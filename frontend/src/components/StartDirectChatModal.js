import React, { useState } from 'react';
import { FiX, FiUser, FiSearch, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';
import Button from './Button';
import { chatAPI } from '../services/chatAPI';

const StartDirectChatModal = ({ isOpen, onClose, onSuccess }) => {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearchUsers = async (email) => {
    if (!email || email.length < 3) {
      setSearchResults([]);
      setSearchError('');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@xyz\.com$/;
    if (!emailRegex.test(email)) {
      setSearchError('Please enter a valid @xyz.com email');
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      setSearchError('');
      const response = await chatAPI.searchUsers(email);
      
      if (response.data && response.data.length > 0) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
        setSearchError('No registered user found with this email');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Failed to search users. Please try again.');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleStartChat = async (user) => {
    try {
      setCreating(true);
      const response = await chatAPI.createDirectChat(user._id);
      
      if (response.message === 'Chat already exists') {
        alert('Chat already exists with this user! Opening chat...');
      }
      
      onSuccess(response.data);
      handleClose();
    } catch (error) {
      console.error('Start chat error:', error);
      alert('Failed to start chat: ' + (error.response?.data?.message || error.message));
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setSearchEmail('');
    setSearchResults([]);
    setSearchError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiMessageSquare className="text-green-600" />
            Start Direct Chat
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Search for a colleague by their @xyz.com email to start a conversation
          </p>

          {/* Search Input */}
          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => {
                setSearchEmail(e.target.value);
                handleSearchUsers(e.target.value);
              }}
              placeholder="colleague@xyz.com"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              autoFocus
            />
            {searching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-5 w-5 border-2 border-green-600 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>

          {/* Search Error */}
          {searchError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4" />
                {searchError}
              </p>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Found {searchResults.length} user{searchResults.length !== 1 ? 's' : ''}:
              </p>
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition cursor-pointer"
                  onClick={() => handleStartChat(user)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.department && (
                        <p className="text-xs text-gray-500 mt-1">
                          {user.department}
                        </p>
                      )}
                    </div>
                    <FiMessageSquare className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!searching && !searchError && searchResults.length === 0 && searchEmail.length >= 3 && (
            <div className="text-center py-8">
              <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No users found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try searching with a different email
              </p>
            </div>
          )}

          {/* Help Text */}
          {searchEmail.length < 3 && (
            <div className="text-center py-8">
              <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Start typing to search</p>
              <p className="text-sm text-gray-500 mt-1">
                Enter at least 3 characters
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full"
            disabled={creating}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartDirectChatModal;