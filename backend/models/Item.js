// const mongoose = require('mongoose');

// const itemSchema = new mongoose.Schema(
//   {
//     seller: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },
//     trip: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Trip',
//       required: false // Optional - item might not be associated with a trip
//     },
//     itemDetails: {
//       name: {
//         type: String,
//         required: [true, 'Please provide item name'],
//         trim: true,
//         maxlength: [100, 'Item name cannot be more than 100 characters']
//       },
//       description: {
//         type: String,
//         required: [true, 'Please provide item description'],
//         maxlength: [1000, 'Description cannot be more than 1000 characters']
//       },
//       category: {
//         type: String,
//         enum: ['Food', 'Handicrafts', 'Clothing', 'Souvenirs', 'Electronics', 'Books', 'Other'],
//         required: true
//       },
//       images: [{
//         type: String
//       }],
//       condition: {
//         type: String,
//         enum: ['New', 'Like New', 'Good', 'Fair'],
//         default: 'New'
//       }
//     },
//     location: {
//       acquiredFrom: {
//         type: String,
//         required: [true, 'Please provide location where item was acquired']
//       },
//       coordinates: {
//         latitude: Number,
//         longitude: Number
//       }
//     },
//     pricing: {
//       originalPrice: {
//         type: Number,
//         required: [true, 'Please provide original price'],
//         min: 0
//       },
//       deliveryCharge: {
//         type: Number,
//         required: [true, 'Please provide delivery charge'],
//         min: 0
//       },
//       totalPrice: {
//         type: Number,
//         required: true
//       }
//     },
//     quantity: {
//       available: {
//         type: Number,
//         required: [true, 'Please provide available quantity'],
//         min: 1
//       },
//       sold: {
//         type: Number,
//         default: 0
//       }
//     },
//     delivery: {
//       estimatedDeliveryDate: {
//         type: Date,
//         required: true
//       },
//       deliveryLocation: {
//         type: String,
//         required: [true, 'Please provide delivery location'],
//         default: 'XYZ Office'
//       },
//       deliveryMethod: {
//         type: String,
//         enum: ['Hand Delivery', 'Office Delivery', 'Meetup'],
//         default: 'Office Delivery'
//       }
//     },
//     orders: [{
//       buyer: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//       },
//       quantity: {
//         type: Number,
//         required: true,
//         min: 1
//       },
//       totalAmount: {
//         type: Number,
//         required: true
//       },
//       status: {
//         type: String,
//         enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
//         default: 'pending'
//       },
//       orderedAt: {
//         type: Date,
//         default: Date.now
//       },
//       paymentStatus: {
//         type: String,
//         enum: ['pending', 'paid', 'refunded'],
//         default: 'pending'
//       },
//       deliveryNotes: String
//     }],
//     status: {
//       type: String,
//       enum: ['available', 'sold_out', 'expired', 'cancelled'],
//       default: 'available'
//     },
//     expiryDate: {
//       type: Date,
//       required: true
//     },
//     tags: [{
//       type: String
//     }],
//     ratings: [{
//       user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//       },
//       rating: {
//         type: Number,
//         min: 1,
//         max: 5
//       },
//       comment: String,
//       createdAt: {
//         type: Date,
//         default: Date.now
//       }
//     }],
//     averageRating: {
//       type: Number,
//       default: 0
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// // Calculate total price
// itemSchema.pre('save', function(next) {
//   this.pricing.totalPrice = this.pricing.originalPrice + this.pricing.deliveryCharge;
//   next();
// });

// // Check if item is sold out
// itemSchema.methods.isSoldOut = function() {
//   return this.quantity.available <= this.quantity.sold;
// };

// // Update status when sold out
// itemSchema.pre('save', function(next) {
//   if (this.isSoldOut() && this.status === 'available') {
//     this.status = 'sold_out';
//   }
//   next();
// });

// // Calculate average rating
// itemSchema.methods.calculateAverageRating = function() {
//   if (this.ratings.length === 0) {
//     this.averageRating = 0;
//   } else {
//     const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
//     this.averageRating = sum / this.ratings.length;
//   }
//   return this.averageRating;
// };

// module.exports = mongoose.model('Item', itemSchema);



const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: false // Optional - item might not be associated with a trip
    },
    itemDetails: {
      name: {
        type: String,
        required: [true, 'Please provide item name'],
        trim: true,
        maxlength: [100, 'Item name cannot be more than 100 characters']
      },
      description: {
        type: String,
        required: [true, 'Please provide item description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
      },
      category: {
        type: String,
        enum: ['Food', 'Handicrafts', 'Clothing', 'Souvenirs', 'Electronics', 'Books', 'Other'],
        required: true
      },
      images: [{
        type: String
      }],
      condition: {
        type: String,
        enum: ['New', 'Like New', 'Good', 'Fair'],
        default: 'New'
      }
    },
    location: {
      acquiredFrom: {
        type: String,
        required: [true, 'Please provide location where item was acquired']
      },
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    pricing: {
      originalPrice: {
        type: Number,
        required: [true, 'Please provide original price'],
        min: 0
      },
      deliveryCharge: {
        type: Number,
        required: [true, 'Please provide delivery charge'],
        min: 0
      },
      totalPrice: {
        type: Number,
        required: false  // ✅ CHANGED: Not required, auto-calculated
      }
    },
    quantity: {
      available: {
        type: Number,
        required: [true, 'Please provide available quantity'],
        min: 1
      },
      sold: {
        type: Number,
        default: 0
      }
    },
    delivery: {
      estimatedDeliveryDate: {
        type: Date,
        required: true
      },
      deliveryLocation: {
        type: String,
        required: [true, 'Please provide delivery location'],
        default: 'XYZ Office'
      },
      deliveryMethod: {
        type: String,
        enum: ['Hand Delivery', 'Office Delivery', 'Meetup'],
        default: 'Office Delivery'
      }
    },
    orders: [{
      buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      totalAmount: {
        type: Number,
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
        default: 'pending'
      },
      orderedAt: {
        type: Date,
        default: Date.now
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
      },
      deliveryNotes: String
    }],
    status: {
      type: String,
      enum: ['available', 'sold_out', 'expired', 'cancelled'],
      default: 'available'
    },
    expiryDate: {
      type: Date,
      required: true
    },
    tags: [{
      type: String
    }],
    ratings: [{
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
    }],
    averageRating: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Calculate total price BEFORE saving
itemSchema.pre('save', function(next) {
  // Auto-calculate totalPrice from originalPrice + deliveryCharge
  if (this.pricing.originalPrice !== undefined && this.pricing.deliveryCharge !== undefined) {
    this.pricing.totalPrice = this.pricing.originalPrice + this.pricing.deliveryCharge;
  }
  next();
});

// Check if item is sold out
itemSchema.methods.isSoldOut = function() {
  return this.quantity.available <= this.quantity.sold;
};

// Update status when sold out
itemSchema.pre('save', function(next) {
  if (this.isSoldOut() && this.status === 'available') {
    this.status = 'sold_out';
  }
  next();
});

// Calculate average rating
itemSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    this.averageRating = sum / this.ratings.length;
  }
  return this.averageRating;
};

module.exports = mongoose.model('Item', itemSchema);