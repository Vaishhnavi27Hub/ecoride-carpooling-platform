import axios from 'axios';

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

export const chatAPI = {
  // Search users by email
  searchUsers: async (email) => {
    try {
      const response = await api.get(`/chats/search-users?email=${email}`);
      return response.data;
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  },

  // Get all chats
  getChats: async () => {
    try {
      const response = await api.get('/chats');
      return response.data;
    } catch (error) {
      console.error('Get chats error:', error);
      throw error;
    }
  },

  // Create direct chat
  createDirectChat: async (participantId, contextType, contextId) => {
    try {
      const response = await api.post('/chats/direct', {
        participantId,
        contextType,
        contextId
      });
      return response.data;
    } catch (error) {
      console.error('Create direct chat error:', error);
      throw error;
    }
  },

  // Create group chat
  createGroupChat: async (chatName, chatDescription, participantEmails) => {
    try {
      const response = await api.post('/chats/group', {
        chatName,
        chatDescription,
        participantEmails
      });
      return response.data;
    } catch (error) {
      console.error('Create group chat error:', error);
      throw error;
    }
  },

  // Get messages
  getMessages: async (chatId, page = 1, limit = 50) => {
    try {
      const response = await api.get(`/chats/${chatId}/messages?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  },

  // Send message
  sendMessage: async (chatId, content, messageType = 'text') => {
    try {
      const response = await api.post(`/chats/${chatId}/messages`, {
        content,
        messageType
      });
      return response.data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  },

  // Mark as read
  markAsRead: async (chatId) => {
    try {
      const response = await api.put(`/chats/${chatId}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  },

  // Add participant to group
  addParticipant: async (chatId, participantEmail) => {
    try {
      const response = await api.post(`/chats/${chatId}/participants`, {
        participantEmail
      });
      return response.data;
    } catch (error) {
      console.error('Add participant error:', error);
      throw error;
    }
  },

  // Remove participant from group
  removeParticipant: async (chatId, participantId) => {
    try {
      const response = await api.delete(`/chats/${chatId}/participants/${participantId}`);
      return response.data;
    } catch (error) {
      console.error('Remove participant error:', error);
      throw error;
    }
  },

  // Update group info
  updateGroupInfo: async (chatId, updates) => {
    try {
      const response = await api.put(`/chats/${chatId}/group-info`, updates);
      return response.data;
    } catch (error) {
      console.error('Update group info error:', error);
      throw error;
    }
  },

  // Leave group
  leaveGroup: async (chatId) => {
    try {
      const response = await api.post(`/chats/${chatId}/leave`);
      return response.data;
    } catch (error) {
      console.error('Leave group error:', error);
      throw error;
    }
  },

  // Delete chat
  deleteChat: async (chatId) => {
    try {
      const response = await api.delete(`/chats/${chatId}`);
      return response.data;
    } catch (error) {
      console.error('Delete chat error:', error);
      throw error;
    }
  }
};

export default chatAPI;