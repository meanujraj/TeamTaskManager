const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/request', protect, connectionController.requestConnection);
router.post('/approve', protect, adminOnly, connectionController.approveConnection);
router.post('/reject', protect, adminOnly, connectionController.rejectConnection);
router.post('/remove', protect, adminOnly, connectionController.removeMember);
router.get('/team', protect, adminOnly, connectionController.getTeam);
router.get('/history', protect, adminOnly, connectionController.getHistory);

module.exports = router;
