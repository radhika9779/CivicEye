const { Op, fn, col, literal } = require('sequelize');
const { Issue, User, Ward, SOSAlert } = require('../models');
const { sequelize } = require('../config/database');
const { getIO } = require('../config/socket');

// GET /api/admin/issues
async function getAdminIssues(req, res) {
  try {
    const { status, category, severity, ward_id, page = 1, limit = 20 } = req.query;

    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (severity) where.severity = severity;
    if (ward_id) where.ward_id = ward_id;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;

    const { count, rows } = await Issue.findAndCountAll({
      where,
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'name', 'email'] },
        { model: Ward, as: 'ward', attributes: ['id', 'name'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
      ],
      order: [['created_at', 'DESC']],
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
    });

    return res.json({
      success: true,
      total: count,
      page: pageNum,
      limit: limitNum,
      issues: rows,
    });
  } catch (err) {
    console.error('getAdminIssues error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch issues' });
  }
}

// PATCH /api/admin/issues/:id/assign
async function assignIssue(req, res) {
  try {
    const { assigned_to } = req.body;
    const issue = await Issue.findByPk(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    await issue.update({ assigned_to, status: 'assigned' });

    try {
      getIO().emit('issue_updated', { id: issue.id, status: issue.status, severity: issue.severity });
    } catch (e) {
      console.warn('Socket emit skipped:', e.message);
    }

    return res.json({ success: true, issue });
  } catch (err) {
    console.error('assignIssue error:', err);
    return res.status(500).json({ success: false, message: 'Failed to assign issue' });
  }
}

// PATCH /api/admin/issues/:id/status
async function updateIssueStatus(req, res) {
  try {
    const { status, resolution_note } = req.body;
    const issue = await Issue.findByPk(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const updates = { status };
    if (resolution_note !== undefined) updates.resolution_note = resolution_note;
    if (status === 'resolved') updates.resolved_at = new Date();

    await issue.update(updates);

    try {
      getIO().emit('issue_updated', { id: issue.id, status: issue.status, severity: issue.severity });
    } catch (e) {
      console.warn('Socket emit skipped:', e.message);
    }

    return res.json({ success: true, issue });
  } catch (err) {
    console.error('updateIssueStatus error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update issue status' });
  }
}

// GET /api/admin/stats
async function getStats(req, res) {
  try {
    const total = await Issue.count();
    const open = await Issue.count({ where: { status: 'open' } });
    const in_progress = await Issue.count({ where: { status: 'in_progress' } });
    const resolved = await Issue.count({ where: { status: 'resolved' } });

    const byCategoryRaw = await Issue.findAll({
      attributes: ['category', [fn('COUNT', col('id')), 'count']],
      group: ['category'],
      raw: true,
    });
    const by_category = byCategoryRaw.map((r) => ({
      category: r.category,
      count: parseInt(r.count, 10),
    }));

    // Daily trend, last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyRaw = await Issue.findAll({
      attributes: [
        [fn('DATE', col('created_at')), 'date'],
        [fn('COUNT', col('id')), 'count'],
      ],
      where: { created_at: { [Op.gte]: sevenDaysAgo } },
      group: [fn('DATE', col('created_at'))],
      order: [[fn('DATE', col('created_at')), 'ASC']],
      raw: true,
    });
    const daily_trend = dailyRaw.map((r) => ({ date: r.date, count: parseInt(r.count, 10) }));

    // Average resolution time (hours) for resolved issues
    const resolvedIssues = await Issue.findAll({
      where: { status: 'resolved', resolved_at: { [Op.ne]: null } },
      attributes: ['created_at', 'resolved_at'],
      raw: true,
    });

    let avg_resolution_hours = 0;
    if (resolvedIssues.length > 0) {
      const totalHours = resolvedIssues.reduce((sum, issue) => {
        const diffMs = new Date(issue.resolved_at) - new Date(issue.created_at);
        return sum + diffMs / (1000 * 60 * 60);
      }, 0);
      avg_resolution_hours = Math.round((totalHours / resolvedIssues.length) * 10) / 10;
    }

    return res.json({
      success: true,
      total,
      open,
      in_progress,
      resolved,
      by_category,
      daily_trend,
      avg_resolution_hours,
    });
  } catch (err) {
    console.error('getStats error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
}

// GET /api/admin/sos-alerts
async function getSosAlerts(req, res) {
  try {
    const alerts = await SOSAlert.findAll({
      where: { status: 'active' },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'phone'] }],
      order: [['triggered_at', 'DESC']],
    });
    return res.json({ success: true, alerts });
  } catch (err) {
    console.error('getSosAlerts error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch SOS alerts' });
  }
}

module.exports = {
  getAdminIssues,
  assignIssue,
  updateIssueStatus,
  getStats,
  getSosAlerts,
};
