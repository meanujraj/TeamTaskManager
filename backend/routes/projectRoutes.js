const express = require('express');
const { createProject, getProjects, addMember, removeMember } = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, adminOnly, createProject);

router.patch('/:id/add-member', protect, adminOnly, addMember);
router.patch('/:id/remove-member', protect, adminOnly, removeMember);

module.exports = router;
