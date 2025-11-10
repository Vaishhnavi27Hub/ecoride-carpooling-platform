
const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide trip title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide trip description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    destination: {
      type: String,
      required: [true, 'Please provide destination']
    },
    tripType: {
      type: String,
      enum: [
        'Weekend Getaway',
        'Team Outing',
        'Adventure',
        'Beach',
        'Mountains',
        'Religious',
        'Historical',
        'Wildlife',
        'Food Tour',      
        'Cultural',       
        'Shopping',
        'Wellness',
        'Photography',
        'Other'
      ],
      required: true
    },
    schedule: {
      startDate: {
        type: Date,
        required: [true, 'Please provide start date']
      },
      endDate: {
        type: Date,
        required: [true, 'Please provide end date']
      },
      duration: {
        type: Number,
        required: true
      }
    },
    capacity: {
      maxParticipants: {
        type: Number,
        required: [true, 'Please provide maximum participants'],
        min: 2,
        max: 50
      },
      currentParticipants: {
        type: Number,
        default: 0
      }
    },
    costDetails: {
      estimatedCost: {
        type: Number,
        required: [true, 'Please provide estimated cost'],
        min: 0
      },
      currency: {
        type: String,
        default: 'INR'
      }
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Hard'],
      default: 'Moderate'
    },
    itinerary: {
      type: String,
      maxlength: [5000, 'Itinerary cannot be more than 5000 characters']
    },
    requirements: {
      minAge: {
        type: Number,
        default: 18
      },
      fitness: {
        type: String,
        enum: ['Easy', 'Moderate', 'Hard'],
        default: 'Moderate'
      },
      notes: {
        type: String,
        maxlength: [1000, 'Requirements notes cannot be more than 1000 characters']
      }
    },
    additionalNotes: {
      type: String,
      maxlength: [1000, 'Additional notes cannot be more than 1000 characters']
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        status: {
          type: String,
          enum: ['pending', 'confirmed', 'rejected', 'cancelled'],
          default: 'pending'
        },
        joinedAt: {
          type: Date,
          default: Date.now
        },
        paymentStatus: {
          type: String,
          enum: ['pending', 'paid', 'refunded'],
          default: 'pending'
        },
        message: String
      }
    ],
    images: [
      {
        type: String
      }
    ],
    amenities: [
      {
        type: String,
        enum: ['Transport', 'Accommodation', 'Food', 'Guide', 'Equipment', 'Insurance']
      }
    ],
    status: {
      type: String,
      enum: ['planned', 'ongoing', 'completed', 'cancelled'],
      default: 'planned'
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
    },
    tags: [
      {
        type: String
      }
    ],
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        rating: {
          type: Number,
          min: 1,
          max: 5
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    averageRating: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
tripSchema.index({ organizer: 1 });
tripSchema.index({ 'schedule.startDate': 1 });
tripSchema.index({ status: 1, visibility: 1 });
tripSchema.index({ tripType: 1 });

// Check if trip is full
tripSchema.methods.isFull = function () {
  const confirmedCount = this.participants.filter(p => p.status === 'confirmed').length;
  return confirmedCount >= this.capacity.maxParticipants;
};

// Calculate average rating
tripSchema.methods.calculateAverageRating = function () {
  if (!this.reviews || this.reviews.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = (sum / this.reviews.length).toFixed(1);
  }
  return this.averageRating;
};

// Auto-update currentParticipants count before saving
tripSchema.pre('save', function (next) {
  const confirmedCount = this.participants.filter(p => p.status === 'confirmed').length;
  this.capacity.currentParticipants = confirmedCount;
  next();
});

module.exports = mongoose.model('Trip', tripSchema);