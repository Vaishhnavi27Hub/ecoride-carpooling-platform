// const express = require('express');
// const router = express.Router();
// const {
//   searchUsers,
//   getChats,
//   createDirectChat,
//   createGroupChat,
//   addParticipant,
//   removeParticipant,
//   updateGroupInfo,
//   getMessages,
//   sendMessage,
//   markAsRead,
//   leaveGroup,
//   deleteChat
// } = require('../controllers/chatController');
// const { protect } = require('../middleware/auth');

// // All routes are protected
// router.use(protect);

// // User search
// router.get('/search-users', searchUsers);

// // Chat routes
// router.get('/', getChats);
// router.post('/direct', createDirectChat);
// router.post('/group', createGroupChat);
// router.delete('/:chatId', deleteChat);

// // Group management
// router.post('/:chatId/participants', addParticipant);
// router.delete('/:chatId/participants/:participantId', removeParticipant);
// router.put('/:chatId/group-info', updateGroupInfo);
// router.post('/:chatId/leave', leaveGroup);

// // Message routes
// router.get('/:chatId/messages', getMessages);
// router.post('/:chatId/messages', sendMessage);
// router.put('/:chatId/read', markAsRead);

// module.exports = router;






// const express = require('express');
// const router = express.Router();
// const {
//   searchUsers,
//   getChats,
//   createDirectChat,
//   createGroupChat,
//   addParticipant,
//   removeParticipant,
//   updateGroupInfo,
//   getMessages,
//   sendMessage,
//   markAsRead,
//   leaveGroup,
//   deleteChat
// } = require('../controllers/chatController');
// const { protect } = require('../middleware/auth');

// // All routes are protected
// router.use(protect);

// // User search
// router.get('/search-users', searchUsers);

// // Chat routes
// router.get('/', getChats);
// router.post('/direct', createDirectChat);
// router.post('/group', createGroupChat);
// router.delete('/:chatId', deleteChat);

// // Group management
// router.post('/:chatId/participants', addParticipant);
// router.delete('/:chatId/participants/:participantId', removeParticipant);
// router.put('/:chatId/group-info', updateGroupInfo);
// router.post('/:chatId/leave', leaveGroup);

// // Message routes
// router.get('/:chatId/messages', getMessages);
// router.post('/:chatId/messages', sendMessage);
// router.put('/:chatId/read', markAsRead);

// module.exports = router;















const express = require('express');
const router = express.Router();
const {
  searchUsers,
  getChats,
  createDirectChat,
  createGroupChat,
  addParticipant,
  removeParticipant,
  updateGroupInfo,
  getMessages,
  sendMessage,
  markAsRead,
  leaveGroup,
  deleteChat
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// User search
router.get('/search-users', searchUsers);

// Chat routes
router.get('/', getChats);
router.post('/direct', createDirectChat);
router.post('/group', createGroupChat);
router.delete('/:chatId', deleteChat);

// Group management
router.post('/:chatId/participants', addParticipant);
router.delete('/:chatId/participants/:participantId', removeParticipant);
router.put('/:chatId/group-info', updateGroupInfo);
router.post('/:chatId/leave', leaveGroup);

// Message routes
router.get('/:chatId/messages', getMessages);
router.post('/:chatId/messages', sendMessage);
router.put('/:chatId/read', markAsRead);

module.exports = router;