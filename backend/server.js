// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const { initializeSocket } = require('./socket');

// // Load env vars
// dotenv.config();

// // Connect to database
// connectDB();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Request logging middleware (development)
// if (process.env.NODE_ENV === 'development') {
//   app.use((req, res, next) => {
//     console.log(`${req.method} ${req.path}`);
//     next();
//   });
// }

// // Import Routes
// const authRoutes = require('./routes/auth');
// const rideRoutes = require('./routes/rides');
// const tripRoutes = require('./routes/trips');
// const itemRoutes = require('./routes/items');
// const chatRoutes = require('./routes/chats');
// const notificationRoutes = require('./routes/notifications');
// const analyticsRoutes = require('./routes/analytics');
// const dashboardRoutes = require('./routes/dashboard'); 
// // const chatbotRoutes = require('./routes/chatbot');

// // Mount Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/rides', rideRoutes);
// app.use('/api/trips', tripRoutes);
// app.use('/api/items', itemRoutes);
// app.use('/api/chats', chatRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/analytics', analyticsRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// // app.use('/api/chatbot', chatbotRoutes); 

// // Welcome route
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Welcome to EcoRide API',
//     version: '1.0.0',
//     endpoints: {
//       auth: '/api/auth',
//       rides: '/api/rides',
//       trips: '/api/trips',
//       items: '/api/items',
//       chats: '/api/chats',
//       notifications: '/api/notifications',
//       analytics: '/api/analytics'
//     }
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.statusCode || 500).json({
//     success: false,
//     message: err.message || 'Server Error',
//     error: process.env.NODE_ENV === 'development' ? err : {}
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found'
//   });
// });

// const PORT = process.env.PORT || 5000;

// // Create HTTP server
// const server = app.listen(PORT, () => {
//   console.log(`
// 🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}
// 🌍 Environment: ${process.env.NODE_ENV}
// 📡 API Base URL: http://localhost:${PORT}
// 💬 Socket.io enabled for real-time features
//   `);
// });

// // Initialize Socket.io
// initializeSocket(server);
// console.log('✅ Socket.io initialized successfully');

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
//   console.log(`Error: ${err.message}`);
//   server.close(() => process.exit(1));
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('SIGTERM signal received: closing HTTP server');
//   server.close(() => {
//     console.log('HTTP server closed');
//   });
// });

// module.exports = app;


















//git code 


const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { initializeSocket } = require('./socket');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS Configuration for Production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://your-frontend-url.vercel.app'
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Import Routes
const authRoutes = require('./routes/auth');
const rideRoutes = require('./routes/rides');
const tripRoutes = require('./routes/trips');
const itemRoutes = require('./routes/items');
const chatRoutes = require('./routes/chats');
const notificationRoutes = require('./routes/notifications');
const analyticsRoutes = require('./routes/analytics');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to EcoRide API',
    version: '1.0.0',
    status: 'Server is running',
    endpoints: {
      auth: '/api/auth',
      rides: '/api/rides',
      trips: '/api/trips',
      items: '/api/items',
      chats: '/api/chats',
      notifications: '/api/notifications',
      analytics: '/api/analytics'
    }
  });
});

// Health check route for deployment monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Initialize Socket.io
initializeSocket(server);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;