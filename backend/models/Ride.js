

const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    vehicleDetails: {
      vehicleType: {
        type: String,
        required: [true, 'Please provide vehicle type'],
        enum: ['Sedan', 'SUV', 'MUV', 'Hatchback', 'Bike', 'Electric Vehicle']  // ADDED MUV
      },
      vehicleModel: {
        type: String,
        required: [true, 'Please provide vehicle model'],
        trim: true
      },
      vehicleNumber: {
        type: String,
        required: [true, 'Please provide vehicle number'],
        trim: true,
        uppercase: true
      },
      vehicleColor: {
        type: String,
        trim: true
      }
    },
    route: {
      startLocation: {
        address: {
          type: String,
          required: [true, 'Please provide start location address']
        },
        coordinates: {
          latitude: {
            type: Number,
            required: true
          },
          longitude: {
            type: Number,
            required: true
          }
        }
      },
      endLocation: {
        address: {
          type: String,
          required: [true, 'Please provide end location address']
        },
        coordinates: {
          latitude: {
            type: Number,
            required: true
          },
          longitude: {
            type: Number,
            required: true
          }
        }
      },
      distance: {
        type: Number, // in kilometers
        required: true
      },
      estimatedDuration: {
        type: Number, // in minutes
        required: true
      }
    },
    schedule: {
      departureTime: {
        type: Date,
        required: [true, 'Please provide departure time']
      },
      isRecurring: {
        type: Boolean,
        default: false
      },
      recurringDays: [{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      }],
      flexibilityMinutes: {
        type: Number,
        default: 15,
        min: 0,
        max: 60
      }
    },
    availableSeats: {
      type: Number,
      required: [true, 'Please provide number of available seats'],
      min: 0,  // CHANGED from 1 to 0 to allow full rides
      max: 7
    },
    totalSeats: {
      type: Number,
      required: true
    },
    pricePerSeat: {
      type: Number,
      required: [true, 'Please provide price per seat'],
      min: 0
    },
    passengers: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
      },
      requestedAt: {
        type: Date,
        default: Date.now
      },
      acceptedAt: {
        type: Date
      },
      pickupLocation: {
        address: String,
        coordinates: {
          latitude: Number,
          longitude: Number
        }
      },
      message: String,
      requestMessage: String  // ADDED for compatibility
    }],
    preferences: {
      smokingAllowed: {
        type: Boolean,
        default: false
      },
      petsAllowed: {
        type: Boolean,
        default: false
      },
      musicPreference: {
        type: String,
        enum: ['Any', 'Pop', 'Rock', 'Classical', 'Silent'],
        default: 'Any'
      },
      luggageSpace: {
        type: String,
        enum: ['None', 'Small', 'Medium', 'Large'],
        default: 'Medium'
      },
      chattinessLevel: {  // ADDED for compatibility
        type: String,
        enum: ['Quiet', 'Moderate', 'Chatty'],
        default: 'Moderate'
      }
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled', 'full'],
      default: 'active'
    },
    carbonSaved: {
      type: Number,
      default: 0 // in kg
    },
    notes: {
      type: String,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

// Index for geospatial queries
rideSchema.index({ 'route.startLocation.coordinates': '2dsphere' });
rideSchema.index({ 'route.endLocation.coordinates': '2dsphere' });

// Index for date queries
rideSchema.index({ 'schedule.departureTime': 1 });
rideSchema.index({ status: 1 });

// Calculate carbon saved (simple formula: distance * passengers * 0.12 kg CO2 per km per person)
rideSchema.methods.calculateCarbonSaved = function() {
  const passengersCount = this.passengers.filter(p => p.status === 'accepted').length;
  this.carbonSaved = this.route.distance * passengersCount * 0.12;
  return this.carbonSaved;
};

// Check if ride is full
rideSchema.methods.isFull = function() {
  const acceptedPassengers = this.passengers.filter(p => p.status === 'accepted').length;
  return acceptedPassengers >= this.availableSeats;  // FIXED: use availableSeats directly
};

// Auto-update status when full and update availableSeats
rideSchema.pre('save', function(next) {
  // Update available seats based on accepted passengers
  const acceptedCount = this.passengers.filter(p => p.status === 'accepted').length;
  this.availableSeats = Math.max(0, this.totalSeats - acceptedCount);
  
  // Update status
  if (this.availableSeats === 0 && this.status === 'active') {
    this.status = 'full';
  } else if (this.availableSeats > 0 && this.status === 'full') {
    this.status = 'active';
  }
  
  next();
});

module.exports = mongoose.model('Ride', rideSchema);