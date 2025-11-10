const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getMonthlyTrends,
  getLeaderboard,
  getPlatformStats,
  getUserActivity,
  getDepartmentStats
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// @route   GET /api/analytics/dashboard
// @desc    Get user dashboard statistics
// @access  Private
router.get('/dashboard', getDashboardStats);

// @route   GET /api/analytics/trends
// @desc    Get monthly trends
// @access  Private
router.get('/trends', getMonthlyTrends);

// @route   GET /api/analytics/leaderboard
// @desc    Get leaderboard (carbon/rides/rating)
// @access  Private
router.get('/leaderboard', getLeaderboard);

// @route   GET /api/analytics/activity
// @desc    Get user activity breakdown
// @access  Private
router.get('/activity', getUserActivity);

// @route   GET /api/analytics/departments
// @desc    Get department statistics
// @access  Private
router.get('/departments', getDepartmentStats);

// @route   GET /api/analytics/platform
// @desc    Get platform-wide statistics (admin)
// @access  Private
router.get('/platform', getPlatformStats);

module.exports = router;