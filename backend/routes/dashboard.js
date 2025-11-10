const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// @route   GET /api/dashboard/stats
// @desc    Get user's dashboard statistics
// @access  Private
router.get('/stats', getDashboardStats);

module.exports = router;