const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  chatType: {
    type: String,
    enum: ['direct', 'group'],
    default: 'direct'
  },
  chatName: {
    type: String,
    trim: true
  },
  chatDescription: {
    type: String,
    trim: true
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  groupIcon: {
    type: String,
    default: null
  },
  lastMessage: {
    type: messageSchema,
    default: null
  },
  context: {
    contextType: {
      type: String,
      enum: ['ride', 'trip', 'item', 'general'],
      default: 'general'
    },
    contextId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'context.contextType'
    }
  },
  messages: [messageSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
chatSchema.index({ participants: 1 });
chatSchema.index({ 'context.contextType': 1, 'context.contextId': 1 });
chatSchema.index({ updatedAt: -1 });

// Method to add message
chatSchema.methods.addMessage = function(senderId, content, messageType = 'text') {
  const message = {
    sender: senderId,
    content,
    messageType,
    readBy: [{ user: senderId }]
  };
  
  this.messages.push(message);
  this.lastMessage = message;
  
  return this.save();
};

// Method to add system message (for group events)
chatSchema.methods.addSystemMessage = function(content) {
  const message = {
    sender: this.groupAdmin || this.participants[0],
    content,
    messageType: 'system',
    readBy: []
  };
  
  this.messages.push(message);
  this.lastMessage = message;
  
  return this.save();
};

// Method to mark messages as read
chatSchema.methods.markAsRead = function(userId) {
  this.messages.forEach(message => {
    const alreadyRead = message.readBy.some(
      read => read.user.toString() === userId.toString()
    );
    
    if (!alreadyRead) {
      message.readBy.push({ user: userId });
    }
  });
  
  return this.save();
};

// Get unread message count for a user
chatSchema.methods.getUnreadCount = function(userId) {
  return this.messages.filter(message => {
    const isRead = message.readBy.some(
      read => read.user.toString() === userId.toString()
    );
    const isSender = message.sender.toString() === userId.toString();
    
    return !isRead && !isSender;
  }).length;
};

// Add participant to group
chatSchema.methods.addParticipant = async function(userId, addedBy) {
  if (this.chatType !== 'group') {
    throw new Error('Can only add participants to group chats');
  }
  
  if (this.participants.includes(userId)) {
    throw new Error('User is already a participant');
  }
  
  this.participants.push(userId);
  
  // Add system message
  const user = await mongoose.model('User').findById(userId);
  await this.addSystemMessage(`${user.name} was added to the group`);
  
  return this.save();
};

// Remove participant from group
chatSchema.methods.removeParticipant = async function(userId, removedBy) {
  if (this.chatType !== 'group') {
    throw new Error('Can only remove participants from group chats');
  }
  
  this.participants = this.participants.filter(
    p => p.toString() !== userId.toString()
  );
  
  // Add system message
  const user = await mongoose.model('User').findById(userId);
  await this.addSystemMessage(`${user.name} was removed from the group`);
  
  return this.save();
};

// Update group info
chatSchema.methods.updateGroupInfo = function(updates) {
  if (this.chatType !== 'group') {
    throw new Error('Can only update group chat info');
  }
  
  if (updates.chatName) this.chatName = updates.chatName;
  if (updates.chatDescription) this.chatDescription = updates.chatDescription;
  if (updates.groupIcon) this.groupIcon = updates.groupIcon;
  
  return this.save();
};

module.exports = mongoose.model('Chat', chatSchema);