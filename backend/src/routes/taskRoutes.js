const express = require('express');

const {
  getTasks,
  getMyTaskCompletions,
  completeTask,
} = require('../controllers/taskController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

/*
 * Get all active tasks
 */
router.get('/', protect, getTasks);

/*
 * Get current user's completed tasks
 */
router.get(
  '/my-completions',
  protect,
  getMyTaskCompletions
);

/*
 * Complete a task
 */
router.post(
  '/:id/complete',
  protect,
  completeTask
);

module.exports = router;