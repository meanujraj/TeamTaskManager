const express = require('express');
const { createTask, getTasks, updateTask, deleteTask, submitTask, approveTask, rejectTask } = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, adminOnly, createTask);

router.route('/:id')
  .patch(protect, updateTask)
  .delete(protect, adminOnly, deleteTask);

router.patch('/:id/submit', protect, submitTask);
router.patch('/:id/approve', protect, adminOnly, approveTask);
router.patch('/:id/reject', protect, adminOnly, rejectTask);

module.exports = router;
