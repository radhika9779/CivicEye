const express = require('express');
const router = express.Router();
const {
  getIssues,
  createIssue,
  getIssueById,
  upvoteIssue,
  removeUpvote,
  getMyIssues,
} = require('../controllers/issues.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// IMPORTANT: /my must be registered before /:id so it isn't swallowed as an id param
router.get('/my', authMiddleware, getMyIssues);

router.get('/', getIssues);
router.post('/', authMiddleware, upload.single('photo'), createIssue);
router.get('/:id', getIssueById);
router.patch('/:id/upvote', authMiddleware, upvoteIssue);
router.delete('/:id/upvote', authMiddleware, removeUpvote);

module.exports = router;
