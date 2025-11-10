// const User = require('../models/User');
// const Ride = require('../models/Ride');
// const Trip = require('../models/Trip');
// const mongoose = require('mongoose');

// // @desc    Get dashboard statistics
// // @route   GET /api/dashboard/stats
// // @access  Private
// exports.getDashboardStats = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const userObjectId = new mongoose.Types.ObjectId(userId);

//     // Get user data
//     const user = await User.findById(userId);
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // ===== RIDES OFFERED (as driver) =====
//     const ridesOffered = await Ride.countDocuments({
//       driver: userObjectId,
//       status: { $in: ['active', 'completed', 'full'] }
//     });

//     // ===== RIDES TAKEN (as accepted passenger) =====
//     const ridesTaken = await Ride.countDocuments({
//       'passengers.user': userObjectId,
//       'passengers.status': 'accepted'
//     });

//     // ===== CALCULATE CO2 SAVED =====
//     // Formula: For each COMPLETED ride as passenger
//     // CO2 saved = (distance × 120g) - (distance × 120g ÷ total_passengers)
    
//     const completedRidesAsPassenger = await Ride.find({
//       'passengers.user': userObjectId,
//       'passengers.status': 'accepted',
//       status: 'completed'
//     });

//     let totalCarbonSaved = 0;
//     let totalMoneySaved = 0;

//     completedRidesAsPassenger.forEach(ride => {
//       const distance = ride.route.distance;
//       const acceptedPassengers = ride.passengers.filter(p => p.status === 'accepted').length;
//       const totalPeople = acceptedPassengers + 1; // +1 for driver

//       // CO2 Calculation
//       // Solo emissions: distance × 120g per km
//       // Shared emissions: (distance × 120g) ÷ totalPeople
//       const soloEmissions = distance * 120; // in grams
//       const sharedEmissions = (distance * 120) / totalPeople;
//       const carbonSavedGrams = soloEmissions - sharedEmissions;
//       totalCarbonSaved += carbonSavedGrams / 1000; // convert to kg

//       // Money Calculation
//       // Assuming: Fuel = ₹100/liter, Mileage = 15 km/liter
//       const fuelPricePerLiter = 100;
//       const mileage = 15;
//       const fuelCostPerKm = fuelPricePerLiter / mileage;
      
//       const soloCost = distance * fuelCostPerKm;
//       const sharedCost = (distance * fuelCostPerKm) / totalPeople;
//       const moneySavedPerRide = soloCost - sharedCost;
//       totalMoneySaved += moneySavedPerRide;
//     });

//     // ===== ACTIVE RIDES =====
//     const activeRides = await Ride.countDocuments({
//       $or: [
//         { driver: userObjectId },
//         { 'passengers.user': userObjectId }
//       ],
//       status: { $in: ['active', 'full'] },
//       'schedule.departureTime': { $gte: new Date() }
//     });

//     // ===== UPCOMING TRIPS =====
//     const upcomingTrips = await Trip.countDocuments({
//       $or: [
//         { organizer: userObjectId },
//         { 'participants.user': userObjectId }
//       ],
//       status: 'planned',
//       'schedule.startDate': { $gte: new Date() }
//     });

//     // ===== PREPARE RESPONSE =====
//     const stats = {
//       ridesOffered: ridesOffered || 0,
//       ridesTaken: ridesTaken || 0,
//       carbonSaved: parseFloat(totalCarbonSaved.toFixed(2)) || 0,
//       moneySaved: Math.round(totalMoneySaved) || 0,
//       activeRides: activeRides || 0,
//       upcomingTrips: upcomingTrips || 0,
//       rating: user.rating || 0,
//       totalRatings: user.totalRatings || 0
//     };

//     console.log('✅ Dashboard stats calculated:', stats);

//     res.status(200).json({
//       success: true,
//       data: stats
//     });

//   } catch (error) {
//     console.error('❌ Dashboard stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch dashboard statistics',
//       error: error.message
//     });
//   }
// };

// // @desc    Complete a ride (mark as completed)
// // @route   PUT /api/rides/:id/complete
// // @access  Private (Driver only)
// exports.completeRide = async (req, res) => {
//   try {
//     const ride = await Ride.findById(req.params.id);

//     if (!ride) {
//       return res.status(404).json({
//         success: false,
//         message: 'Ride not found'
//       });
//     }

//     // Only driver can complete the ride
//     if (ride.driver.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Only the driver can complete this ride'
//       });
//     }

//     // Mark ride as completed
//     ride.status = 'completed';
    
//     // Calculate carbon saved for this ride
//     const distance = ride.route.distance;
//     const acceptedPassengers = ride.passengers.filter(p => p.status === 'accepted').length;
//     const totalPeople = acceptedPassengers + 1;
    
//     // CO2 calculation
//     const soloEmissions = distance * 120 * totalPeople; // if everyone drove separately
//     const sharedEmissions = distance * 120; // one car for everyone
//     const carbonSavedGrams = soloEmissions - sharedEmissions;
//     ride.carbonSaved = carbonSavedGrams / 1000; // convert to kg

//     await ride.save();

//     // Update driver stats
//     const driver = await User.findById(ride.driver);
//     driver.ridesOffered += 1;
//     await driver.save();

//     // Update each accepted passenger's stats
//     for (const passenger of ride.passengers) {
//       if (passenger.status === 'accepted') {
//         const passengerUser = await User.findById(passenger.user);
//         if (passengerUser) {
//           passengerUser.ridesTaken += 1;
//           // Each passenger saves proportional CO2
//           passengerUser.carbonSaved += (carbonSavedGrams / totalPeople) / 1000;
          
//           // Each passenger saves money
//           const fuelCostPerKm = 100 / 15;
//           const soloCost = distance * fuelCostPerKm;
//           const sharedCost = (distance * fuelCostPerKm) / totalPeople;
//           passengerUser.moneySaved += Math.round(soloCost - sharedCost);
          
//           await passengerUser.save();
//         }
//       }
//     }

//     console.log('✅ Ride completed and stats updated');

//     res.status(200).json({
//       success: true,
//       message: 'Ride completed successfully',
//       data: ride
//     });

//   } catch (error) {
//     console.error('❌ Complete ride error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error completing ride',
//       error: error.message
//     });
//   }
// };

// module.exports = exports;

const User = require('../models/User');
const Ride = require('../models/Ride');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    console.log('📊 Fetching dashboard stats for user:', req.user._id);
    
    // Get user with all stats fields
    const user = await User.findById(req.user._id).select(
      'ridesOffered ridesTaken carbonSaved moneySaved rating totalRatings'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('👤 User stats from database:', {
      ridesOffered: user.ridesOffered,
      ridesTaken: user.ridesTaken,
      carbonSaved: user.carbonSaved,
      moneySaved: user.moneySaved,
      rating: user.rating,
      totalRatings: user.totalRatings
    });

    // Count active rides where user is driver
    const activeRidesAsDriver = await Ride.countDocuments({
      driver: req.user._id,
      status: { $in: ['active', 'full'] }
    });

    // Count upcoming trips where user is accepted passenger
    const upcomingTripsAsPassenger = await Ride.countDocuments({
      'passengers.user': req.user._id,
      'passengers.status': 'accepted',
      status: { $in: ['active', 'full'] },
      'schedule.departureTime': { $gt: new Date() }
    });

    const stats = {
      ridesOffered: user.ridesOffered || 0,
      ridesTaken: user.ridesTaken || 0,
      carbonSaved: Number(user.carbonSaved || 0),
      moneySaved: Number(user.moneySaved || 0),
      activeRides: activeRidesAsDriver,
      upcomingTrips: upcomingTripsAsPassenger,
      rating: Number(user.rating || 0),
      totalRatings: user.totalRatings || 0
    };

    console.log('✅ Final dashboard stats:', stats);

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get user activity/history
// @route   GET /api/dashboard/activity
// @access  Private
exports.getUserActivity = async (req, res) => {
  try {
    // Get recent rides as driver
    const recentAsDriver = await Ride.find({
      driver: req.user._id
    })
      .sort({ 'schedule.departureTime': -1 })
      .limit(5)
      .populate('passengers.user', 'name profilePicture')
      .select('route schedule status passengers');

    // Get recent rides as passenger
    const recentAsPassenger = await Ride.find({
      'passengers.user': req.user._id
    })
      .sort({ 'schedule.departureTime': -1 })
      .limit(5)
      .populate('driver', 'name profilePicture')
      .select('route schedule status driver');

    res.status(200).json({
      success: true,
      data: {
        asDriver: recentAsDriver,
        asPassenger: recentAsPassenger
      }
    });

  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user activity',
      error: error.message
    });
  }
};

// @desc    Get environmental impact summary
// @route   GET /api/dashboard/impact
// @access  Private
exports.getEnvironmentalImpact = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('carbonSaved moneySaved');

    // Calculate equivalent metrics
    const treesEquivalent = (user.carbonSaved / 21).toFixed(1); // 1 tree absorbs ~21kg CO2/year
    const carMilesAvoided = (user.carbonSaved / 0.404).toFixed(0); // Average car emits 404g CO2/mile

    res.status(200).json({
      success: true,
      data: {
        carbonSaved: user.carbonSaved,
        moneySaved: user.moneySaved,
        treesEquivalent: parseFloat(treesEquivalent),
        carMilesAvoided: parseInt(carMilesAvoided)
      }
    });

  } catch (error) {
    console.error('Error fetching environmental impact:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching environmental impact',
      error: error.message
    });
  }
};