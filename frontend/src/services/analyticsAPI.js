import api from './api';

export const analyticsAPI = {
  // Get dashboard statistics
  getDashboardStats: () => api.get('/analytics/dashboard'),

  // Get monthly trends
  getMonthlyTrends: () => api.get('/analytics/trends'),

  // Get leaderboard
  getLeaderboard: (type = 'carbon', limit = 10) => 
    api.get(`/analytics/leaderboard?type=${type}&limit=${limit}`),

  // Get user activity breakdown
  getUserActivity: () => api.get('/analytics/activity'),

  // Get department statistics
  getDepartmentStats: () => api.get('/analytics/departments'),

  // Get platform statistics (admin)
  getPlatformStats: () => api.get('/analytics/platform')
};

export default analyticsAPI;