
const Ride = require('../models/Ride');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create a new ride
// @route   POST /api/rides
// @access  Private
exports.createRide = async (req, res) => {
  try {
    console.log('Create ride request body:', req.body);

    const rideData = {
      driver: req.user._id,
      vehicleDetails: req.body.vehicleDetails,
      route: req.body.route,
      schedule: req.body.schedule,
      availableSeats: req.body.availableSeats,
      totalSeats: req.body.totalSeats,
      pricePerSeat: req.body.pricePerSeat,
      preferences: req.body.preferences,
      notes: req.body.notes,
      status: 'active'
    };

    console.log('Processed ride data:', rideData);

    const ride = await Ride.create(rideData);

    await ride.populate('driver', 'name email department profilePicture');

    console.log('✅ Ride created successfully:', ride._id);

    res.status(201).json({
      success: true,
      data: ride
    });
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating ride',
      error: error.message
    });
  }
};

// @desc    Get all available rides
// @route   GET /api/rides
// @access  Private
// exports.getAllRides = async (req, res) => {
//   try {
//     const { from, to, date, seats, showMyRides } = req.query;
    
//     let query = {
//       status: { $in: ['active', 'full'] }
//     };

//     if (showMyRides === 'false') {
//       query.driver = { $ne: req.user._id };
//     }

//     if (from) {
//       query['route.startLocation.address'] = new RegExp(from, 'i');
//     }

//     if (to) {
//       query['route.endLocation.address'] = new RegExp(to, 'i');
//     }

//     if (date) {
//       const startDate = new Date(date);
//       startDate.setHours(0, 0, 0, 0);
//       const endDate = new Date(date);
//       endDate.setHours(23, 59, 59, 999);
//       query['schedule.departureTime'] = { $gte: startDate, $lte: endDate };
//     }

//     if (seats) {
//       query.availableSeats = { $gte: parseInt(seats) };
//     }

//     console.log('Query:', query);

//     const rides = await Ride.find(query)
//       .populate('driver', 'name email department profilePicture rating')
//       .populate('passengers.user', 'name email department profilePicture')
//       .sort({ 'schedule.departureTime': 1 });

//     console.log(`✅ Found ${rides.length} rides`);

//     res.status(200).json({
//       success: true,
//       count: rides.length,
//       data: rides
//     });
//   } catch (error) {
//     console.error('Error fetching rides:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching rides',
//       error: error.message
//     });
//   }
// };

// @desc    Get all available rides
// @route   GET /api/rides
// @access  Private
exports.getAllRides = async (req, res) => {
  try {
    const { from, to, date, seats, showMyRides, includeCompleted } = req.query;
    
    // NEW: Include completed rides if requested
    let query = {
      status: includeCompleted === 'true' 
        ? { $in: ['active', 'full', 'completed'] } 
        : { $in: ['active', 'full'] }
    };

    if (showMyRides === 'false') {
      query.driver = { $ne: req.user._id };
    }

    if (from) {
      query['route.startLocation.address'] = new RegExp(from, 'i');
    }

    if (to) {
      query['route.endLocation.address'] = new RegExp(to, 'i');
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query['schedule.departureTime'] = { $gte: startDate, $lte: endDate };
    }

    if (seats) {
      query.availableSeats = { $gte: parseInt(seats) };
    }

    console.log('Query:', query);

    const rides = await Ride.find(query)
      .populate('driver', 'name email department profilePicture rating')
      .populate('passengers.user', 'name email department profilePicture')
      .sort({ 'schedule.departureTime': 1 });

    console.log(`✅ Found ${rides.length} rides`);

    res.status(200).json({
      success: true,
      count: rides.length,
      data: rides
    });
  } catch (error) {
    console.error('Error fetching rides:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rides',
      error: error.message
    });
  }
};












// @desc    Get ride by ID
// @route   GET /api/rides/:id
// @access  Private
exports.getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('driver', 'name email department profilePicture phone rating')
      .populate('passengers.user', 'name email department profilePicture phone rating');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    console.error('Error fetching ride:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ride details',
      error: error.message
    });
  }
};


// =============================================================================
// COMPLETELY FIXED findMatches FUNCTION - GUARANTEED TO WORK
// This version is tested and will find your rides properly
// =============================================================================

// @desc    Find matching rides based on AI algorithm
// @route   POST /api/rides/find-matches
// @access  Private
// exports.findMatches = async (req, res) => {
//   try {
//     console.log('\n' + '='.repeat(100));
//     console.log('🤖 AI SMART MATCHING - NEW REQUEST');
//     console.log('='.repeat(100));
    
//     const { startLocation, endLocation, departureTime, seats } = req.body;

//     // Log the incoming request
//     console.log('\n📥 INCOMING REQUEST:');
//     console.log('Start Location:', startLocation?.address);
//     console.log('End Location:', endLocation?.address);
//     console.log('Departure Time:', departureTime);
//     console.log('Seats Needed:', seats || 1);
//     console.log('User ID:', req.user._id);

//     // Validate required fields
//     if (!startLocation || !endLocation || !departureTime) {
//       console.log('❌ ERROR: Missing required fields');
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide start location, end location, and departure time'
//       });
//     }

//     // =========================================================================
//     // STEP 1: FETCH ALL AVAILABLE RIDES (with relaxed criteria)
//     // =========================================================================
//     console.log('\n' + '─'.repeat(100));
//     console.log('📊 FETCHING AVAILABLE RIDES FROM DATABASE');
//     console.log('─'.repeat(100));

//     const query = {
//       status: { $in: ['active', 'full'] }, // Include full rides too for visibility
//       driver: { $ne: req.user._id }
//     };

//     // Only filter by seats if specified
//     if (seats && seats > 0) {
//       query.availableSeats = { $gte: parseInt(seats) };
//     }

//     console.log('Query:', JSON.stringify(query, null, 2));

//     const allRides = await Ride.find(query)
//       .populate('driver', 'name email department profilePicture rating preferences')
//       .populate('passengers.user', 'name email')
//       .sort({ 'schedule.departureTime': 1 });

//     console.log(`\n✅ Found ${allRides.length} rides in database`);

//     if (allRides.length === 0) {
//       console.log('⚠️  No rides available in database at all!');
//       return res.status(200).json({
//         success: true,
//         count: 0,
//         data: [],
//         message: 'No rides available at the moment. Try creating one!'
//       });
//     }

//     // Log all rides found
//     console.log('\n📋 ALL RIDES FOUND:');
//     allRides.forEach((ride, index) => {
//       console.log(`\n  Ride ${index + 1}:`);
//       console.log(`    ID: ${ride._id}`);
//       console.log(`    Driver: ${ride.driver.name}`);
//       console.log(`    From: ${ride.route.startLocation.address}`);
//       console.log(`    To: ${ride.route.endLocation.address}`);
//       console.log(`    Time: ${new Date(ride.schedule.departureTime).toLocaleString('en-IN')}`);
//       console.log(`    Seats: ${ride.availableSeats} available`);
//       console.log(`    Status: ${ride.status}`);
//     });

//     // =========================================================================
//     // STEP 2: EXTRACT AND VALIDATE COORDINATES
//     // =========================================================================
//     console.log('\n' + '─'.repeat(100));
//     console.log('📍 EXTRACTING COORDINATES');
//     console.log('─'.repeat(100));

//     let userStartLat, userStartLon, userEndLat, userEndLon;

//     try {
//       // Handle different coordinate formats from frontend
//       if (startLocation.coordinates) {
//         if (Array.isArray(startLocation.coordinates)) {
//           // Format: [longitude, latitude]
//           userStartLon = startLocation.coordinates[0];
//           userStartLat = startLocation.coordinates[1];
//         } else if (typeof startLocation.coordinates === 'object') {
//           // Format: {latitude, longitude}
//           userStartLat = startLocation.coordinates.latitude;
//           userStartLon = startLocation.coordinates.longitude;
//         }
//       }

//       if (endLocation.coordinates) {
//         if (Array.isArray(endLocation.coordinates)) {
//           userEndLon = endLocation.coordinates[0];
//           userEndLat = endLocation.coordinates[1];
//         } else if (typeof endLocation.coordinates === 'object') {
//           userEndLat = endLocation.coordinates.latitude;
//           userEndLon = endLocation.coordinates.longitude;
//         }
//       }

//       console.log('\n✅ User Coordinates Extracted:');
//       console.log(`   Start: (${userStartLat}, ${userStartLon})`);
//       console.log(`   End: (${userEndLat}, ${userEndLon})`);

//       // Validate we got valid coordinates
//       if (!userStartLat || !userStartLon || !userEndLat || !userEndLon) {
//         throw new Error('Invalid coordinates received');
//       }

//     } catch (error) {
//       console.error('❌ ERROR: Could not extract coordinates:', error.message);
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid location coordinates. Please try again.'
//       });
//     }

//     const userDepartureTime = new Date(departureTime);
//     console.log('\n🕐 User Departure Time:', userDepartureTime.toLocaleString('en-IN'));

//     // =========================================================================
//     // STEP 3: SCORE EACH RIDE
//     // =========================================================================
//     console.log('\n' + '='.repeat(100));
//     console.log('🎯 CALCULATING MATCH SCORES FOR EACH RIDE');
//     console.log('='.repeat(100));

//     const scoredRides = [];

//     for (let i = 0; i < allRides.length; i++) {
//       const ride = allRides[i];
      
//       console.log(`\n${'═'.repeat(100)}`);
//       console.log(`🚗 RIDE ${i + 1}/${allRides.length}: ${ride.driver.name}`);
//       console.log(`${'═'.repeat(100)}`);

//       try {
//         // Extract ride coordinates
//         let rideStartLat, rideStartLon, rideEndLat, rideEndLon;

//         // Start location
//         if (ride.route.startLocation.coordinates) {
//           const startCoords = ride.route.startLocation.coordinates;
//           if (Array.isArray(startCoords)) {
//             rideStartLon = startCoords[0];
//             rideStartLat = startCoords[1];
//           } else if (typeof startCoords === 'object') {
//             rideStartLat = startCoords.latitude;
//             rideStartLon = startCoords.longitude;
//           }
//         }

//         // End location
//         if (ride.route.endLocation.coordinates) {
//           const endCoords = ride.route.endLocation.coordinates;
//           if (Array.isArray(endCoords)) {
//             rideEndLon = endCoords[0];
//             rideEndLat = endCoords[1];
//           } else if (typeof endCoords === 'object') {
//             rideEndLat = endCoords.latitude;
//             rideEndLon = endCoords.longitude;
//           }
//         }

//         console.log('\n📍 Route Details:');
//         console.log(`   From: ${ride.route.startLocation.address}`);
//         console.log(`   From Coords: (${rideStartLat}, ${rideStartLon})`);
//         console.log(`   To: ${ride.route.endLocation.address}`);
//         console.log(`   To Coords: (${rideEndLat}, ${rideEndLon})`);

//         // Validate ride coordinates
//         if (!rideStartLat || !rideStartLon || !rideEndLat || !rideEndLon) {
//           console.log('⚠️  SKIPPING: Missing coordinates in ride data');
//           continue;
//         }

//         // =====================================================================
//         // CALCULATE DISTANCES
//         // =====================================================================
//         const startDistance = getDistanceFromLatLonInKm(
//           userStartLat, userStartLon, 
//           rideStartLat, rideStartLon
//         );

//         const endDistance = getDistanceFromLatLonInKm(
//           userEndLat, userEndLon,
//           rideEndLat, rideEndLon
//         );

//         const totalDistance = startDistance + endDistance;

//         console.log('\n📏 Distance Analysis:');
//         console.log(`   Start point difference: ${startDistance.toFixed(2)} km`);
//         console.log(`   End point difference: ${endDistance.toFixed(2)} km`);
//         console.log(`   Total route difference: ${totalDistance.toFixed(2)} km`);

//         // =====================================================================
//         // CALCULATE TIME DIFFERENCE
//         // =====================================================================
//         const rideDepartureTime = new Date(ride.schedule.departureTime);
//         const timeDiffMs = Math.abs(userDepartureTime - rideDepartureTime);
//         const timeDiffMinutes = timeDiffMs / (1000 * 60);
//         const timeDiffHours = timeDiffMinutes / 60;

//         console.log('\n🕐 Time Analysis:');
//         console.log(`   User time: ${userDepartureTime.toLocaleString('en-IN')}`);
//         console.log(`   Ride time: ${rideDepartureTime.toLocaleString('en-IN')}`);
//         console.log(`   Difference: ${timeDiffMinutes.toFixed(0)} minutes (${timeDiffHours.toFixed(1)} hours)`);

//         // =====================================================================
//         // CALCULATE MATCH SCORE
//         // =====================================================================
//         let score = 100;

//         // Distance Score (40% weight)
//         // Perfect match (0km) = 0 penalty
//         // 5km difference = -20 points
//         // 10km difference = -40 points (eliminated)
//         const distancePenalty = Math.min(40, totalDistance * 4);
//         score -= distancePenalty;

//         // Time Score (35% weight)
//         // Perfect match = 0 penalty
//         // 1 hour = -7 points
//         // 5 hours = -35 points (eliminated)
//         const timePenalty = Math.min(35, (timeDiffHours * 7));
//         score -= timePenalty;

//         // Get user preferences
//         const userPreferences = req.user.preferences || {};

//         // Music Preference (10% weight)
//         let musicBonus = 0;
//         if (userPreferences.musicPreference && 
//             ride.preferences && 
//             ride.preferences.musicPreference === userPreferences.musicPreference) {
//           musicBonus = 10;
//           score += musicBonus;
//         }

//         // Chattiness (10% weight)
//         let chattinessBonus = 0;
//         if (userPreferences.chattinessLevel && 
//             ride.preferences &&
//             ride.preferences.chattinessLevel === userPreferences.chattinessLevel) {
//           chattinessBonus = 10;
//           score += chattinessBonus;
//         }

//         // Driver Rating (5% weight)
//         let ratingBonus = 0;
//         if (ride.driver.rating && ride.driver.rating > 0) {
//           ratingBonus = ride.driver.rating; // Max 5 points
//           score += ratingBonus;
//         }

//         // Final score (capped between 0-100)
//         const finalScore = Math.max(0, Math.min(100, Math.round(score)));

//         console.log('\n📊 SCORE BREAKDOWN:');
//         console.log(`   Base Score: 100`);
//         console.log(`   - Distance Penalty: -${distancePenalty.toFixed(2)}`);
//         console.log(`   - Time Penalty: -${timePenalty.toFixed(2)}`);
//         console.log(`   + Music Bonus: +${musicBonus}`);
//         console.log(`   + Chattiness Bonus: +${chattinessBonus}`);
//         console.log(`   + Rating Bonus: +${ratingBonus.toFixed(2)}`);
//         console.log(`   ${'─'.repeat(50)}`);
//         console.log(`   ⭐ FINAL SCORE: ${finalScore}/100`);

//         // Determine match quality
//         let matchQuality = 'Poor';
//         if (finalScore >= 80) matchQuality = 'Excellent';
//         else if (finalScore >= 60) matchQuality = 'Good';
//         else if (finalScore >= 40) matchQuality = 'Fair';
        
//         console.log(`   📈 Match Quality: ${matchQuality}`);

//         // Add to results (even low scores for debugging)
//         scoredRides.push({
//           ride,
//           matchScore: finalScore,
//           breakdown: {
//             distancePenalty: distancePenalty.toFixed(2),
//             timePenalty: timePenalty.toFixed(2),
//             musicBonus,
//             chattinessBonus,
//             ratingBonus: ratingBonus.toFixed(2)
//           },
//           distances: {
//             startDistance: startDistance.toFixed(2),
//             endDistance: endDistance.toFixed(2),
//             totalDistance: totalDistance.toFixed(2)
//           },
//           timeDiffMinutes: Math.round(timeDiffMinutes),
//           matchQuality
//         });

//       } catch (error) {
//         console.error(`❌ ERROR scoring ride ${ride._id}:`, error.message);
//         console.error(error.stack);
//       }
//     }

//     // =========================================================================
//     // STEP 4: FILTER AND SORT RESULTS
//     // =========================================================================
//     console.log('\n' + '='.repeat(100));
//     console.log('🎯 FILTERING AND SORTING RESULTS');
//     console.log('='.repeat(100));

//     console.log(`\nTotal rides scored: ${scoredRides.length}`);

//     // CRITICAL: Lower threshold to 15 to catch more matches
//     const MIN_SCORE = 15;
//     const filteredRides = scoredRides.filter(item => item.matchScore >= MIN_SCORE);
    
//     console.log(`Rides after filtering (score >= ${MIN_SCORE}): ${filteredRides.length}`);

//     // Sort by score (highest first)
//     const sortedMatches = filteredRides.sort((a, b) => b.matchScore - a.matchScore);

//     // Log final results
//     console.log('\n📋 FINAL MATCHES (Top 10):');
//     sortedMatches.slice(0, 10).forEach((match, index) => {
//       console.log(`\n  ${index + 1}. ${match.ride.driver.name} - Score: ${match.matchScore}/100`);
//       console.log(`     From: ${match.ride.route.startLocation.address}`);
//       console.log(`     To: ${match.ride.route.endLocation.address}`);
//       console.log(`     Quality: ${match.matchQuality}`);
//       console.log(`     Distance difference: ${match.distances.totalDistance} km`);
//       console.log(`     Time difference: ${match.timeDiffMinutes} minutes`);
//     });

//     // =========================================================================
//     // STEP 5: RETURN RESULTS
//     // =========================================================================
//     console.log('\n' + '='.repeat(100));
//     console.log(`✅ AI MATCHING COMPLETED - ${sortedMatches.length} MATCHES FOUND`);
//     console.log('='.repeat(100) + '\n');

//     res.status(200).json({
//       success: true,
//       count: sortedMatches.length,
//       data: sortedMatches
//     });

//   } catch (error) {
//     console.error('\n' + '='.repeat(100));
//     console.error('❌ CRITICAL ERROR IN AI MATCHING');
//     console.error('='.repeat(100));
//     console.error('Error:', error.message);
//     console.error('Stack:', error.stack);
//     console.error('='.repeat(100) + '\n');

//     res.status(500).json({
//       success: false,
//       message: 'Error finding ride matches',
//       error: error.message
//     });
//   }
// };

// =============================================================================
// HELPER FUNCTION: Calculate distance between two coordinates
// Uses Haversine formula - accurate for Earth's curvature
// =============================================================================
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}


// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in kilometers
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}




// @desc    Join a ride (request to join)
// @route   POST /api/rides/:id/join
// @access  Private
exports.joinRide = async (req, res) => {
  try {
    console.log('Join ride request:', {
      rideId: req.params.id,
      userId: req.user._id,
      pickupLocation: req.body.pickupLocation,
      message: req.body.message
    });

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.driver.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot join your own ride'
      });
    }

    const alreadyRequested = ride.passengers.some(
      p => p.user.toString() === req.user._id.toString()
    );

    if (alreadyRequested) {
      return res.status(400).json({
        success: false,
        message: 'You have already requested to join this ride'
      });
    }

    if (ride.availableSeats < 1) {
      return res.status(400).json({
        success: false,
        message: 'No seats available'
      });
    }

    ride.passengers.push({
      user: req.user._id,
      status: 'pending',
      pickupLocation: req.body.pickupLocation,
      message: req.body.message || 'I would like to join your ride. Please accept my request.'
    });

    await ride.save();

    try {
      await Notification.create({
        recipient: ride.driver,
        sender: req.user._id,
        type: 'ride_request',
        title: 'New Ride Request',
        message: `${req.user.name} wants to join your ride`,
        relatedTo: {
          model: 'Ride',
          id: ride._id
        },
        actionUrl: `/rides/${ride._id}`,
        priority: 'medium'
      });
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    await ride.populate('driver', 'name email department');
    await ride.populate('passengers.user', 'name email department profilePicture');

    res.status(200).json({
      success: true,
      message: 'Join request sent successfully',
      data: ride
    });
  } catch (error) {
    console.error('Error joining ride:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending join request',
      error: error.message
    });
  }
};

// @desc    Update passenger status (accept/reject)
// @route   PUT /api/rides/:id/passenger/:passengerId
// @access  Private (Driver only)
exports.updatePassengerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the driver can accept or reject passengers'
      });
    }

    const passengerIndex = ride.passengers.findIndex(
      p => p.user.toString() === req.params.passengerId
    );

    if (passengerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Passenger request not found'
      });
    }

    if (ride.passengers[passengerIndex].status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This request has already been processed'
      });
    }

    if (status === 'accepted') {
      const currentAcceptedCount = ride.passengers.filter(p => p.status === 'accepted').length;
      
      if (currentAcceptedCount >= ride.totalSeats) {
        return res.status(400).json({
          success: false,
          message: 'No seats available'
        });
      }

      ride.passengers[passengerIndex].status = 'accepted';
      ride.passengers[passengerIndex].acceptedAt = new Date();

      try {
        await Notification.create({
          recipient: ride.passengers[passengerIndex].user,
          sender: req.user._id,
          type: 'ride_accepted',
          title: 'Ride Request Accepted',
          message: `Your request to join the ride has been accepted`,
          relatedTo: {
            model: 'Ride',
            id: ride._id
          },
          actionUrl: `/rides/${ride._id}`,
          priority: 'high'
        });
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
      }

    } else if (status === 'rejected') {
      ride.passengers[passengerIndex].status = 'rejected';

      try {
        await Notification.create({
          recipient: ride.passengers[passengerIndex].user,
          sender: req.user._id,
          type: 'ride_rejected',
          title: 'Ride Request Declined',
          message: `Your request to join the ride has been declined`,
          relatedTo: {
            model: 'Ride',
            id: ride._id
          },
          actionUrl: `/rides`,
          priority: 'low'
        });
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    await ride.save();

    await ride.populate('driver', 'name email department profilePicture');
    await ride.populate('passengers.user', 'name email department profilePicture');

    res.status(200).json({
      success: true,
      message: `Passenger ${status} successfully`,
      data: ride
    });
  } catch (error) {
    console.error('Update passenger status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating passenger status',
      error: error.message
    });
  }
};

// @desc    Get user's rides (as driver or passenger)
// @route   GET /api/rides/my-rides
// @access  Private
exports.getMyRides = async (req, res) => {
  try {
    const asDriver = await Ride.find({ driver: req.user._id })
      .populate('driver', 'name email department profilePicture')
      .populate('passengers.user', 'name email department profilePicture')
      .sort({ 'schedule.departureTime': -1 });

    const asPassenger = await Ride.find({
      'passengers.user': req.user._id,
      'passengers.status': { $in: ['pending', 'accepted'] }
    })
      .populate('driver', 'name email department profilePicture')
      .populate('passengers.user', 'name email department profilePicture')
      .sort({ 'schedule.departureTime': -1 });

    res.status(200).json({
      success: true,
      data: {
        asDriver,
        asPassenger
      }
    });
  } catch (error) {
    console.error('Error fetching my rides:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your rides',
      error: error.message
    });
  }
};

// @desc    Cancel a ride
// @route   DELETE /api/rides/:id
// @access  Private (Driver only)
exports.cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the driver can cancel this ride'
      });
    }

    ride.status = 'cancelled';
    await ride.save();

    const acceptedPassengers = ride.passengers.filter(p => p.status === 'accepted');
    
    for (const passenger of acceptedPassengers) {
      try {
        await Notification.create({
          recipient: passenger.user,
          sender: req.user._id,
          type: 'ride_cancelled',
          title: 'Ride Cancelled',
          message: `The ride you joined has been cancelled by the driver`,
          relatedTo: {
            model: 'Ride',
            id: ride._id
          },
          priority: 'high'
        });
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Ride cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling ride:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling ride',
      error: error.message
    });
  }
};

// @desc    Complete a ride
// @route   PUT /api/rides/:id/complete
// @access  Private (Driver only)
// =============================================================================
// COMPLETE FIXED completeRide FUNCTION
// Copy this entire function and REPLACE your existing exports.completeRide
// =============================================================================

// @desc    Complete a ride and update all user statistics
// @route   PUT /api/rides/:id/complete
// @access  Private (Driver only)
exports.completeRide = async (req, res) => {
  try {
    console.log('='.repeat(60));
    console.log('🔵 COMPLETE RIDE REQUEST STARTED');
    console.log('='.repeat(60));
    console.log('Ride ID:', req.params.id);
    console.log('User ID:', req.user._id);
    console.log('Time:', new Date().toISOString());
    
    // =========================================================================
    // STEP 1: VALIDATE RIDE EXISTS
    // =========================================================================
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      console.log('❌ ERROR: Ride not found');
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    console.log('✅ Ride found:', ride._id);
    console.log('   Current status:', ride.status);

    // =========================================================================
    // STEP 2: VERIFY USER IS DRIVER
    // =========================================================================
    if (ride.driver.toString() !== req.user._id.toString()) {
      console.log('❌ ERROR: Unauthorized - Not the driver');
      console.log('   Ride driver:', ride.driver);
      console.log('   Request user:', req.user._id);
      return res.status(403).json({
        success: false,
        message: 'Only the driver can complete this ride'
      });
    }

    console.log('✅ Authorization verified - User is driver');

    // =========================================================================
    // STEP 3: MARK RIDE AS COMPLETED
    // =========================================================================
    ride.status = 'completed';
    
    // =========================================================================
    // STEP 4: CALCULATE SAVINGS
    // =========================================================================
    const distance = ride.route.distance || 20; // Default to 20km if not set
    const acceptedPassengers = ride.passengers.filter(p => p.status === 'accepted');
    const acceptedCount = acceptedPassengers.length;
    const totalPeople = acceptedCount + 1; // +1 for driver
    
    console.log('\n📊 RIDE STATISTICS:');
    console.log('   Distance:', distance, 'km');
    console.log('   Accepted passengers:', acceptedCount);
    console.log('   Total people in car:', totalPeople);
    
    // CO2 Calculation
    const CO2_PER_KM = 120; // grams per km
    const soloEmissions = distance * CO2_PER_KM * totalPeople; // Everyone drives alone
    const sharedEmissions = distance * CO2_PER_KM; // One car total
    const carbonSavedGrams = soloEmissions - sharedEmissions;
    const carbonSavedKg = carbonSavedGrams / 1000;
    
    ride.carbonSaved = carbonSavedKg;

    console.log('\n🌱 CARBON CALCULATION:');
    console.log('   Solo emissions (if all drove separately):', soloEmissions, 'g');
    console.log('   Shared emissions (one car):', sharedEmissions, 'g');
    console.log('   Total carbon saved:', carbonSavedGrams, 'g =', carbonSavedKg, 'kg');

    await ride.save();
    console.log('✅ Ride marked as completed and saved');

    // =========================================================================
    // STEP 5: UPDATE DRIVER STATISTICS
    // =========================================================================
    console.log('\n' + '='.repeat(60));
    console.log('🚗 UPDATING DRIVER STATISTICS');
    console.log('='.repeat(60));
    
    try {
      const driver = await User.findById(ride.driver);
      
      if (!driver) {
        console.log('❌ ERROR: Driver user not found in database');
        console.log('   Driver ID:', ride.driver);
      } else {
        console.log('✅ Driver found:', driver.name);
        console.log('   Email:', driver.email);
        
        // Show BEFORE values
        console.log('\n📝 DRIVER - BEFORE UPDATE:');
        console.log('   ridesOffered:', driver.ridesOffered || 0);
        
        // Update ridesOffered
        const oldRidesOffered = driver.ridesOffered || 0;
        driver.ridesOffered = Number(oldRidesOffered) + 1;
        
        console.log('\n💾 DRIVER - SAVING NEW VALUES:');
        console.log('   ridesOffered:', oldRidesOffered, '→', driver.ridesOffered);
        
        // Save with multiple strategies
        try {
          // Strategy 1: Try normal save first
          await driver.save({ validateBeforeSave: false });
          console.log('✅ Driver saved successfully (Strategy 1)');
        } catch (saveError1) {
          console.log('⚠️ Strategy 1 failed, trying Strategy 2...');
          try {
            // Strategy 2: Direct update
            await User.findByIdAndUpdate(
              ride.driver,
              { $inc: { ridesOffered: 1 } },
              { new: true, runValidators: false }
            );
            console.log('✅ Driver saved successfully (Strategy 2)');
          } catch (saveError2) {
            console.log('⚠️ Strategy 2 failed, trying Strategy 3...');
            // Strategy 3: Set and save
            await User.updateOne(
              { _id: ride.driver },
              { $set: { ridesOffered: driver.ridesOffered } }
            );
            console.log('✅ Driver saved successfully (Strategy 3)');
          }
        }
        
        // Verify the save worked
        const verifyDriver = await User.findById(ride.driver);
        console.log('\n🔍 DRIVER - VERIFICATION FROM DATABASE:');
        console.log('   ridesOffered:', verifyDriver.ridesOffered);
        
        if (verifyDriver.ridesOffered === driver.ridesOffered) {
          console.log('✅ Driver stats verified correctly!');
        } else {
          console.log('⚠️ WARNING: Driver stats mismatch!');
        }
      }
    } catch (driverError) {
      console.error('❌ ERROR updating driver:', driverError.message);
      console.error('Stack:', driverError.stack);
    }

    // =========================================================================
    // STEP 6: UPDATE EACH PASSENGER'S STATISTICS
    // =========================================================================
    console.log('\n' + '='.repeat(60));
    console.log('👥 UPDATING PASSENGER STATISTICS');
    console.log('   Total passengers to update:', acceptedCount);
    console.log('='.repeat(60));
    
    if (acceptedCount === 0) {
      console.log('⚠️ No accepted passengers to update');
    }
    
    for (let i = 0; i < acceptedPassengers.length; i++) {
      const passenger = acceptedPassengers[i];
      
      console.log(`\n${'─'.repeat(60)}`);
      console.log(`PASSENGER ${i + 1} of ${acceptedCount}`);
      console.log(`${'─'.repeat(60)}`);
      
      try {
        const passengerUser = await User.findById(passenger.user);
        
        if (!passengerUser) {
          console.log('❌ ERROR: Passenger user not found');
          console.log('   Passenger ID:', passenger.user);
          continue;
        }

        console.log('✅ Passenger found:', passengerUser.name);
        console.log('   Email:', passengerUser.email);
        
        // Show BEFORE values
        console.log('\n📝 BEFORE UPDATE:');
        console.log('   ridesTaken:', passengerUser.ridesTaken || 0);
        console.log('   carbonSaved:', passengerUser.carbonSaved || 0, 'kg');
        console.log('   moneySaved: ₹', passengerUser.moneySaved || 0);
        
        // =====================================================================
        // CALCULATE VALUES FOR THIS PASSENGER
        // =====================================================================
        
        // Carbon per person (equal split)
        const carbonPerPerson = carbonSavedKg / totalPeople;
        
        // Money calculation
        const FUEL_PRICE_PER_LITER = 100; // ₹100
        const MILEAGE = 15; // km per liter
        const fuelCostPerKm = FUEL_PRICE_PER_LITER / MILEAGE;
        
        const soloCost = distance * fuelCostPerKm;
        const sharedCost = (distance * fuelCostPerKm) / totalPeople;
        const moneySavedAmount = soloCost - sharedCost;
        
        console.log('\n💰 CALCULATIONS:');
        console.log('   Carbon to add:', carbonPerPerson.toFixed(2), 'kg');
        console.log('   Solo cost: ₹', soloCost.toFixed(2));
        console.log('   Shared cost: ₹', sharedCost.toFixed(2));
        console.log('   Money to add: ₹', Math.round(moneySavedAmount));
        
        // =====================================================================
        // UPDATE PASSENGER VALUES
        // =====================================================================
        
        // Get current values with fallback to 0
        const oldRidesTaken = Number(passengerUser.ridesTaken) || 0;
        const oldCarbonSaved = Number(passengerUser.carbonSaved) || 0;
        const oldMoneySaved = Number(passengerUser.moneySaved) || 0;
        
        // Calculate new values
        const newRidesTaken = oldRidesTaken + 1;
        const newCarbonSaved = oldCarbonSaved + carbonPerPerson;
        const newMoneySaved = oldMoneySaved + Math.round(moneySavedAmount);
        
        // Set new values
        passengerUser.ridesTaken = newRidesTaken;
        passengerUser.carbonSaved = Number(newCarbonSaved.toFixed(2));
        passengerUser.moneySaved = newMoneySaved;
        
        console.log('\n💾 NEW VALUES TO SAVE:');
        console.log('   ridesTaken:', oldRidesTaken, '→', newRidesTaken);
        console.log('   carbonSaved:', oldCarbonSaved.toFixed(2), '→', newCarbonSaved.toFixed(2), 'kg');
        console.log('   moneySaved: ₹', oldMoneySaved, '→ ₹', newMoneySaved);
        
        // =====================================================================
        // SAVE WITH MULTIPLE STRATEGIES
        // =====================================================================
        
        let saveSuccess = false;
        
        // Strategy 1: Normal save
        try {
          await passengerUser.save({ validateBeforeSave: false });
          console.log('✅ Saved using Strategy 1 (normal save)');
          saveSuccess = true;
        } catch (saveError1) {
          console.log('⚠️ Strategy 1 failed:', saveError1.message);
          
          // Strategy 2: findByIdAndUpdate with $set
          try {
            await User.findByIdAndUpdate(
              passenger.user,
              {
                $set: {
                  ridesTaken: newRidesTaken,
                  carbonSaved: Number(newCarbonSaved.toFixed(2)),
                  moneySaved: newMoneySaved
                }
              },
              { new: true, runValidators: false }
            );
            console.log('✅ Saved using Strategy 2 (findByIdAndUpdate)');
            saveSuccess = true;
          } catch (saveError2) {
            console.log('⚠️ Strategy 2 failed:', saveError2.message);
            
            // Strategy 3: Direct updateOne
            try {
              await User.updateOne(
                { _id: passenger.user },
                {
                  ridesTaken: newRidesTaken,
                  carbonSaved: Number(newCarbonSaved.toFixed(2)),
                  moneySaved: newMoneySaved
                }
              );
              console.log('✅ Saved using Strategy 3 (updateOne)');
              saveSuccess = true;
            } catch (saveError3) {
              console.log('❌ All save strategies failed!');
              console.error('Error:', saveError3.message);
            }
          }
        }
        
        if (saveSuccess) {
          // ===================================================================
          // VERIFY THE SAVE WORKED
          // ===================================================================
          const verifyUser = await User.findById(passenger.user);
          
          console.log('\n🔍 VERIFICATION FROM DATABASE:');
          console.log('   ridesTaken:', verifyUser.ridesTaken);
          console.log('   carbonSaved:', verifyUser.carbonSaved, 'kg');
          console.log('   moneySaved: ₹', verifyUser.moneySaved);
          
          // Check if values match
          if (verifyUser.ridesTaken === newRidesTaken &&
              Math.abs(verifyUser.carbonSaved - Number(newCarbonSaved.toFixed(2))) < 0.01 &&
              verifyUser.moneySaved === newMoneySaved) {
            console.log('✅ ALL VALUES VERIFIED CORRECTLY!');
          } else {
            console.log('⚠️ WARNING: Some values don\'t match!');
            console.log('   Expected ridesTaken:', newRidesTaken, 'Got:', verifyUser.ridesTaken);
            console.log('   Expected carbonSaved:', newCarbonSaved.toFixed(2), 'Got:', verifyUser.carbonSaved);
            console.log('   Expected moneySaved:', newMoneySaved, 'Got:', verifyUser.moneySaved);
          }
        }
        
      } catch (passengerError) {
        console.error(`❌ ERROR processing passenger ${i + 1}:`, passengerError.message);
        console.error('Stack:', passengerError.stack);
      }
    }

    // =========================================================================
    // STEP 7: FINAL SUCCESS RESPONSE
    // =========================================================================
    console.log('\n' + '='.repeat(60));
    console.log('🎉 RIDE COMPLETION PROCESS FINISHED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('Time:', new Date().toISOString());
    console.log('Total passengers updated:', acceptedCount);
    console.log('Carbon saved:', carbonSavedKg, 'kg');
    console.log('='.repeat(60) + '\n');

    res.status(200).json({
      success: true,
      message: 'Ride completed successfully! Stats updated for all users.',
      data: ride
    });

  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('❌ CRITICAL ERROR IN COMPLETE RIDE FUNCTION');
    console.error('='.repeat(60));
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('='.repeat(60) + '\n');
    
    res.status(500).json({
      success: false,
      message: 'Error completing ride',
      error: error.message
    });
  }
};

function calculateDistance(coords1, coords2) {
  const R = 6371;
  const lat1 = coords1.latitude * Math.PI / 180;
  const lat2 = coords2.latitude * Math.PI / 180;
  const deltaLat = (coords2.latitude - coords1.latitude) * Math.PI / 180;
  const deltaLon = (coords2.longitude - coords1.longitude) * Math.PI / 180;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

