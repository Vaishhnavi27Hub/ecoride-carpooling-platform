
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._-]+@xyz\.com$/,
        'Please provide a valid @xyz.com email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    department: {
      type: String,
      required: [true, 'Please provide your department'],
      trim: true
    },
    employeeId: {
      type: String,
      required: [true, 'Please provide your employee ID'],
      unique: true,
      trim: true
    },
    bio: {
      type: String,
      default: ''
    },
    emergencyContact: {
      type: String,
      default: ''
    },
    profilePicture: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    ridesOffered: {
      type: Number,
      default: 0
    },
    ridesTaken: {
      type: Number,
      default: 0
    },
    driverEarnings: {
  type: Number,
  default: 0 // Total profit earned as driver
},
    carbonSaved: {
      type: Number,
      default: 0
    },
    moneySaved: {
      type: Number,
      default: 0
    },
    preferences: {
      music: {
        type: String,
        enum: ['Any', 'Pop', 'Rock', 'Classical', 'Jazz', 'Electronic', 'Hip Hop', 'Country', 'Silent'],
        default: 'Any'
      },
      chattiness: {
        type: String,
        enum: ['Quiet', 'Moderate', 'Chatty'],
        default: 'Moderate'
      },
      smoking: {
        type: Boolean,
        default: false
      },
      pets: {
        type: Boolean,
        default: false
      }
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Method to get public profile
userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    department: this.department,
    employeeId: this.employeeId,
    bio: this.bio,
    emergencyContact: this.emergencyContact,
    profilePicture: this.profilePicture,
    rating: this.rating,
    totalRatings: this.totalRatings,
    ridesOffered: this.ridesOffered,
    ridesTaken: this.ridesTaken,
    carbonSaved: this.carbonSaved,
    moneySaved: this.moneySaved,
    preferences: this.preferences,
    isVerified: this.isVerified,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);