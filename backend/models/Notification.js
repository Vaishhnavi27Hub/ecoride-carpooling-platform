const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: [
        'ride_request',
        'ride_accepted',
        'ride_rejected',
        'ride_cancelled',
        'trip_invitation',
        'trip_joined',
        'trip_update',
        'marketplace_order',
        'marketplace_message',
        'chat_message',
        'system',
        'achievement'
      ],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
    data: {
      rideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride'
      },
      tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip'
      },
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
      },
      chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
      },
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
      },
      actionUrl: String
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

// Method to mark as read
notificationSchema.methods.markAsRead = async function() {
  this.read = true;
  return await this.save();
};

// Static method to create notification
notificationSchema.statics.createNotification = async function(notificationData) {
  try {
    const notification = await this.create(notificationData);
    return await notification.populate('sender', 'name profilePicture');
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({ recipient: userId, read: false });
};

module.exports = mongoose.model('Notification', notificationSchema);