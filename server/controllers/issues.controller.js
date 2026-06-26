const { Op } = require('sequelize');
const { Issue, User, Ward, Upvote } = require('../models');
const { calculateSeverity } = require('../services/severity.service');
const { haversineDistanceKm } = require('../services/routeSafety.service');
const { getIO } = require('../config/socket');

/** Finds the ward whose bounding box contains the given coordinates. */
async function findWardForCoords(latitude, longitude) {
  const wards = await Ward.findAll();
  const match = wards.find(
    (w) =>
      latitude >= w.lat_min &&
      latitude <= w.lat_max &&
      longitude >= w.lon_min &&
      longitude <= w.lon_max
  );
  return match ? match.id : null;
}

function serializeIssue(issue) {
  const plain = issue.toJSON ? issue.toJSON() : issue;
  if (plain.is_anonymous && plain.reporter) {
    plain.reporter = { id: null, name: 'Anonymous', email: null };
  }
  return plain;
}

// GET /api/issues
async function getIssues(req, res) {
  try {
    const {
      lat,
      lon,
      radius,
      category,
      status,
      page = 1,
      limit = 20,
    } = req.query;

    const where = {};
    if (category) where.category = category;
    if (status) where.status = status;

    const allIssues = await Issue.findAll({
      where,
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'name'] },
        { model: Ward, as: 'ward', attributes: ['id', 'name'] },
      ],
      order: [['ai_score', 'DESC']],
    });

    let filtered = allIssues;

    if (lat && lon) {
      const radiusKm = radius ? parseFloat(radius) : 5;
      filtered = allIssues.filter(
        (issue) =>
          haversineDistanceKm(parseFloat(lat), parseFloat(lon), issue.latitude, issue.longitude) <=
          radiusKm
      );
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const start = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(start, start + limitNum);

    return res.json({
      success: true,
      total: filtered.length,
      page: pageNum,
      limit: limitNum,
      issues: paginated.map(serializeIssue),
    });
  } catch (err) {
    console.error('getIssues error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch issues' });
  }
}

// POST /api/issues
async function createIssue(req, res) {
  try {
    const { title, description, category, latitude, longitude, address, is_anonymous } =
      req.body;

    if (!title || !category || !latitude || !longitude) {
      return res
        .status(400)
        .json({ success: false, message: 'title, category, latitude and longitude are required' });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const ward_id = await findWardForCoords(lat, lon);

    const { score, severity, reasons } = calculateSeverity({
      category,
      title,
      description: description || '',
      upvote_count: 0,
    });

    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

    const issue = await Issue.create({
      title,
      description,
      category,
      latitude: lat,
      longitude: lon,
      address,
      ward_id,
      photo_url,
      is_anonymous: is_anonymous === 'true' || is_anonymous === true,
      reporter_id: req.user.id,
      ai_score: score,
      severity,
      ai_reasons: reasons,
    });

    const fullIssue = await Issue.findByPk(issue.id, {
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'name'] },
        { model: Ward, as: 'ward', attributes: ['id', 'name'] },
      ],
    });

    const serialized = serializeIssue(fullIssue);

    try {
      getIO().emit('new_issue', serialized);
    } catch (e) {
      console.warn('Socket emit skipped:', e.message);
    }

    return res.status(201).json({ success: true, issue: serialized });
  } catch (err) {
    console.error('createIssue error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create issue' });
  }
}

// GET /api/issues/:id
async function getIssueById(req, res) {
  try {
    const issue = await Issue.findByPk(req.params.id, {
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'name'] },
        { model: Ward, as: 'ward' },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    return res.json({ success: true, issue: serializeIssue(issue) });
  } catch (err) {
    console.error('getIssueById error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch issue' });
  }
}

// PATCH /api/issues/:id/upvote
async function upvoteIssue(req, res) {
  try {
    const issue = await Issue.findByPk(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const existing = await Upvote.findOne({
      where: { issue_id: issue.id, user_id: req.user.id },
    });
    if (existing) {
      return res.status(409).json({ success: false, message: 'You already upvoted this issue' });
    }

    await Upvote.create({ issue_id: issue.id, user_id: req.user.id });

    const newCount = issue.upvote_count + 1;
    const { score, severity, reasons } = calculateSeverity({
      category: issue.category,
      title: issue.title,
      description: issue.description || '',
      upvote_count: newCount,
    });

    await issue.update({
      upvote_count: newCount,
      ai_score: score,
      severity,
      ai_reasons: reasons,
    });

    try {
      getIO().emit('issue_updated', { id: issue.id, status: issue.status, severity });
    } catch (e) {
      console.warn('Socket emit skipped:', e.message);
    }

    return res.json({ success: true, ai_score: score, severity, upvote_count: newCount });
  } catch (err) {
    console.error('upvoteIssue error:', err);
    return res.status(500).json({ success: false, message: 'Failed to upvote issue' });
  }
}

// DELETE /api/issues/:id/upvote
async function removeUpvote(req, res) {
  try {
    const issue = await Issue.findByPk(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const existing = await Upvote.findOne({
      where: { issue_id: issue.id, user_id: req.user.id },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Upvote not found' });
    }

    await existing.destroy();

    const newCount = Math.max(0, issue.upvote_count - 1);
    const { score, severity, reasons } = calculateSeverity({
      category: issue.category,
      title: issue.title,
      description: issue.description || '',
      upvote_count: newCount,
    });

    await issue.update({
      upvote_count: newCount,
      ai_score: score,
      severity,
      ai_reasons: reasons,
    });

    try {
      getIO().emit('issue_updated', { id: issue.id, status: issue.status, severity });
    } catch (e) {
      console.warn('Socket emit skipped:', e.message);
    }

    return res.json({ success: true, ai_score: score, severity, upvote_count: newCount });
  } catch (err) {
    console.error('removeUpvote error:', err);
    return res.status(500).json({ success: false, message: 'Failed to remove upvote' });
  }
}

// GET /api/issues/my
async function getMyIssues(req, res) {
  try {
    const issues = await Issue.findAll({
      where: { reporter_id: req.user.id },
      include: [{ model: Ward, as: 'ward', attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']],
    });
    return res.json({ success: true, issues: issues.map(serializeIssue) });
  } catch (err) {
    console.error('getMyIssues error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch your issues' });
  }
}

module.exports = {
  getIssues,
  createIssue,
  getIssueById,
  upvoteIssue,
  removeUpvote,
  getMyIssues,
  findWardForCoords,
};
