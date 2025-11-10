// const mongoose = require('mongoose');
// const User = require('../models/User');
// const Ride = require('../models/Ride');
// const Trip = require('../models/Trip');
// const Item = require('../models/Item');

// // @desc    Get dashboard statistics
// // @route   GET /api/analytics/dashboard
// // @access  Private
// exports.getDashboardStats = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const userObjectId = new mongoose.Types.ObjectId(userId);

//     // Get user
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // Count rides offered by user
//     const ridesOffered = await Ride.countDocuments({
//       driver: userObjectId,
//       'schedule.date': { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
//     });

//     // Count rides taken by user
//     const ridesTaken = await Ride.countDocuments({
//       'passengers.user': userObjectId,
//       'schedule.date': { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
//     });

//     // Count active rides
//     const activeRides = await Ride.countDocuments({
//       $or: [
//         { driver: userObjectId },
//         { 'passengers.user': userObjectId }
//       ],
//       'schedule.date': { $gte: new Date() }
//     });

//     // Count trips participated
//     const tripsCount = await Trip.countDocuments({
//       'participants.user': userObjectId
//     });

//     // Count marketplace items listed
//     const itemsListed = await Item.countDocuments({
//       seller: userObjectId
//     });

//     // Calculate environmental impact
//     const carbonSaved = user.carbonSaved || (ridesOffered + ridesTaken) * 2.5; // Approx 2.5kg per ride
//     const moneySaved = user.moneySaved || (ridesTaken * 150); // Approx ₹150 per ride

//     res.status(200).json({
//       success: true,
//       data: {
//         ridesOffered,
//         ridesTaken,
//         totalRides: ridesOffered + ridesTaken,
//         activeRides,
//         tripsCount,
//         itemsListed,
//         carbonSaved: Math.round(carbonSaved * 10) / 10,
//         moneySaved: Math.round(moneySaved),
//         rating: user.rating || 0,
//         totalRatings: user.totalRatings || 0
//       }
//     });
//   } catch (error) {
//     console.error('Get dashboard stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching dashboard statistics',
//       error: error.message
//     });
//   }
// };

// // @desc    Get monthly trends
// // @route   GET /api/analytics/trends
// // @access  Private
// exports.getMonthlyTrends = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const userObjectId = new mongoose.Types.ObjectId(userId);

//     // Get last 6 months data
//     const months = [];
//     const ridesData = [];
//     const carbonData = [];

//     for (let i = 5; i >= 0; i--) {
//       const date = new Date();
//       date.setMonth(date.getMonth() - i);
//       const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
//       const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

//       // Month name
//       months.push(date.toLocaleString('default', { month: 'short' }));

//       // Count rides in this month
//       const ridesOffered = await Ride.countDocuments({
//         driver: userObjectId,
//         'schedule.date': { $gte: monthStart, $lte: monthEnd }
//       });

//       const ridesTaken = await Ride.countDocuments({
//         'passengers.user': userObjectId,
//         'schedule.date': { $gte: monthStart, $lte: monthEnd }
//       });

//       const totalRides = ridesOffered + ridesTaken;
//       ridesData.push(totalRides);
//       carbonData.push(totalRides * 2.5); // 2.5kg CO2 per ride
//     }

//     res.status(200).json({
//       success: true,
//       data: {
//         months,
//         rides: ridesData,
//         carbon: carbonData
//       }
//     });
//   } catch (error) {
//     console.error('Get trends error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching trends',
//       error: error.message
//     });
//   }
// };

// // @desc    Get leaderboard
// // @route   GET /api/analytics/leaderboard
// // @access  Private
// exports.getLeaderboard = async (req, res) => {
//   try {
//     const { type = 'carbon', limit = 10 } = req.query;

//     let sortField;
//     switch (type) {
//       case 'rides':
//         sortField = { ridesOffered: -1 };
//         break;
//       case 'rating':
//         sortField = { rating: -1, totalRatings: -1 };
//         break;
//       case 'carbon':
//       default:
//         sortField = { carbonSaved: -1 };
//     }

//     const leaderboard = await User.find()
//       .select('name email department profilePicture carbonSaved ridesOffered ridesTaken rating totalRatings')
//       .sort(sortField)
//       .limit(parseInt(limit));

//     res.status(200).json({
//       success: true,
//       data: leaderboard
//     });
//   } catch (error) {
//     console.error('Get leaderboard error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching leaderboard',
//       error: error.message
//     });
//   }
// };

// // @desc    Get platform statistics (admin)
// // @route   GET /api/analytics/platform
// // @access  Private
// exports.getPlatformStats = async (req, res) => {
//   try {
//     // Total users
//     const totalUsers = await User.countDocuments();
//     const activeUsers = await User.countDocuments({ isActive: true });

//     // Total rides
//     const totalRides = await Ride.countDocuments();
//     const completedRides = await Ride.countDocuments({
//       'schedule.date': { $lt: new Date() }
//     });

//     // Total trips
//     const totalTrips = await Trip.countDocuments();
//     const activeTrips = await Trip.countDocuments({
//       endDate: { $gte: new Date() }
//     });

//     // Total marketplace items
//     const totalItems = await Item.countDocuments();
//     const availableItems = await Item.countDocuments({ availability: 'available' });

//     // Environmental impact
//     const users = await User.find().select('carbonSaved moneySaved');
//     const totalCarbonSaved = users.reduce((sum, user) => sum + (user.carbonSaved || 0), 0);
//     const totalMoneySaved = users.reduce((sum, user) => sum + (user.moneySaved || 0), 0);

//     // Growth metrics (last 30 days)
//     const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
//     const newUsers = await User.countDocuments({
//       createdAt: { $gte: thirtyDaysAgo }
//     });
//     const newRides = await Ride.countDocuments({
//       createdAt: { $gte: thirtyDaysAgo }
//     });

//     res.status(200).json({
//       success: true,
//       data: {
//         users: {
//           total: totalUsers,
//           active: activeUsers,
//           newThisMonth: newUsers
//         },
//         rides: {
//           total: totalRides,
//           completed: completedRides,
//           newThisMonth: newRides
//         },
//         trips: {
//           total: totalTrips,
//           active: activeTrips
//         },
//         marketplace: {
//           total: totalItems,
//           available: availableItems
//         },
//         impact: {
//           carbonSaved: Math.round(totalCarbonSaved * 10) / 10,
//           moneySaved: Math.round(totalMoneySaved),
//           averagePerUser: Math.round((totalCarbonSaved / totalUsers) * 10) / 10
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get platform stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching platform statistics',
//       error: error.message
//     });
//   }
// };

// // @desc    Get user activity breakdown
// // @route   GET /api/analytics/activity
// // @access  Private
// exports.getUserActivity = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const userObjectId = new mongoose.Types.ObjectId(userId);

//     // Rides by status
//     const ridesAsDriver = await Ride.find({ driver: userObjectId })
//       .select('status schedule')
//       .lean();

//     const ridesAsPassenger = await Ride.find({ 'passengers.user': userObjectId })
//       .select('status schedule passengers')
//       .lean();

//     // Categorize rides
//     const upcoming = [];
//     const completed = [];
//     const cancelled = [];
//     const now = new Date();

//     ridesAsDriver.forEach(ride => {
//       if (ride.status === 'cancelled') {
//         cancelled.push(ride);
//       } else if (new Date(ride.schedule.date) > now) {
//         upcoming.push(ride);
//       } else {
//         completed.push(ride);
//       }
//     });

//     ridesAsPassenger.forEach(ride => {
//       const passenger = ride.passengers.find(p => p.user.toString() === userId);
//       if (passenger?.status === 'rejected' || ride.status === 'cancelled') {
//         cancelled.push(ride);
//       } else if (new Date(ride.schedule.date) > now) {
//         upcoming.push(ride);
//       } else if (passenger?.status === 'accepted') {
//         completed.push(ride);
//       }
//     });

//     // Trips participation
//     const trips = await Trip.find({ 'participants.user': userObjectId })
//       .select('title startDate endDate status')
//       .lean();

//     const activeTrips = trips.filter(t => new Date(t.endDate) >= now);
//     const pastTrips = trips.filter(t => new Date(t.endDate) < now);

//     // Marketplace activity
//     const itemsListed = await Item.countDocuments({ seller: userObjectId });
//     const itemsSold = await Item.countDocuments({ 
//       seller: userObjectId,
//       availability: 'sold'
//     });

//     res.status(200).json({
//       success: true,
//       data: {
//         rides: {
//           upcoming: upcoming.length,
//           completed: completed.length,
//           cancelled: cancelled.length,
//           total: ridesAsDriver.length + ridesAsPassenger.length
//         },
//         trips: {
//           active: activeTrips.length,
//           past: pastTrips.length,
//           total: trips.length
//         },
//         marketplace: {
//           listed: itemsListed,
//           sold: itemsSold,
//           active: itemsListed - itemsSold
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get user activity error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching user activity',
//       error: error.message
//     });
//   }
// };

// // @desc    Get ride statistics by department
// // @route   GET /api/analytics/departments
// // @access  Private
// exports.getDepartmentStats = async (req, res) => {
//   try {
//     const departments = await User.aggregate([
//       {
//         $group: {
//           _id: '$department',
//           userCount: { $sum: 1 },
//           totalRidesOffered: { $sum: '$ridesOffered' },
//           totalRidesTaken: { $sum: '$ridesTaken' },
//           totalCarbonSaved: { $sum: '$carbonSaved' },
//           averageRating: { $avg: '$rating' }
//         }
//       },
//       {
//         $sort: { totalCarbonSaved: -1 }
//       },
//       {
//         $limit: 10
//       }
//     ]);

//     res.status(200).json({
//       success: true,
//       data: departments.map(dept => ({
//         department: dept._id,
//         users: dept.userCount,
//         ridesOffered: dept.totalRidesOffered,
//         ridesTaken: dept.totalRidesTaken,
//         carbonSaved: Math.round(dept.totalCarbonSaved * 10) / 10,
//         averageRating: Math.round(dept.averageRating * 10) / 10
//       }))
//     });
//   } catch (error) {
//     console.error('Get department stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching department statistics',
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   getDashboardStats,
//   getMonthlyTrends,
//   getLeaderboard,
//   getPlatformStats,
//   getUserActivity,
//   getDepartmentStats
// };

const mongoose = require('mongoose');
const User = require('../models/User');
const Ride = require('../models/Ride');
const Trip = require('../models/Trip');
const Item = require('../models/Item');

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Count rides offered by user
    const ridesOffered = await Ride.countDocuments({
      driver: userObjectId,
      'schedule.date': { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
    });

    // Count rides taken by user
    const ridesTaken = await Ride.countDocuments({
      'passengers.user': userObjectId,
      'schedule.date': { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
    });

    // Count active rides
    const activeRides = await Ride.countDocuments({
      $or: [
        { driver: userObjectId },
        { 'passengers.user': userObjectId }
      ],
      'schedule.date': { $gte: new Date() }
    });

    // Count trips participated
    const tripsCount = await Trip.countDocuments({
      'participants.user': userObjectId
    });

    // Count marketplace items listed
    const itemsListed = await Item.countDocuments({
      seller: userObjectId
    });

    // Calculate environmental impact
    const carbonSaved = user.carbonSaved || (ridesOffered + ridesTaken) * 2.5; // Approx 2.5kg per ride
    const moneySaved = user.moneySaved || (ridesTaken * 150); // Approx ₹150 per ride

    res.status(200).json({
      success: true,
      data: {
        ridesOffered,
        ridesTaken,
        totalRides: ridesOffered + ridesTaken,
        activeRides,
        tripsCount,
        itemsListed,
        carbonSaved: Math.round(carbonSaved * 10) / 10,
        moneySaved: Math.round(moneySaved),
        rating: user.rating || 0,
        totalRatings: user.totalRatings || 0
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get monthly trends
// @route   GET /api/analytics/trends
// @access  Private
exports.getMonthlyTrends = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Get last 6 months data
    const months = [];
    const ridesData = [];
    const carbonData = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      // Month name
      months.push(date.toLocaleString('default', { month: 'short' }));

      // Count rides in this month
      const ridesOffered = await Ride.countDocuments({
        driver: userObjectId,
        'schedule.date': { $gte: monthStart, $lte: monthEnd }
      });

      const ridesTaken = await Ride.countDocuments({
        'passengers.user': userObjectId,
        'schedule.date': { $gte: monthStart, $lte: monthEnd }
      });

      const totalRides = ridesOffered + ridesTaken;
      ridesData.push(totalRides);
      carbonData.push(totalRides * 2.5); // 2.5kg CO2 per ride
    }

    res.status(200).json({
      success: true,
      data: {
        months,
        rides: ridesData,
        carbon: carbonData
      }
    });
  } catch (error) {
    console.error('Get trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trends',
      error: error.message
    });
  }
};

// @desc    Get leaderboard
// @route   GET /api/analytics/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res) => {
  try {
    const { type = 'carbon', limit = 10 } = req.query;

    let sortField;
    switch (type) {
      case 'rides':
        sortField = { ridesOffered: -1 };
        break;
      case 'rating':
        sortField = { rating: -1, totalRatings: -1 };
        break;
      case 'carbon':
      default:
        sortField = { carbonSaved: -1 };
    }

    const leaderboard = await User.find()
      .select('name email department profilePicture carbonSaved ridesOffered ridesTaken rating totalRatings')
      .sort(sortField)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
};

// @desc    Get platform statistics (admin)
// @route   GET /api/analytics/platform
// @access  Private
exports.getPlatformStats = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    // Total rides
    const totalRides = await Ride.countDocuments();
    const completedRides = await Ride.countDocuments({
      'schedule.date': { $lt: new Date() }
    });

    // Total trips
    const totalTrips = await Trip.countDocuments();
    const activeTrips = await Trip.countDocuments({
      endDate: { $gte: new Date() }
    });

    // Total marketplace items
    const totalItems = await Item.countDocuments();
    const availableItems = await Item.countDocuments({ availability: 'available' });

    // Environmental impact
    const users = await User.find().select('carbonSaved moneySaved');
    const totalCarbonSaved = users.reduce((sum, user) => sum + (user.carbonSaved || 0), 0);
    const totalMoneySaved = users.reduce((sum, user) => sum + (user.moneySaved || 0), 0);

    // Growth metrics (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    const newRides = await Ride.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          newThisMonth: newUsers
        },
        rides: {
          total: totalRides,
          completed: completedRides,
          newThisMonth: newRides
        },
        trips: {
          total: totalTrips,
          active: activeTrips
        },
        marketplace: {
          total: totalItems,
          available: availableItems
        },
        impact: {
          carbonSaved: Math.round(totalCarbonSaved * 10) / 10,
          moneySaved: Math.round(totalMoneySaved),
          averagePerUser: Math.round((totalCarbonSaved / totalUsers) * 10) / 10
        }
      }
    });
  } catch (error) {
    console.error('Get platform stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching platform statistics',
      error: error.message
    });
  }
};

// @desc    Get user activity breakdown
// @route   GET /api/analytics/activity
// @access  Private
exports.getUserActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Rides by status
    const ridesAsDriver = await Ride.find({ driver: userObjectId })
      .select('status schedule')
      .lean();

    const ridesAsPassenger = await Ride.find({ 'passengers.user': userObjectId })
      .select('status schedule passengers')
      .lean();

    // Categorize rides
    const upcoming = [];
    const completed = [];
    const cancelled = [];
    const now = new Date();

    ridesAsDriver.forEach(ride => {
      if (ride.status === 'cancelled') {
        cancelled.push(ride);
      } else if (new Date(ride.schedule.date) > now) {
        upcoming.push(ride);
      } else {
        completed.push(ride);
      }
    });

    ridesAsPassenger.forEach(ride => {
      const passenger = ride.passengers.find(p => p.user.toString() === userId);
      if (passenger?.status === 'rejected' || ride.status === 'cancelled') {
        cancelled.push(ride);
      } else if (new Date(ride.schedule.date) > now) {
        upcoming.push(ride);
      } else if (passenger?.status === 'accepted') {
        completed.push(ride);
      }
    });

    // Trips participation
    const trips = await Trip.find({ 'participants.user': userObjectId })
      .select('title startDate endDate status')
      .lean();

    const activeTrips = trips.filter(t => new Date(t.endDate) >= now);
    const pastTrips = trips.filter(t => new Date(t.endDate) < now);

    // Marketplace activity
    const itemsListed = await Item.countDocuments({ seller: userObjectId });
    const itemsSold = await Item.countDocuments({ 
      seller: userObjectId,
      availability: 'sold'
    });

    res.status(200).json({
      success: true,
      data: {
        rides: {
          upcoming: upcoming.length,
          completed: completed.length,
          cancelled: cancelled.length,
          total: ridesAsDriver.length + ridesAsPassenger.length
        },
        trips: {
          active: activeTrips.length,
          past: pastTrips.length,
          total: trips.length
        },
        marketplace: {
          listed: itemsListed,
          sold: itemsSold,
          active: itemsListed - itemsSold
        }
      }
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user activity',
      error: error.message
    });
  }
};

// @desc    Get ride statistics by department
// @route   GET /api/analytics/departments
// @access  Private
exports.getDepartmentStats = async (req, res) => {
  try {
    const departments = await User.aggregate([
      {
        $group: {
          _id: '$department',
          userCount: { $sum: 1 },
          totalRidesOffered: { $sum: '$ridesOffered' },
          totalRidesTaken: { $sum: '$ridesTaken' },
          totalCarbonSaved: { $sum: '$carbonSaved' },
          averageRating: { $avg: '$rating' }
        }
      },
      {
        $sort: { totalCarbonSaved: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.status(200).json({
      success: true,
      data: departments.map(dept => ({
        department: dept._id,
        users: dept.userCount,
        ridesOffered: dept.totalRidesOffered,
        ridesTaken: dept.totalRidesTaken,
        carbonSaved: Math.round(dept.totalCarbonSaved * 10) / 10,
        averageRating: Math.round(dept.averageRating * 10) / 10
      }))
    });
  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching department statistics',
      error: error.message
    });
  }
};