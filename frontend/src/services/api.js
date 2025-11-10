

// import axios from 'axios';

// // Base API URL
// const API_BASE_URL = 'http://localhost:5000/api';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Add token to requests
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // ============================================
// // AUTH API
// // ============================================

// export const authAPI = {
//   register: async (userData) => {
//     try {
//       const response = await api.post('/auth/register', userData);
//       return response.data;
//     } catch (error) {
//       console.error('Register error:', error);
//       throw error;
//     }
//   },

//   login: async (credentials) => {
//     try {
//       const response = await api.post('/auth/login', credentials);
//       return response.data;
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   },

//   getProfile: async () => {
//     try {
//       const response = await api.get('/auth/profile');
//       return response.data;
//     } catch (error) {
//       console.error('Get profile error:', error);
//       throw error;
//     }
//   },

//   updateProfile: async (profileData) => {
//     try {
//       const response = await api.put('/auth/profile', profileData);
//       return response.data;
//     } catch (error) {
//       console.error('Update profile error:', error);
//       throw error;
//     }
//   }
// };

// // ============================================
// // RIDES API
// // ============================================

// export const ridesAPI = {
//   getAllRides: async (params) => {
//     try {
//       const response = await api.get('/rides', {
//         params,
//         headers: {
//           'Cache-Control': 'no-cache',
//           'Pragma': 'no-cache',
//           'Expires': '0'
//         }
//       });
//       return response;
//     } catch (error) {
//       console.error('Get all rides error:', error);
//       throw error;
//     }
//   },

//   getRides: async () => {
//     try {
//       const response = await api.get('/rides', {
//         headers: {
//           'Cache-Control': 'no-cache',
//           'Pragma': 'no-cache'
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Get rides error:', error);
//       throw error;
//     }
//   },

//   getRideById: async (rideId) => {
//     try {
//       const response = await api.get(`/rides/${rideId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Get ride error:', error);
//       throw error;
//     }
//   },

//   createRide: async (rideData) => {
//     try {
//       const response = await api.post('/rides', rideData);
//       return response.data;
//     } catch (error) {
//       console.error('Create ride error:', error);
//       throw error;
//     }
//   },

//   updateRide: async (rideId, rideData) => {
//     try {
//       const response = await api.put(`/rides/${rideId}`, rideData);
//       return response.data;
//     } catch (error) {
//       console.error('Update ride error:', error);
//       throw error;
//     }
//   },

//   deleteRide: async (rideId) => {
//     try {
//       const response = await api.delete(`/rides/${rideId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Delete ride error:', error);
//       throw error;
//     }
//   },

//   requestRide: async (rideId, requestData) => {
//     try {
//       const response = await api.post(`/rides/${rideId}/join`, requestData);
//       return response.data;
//     } catch (error) {
//       console.error('Request join error:', error);
//       throw error;
//     }
//   },

//   requestJoin: async (rideId, requestData) => {
//     try {
//       const response = await api.post(`/rides/${rideId}/join`, requestData);
//       return response.data;
//     } catch (error) {
//       console.error('Request join error:', error);
//       throw error;
//     }
//   },

//   respondToRequest: async (rideId, passengerId, status) => {
//     try {
//       const response = await api.put(`/rides/${rideId}/passenger/${passengerId}`, { status });
//       return response.data;
//     } catch (error) {
//       console.error('Respond to request error:', error);
//       throw error;
//     }
//   },

//   getMyRides: async (type) => {
//     try {
//       const response = await api.get('/rides/my-rides', {
//         params: { type },
//         headers: {
//           'Cache-Control': 'no-cache',
//           'Pragma': 'no-cache'
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Get my rides error:', error);
//       throw error;
//     }
//   }
// };

// // ============================================
// // TRIPS API
// // ============================================

// export const tripAPI = {
//   getTrips: async (filters = {}) => {
//     try {
//       const params = new URLSearchParams(filters).toString();
//       const url = params ? `/trips?${params}` : '/trips';
//       const response = await api.get(url);
//       return response.data;
//     } catch (error) {
//       console.error('Get trips error:', error);
//       throw error;
//     }
//   },

//   getTripById: async (tripId) => {
//     try {
//       const response = await api.get(`/trips/${tripId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Get trip error:', error);
//       throw error;
//     }
//   },

//   createTrip: async (tripData) => {
//     try {
//       const response = await api.post('/trips', tripData);
//       return response.data;
//     } catch (error) {
//       console.error('Create trip error:', error);
//       throw error;
//     }
//   },

//   updateTrip: async (tripId, tripData) => {
//     try {
//       const response = await api.put(`/trips/${tripId}`, tripData);
//       return response.data;
//     } catch (error) {
//       console.error('Update trip error:', error);
//       throw error;
//     }
//   },

//   deleteTrip: async (tripId) => {
//     try {
//       const response = await api.delete(`/trips/${tripId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Delete trip error:', error);
//       throw error;
//     }
//   },

//   joinTrip: async (tripId, message = '') => {
//     try {
//       const response = await api.post(`/trips/${tripId}/join`, { message });
//       return response.data;
//     } catch (error) {
//       console.error('Join trip error:', error);
//       throw error;
//     }
//   },

//   leaveTrip: async (tripId) => {
//     try {
//       const response = await api.delete(`/trips/${tripId}/leave`);
//       return response.data;
//     } catch (error) {
//       console.error('Leave trip error:', error);
//       throw error;
//     }
//   },

//   updateParticipantStatus: async (tripId, participantId, status) => {
//     try {
//       const response = await api.put(`/trips/${tripId}/participant/${participantId}`, { status });
//       return response.data;
//     } catch (error) {
//       console.error('Update participant status error:', error);
//       throw error;
//     }
//   },

//   getMyTrips: async (type = '') => {
//     try {
//       const params = type ? `?type=${type}` : '';
//       const response = await api.get(`/trips/my-trips${params}`);
//       return response.data;
//     } catch (error) {
//       console.error('Get my trips error:', error);
//       throw error;
//     }
//   },

//   addReview: async (tripId, rating, comment) => {
//     try {
//       const response = await api.post(`/trips/${tripId}/review`, { rating, comment });
//       return response.data;
//     } catch (error) {
//       console.error('Add review error:', error);
//       throw error;
//     }
//   }
// };

// // ============================================
// // MARKETPLACE API - ✅ WITH EDIT FUNCTIONALITY
// // ============================================

// export const marketplaceAPI = {
//   // Get all items
//   getItems: async (params = {}) => {
//     try {
//       const response = await api.get('/items', { params });
//       return response.data;
//     } catch (error) {
//       console.error('Get items error:', error);
//       throw error;
//     }
//   },

//   // Get single item by ID
//   getItemById: async (itemId) => {
//     try {
//       const response = await api.get(`/items/${itemId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Get item error:', error);
//       throw error;
//     }
//   },

//   // Create new item
//   createItem: async (itemData) => {
//     try {
//       const response = await api.post('/items', itemData);
//       return response.data;
//     } catch (error) {
//       console.error('Create item error:', error);
//       throw error;
//     }
//   },

//   // ✅ UPDATE ITEM - NEW EDIT FUNCTIONALITY
//   updateItem: async (itemId, itemData) => {
//     try {
//       const response = await api.put(`/items/${itemId}`, itemData);
//       return response.data;
//     } catch (error) {
//       console.error('Update item error:', error);
//       throw error;
//     }
//   },

//   // Delete item
//   deleteItem: async (itemId) => {
//     try {
//       const response = await api.delete(`/items/${itemId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Delete item error:', error);
//       throw error;
//     }
//   },

//   // Get my items (seller)
//   getMyItems: async () => {
//     try {
//       const response = await api.get('/items/my-items');
//       return response.data;
//     } catch (error) {
//       console.error('Get my items error:', error);
//       throw error;
//     }
//   },

//   // Get my orders (buyer)
//   getMyOrders: async () => {
//     try {
//       const response = await api.get('/items/my-orders');
//       return response.data;
//     } catch (error) {
//       console.error('Get my orders error:', error);
//       throw error;
//     }
//   },

//   // Place order
//   placeOrder: async (itemId, orderData) => {
//     try {
//       const response = await api.post(`/items/${itemId}/order`, orderData);
//       return response.data;
//     } catch (error) {
//       console.error('Place order error:', error);
//       throw error;
//     }
//   },

//   // Update order status (seller only)
//   updateOrderStatus: async (itemId, orderId, status) => {
//     try {
//       const response = await api.put(`/items/${itemId}/order/${orderId}`, { status });
//       return response.data;
//     } catch (error) {
//       console.error('Update order status error:', error);
//       throw error;
//     }
//   },

//   // Add rating to item
//   addRating: async (itemId, ratingData) => {
//     try {
//       const response = await api.post(`/items/${itemId}/rating`, ratingData);
//       return response.data;
//     } catch (error) {
//       console.error('Add rating error:', error);
//       throw error;
//     }
//   },

//   // Search items
//   searchItems: async (query) => {
//     try {
//       const response = await api.get(`/items/search?q=${query}`);
//       return response.data;
//     } catch (error) {
//       console.error('Search items error:', error);
//       throw error;
//     }
//   }
// };

// // ============================================
// // ANALYTICS API
// // ============================================

// export const analyticsAPI = {
//   getDashboardStats: () => api.get('/analytics/dashboard'),

//   getMonthlyTrends: () => api.get('/analytics/trends'),

//   getLeaderboard: (type = 'carbon', limit = 10) => 
//     api.get(`/analytics/leaderboard?type=${type}&limit=${limit}`),

//   getUserActivity: () => api.get('/analytics/activity'),

//   getDepartmentStats: () => api.get('/analytics/departments'),

//   getPlatformStats: () => api.get('/analytics/platform'),

//   getEnvironmentalImpact: async () => {
//     try {
//       const response = await api.get('/analytics/dashboard');
//       return response.data;
//     } catch (error) {
//       console.error('Get environmental impact error:', error);
//       throw error;
//     }
//   },

//   getRideStats: async () => {
//     try {
//       const response = await api.get('/analytics/dashboard');
//       return response.data;
//     } catch (error) {
//       console.error('Get ride stats error:', error);
//       throw error;
//     }
//   }
// };

// // ============================================
// // NOTIFICATIONS API
// // ============================================

// export const notificationsAPI = {
//   getNotifications: async () => {
//     try {
//       const response = await api.get('/notifications');
//       return response.data;
//     } catch (error) {
//       console.error('Get notifications error:', error);
//       throw error;
//     }
//   },

//   markAsRead: async (notificationId) => {
//     try {
//       const response = await api.put(`/notifications/${notificationId}/read`);
//       return response.data;
//     } catch (error) {
//       console.error('Mark notification as read error:', error);
//       throw error;
//     }
//   },

//   markAllAsRead: async () => {
//     try {
//       const response = await api.put('/notifications/read-all');
//       return response.data;
//     } catch (error) {
//       console.error('Mark all notifications as read error:', error);
//       throw error;
//     }
//   },

//   deleteNotification: async (notificationId) => {
//     try {
//       const response = await api.delete(`/notifications/${notificationId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Delete notification error:', error);
//       throw error;
//     }
//   },

//   getUnreadCount: async () => {
//     try {
//       const response = await api.get('/notifications/unread/count', {
//         headers: {
//           'Cache-Control': 'no-cache',
//           'Pragma': 'no-cache'
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Get unread count error:', error);
//       return {
//         success: false,
//         count: 0
//       };
//     }
//   }
// };

// // ============================================
// // CHAT API
// // ============================================

// export const chatAPI = {
//   getChats: async () => {
//     try {
//       const response = await api.get('/chats');
//       return response.data;
//     } catch (error) {
//       console.error('Get chats error:', error);
//       throw error;
//     }
//   },

//   getChatById: async (chatId) => {
//     try {
//       const response = await api.get(`/chats/${chatId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Get chat error:', error);
//       throw error;
//     }
//   },

//   getMessages: async (chatId) => {
//     try {
//       const response = await api.get(`/chats/${chatId}/messages`);
//       return response.data;
//     } catch (error) {
//       console.error('Get messages error:', error);
//       throw error;
//     }
//   },

//   sendMessage: async (chatId, content) => {
//     try {
//       const response = await api.post(`/chats/${chatId}/messages`, { content });
//       return response.data;
//     } catch (error) {
//       console.error('Send message error:', error);
//       throw error;
//     }
//   },

//   createDirectChat: async (participantEmail) => {
//     try {
//       const response = await api.post('/chats/direct', { participantEmail });
//       return response.data;
//     } catch (error) {
//       console.error('Create direct chat error:', error);
//       throw error;
//     }
//   },

//   createGroup: async (groupData) => {
//     try {
//       const response = await api.post('/chats/group', groupData);
//       return response.data;
//     } catch (error) {
//       console.error('Create group error:', error);
//       throw error;
//     }
//   },

//   searchUsers: async (email) => {
//     try {
//       const response = await api.get(`/chats/search-users?email=${email}`);
//       return response.data;
//     } catch (error) {
//       console.error('Search users error:', error);
//       throw error;
//     }
//   },

//   markAsRead: async (chatId) => {
//     try {
//       const response = await api.put(`/chats/${chatId}/read`);
//       return response.data;
//     } catch (error) {
//       console.error('Mark chat as read error:', error);
//       throw error;
//     }
//   }
// };

// // Default export
// export default api;
























import axios from 'axios';

// Base API URL - uses environment variable or falls back to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
};

// ============================================
// RIDES API
// ============================================

export const ridesAPI = {
  getAllRides: async (params) => {
    try {
      const response = await api.get('/rides', {
        params,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      return response;
    } catch (error) {
      console.error('Get all rides error:', error);
      throw error;
    }
  },

  getRides: async () => {
    try {
      const response = await api.get('/rides', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get rides error:', error);
      throw error;
    }
  },

  getRideById: async (rideId) => {
    try {
      const response = await api.get(`/rides/${rideId}`);
      return response.data;
    } catch (error) {
      console.error('Get ride error:', error);
      throw error;
    }
  },

  createRide: async (rideData) => {
    try {
      const response = await api.post('/rides', rideData);
      return response.data;
    } catch (error) {
      console.error('Create ride error:', error);
      throw error;
    }
  },

  updateRide: async (rideId, rideData) => {
    try {
      const response = await api.put(`/rides/${rideId}`, rideData);
      return response.data;
    } catch (error) {
      console.error('Update ride error:', error);
      throw error;
    }
  },

  deleteRide: async (rideId) => {
    try {
      const response = await api.delete(`/rides/${rideId}`);
      return response.data;
    } catch (error) {
      console.error('Delete ride error:', error);
      throw error;
    }
  },

  requestRide: async (rideId, requestData) => {
    try {
      const response = await api.post(`/rides/${rideId}/join`, requestData);
      return response.data;
    } catch (error) {
      console.error('Request join error:', error);
      throw error;
    }
  },

  requestJoin: async (rideId, requestData) => {
    try {
      const response = await api.post(`/rides/${rideId}/join`, requestData);
      return response.data;
    } catch (error) {
      console.error('Request join error:', error);
      throw error;
    }
  },

  respondToRequest: async (rideId, passengerId, status) => {
    try {
      const response = await api.put(`/rides/${rideId}/passenger/${passengerId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Respond to request error:', error);
      throw error;
    }
  },

  getMyRides: async (type) => {
    try {
      const response = await api.get('/rides/my-rides', {
        params: { type },
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get my rides error:', error);
      throw error;
    }
  }
};

// ============================================
// TRIPS API
// ============================================

export const tripAPI = {
  getTrips: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const url = params ? `/trips?${params}` : '/trips';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get trips error:', error);
      throw error;
    }
  },

  getTripById: async (tripId) => {
    try {
      const response = await api.get(`/trips/${tripId}`);
      return response.data;
    } catch (error) {
      console.error('Get trip error:', error);
      throw error;
    }
  },

  createTrip: async (tripData) => {
    try {
      const response = await api.post('/trips', tripData);
      return response.data;
    } catch (error) {
      console.error('Create trip error:', error);
      throw error;
    }
  },

  updateTrip: async (tripId, tripData) => {
    try {
      const response = await api.put(`/trips/${tripId}`, tripData);
      return response.data;
    } catch (error) {
      console.error('Update trip error:', error);
      throw error;
    }
  },

  deleteTrip: async (tripId) => {
    try {
      const response = await api.delete(`/trips/${tripId}`);
      return response.data;
    } catch (error) {
      console.error('Delete trip error:', error);
      throw error;
    }
  },

  joinTrip: async (tripId, message = '') => {
    try {
      const response = await api.post(`/trips/${tripId}/join`, { message });
      return response.data;
    } catch (error) {
      console.error('Join trip error:', error);
      throw error;
    }
  },

  leaveTrip: async (tripId) => {
    try {
      const response = await api.delete(`/trips/${tripId}/leave`);
      return response.data;
    } catch (error) {
      console.error('Leave trip error:', error);
      throw error;
    }
  },

  updateParticipantStatus: async (tripId, participantId, status) => {
    try {
      const response = await api.put(`/trips/${tripId}/participant/${participantId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Update participant status error:', error);
      throw error;
    }
  },

  getMyTrips: async (type = '') => {
    try {
      const params = type ? `?type=${type}` : '';
      const response = await api.get(`/trips/my-trips${params}`);
      return response.data;
    } catch (error) {
      console.error('Get my trips error:', error);
      throw error;
    }
  },

  addReview: async (tripId, rating, comment) => {
    try {
      const response = await api.post(`/trips/${tripId}/review`, { rating, comment });
      return response.data;
    } catch (error) {
      console.error('Add review error:', error);
      throw error;
    }
  }
};

// ============================================
// MARKETPLACE API - ✅ WITH EDIT FUNCTIONALITY
// ============================================

export const marketplaceAPI = {
  // Get all items
  getItems: async (params = {}) => {
    try {
      const response = await api.get('/items', { params });
      return response.data;
    } catch (error) {
      console.error('Get items error:', error);
      throw error;
    }
  },

  // Get single item by ID
  getItemById: async (itemId) => {
    try {
      const response = await api.get(`/items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Get item error:', error);
      throw error;
    }
  },

  // Create new item
  createItem: async (itemData) => {
    try {
      const response = await api.post('/items', itemData);
      return response.data;
    } catch (error) {
      console.error('Create item error:', error);
      throw error;
    }
  },

  // ✅ UPDATE ITEM - NEW EDIT FUNCTIONALITY
  updateItem: async (itemId, itemData) => {
    try {
      const response = await api.put(`/items/${itemId}`, itemData);
      return response.data;
    } catch (error) {
      console.error('Update item error:', error);
      throw error;
    }
  },

  // Delete item
  deleteItem: async (itemId) => {
    try {
      const response = await api.delete(`/items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Delete item error:', error);
      throw error;
    }
  },

  // Get my items (seller)
  getMyItems: async () => {
    try {
      const response = await api.get('/items/my-items');
      return response.data;
    } catch (error) {
      console.error('Get my items error:', error);
      throw error;
    }
  },

  // Get my orders (buyer)
  getMyOrders: async () => {
    try {
      const response = await api.get('/items/my-orders');
      return response.data;
    } catch (error) {
      console.error('Get my orders error:', error);
      throw error;
    }
  },

  // Place order
  placeOrder: async (itemId, orderData) => {
    try {
      const response = await api.post(`/items/${itemId}/order`, orderData);
      return response.data;
    } catch (error) {
      console.error('Place order error:', error);
      throw error;
    }
  },

  // Update order status (seller only)
  updateOrderStatus: async (itemId, orderId, status) => {
    try {
      const response = await api.put(`/items/${itemId}/order/${orderId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  },

  // Add rating to item
  addRating: async (itemId, ratingData) => {
    try {
      const response = await api.post(`/items/${itemId}/rating`, ratingData);
      return response.data;
    } catch (error) {
      console.error('Add rating error:', error);
      throw error;
    }
  },

  // Search items
  searchItems: async (query) => {
    try {
      const response = await api.get(`/items/search?q=${query}`);
      return response.data;
    } catch (error) {
      console.error('Search items error:', error);
      throw error;
    }
  }
};

// ============================================
// ANALYTICS API
// ============================================

export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),

  getMonthlyTrends: () => api.get('/analytics/trends'),

  getLeaderboard: (type = 'carbon', limit = 10) => 
    api.get(`/analytics/leaderboard?type=${type}&limit=${limit}`),

  getUserActivity: () => api.get('/analytics/activity'),

  getDepartmentStats: () => api.get('/analytics/departments'),

  getPlatformStats: () => api.get('/analytics/platform'),

  getEnvironmentalImpact: async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.error('Get environmental impact error:', error);
      throw error;
    }
  },

  getRideStats: async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.error('Get ride stats error:', error);
      throw error;
    }
  }
};

// ============================================
// NOTIFICATIONS API
// ============================================

export const notificationsAPI = {
  getNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      throw error;
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread/count', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get unread count error:', error);
      return {
        success: false,
        count: 0
      };
    }
  }
};

// ============================================
// CHAT API
// ============================================

export const chatAPI = {
  getChats: async () => {
    try {
      const response = await api.get('/chats');
      return response.data;
    } catch (error) {
      console.error('Get chats error:', error);
      throw error;
    }
  },

  getChatById: async (chatId) => {
    try {
      const response = await api.get(`/chats/${chatId}`);
      return response.data;
    } catch (error) {
      console.error('Get chat error:', error);
      throw error;
    }
  },

  getMessages: async (chatId) => {
    try {
      const response = await api.get(`/chats/${chatId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  },

  sendMessage: async (chatId, content) => {
    try {
      const response = await api.post(`/chats/${chatId}/messages`, { content });
      return response.data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  },

  createDirectChat: async (participantEmail) => {
    try {
      const response = await api.post('/chats/direct', { participantEmail });
      return response.data;
    } catch (error) {
      console.error('Create direct chat error:', error);
      throw error;
    }
  },

  createGroup: async (groupData) => {
    try {
      const response = await api.post('/chats/group', groupData);
      return response.data;
    } catch (error) {
      console.error('Create group error:', error);
      throw error;
    }
  },

  searchUsers: async (email) => {
    try {
      const response = await api.get(`/chats/search-users?email=${email}`);
      return response.data;
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  },

  markAsRead: async (chatId) => {
    try {
      const response = await api.put(`/chats/${chatId}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark chat as read error:', error);
      throw error;
    }
  }
};

// Default export
export default api;