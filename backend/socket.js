// const socketIO = require('socket.io');
// const jwt = require('jsonwebtoken');

// let io;
// const userSockets = new Map(); // Map to store user_id -> socket_id

// const initializeSocket = (server) => {
//   io = socketIO(server, {
//     cors: {
//       origin: process.env.CLIENT_URL || 'http://localhost:3000',
//       methods: ['GET', 'POST'],
//       credentials: true
//     }
//   });

//   // Authentication middleware for socket connections
//   io.use((socket, next) => {
//     try {
//       const token = socket.handshake.auth.token;
      
//       if (!token) {
//         return next(new Error('Authentication error'));
//       }

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       socket.userId = decoded.id;
//       next();
//     } catch (error) {
//       next(new Error('Authentication error'));
//     }
//   });

//   io.on('connection', (socket) => {
//     console.log(`User connected: ${socket.userId}`);
    
//     // Store user's socket connection
//     userSockets.set(socket.userId, socket.id);

//     // Join user's personal room
//     socket.join(socket.userId);

//     // Emit online status to all users
//     io.emit('user_status', {
//       userId: socket.userId,
//       status: 'online'
//     });

//     // Handle joining chat rooms
//     socket.on('join_chat', (chatId) => {
//       socket.join(`chat_${chatId}`);
//       console.log(`User ${socket.userId} joined chat ${chatId}`);
//     });

//     // Handle leaving chat rooms
//     socket.on('leave_chat', (chatId) => {
//       socket.leave(`chat_${chatId}`);
//       console.log(`User ${socket.userId} left chat ${chatId}`);
//     });

//     // Handle sending messages
//     socket.on('send_message', (data) => {
//       const { chatId, message } = data;
      
//       // Broadcast message to all users in the chat room
//       io.to(`chat_${chatId}`).emit('receive_message', {
//         chatId,
//         message,
//         timestamp: new Date()
//       });
//     });

//     // Handle typing indicator
//     socket.on('typing', (data) => {
//       const { chatId, isTyping } = data;
//       socket.to(`chat_${chatId}`).emit('user_typing', {
//         userId: socket.userId,
//         chatId,
//         isTyping
//       });
//     });

//     // Handle group updates
//     socket.on('group_updated', (data) => {
//       const { chatId, update } = data;
//       io.to(`chat_${chatId}`).emit('group_update', {
//         chatId,
//         update
//       });
//     });

//     // Handle notifications
//     socket.on('send_notification', (data) => {
//       const { recipientId, notification } = data;
      
//       // Send notification to specific user
//       io.to(recipientId).emit('receive_notification', notification);
//     });

//     // Handle disconnect
//     socket.on('disconnect', () => {
//       console.log(`User disconnected: ${socket.userId}`);
      
//       // Remove user's socket connection
//       userSockets.delete(socket.userId);

//       // Emit offline status to all users
//       io.emit('user_status', {
//         userId: socket.userId,
//         status: 'offline'
//       });
//     });
//   });

//   return io;
// };

// const getIO = () => {
//   if (!io) {
//     throw new Error('Socket.io not initialized!');
//   }
//   return io;
// };

// const getUserSocket = (userId) => {
//   return userSockets.get(userId);
// };

// const emitToUser = (userId, event, data) => {
//   const socketId = userSockets.get(userId);
//   if (socketId) {
//     io.to(socketId).emit(event, data);
//   }
// };

// const emitToChat = (chatId, event, data) => {
//   io.to(`chat_${chatId}`).emit(event, data);
// };

// module.exports = {
//   initializeSocket,
//   getIO,
//   getUserSocket,
//   emitToUser,
//   emitToChat
// };

const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

/**
 * Initialize Socket.IO server
 * @param {Object} server - HTTP server instance
 * @returns {Object} Socket.IO instance
 */
const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Connection handling
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Join user's personal room for notifications
    socket.join(socket.userId);

    // Handle online status
    socket.on('user_online', () => {
      socket.broadcast.emit('user_status', { 
        userId: socket.userId, 
        status: 'online' 
      });
    });

    // Join chat room
    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.userId} joined chat ${chatId}`);
    });

    // Leave chat room
    socket.on('leave_chat', (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.userId} left chat ${chatId}`);
    });

    // Send message
    socket.on('send_message', ({ chatId, message }) => {
      // Emit to all users in the chat room except sender
      socket.to(chatId).emit('receive_message', { 
        chatId, 
        message 
      });
    });

    // Typing indicator
    socket.on('typing', ({ chatId, isTyping }) => {
      socket.to(chatId).emit('user_typing', { 
        userId: socket.userId, 
        chatId, 
        isTyping 
      });
    });

    // Handle new notification event
    socket.on('notification_sent', ({ recipientId, notification }) => {
      io.to(recipientId).emit('new_notification', notification);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
      socket.broadcast.emit('user_status', { 
        userId: socket.userId, 
        status: 'offline' 
      });
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  console.log('✅ Socket.IO initialized successfully');
  return io;
};

/**
 * Get Socket.IO instance
 * @returns {Object} Socket.IO instance
 * @throws {Error} If Socket.IO is not initialized
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized! Call initializeSocket first.');
  }
  return io;
};

/**
 * Emit notification to a specific user
 * @param {String} userId - Recipient user ID
 * @param {Object} notification - Notification data
 */
const emitNotification = (userId, notification) => {
  if (!io) {
    console.error('Socket.io not initialized!');
    return;
  }
  io.to(userId.toString()).emit('new_notification', notification);
};

/**
 * Emit event to a specific room
 * @param {String} room - Room name/ID
 * @param {String} event - Event name
 * @param {Object} data - Event data
 */
const emitToRoom = (room, event, data) => {
  if (!io) {
    console.error('Socket.io not initialized!');
    return;
  }
  io.to(room).emit(event, data);
};

/**
 * Emit event to all connected users
 * @param {String} event - Event name
 * @param {Object} data - Event data
 */
const emitToAll = (event, data) => {
  if (!io) {
    console.error('Socket.io not initialized!');
    return;
  }
  io.emit(event, data);
};

module.exports = { 
  initializeSocket, 
  getIO,
  emitNotification,
  emitToRoom,
  emitToAll
};