
const Trip = require('../models/Trip');
const User = require('../models/User');

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
exports.createTrip = async (req, res) => {
  try {
    const {
      title,
      description,
      destination,
      startDate,
      endDate,
      duration,
      category,
      difficulty,
      maxParticipants,
      estimatedCost,
      itinerary,
      requirements,
      notes
    } = req.body;

    // Validate required fields
    if (!title || !description || !destination || !startDate || !endDate || !maxParticipants || !estimatedCost) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, description, destination, dates, participants, cost)'
      });
    }

    // Validate dates
    if (new Date(startDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past'
      });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Validate participants
    if (maxParticipants < 2 || maxParticipants > 50) {
      return res.status(400).json({
        success: false,
        message: 'Maximum participants must be between 2 and 50'
      });
    }

    // Create trip with the structure that matches the frontend
    const trip = await Trip.create({
      organizer: req.user._id,
      title,
      description,
      destination,
      tripType: category || 'Other', // Map category to tripType
      schedule: {
        startDate,
        endDate,
        duration: duration || Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
      },
      capacity: {
        maxParticipants: parseInt(maxParticipants),
        currentParticipants: 1 // Organizer is automatically included
      },
      costDetails: {
        estimatedCost: parseFloat(estimatedCost),
        currency: 'INR'
      },
      difficulty: difficulty || 'Moderate',
      itinerary: itinerary || '',
      requirements: {
        minAge: 18,
        fitness: difficulty || 'Moderate',
        notes: requirements || ''
      },
      additionalNotes: notes || '',
      visibility: 'public',
      status: 'planned',
      participants: [{
        user: req.user._id,
        status: 'confirmed',
        paymentStatus: 'paid',
        joinedAt: new Date()
      }]
    });

    await trip.populate('organizer', 'name email phone profilePicture rating department');

    res.status(201).json({
      success: true,
      message: 'Trip created successfully! Other users can now join your trip.',
      trip
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating trip',
      error: error.message
    });
  }
};

// @desc    Get all trips
// @route   GET /api/trips
// @access  Private
exports.getAllTrips = async (req, res) => {
  try {
    const { status, tripType, startDate, endDate, category } = req.query;

    let query = { visibility: 'public' };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by trip type or category
    if (tripType || category) {
      query.tripType = tripType || category;
    }

    // Filter by date range
    if (startDate) {
      query['schedule.startDate'] = { $gte: new Date(startDate) };
    }

    if (endDate) {
      query['schedule.endDate'] = { $lte: new Date(endDate) };
    }

    // Show only future or ongoing trips by default (not completed/cancelled)
    if (!status) {
      query.status = { $in: ['planned', 'ongoing'] };
      query['schedule.endDate'] = { $gte: new Date() };
    }

    const trips = await Trip.find(query)
      .populate('organizer', 'name email phone profilePicture rating department')
      .populate('participants.user', 'name profilePicture email')
      .sort({ 'schedule.startDate': 1 });

    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips // Changed from 'trips' to 'data' to match frontend
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trips',
      error: error.message
    });
  }
};

// @desc    Get single trip by ID
// @route   GET /api/trips/:id
// @access  Private
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('organizer', 'name email phone profilePicture rating department employeeId')
      .populate('participants.user', 'name email phone profilePicture rating department')
      .populate('reviews.user', 'name profilePicture');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trip',
      error: error.message
    });
  }
};

// @desc    Join a trip (Send join request)
// @route   POST /api/trips/:id/join
// @access  Private
exports.joinTrip = async (req, res) => {
  try {
    const { message } = req.body;

    const trip = await Trip.findById(req.params.id)
      .populate('organizer', 'name email');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check if trip is full
    const confirmedParticipants = trip.participants.filter(p => p.status === 'confirmed').length;
    if (confirmedParticipants >= trip.capacity.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'This trip is already full'
      });
    }

    // Check if user is the organizer
    if (trip.organizer._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You are the organizer of this trip and are already a participant'
      });
    }

    // Check if user already requested/joined
    const alreadyJoined = trip.participants.some(
      p => p.user.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: 'You have already requested to join this trip or are already a participant'
      });
    }

    // Add participant with pending status
    trip.participants.push({
      user: req.user._id,
      status: 'pending',
      message: message || '',
      joinedAt: new Date()
    });

    await trip.save();
    await trip.populate('participants.user', 'name email phone profilePicture');

    // TODO: Send notification to organizer about new join request
    // You can add notification logic here

    res.status(200).json({
      success: true,
      message: 'Join request sent successfully! The organizer will review your request.',
      trip
    });
  } catch (error) {
    console.error('Join trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error joining trip',
      error: error.message
    });
  }
};

// @desc    Update participant status (Accept/Reject join requests)
// @route   PUT /api/trips/:id/participant/:participantId
// @access  Private (Organizer only)
exports.updateParticipantStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Use "confirmed" or "rejected"'
      });
    }

    const trip = await Trip.findById(req.params.id)
      .populate('organizer', 'name email');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check if user is the organizer
    if (trip.organizer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the trip organizer can accept or reject participants'
      });
    }

    // Find the participant
    const participant = trip.participants.id(req.params.participantId);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    // Check if trip is full (when confirming)
    if (status === 'confirmed') {
      const confirmedCount = trip.participants.filter(p => p.status === 'confirmed').length;
      if (confirmedCount >= trip.capacity.maxParticipants) {
        return res.status(400).json({
          success: false,
          message: 'Trip is already full. Cannot accept more participants.'
        });
      }
    }

    // Update participant status
    participant.status = status;

    // Update current participants count if confirmed
    if (status === 'confirmed') {
      trip.capacity.currentParticipants += 1;
    }

    await trip.save();
    await trip.populate('participants.user', 'name email phone profilePicture');

    // TODO: Send notification to the participant about their request status
    // You can add notification logic here

    res.status(200).json({
      success: true,
      message: `Participant ${status === 'confirmed' ? 'accepted' : 'rejected'} successfully`,
      trip
    });
  } catch (error) {
    console.error('Update participant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating participant status',
      error: error.message
    });
  }
};

// @desc    Leave a trip
// @route   DELETE /api/trips/:id/leave
// @access  Private
exports.leaveTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Organizer cannot leave their own trip
    if (trip.organizer.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Trip organizer cannot leave the trip. You can cancel it instead.'
      });
    }

    // Find and remove participant
    const participantIndex = trip.participants.findIndex(
      p => p.user.toString() === req.user._id.toString()
    );

    if (participantIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'You are not a participant of this trip'
      });
    }

    // Update count if they were confirmed
    if (trip.participants[participantIndex].status === 'confirmed') {
      trip.capacity.currentParticipants = Math.max(0, trip.capacity.currentParticipants - 1);
    }

    // Remove participant
    trip.participants.splice(participantIndex, 1);
    await trip.save();

    res.status(200).json({
      success: true,
      message: 'You have successfully left the trip'
    });
  } catch (error) {
    console.error('Leave trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error leaving trip',
      error: error.message
    });
  }
};

// @desc    Get my trips (organized and joined)
// @route   GET /api/trips/my-trips
// @access  Private
exports.getMyTrips = async (req, res) => {
  try {
    const { type } = req.query;

    let trips;

    if (type === 'organized') {
      // Trips organized by me
      trips = await Trip.find({ organizer: req.user._id })
        .populate('participants.user', 'name profilePicture email')
        .sort({ 'schedule.startDate': -1 });
    } else if (type === 'joined') {
      // Trips I've joined
      trips = await Trip.find({ 
        'participants.user': req.user._id,
        organizer: { $ne: req.user._id } // Exclude trips I organized
      })
        .populate('organizer', 'name email phone profilePicture rating department')
        .populate('participants.user', 'name profilePicture')
        .sort({ 'schedule.startDate': -1 });
    } else {
      // Both organized and joined
      const organized = await Trip.find({ organizer: req.user._id })
        .populate('participants.user', 'name profilePicture email')
        .sort({ 'schedule.startDate': -1 });
      
      const joined = await Trip.find({ 
        'participants.user': req.user._id,
        organizer: { $ne: req.user._id }
      })
        .populate('organizer', 'name email phone profilePicture rating department')
        .sort({ 'schedule.startDate': -1 });

      return res.status(200).json({
        success: true,
        organized,
        joined
      });
    }

    res.status(200).json({
      success: true,
      count: trips.length,
      trips
    });
  } catch (error) {
    console.error('Get my trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trips',
      error: error.message
    });
  }
};

// @desc    Update trip details
// @route   PUT /api/trips/:id
// @access  Private (Organizer only)
exports.updateTrip = async (req, res) => {
  try {
    console.log('=== UPDATE TRIP DEBUG ===');
    console.log('Trip ID:', req.params.id);
    console.log('Request Body:', JSON.stringify(req.body, null, 2));

    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check if user is the organizer
    if (trip.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the organizer can update trip details'
      });
    }

    // Update simple fields
    const simpleFields = [
      'title', 'description', 'destination', 'itinerary', 
      'additionalNotes', 'difficulty', 'status', 'tripType'
    ];

    simpleFields.forEach(field => {
      if (req.body[field] !== undefined) {
        trip[field] = req.body[field];
        console.log(`Updated ${field}:`, req.body[field]);
      }
    });

    // Handle FLAT date fields (from frontend EditTripModal)
    if (req.body.startDate) {
      trip.schedule.startDate = new Date(req.body.startDate);
      console.log('Updated schedule.startDate:', trip.schedule.startDate);
    }
    
    if (req.body.endDate) {
      trip.schedule.endDate = new Date(req.body.endDate);
      console.log('Updated schedule.endDate:', trip.schedule.endDate);
    }

    // Calculate duration if dates are provided
    if (req.body.startDate && req.body.endDate) {
      const start = new Date(req.body.startDate);
      const end = new Date(req.body.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      trip.schedule.duration = diffDays;
      console.log('Calculated duration:', diffDays, 'days');
    }

    // Handle NESTED schedule fields (backward compatibility)
    if (req.body.schedule) {
      if (req.body.schedule.startDate) {
        trip.schedule.startDate = new Date(req.body.schedule.startDate);
        console.log('Updated schedule.startDate (nested):', trip.schedule.startDate);
      }
      if (req.body.schedule.endDate) {
        trip.schedule.endDate = new Date(req.body.schedule.endDate);
        console.log('Updated schedule.endDate (nested):', trip.schedule.endDate);
      }
      if (req.body.schedule.duration) {
        trip.schedule.duration = req.body.schedule.duration;
        console.log('Updated schedule.duration (nested):', trip.schedule.duration);
      }
    }

    // Handle FLAT capacity field (maxParticipants from frontend)
    if (req.body.maxParticipants !== undefined) {
      const newMax = parseInt(req.body.maxParticipants);
      
      // Validate new max against current confirmed participants
      const confirmedCount = trip.participants.filter(p => p.status === 'confirmed').length;
      
      if (newMax < confirmedCount) {
        return res.status(400).json({
          success: false,
          message: `Cannot set max participants to ${newMax}. There are already ${confirmedCount} confirmed participants.`
        });
      }
      
      trip.capacity.maxParticipants = newMax;
      console.log('Updated capacity.maxParticipants:', newMax);
    }

    // Handle NESTED capacity fields (backward compatibility)
    if (req.body.capacity) {
      if (req.body.capacity.maxParticipants !== undefined) {
        const newMax = parseInt(req.body.capacity.maxParticipants);
        const confirmedCount = trip.participants.filter(p => p.status === 'confirmed').length;
        
        if (newMax < confirmedCount) {
          return res.status(400).json({
            success: false,
            message: `Cannot set max participants to ${newMax}. There are already ${confirmedCount} confirmed participants.`
          });
        }
        
        trip.capacity.maxParticipants = newMax;
        console.log('Updated capacity.maxParticipants (nested):', newMax);
      }
    }

    // Handle FLAT cost field (estimatedCost from frontend)
    if (req.body.estimatedCost !== undefined) {
      trip.costDetails.estimatedCost = parseFloat(req.body.estimatedCost);
      console.log('Updated costDetails.estimatedCost:', trip.costDetails.estimatedCost);
    }

    // Handle NESTED cost details (backward compatibility)
    if (req.body.costDetails) {
      if (req.body.costDetails.estimatedCost !== undefined) {
        trip.costDetails.estimatedCost = parseFloat(req.body.costDetails.estimatedCost);
        console.log('Updated costDetails.estimatedCost (nested):', trip.costDetails.estimatedCost);
      }
      if (req.body.costDetails.currency) {
        trip.costDetails.currency = req.body.costDetails.currency;
        console.log('Updated costDetails.currency:', trip.costDetails.currency);
      }
    }

    // Update requirements
    if (req.body.requirements) {
      if (req.body.requirements.notes) {
        trip.requirements.notes = req.body.requirements.notes;
        console.log('Updated requirements.notes');
      }
      if (req.body.requirements.fitness) {
        trip.requirements.fitness = req.body.requirements.fitness;
      }
      if (req.body.requirements.minAge) {
        trip.requirements.minAge = req.body.requirements.minAge;
      }
    }

    console.log('=== SAVING TRIP ===');
    console.log('Trip before save:', {
      title: trip.title,
      startDate: trip.schedule.startDate,
      endDate: trip.schedule.endDate,
      duration: trip.schedule.duration,
      maxParticipants: trip.capacity.maxParticipants,
      estimatedCost: trip.costDetails.estimatedCost,
      tripType: trip.tripType,
      status: trip.status
    });

    await trip.save();
    
    console.log('Trip saved successfully');

    await trip.populate('organizer', 'name email phone profilePicture');
    await trip.populate('participants.user', 'name email profilePicture');

    console.log('=== FINAL TRIP DATA ===');
    console.log({
      title: trip.title,
      startDate: trip.schedule.startDate,
      endDate: trip.schedule.endDate,
      duration: trip.schedule.duration,
      maxParticipants: trip.capacity.maxParticipants,
      currentParticipants: trip.capacity.currentParticipants,
      estimatedCost: trip.costDetails.estimatedCost
    });

    res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      data: trip
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating trip',
      error: error.message
    });
  }
};

// @desc    Cancel a trip
// @route   DELETE /api/trips/:id
// @access  Private (Organizer only)
exports.cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the organizer can cancel the trip'
      });
    }

    trip.status = 'cancelled';
    await trip.save();

    // TODO: Send notifications to all participants
    // You can add notification logic here

    res.status(200).json({
      success: true,
      message: 'Trip cancelled successfully. All participants will be notified.'
    });
  } catch (error) {
    console.error('Cancel trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling trip',
      error: error.message
    });
  }
};

// @desc    Add review to trip
// @route   POST /api/trips/:id/review
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid rating between 1 and 5'
      });
    }

    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check if trip is completed
    if (trip.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only review completed trips'
      });
    }

    // Check if user participated in the trip
    const participated = trip.participants.some(
      p => p.user.toString() === req.user._id.toString() && p.status === 'confirmed'
    );

    if (!participated) {
      return res.status(403).json({
        success: false,
        message: 'You can only review trips you participated in'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = trip.reviews.some(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this trip'
      });
    }

    // Add review
    trip.reviews.push({
      user: req.user._id,
      rating,
      comment: comment || '',
      createdAt: new Date()
    });

    // Calculate and update average rating
    trip.calculateAverageRating();
    await trip.save();

    await trip.populate('reviews.user', 'name profilePicture');

    res.status(200).json({
      success: true,
      message: 'Review added successfully',
      trip
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
};