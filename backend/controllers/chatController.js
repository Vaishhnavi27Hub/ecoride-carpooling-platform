const Chat = require('../models/Chat');
const User = require('../models/User');
const { getIO } = require('../socket');

// Helper function to emit to user
const emitToUser = (userId, event, data) => {
  try {
    const io = getIO();
    io.to(userId.toString()).emit(event, data);
  } catch (error) {
    console.error('Socket emit error:', error);
  }
};

// Helper function to emit to chat room
const emitToChat = (chatId, event, data) => {
  try {
    const io = getIO();
    io.to(chatId.toString()).emit(event, data);
  } catch (error) {
    console.error('Socket emit error:', error);
  }
};

// @desc    Search users by email
// @route   GET /api/chats/search-users?email=xxx
// @access  Private
exports.searchUsers = async (req, res) => {
  try {
    const { email } = req.query;
    const currentUserId = req.user.id;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email query is required'
      });
    }

    // Search for users by email (partial match)
    const users = await User.find({
      email: { $regex: email, $options: 'i' },
      _id: { $ne: currentUserId }, // Exclude current user
      isActive: true
    })
      .select('name email profilePicture department')
      .limit(10);

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search users',
      error: error.message
    });
  }
};

// @desc    Get all chats for logged in user
// @route   GET /api/chats
// @access  Private
exports.getChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({
      participants: userId,
      isActive: true
    })
      .populate('participants', 'name email profilePicture')
      .populate('lastMessage.sender', 'name')
      .populate('groupAdmin', 'name email')
      .sort({ updatedAt: -1 });

    // Add unread count to each chat
    const chatsWithUnread = chats.map(chat => ({
      ...chat.toObject(),
      unreadCount: chat.getUnreadCount ? chat.getUnreadCount(userId) : 0
    }));

    res.status(200).json({
      success: true,
      data: chatsWithUnread
    });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chats',
      error: error.message
    });
  }
};

// @desc    Create direct chat
// @route   POST /api/chats/direct
// @access  Private
exports.createDirectChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { participantId, contextType, contextId } = req.body;

    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: 'Participant ID is required'
      });
    }

    // Check if user is trying to chat with themselves
    if (participantId === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot start a chat with yourself'
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [userId, participantId] },
      chatType: 'direct',
      isActive: true
    }).populate('participants', 'name email profilePicture');

    if (chat) {
      return res.status(200).json({
        success: true,
        data: chat,
        message: 'Chat already exists'
      });
    }

    // Create new chat
    chat = await Chat.create({
      participants: [userId, participantId],
      chatType: 'direct',
      context: {
        contextType: contextType || 'general',
        contextId: contextId || null
      }
    });

    chat = await chat.populate('participants', 'name email profilePicture');

    // Notify the other user
    emitToUser(participantId, 'new_chat', chat);
    emitToUser(userId, 'new_chat', chat);

    res.status(201).json({
      success: true,
      data: chat
    });
  } catch (error) {
    console.error('Create direct chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create chat',
      error: error.message
    });
  }
};

// @desc    Create group chat
// @route   POST /api/chats/group
// @access  Private
exports.createGroupChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatName, chatDescription, participantEmails } = req.body;

    if (!chatName || !chatName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Group name is required'
      });
    }

    if (!participantEmails || participantEmails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one participant is required'
      });
    }

    // Find users by email
    const participants = await User.find({
      email: { $in: participantEmails },
      isActive: true
    });

    if (participants.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No valid participants found'
      });
    }

    // Add creator to participants
    const participantIds = participants.map(p => p._id);
    if (!participantIds.includes(userId)) {
      participantIds.push(userId);
    }

    // Create group chat
    const chat = await Chat.create({
      participants: participantIds,
      chatType: 'group',
      chatName,
      chatDescription,
      groupAdmin: userId
    });

    const populatedChat = await chat.populate([
      { path: 'participants', select: 'name email profilePicture' },
      { path: 'groupAdmin', select: 'name email' }
    ]);

    // Notify all participants
    participantIds.forEach(participantId => {
      emitToUser(participantId, 'new_chat', populatedChat);
    });

    res.status(201).json({
      success: true,
      data: populatedChat
    });
  } catch (error) {
    console.error('Create group chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create group chat',
      error: error.message
    });
  }
};

// @desc    Add participant to group
// @route   POST /api/chats/:chatId/participants
// @access  Private
exports.addParticipant = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { participantEmail } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (chat.chatType !== 'group') {
      return res.status(400).json({
        success: false,
        message: 'Can only add participants to group chats'
      });
    }

    // Check if user is group admin
    if (chat.groupAdmin.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only group admin can add participants'
      });
    }

    // Find user by email
    const newParticipant = await User.findOne({ email: participantEmail });

    if (!newParticipant) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already a participant
    if (chat.participants.includes(newParticipant._id)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a participant'
      });
    }

    chat.participants.push(newParticipant._id);
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('participants', 'name email profilePicture')
      .populate('groupAdmin', 'name email');

    // Notify all participants
    chat.participants.forEach(participantId => {
      emitToUser(participantId, 'participant_added', {
        chatId: chat._id,
        participant: newParticipant
      });
    });

    res.status(200).json({
      success: true,
      data: updatedChat
    });
  } catch (error) {
    console.error('Add participant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add participant',
      error: error.message
    });
  }
};

// @desc    Remove participant from group
// @route   DELETE /api/chats/:chatId/participants/:participantId
// @access  Private
exports.removeParticipant = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId, participantId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (chat.chatType !== 'group') {
      return res.status(400).json({
        success: false,
        message: 'Can only remove participants from group chats'
      });
    }

    // Check if user is group admin
    if (chat.groupAdmin.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only group admin can remove participants'
      });
    }

    // Cannot remove admin
    if (participantId === userId) {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot be removed. Transfer admin rights first.'
      });
    }

    chat.participants = chat.participants.filter(
      p => p.toString() !== participantId
    );
    await chat.save();

    // Notify all participants
    chat.participants.forEach(pId => {
      emitToUser(pId, 'participant_removed', {
        chatId: chat._id,
        participantId
      });
    });

    // Notify removed participant
    emitToUser(participantId, 'removed_from_group', {
      chatId: chat._id
    });

    res.status(200).json({
      success: true,
      message: 'Participant removed successfully'
    });
  } catch (error) {
    console.error('Remove participant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove participant',
      error: error.message
    });
  }
};

// @desc    Update group info
// @route   PUT /api/chats/:chatId/group-info
// @access  Private
exports.updateGroupInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { chatName, chatDescription, groupIcon } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (chat.chatType !== 'group') {
      return res.status(400).json({
        success: false,
        message: 'Can only update group chats'
      });
    }

    // Check if user is group admin
    if (chat.groupAdmin.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only group admin can update group info'
      });
    }

    if (chatName) chat.chatName = chatName;
    if (chatDescription !== undefined) chat.chatDescription = chatDescription;
    if (groupIcon !== undefined) chat.groupIcon = groupIcon;

    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('participants', 'name email profilePicture')
      .populate('groupAdmin', 'name email');

    // Notify all participants
    chat.participants.forEach(participantId => {
      emitToUser(participantId, 'group_updated', updatedChat);
    });

    res.status(200).json({
      success: true,
      data: updatedChat
    });
  } catch (error) {
    console.error('Update group info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update group info',
      error: error.message
    });
  }
};

// @desc    Get messages for a chat
// @route   GET /api/chats/:chatId/messages
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const chat = await Chat.findById(chatId)
      .populate('messages.sender', 'name profilePicture');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      p => p.toString() === userId
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view these messages'
      });
    }

    // Mark messages as read
    if (chat.markAsRead) {
      await chat.markAsRead(userId);
    }

    // Paginate messages
    const skip = (page - 1) * limit;
    const messages = chat.messages
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(skip, skip + parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        chat: {
          _id: chat._id,
          participants: chat.participants,
          chatType: chat.chatType,
          chatName: chat.chatName,
          chatDescription: chat.chatDescription,
          groupAdmin: chat.groupAdmin,
          groupIcon: chat.groupIcon,
          context: chat.context
        },
        messages: messages.reverse(),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: chat.messages.length
        }
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

// @desc    Send message
// @route   POST /api/chats/:chatId/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { content, messageType = 'text' } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const chat = await Chat.findById(chatId)
      .populate('participants', 'name email profilePicture');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      p => p._id.toString() === userId
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to send messages in this chat'
      });
    }

    // Add message
    if (chat.addMessage) {
      await chat.addMessage(userId, content, messageType);
    } else {
      chat.messages.push({
        sender: userId,
        content,
        messageType,
        createdAt: new Date()
      });
      chat.lastMessage = {
        sender: userId,
        content,
        createdAt: new Date()
      };
      await chat.save();
    }

    // Get the latest message with populated sender
    const updatedChat = await Chat.findById(chatId)
      .populate('messages.sender', 'name profilePicture');

    const latestMessage = updatedChat.messages[updatedChat.messages.length - 1];

    // Emit message to chat room via socket
    emitToChat(chatId, 'receive_message', {
      chatId: chat._id,
      message: latestMessage
    });

    res.status(200).json({
      success: true,
      data: latestMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// @desc    Mark chat as read
// @route   PUT /api/chats/:chatId/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (chat.markAsRead) {
      await chat.markAsRead(userId);
    } else {
      chat.messages.forEach(msg => {
        if (msg.sender.toString() !== userId && !msg.readBy.includes(userId)) {
          msg.readBy.push(userId);
        }
      });
      await chat.save();
    }

    res.status(200).json({
      success: true,
      message: 'Chat marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark chat as read',
      error: error.message
    });
  }
};

// @desc    Leave group
// @route   POST /api/chats/:chatId/leave
// @access  Private
exports.leaveGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (chat.chatType !== 'group') {
      return res.status(400).json({
        success: false,
        message: 'Can only leave group chats'
      });
    }

    // If admin leaves, transfer admin to another participant
    if (chat.groupAdmin.toString() === userId) {
      const otherParticipants = chat.participants.filter(
        p => p.toString() !== userId
      );

      if (otherParticipants.length > 0) {
        chat.groupAdmin = otherParticipants[0];
      } else {
        // If no other participants, delete the chat
        await Chat.findByIdAndDelete(chatId);
        return res.status(200).json({
          success: true,
          message: 'Group deleted as you were the last member'
        });
      }
    }

    // Remove user from participants
    chat.participants = chat.participants.filter(
      p => p.toString() !== userId
    );
    await chat.save();

    // Notify remaining participants
    chat.participants.forEach(participantId => {
      emitToUser(participantId, 'participant_left', {
        chatId: chat._id,
        participantId: userId
      });
    });

    res.status(200).json({
      success: true,
      message: 'Left group successfully'
    });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to leave group',
      error: error.message
    });
  }
};

// @desc    Delete chat
// @route   DELETE /api/chats/:chatId
// @access  Private
exports.deleteChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // For group chats, only admin can delete
    if (chat.chatType === 'group' && chat.groupAdmin.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only group admin can delete the chat'
      });
    }

    // For direct chats, either participant can delete
    if (chat.chatType === 'direct') {
      const isParticipant = chat.participants.some(
        p => p.toString() === userId
      );

      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to delete this chat'
        });
      }
    }

    await Chat.findByIdAndDelete(chatId);

    // Notify all participants
    chat.participants.forEach(participantId => {
      emitToUser(participantId, 'chat_deleted', {
        chatId: chat._id
      });
    });

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete chat',
      error: error.message
    });
  }
};