

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, 
  FiEdit2, 
  FiSave, 
  FiX, 
  FiMail, 
  FiPhone, 
  FiBriefcase,
  FiMapPin,
  FiTruck,
  FiTrendingUp,
  FiCalendar,
  FiShoppingBag
} from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { authAPI } from '../services/api';
import { DEPARTMENTS, MUSIC_PREFERENCES, CHATTINESS_LEVELS } from '../utils/constants';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingPreferences, setEditingPreferences] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    ridesOffered: 0,
    ridesTaken: 0,
    carbonSaved: 0,
    moneySaved: 0,
    activeRides: 0,
    upcomingTrips: 0
  });

  const [preferencesFormData, setPreferencesFormData] = useState({
    music: 'Any',
    chattiness: 'Moderate',
    smoking: false,
    pets: false
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: '',
    bio: '',
    emergencyContact: '',
    preferences: {
      music: 'Any',
      chattiness: 'Moderate',
      smoking: false,
      pets: false
    }
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      console.log('Fetching user profile...');
      const response = await authAPI.getProfile();
      console.log('Profile response:', response);
      
      if (response.success && response.data) {
        setUser(response.data);
        setFormData({
          name: response.data.name || '',
          phone: response.data.phone || '',
          department: response.data.department || '',
          bio: response.data.bio || '',
          emergencyContact: response.data.emergencyContact || '',
          preferences: {
            music: response.data.preferences?.music || 'Any',
            chattiness: response.data.preferences?.chattiness || 'Moderate',
            smoking: response.data.preferences?.smoking || false,
            pets: response.data.preferences?.pets || false
          }
        });
      } else {
        console.error('Profile response not successful:', response);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      console.log('📊 Fetching user stats from dashboard API...');
      
      // Use the same dashboard stats endpoint as Dashboard page
      const response = await api.get('/dashboard/stats');
      console.log('Dashboard stats response:', response.data);
      
      if (response.data.success && response.data.data) {
        const dashboardStats = response.data.data;
        
        // Set stats from dashboard API (stored User model values)
        setStats({
          ridesOffered: dashboardStats.ridesOffered || 0,
          ridesTaken: dashboardStats.ridesTaken || 0,
          carbonSaved: dashboardStats.carbonSaved || 0,
          moneySaved: dashboardStats.moneySaved || 0,
          activeRides: dashboardStats.activeRides || 0,
          upcomingTrips: dashboardStats.upcomingTrips || 0
        });

        console.log('✅ Stats updated:', {
          ridesOffered: dashboardStats.ridesOffered,
          ridesTaken: dashboardStats.ridesTaken,
          carbonSaved: dashboardStats.carbonSaved,
          moneySaved: dashboardStats.moneySaved
        });
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await authAPI.updateProfile(formData);
      
      if (response.success) {
        setUser(response.data);
        setEditing(false);
        alert('Profile updated successfully! ✅');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        department: user.department || '',
        bio: user.bio || '',
        emergencyContact: user.emergencyContact || '',
        preferences: {
          music: user.preferences?.music || 'Any',
          chattiness: user.preferences?.chattiness || 'Moderate',
          smoking: user.preferences?.smoking || false,
          pets: user.preferences?.pets || false
        }
      });
    }
    setEditing(false);
  };

  const handleOpenPreferencesEdit = () => {
    setPreferencesFormData({
      music: user.preferences?.music || 'Any',
      chattiness: user.preferences?.chattiness || 'Moderate',
      smoking: user.preferences?.smoking || false,
      pets: user.preferences?.pets || false
    });
    setEditingPreferences(true);
  };

  const handlePreferencesChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferencesFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSavePreferences = async () => {
    try {
      setSavingPreferences(true);
      const response = await authAPI.updateProfile({
        preferences: preferencesFormData
      });
      
      if (response.success) {
        setUser(response.data);
        setEditingPreferences(false);
        alert('Ride preferences updated successfully! ✅');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences: ' + (error.response?.data?.message || error.message));
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleCancelPreferences = () => {
    setEditingPreferences(false);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <p className="text-center text-gray-600">Failed to load profile</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="text-center">
              {/* Profile Picture */}
              <div className="mb-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* User Info */}
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
              <p className="text-gray-600 mb-6">{user.email}</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.ridesOffered + stats.ridesTaken}
                  </div>
                  <div className="text-xs text-gray-600">Total Rides</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.activeRides}
                  </div>
                  <div className="text-xs text-gray-600">Active Rides</div>
                </div>
              </div>

              {/* Edit Button */}
              {!editing ? (
                <Button
                  variant="outline"
                  onClick={() => setEditing(true)}
                  icon={FiEdit2}
                  className="w-full"
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    icon={FiX}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={saving}
                    icon={FiSave}
                    className="flex-1"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </Card>

            {/* Environmental Impact */}
            <Card className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiTrendingUp className="text-green-600" />
                Environmental Impact
              </h3>
              
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {stats.carbonSaved.toFixed(1)} kg
                  </div>
                  <div className="text-sm text-gray-600">CO₂ Saved</div>
                </div>

                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">
                    ₹{Math.round(stats.moneySaved)}
                  </div>
                  <div className="text-sm text-gray-600">Money Saved</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiUser className="text-blue-600" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.name}</p>
                  )}
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="flex items-center gap-2">
                    <FiMail className="text-gray-400" />
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 1234567890"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-gray-400" />
                      <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                    </div>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  {editing ? (
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select department</option>
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FiBriefcase className="text-gray-400" />
                      <p className="text-gray-900">{user.department || 'Not provided'}</p>
                    </div>
                  )}
                </div>

                {/* Emergency Contact */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.emergencyContact || 'Not provided'}</p>
                  )}
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {editing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
                    />
                  ) : (
                    <p className="text-gray-900">{user.bio || 'No bio provided'}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Ride Preferences */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FiTruck className="text-purple-600" />
                  Ride Preferences
                </h3>
                <button
                  onClick={handleOpenPreferencesEdit}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Edit Preferences"
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Music Preference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Music Preference
                  </label>
                  <p className="text-gray-900">{user.preferences?.music || 'Any'}</p>
                </div>

                {/* Chattiness */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chattiness Level
                  </label>
                  <p className="text-gray-900">{user.preferences?.chattiness || 'Moderate'}</p>
                </div>

                {/* Smoking */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Smoking
                  </label>
                  <Badge color={user.preferences?.smoking ? 'red' : 'green'}>
                    {user.preferences?.smoking ? 'Smoking OK' : 'No Smoking'}
                  </Badge>
                </div>

                {/* Pets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pets
                  </label>
                  <Badge color={user.preferences?.pets ? 'green' : 'gray'}>
                    {user.preferences?.pets ? 'Pets Welcome' : 'No Pets'}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Activity Summary */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiCalendar className="text-orange-600" />
                Activity Summary
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <FiTruck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{stats.ridesOffered}</div>
                  <div className="text-sm text-gray-600">Rides Offered</div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <FiMapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{stats.ridesTaken}</div>
                  <div className="text-sm text-gray-600">Rides Taken</div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <FiCalendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{stats.upcomingTrips}</div>
                  <div className="text-sm text-gray-600">Upcoming Trips</div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <FiMapPin className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-indigo-600">{stats.activeRides}</div>
                  <div className="text-sm text-gray-600">Active Rides</div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <FiShoppingBag className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">0</div>
                  <div className="text-sm text-gray-600">Items Listed</div>
                </div>

                {/* RATING SECTION REMOVED - Not appropriate for professional environment */}
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <FiTrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-emerald-600">
                    {stats.ridesOffered + stats.ridesTaken}
                  </div>
                  <div className="text-sm text-gray-600">Total Rides</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Ride Preferences Edit Modal */}
        {editingPreferences && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FiTruck className="text-purple-600" />
                  Edit Ride Preferences
                </h2>
                <button
                  onClick={handleCancelPreferences}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Music Preference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Music Preference
                  </label>
                  <select
                    name="music"
                    value={preferencesFormData.music}
                    onChange={handlePreferencesChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {MUSIC_PREFERENCES.map(pref => (
                      <option key={pref} value={pref}>{pref}</option>
                    ))}
                  </select>
                </div>

                {/* Chattiness Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chattiness Level
                  </label>
                  <select
                    name="chattiness"
                    value={preferencesFormData.chattiness}
                    onChange={handlePreferencesChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {CHATTINESS_LEVELS.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Smoking */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    name="smoking"
                    id="smoking"
                    checked={preferencesFormData.smoking}
                    onChange={handlePreferencesChange}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="smoking" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Smoking allowed in my rides
                  </label>
                </div>

                {/* Pets */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    name="pets"
                    id="pets"
                    checked={preferencesFormData.pets}
                    onChange={handlePreferencesChange}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="pets" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Pets welcome in my rides
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCancelPreferences}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePreferences}
                  disabled={savingPreferences}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FiSave className="w-4 h-4" />
                  {savingPreferences ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;