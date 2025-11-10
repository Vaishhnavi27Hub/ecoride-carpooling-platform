
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiMessageSquare, FiPlus, FiUsers, FiUser, FiTrash2, FiInfo } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateGroupModal from '../components/CreateGroupModal';
import StartDirectChatModal from '../components/StartDirectChatModal';
import { chatAPI } from '../services/chatAPI';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const ChatPage = () => {
  const { user } = useAuth();
  const { socket, joinChat } = useSocket();
  const [searchParams, setSearchParams] = useSearchParams();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showStartChat, setShowStartChat] = useState(false);
  const [showNewChatMenu, setShowNewChatMenu] = useState(false);
  const [autoOpeningChat, setAutoOpeningChat] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false); // NEW: Members modal state

  useEffect(() => {
    fetchChats();
  }, []);

  // Handle automatic chat opening from URL parameter
  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId && chats.length > 0 && !autoOpeningChat) {
      handleAutoOpenChat(userId);
    }
  }, [searchParams, chats]);

  const handleAutoOpenChat = async (targetUserId) => {
    try {
      setAutoOpeningChat(true);
      
      // Check if a chat already exists with this user
      const existingChat = chats.find(chat => 
        chat.chatType === 'direct' && 
        chat.participants.some(p => p._id === targetUserId)
      );

      if (existingChat) {
        // Chat exists, open it
        await handleSelectChat(existingChat);
      } else {
        // No existing chat, create a new one
        const response = await chatAPI.createDirectChat(targetUserId);
        if (response.success) {
          const newChat = response.data;
          setChats(prev => [newChat, ...prev]);
          await handleSelectChat(newChat);
        }
      }
      
      // Remove userId from URL to prevent re-triggering
      setSearchParams({});
    } catch (error) {
      console.error('Error auto-opening chat:', error);
      alert('Failed to open chat with user');
    } finally {
      setAutoOpeningChat(false);
    }
  };

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', ({ chatId, message }) => {
      if (selectedChat && selectedChat._id === chatId) {
        setMessages(prev => [...prev, message]);
      }
      // Update chat list
      fetchChats();
    });

    socket.on('new_chat', (chat) => {
      setChats(prev => [chat, ...prev]);
    });

    socket.on('new_group', (group) => {
      setChats(prev => [group, ...prev]);
    });

    return () => {
      socket.off('receive_message');
      socket.off('new_chat');
      socket.off('new_group');
    };
  }, [socket, selectedChat]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getChats();
      setChats(response.data || []);
    } catch (error) {
      console.error('Fetch chats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    joinChat(chat._id);

    try {
      const response = await chatAPI.getMessages(chat._id);
      setMessages(response.data.messages || []);
      
      // Mark as read
      await chatAPI.markAsRead(chat._id);
      
      // Update chat list to remove unread count
      fetchChats();
    } catch (error) {
      console.error('Fetch messages error:', error);
    }
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete
    
    if (!window.confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingChatId(chatId);
      await chatAPI.deleteChat(chatId);
      
      // Remove from local state
      setChats(prev => prev.filter(chat => chat._id !== chatId));
      
      // If the deleted chat was selected, deselect it
      if (selectedChat?._id === chatId) {
        setSelectedChat(null);
        setMessages([]);
      }
      
      alert('Chat deleted successfully');
    } catch (error) {
      console.error('Delete chat error:', error);
      alert('Failed to delete chat: ' + (error.response?.data?.message || error.message));
    } finally {
      setDeletingChatId(null);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !selectedChat) return;

    try {
      setSending(true);
      const response = await chatAPI.sendMessage(selectedChat._id, messageInput);
      setMessages(prev => [...prev, response.data]);
      setMessageInput('');
    } catch (error) {
      console.error('Send message error:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getChatName = (chat) => {
    if (chat.chatType === 'group') {
      return chat.chatName;
    }
    // Direct chat - show other participant's name
    const otherUser = chat.participants.find(p => p._id !== user?.id);
    return otherUser?.name || 'Unknown';
  };

  const getChatAvatar = (chat) => {
    if (chat.chatType === 'group') {
      return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white font-bold">
          <FiUsers className="w-6 h-6" />
        </div>
      );
    }
    const otherUser = chat.participants.find(p => p._id !== user?.id);
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold">
        {otherUser?.name?.charAt(0).toUpperCase()}
      </div>
    );
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            {/* Chat List Sidebar */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FiMessageSquare className="text-green-600" />
                    Chats
                  </h2>
                  <div className="relative">
                    <Button
                      variant="primary"
                      onClick={() => setShowNewChatMenu(!showNewChatMenu)}
                      icon={FiPlus}
                      className="px-3 py-2"
                    >
                      New
                    </Button>
                    
                    {/* Dropdown Menu */}
                    {showNewChatMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <button
                          onClick={() => {
                            setShowStartChat(true);
                            setShowNewChatMenu(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition"
                        >
                          <FiUser className="text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">Start Direct Chat</p>
                            <p className="text-xs text-gray-500">One-on-one conversation</p>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setShowCreateGroup(true);
                            setShowNewChatMenu(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-t transition"
                        >
                          <FiUsers className="text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">Create Group</p>
                            <p className="text-xs text-gray-500">Chat with multiple people</p>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {chats.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <FiMessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No chats yet</p>
                    <p className="text-sm text-gray-500 mt-1 mb-4">Start a conversation with your colleagues</p>
                    <Button
                      variant="outline"
                      onClick={() => setShowStartChat(true)}
                      icon={FiPlus}
                      className="mx-auto"
                    >
                      Start Chat
                    </Button>
                  </div>
                ) : (
                  chats.map((chat) => (
                    <div
                      key={chat._id}
                      onClick={() => handleSelectChat(chat)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition relative group ${
                        selectedChat?._id === chat._id ? 'bg-green-50 border-l-4 border-l-green-600' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {getChatAvatar(chat)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {getChatName(chat)}
                            </h3>
                            <div className="flex items-center gap-2">
                              {chat.unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-medium">
                                  {chat.unreadCount}
                                </span>
                              )}
                              {/* Delete Button */}
                              <button
                                onClick={(e) => handleDeleteChat(chat._id, e)}
                                disabled={deletingChatId === chat._id}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded-full transition-all"
                                title="Delete chat"
                              >
                                <FiTrash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {chat.lastMessage?.content || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      {getChatAvatar(selectedChat)}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {getChatName(selectedChat)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedChat.chatType === 'group'
                            ? `${selectedChat.participants.length} members`
                            : ''}
                        </p>
                      </div>
                    </div>
                    
                    {/* NEW: View Members Button for Groups */}
                    {selectedChat.chatType === 'group' && (
                      <button
                        onClick={() => setShowMembersModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
                      >
                        <FiInfo className="w-4 h-4" />
                        <span className="font-medium">View Members</span>
                      </button>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <FiMessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">No messages yet</p>
                          <p className="text-sm text-gray-500 mt-1">Start the conversation!</p>
                        </div>
                      </div>
                    ) : (
                      messages.map((message, index) => {
                        const isOwn = message.sender._id === user?.id;
                        const isSystem = message.messageType === 'system';
                        
                        if (isSystem) {
                          return (
                            <div key={index} className="flex justify-center">
                              <div className="bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-full italic">
                                {message.content}
                              </div>
                            </div>
                          );
                        }
                        
                        return (
                          <div
                            key={index}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-xs lg:max-w-md`}>
                              {!isOwn && selectedChat.chatType === 'group' && (
                                <p className="text-xs text-gray-500 mb-1 px-2 font-medium">
                                  {message.sender.name}
                                </p>
                              )}
                              <div
                                className={`rounded-2xl px-4 py-2 ${
                                  isOwn
                                    ? 'bg-green-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                                }`}
                              >
                                <p className="break-words">{message.content}</p>
                                <p className={`text-xs mt-1 ${isOwn ? 'text-green-100' : 'text-gray-400'}`}>
                                  {formatTime(message.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={sending}
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={sending || !messageInput.trim()}
                        className="px-6"
                      >
                        {sending ? 'Sending...' : 'Send'}
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    {autoOpeningChat ? (
                      <div>
                        <LoadingSpinner size="large" />
                        <p className="text-gray-600 mt-4">Opening chat...</p>
                      </div>
                    ) : (
                      <>
                        <FiMessageSquare className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Select a chat to start messaging
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Choose a conversation from the left or start a new one
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button
                            variant="primary"
                            onClick={() => setShowStartChat(true)}
                            icon={FiUser}
                          >
                            Direct Chat
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowCreateGroup(true)}
                            icon={FiUsers}
                          >
                            Create Group
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateGroupModal
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onSuccess={(group) => {
          setChats([group, ...chats]);
          setSelectedChat(group);
          handleSelectChat(group);
        }}
      />

      <StartDirectChatModal
        isOpen={showStartChat}
        onClose={() => setShowStartChat(false)}
        onSuccess={(chat) => {
          // Check if chat already exists in list
          const existingChat = chats.find(c => c._id === chat._id);
          if (!existingChat) {
            setChats([chat, ...chats]);
          }
          setSelectedChat(chat);
          handleSelectChat(chat);
        }}
      />

      {/* NEW: View Members Modal */}
      {showMembersModal && selectedChat && selectedChat.chatType === 'group' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FiUsers className="text-purple-600" />
                  Group Members
                </h3>
                <button
                  onClick={() => setShowMembersModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {selectedChat.chatName} • {selectedChat.participants.length} members
              </p>
            </div>

            {/* Members List */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {selectedChat.participants.map((member, index) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* Member Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {member.name?.charAt(0).toUpperCase()}
                    </div>
                    
                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {member.name}
                        </h4>
                        {member._id === user?.id && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            You
                          </span>
                        )}
                        {selectedChat.admin === member._id && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowMembersModal(false)}
                className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {showNewChatMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowNewChatMenu(false)}
        />
      )}
    </div>
  );
};

export default ChatPage;
































