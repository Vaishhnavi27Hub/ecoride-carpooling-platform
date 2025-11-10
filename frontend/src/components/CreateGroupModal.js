import React, { useState } from 'react';
import { FiX, FiUsers, FiSearch, FiPlus, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import Button from './Button';
import { chatAPI } from '../services/chatAPI';

const CreateGroupModal = ({ isOpen, onClose, onSuccess }) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState({});
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
        // Filter out already selected users
        const filtered = response.data.filter(
          user => !selectedUsers.find(u => u._id === user._id)
        );
        setSearchResults(filtered);
        
        if (filtered.length === 0 && response.data.length > 0) {
          setSearchError('This user is already added');
        }
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

  const handleAddUser = (user) => {
    if (!selectedUsers.find(u => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
      setSearchEmail('');
      setSearchResults([]);
      setSearchError('');
      
      // Clear user error if it exists
      if (errors.users) {
        setErrors(prev => ({ ...prev, users: '' }));
      }
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(u => u._id !== userId));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!groupName.trim()) {
      newErrors.groupName = 'Group name is required';
    } else if (groupName.trim().length < 3) {
      newErrors.groupName = 'Group name must be at least 3 characters';
    }

    if (selectedUsers.length === 0) {
      newErrors.users = 'Add at least one member to create a group';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateGroup = async () => {
    if (!validateForm()) return;

    try {
      setCreating(true);
      const participantEmails = selectedUsers.map(u => u.email);
      
      const response = await chatAPI.createGroupChat(
        groupName.trim(),
        groupDescription.trim(),
        participantEmails
      );

      alert('Group created successfully! ✅');
      onSuccess(response.data);
      handleClose();
    } catch (error) {
      console.error('Create group error:', error);
      const errorMsg = error.response?.data?.message || error.message;
      alert('Failed to create group: ' + errorMsg);
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setGroupName('');
    setGroupDescription('');
    setSearchEmail('');
    setSearchResults([]);
    setSelectedUsers([]);
    setErrors({});
    setSearchError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiUsers className="text-green-600" />
            Create Group Chat
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Group Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name *
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                if (errors.groupName) {
                  setErrors(prev => ({ ...prev, groupName: '' }));
                }
              }}
              placeholder="e.g., Office Carpool Group"
              maxLength={50}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.groupName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.groupName && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <FiAlertCircle className="w-4 h-4" />
                {errors.groupName}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {groupName.length}/50 characters
            </p>
          </div>

          {/* Group Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="What's this group about?"
              rows="3"
              maxLength={200}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              {groupDescription.length}/200 characters
            </p>
          </div>

          {/* Add Members */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Members * (Search by @xyz.com email)
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => {
                  setSearchEmail(e.target.value);
                  handleSearchUsers(e.target.value);
                }}
                placeholder="colleague@xyz.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              {searching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-5 w-5 border-2 border-green-600 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>

            {/* Search Error */}
            {searchError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <FiAlertCircle className="w-4 h-4" />
                {searchError}
              </p>
            )}

            {/* Users Error */}
            {errors.users && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <FiAlertCircle className="w-4 h-4" />
                {errors.users}
              </p>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleAddUser(user)}
                    className="p-3 hover:bg-green-50 cursor-pointer flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {user.department && (
                          <p className="text-xs text-gray-400">{user.department}</p>
                        )}
                      </div>
                    </div>
                    <FiPlus className="text-green-600 w-5 h-5" />
                  </div>
                ))}
              </div>
            )}

            <p className="mt-2 text-xs text-gray-500">
              💡 Tip: Only registered users with @xyz.com emails can be added
            </p>
          </div>

          {/* Selected Members */}
          {selectedUsers.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected Members ({selectedUsers.length})
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-semibold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveUser(user._id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
                      title="Remove member"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
            disabled={creating}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateGroup}
            className="flex-1"
            disabled={creating || selectedUsers.length === 0}
          >
            {creating ? 'Creating Group...' : `Create Group (${selectedUsers.length} members)`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;