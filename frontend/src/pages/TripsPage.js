

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiPlus, FiMapPin } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import TripCard from '../components/TripCard';
import TripDetailsModal from '../components/TripDetailsModal';
import EditTripModal from '../components/EditTripModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { tripAPI } from '../services/api';

const TripsPage = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tripToEdit, setTripToEdit] = useState(null);

  const categories = [
    'All Categories',
    'Weekend Getaway',
    'Team Outing',
    'Adventure',
    'Beach',
    'Mountains',
    'Religious',
    'Historical',
    'Wildlife',
    'Food Tour',     
    'Cultural',       
    'Shopping',
    'Wellness',
    'Photography',
    'Other'
  ];

  const statuses = [
    { value: 'all', label: 'All Trips' },
    { value: 'planned', label: 'Planned' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' }
  ];

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    filterTrips();
  }, [trips, searchTerm, categoryFilter, statusFilter]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await tripAPI.getTrips();
      console.log('Trips fetched:', response.data);
      setTrips(response.data || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
      alert('Failed to load trips. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterTrips = () => {
    let filtered = [...trips];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(trip => 
        trip.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.organizer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(trip => 
        trip.tripType?.toLowerCase() === categoryFilter.toLowerCase() ||
        trip.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(trip => trip.status === statusFilter);
    }

    setFilteredTrips(filtered);
  };

  const handleViewDetails = async (trip) => {
    try {
      // Fetch full trip details to get all participants
      const response = await tripAPI.getTripById(trip._id);
      setSelectedTrip(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching trip details:', error);
      alert('Failed to load trip details. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrip(null);
  };

  const handleJoinTrip = async (tripId) => {
    try {
      await tripAPI.joinTrip(tripId);
      alert('Join request sent successfully! The organizer will review your request.');
      handleCloseModal();
      fetchTrips(); // Refresh trips list
    } catch (error) {
      console.error('Error joining trip:', error);
      alert(error.response?.data?.message || 'Failed to join trip. Please try again.');
    }
  };

  const handleLeaveTrip = async (tripId) => {
    try {
      await tripAPI.leaveTrip(tripId);
      alert('You have successfully left the trip.');
      handleCloseModal();
      fetchTrips(); // Refresh trips list
    } catch (error) {
      console.error('Error leaving trip:', error);
      alert(error.response?.data?.message || 'Failed to leave trip. Please try again.');
    }
  };

  const handleAcceptParticipant = async (tripId, participantId) => {
    try {
      await tripAPI.updateParticipantStatus(tripId, participantId, 'confirmed');
      alert('Participant accepted successfully!');
      // Refresh trip details
      const response = await tripAPI.getTripById(tripId);
      setSelectedTrip(response.data);
      fetchTrips(); // Also refresh the list
    } catch (error) {
      console.error('Error accepting participant:', error);
      alert(error.response?.data?.message || 'Failed to accept participant.');
    }
  };

  const handleRejectParticipant = async (tripId, participantId) => {
    try {
      await tripAPI.updateParticipantStatus(tripId, participantId, 'rejected');
      alert('Participant rejected.');
      // Refresh trip details
      const response = await tripAPI.getTripById(tripId);
      setSelectedTrip(response.data);
      fetchTrips(); // Also refresh the list
    } catch (error) {
      console.error('Error rejecting participant:', error);
      alert(error.response?.data?.message || 'Failed to reject participant.');
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      return;
    }

    try {
      await tripAPI.deleteTrip(tripId);
      alert('Trip deleted successfully.');
      handleCloseModal(); // Close the modal first
      fetchTrips(); // Refresh trips list
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert(error.response?.data?.message || 'Failed to delete trip.');
    }
  };

  const handleEditTrip = (trip) => {
    setIsModalOpen(false); // Close details modal
    setTripToEdit(trip);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setTripToEdit(null);
  };

  const handleUpdateTrip = async (tripId, updateData) => {
    try {
      const response = await tripAPI.updateTrip(tripId, updateData);
      alert('Trip updated successfully!');
      handleCloseEditModal();
      
      // Refresh the trips list
      await fetchTrips();
      
      // If the details modal was open, refresh the selected trip
      if (selectedTrip && selectedTrip._id === tripId) {
        const updatedTripResponse = await tripAPI.getTripById(tripId);
        setSelectedTrip(updatedTripResponse.data);
        setIsModalOpen(true); // Reopen details modal with updated data
      }
      
      return response;
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error; // Re-throw to be handled by modal
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner message="Loading trips..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Group Trips</h1>
              <p className="text-gray-600 mt-2">Explore and join exciting trips with your colleagues</p>
            </div>
            <Button
              onClick={() => navigate('/trips/create')}
              icon={<FiPlus />}
            >
              Organize a Trip
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, destination, or organizer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <FiFilter className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category === 'All Categories' ? 'all' : category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      (categoryFilter === 'all' && category === 'All Categories') ||
                      categoryFilter === category
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              {statuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredTrips.length}</span> trip{filteredTrips.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FiMapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Trips Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Be the first to organize a trip!'}
            </p>
            <Button onClick={() => navigate('/trips/create')}>
              Organize a Trip
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onViewDetails={handleViewDetails}
                onJoinTrip={handleJoinTrip}
                onEditTrip={handleEditTrip}
                onDeleteTrip={handleDeleteTrip}
              />
            ))}
          </div>
        )}
      </div>

      {/* Trip Details Modal */}
      {isModalOpen && selectedTrip && (
        <TripDetailsModal
          trip={selectedTrip}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onJoinTrip={handleJoinTrip}
          onLeaveTrip={handleLeaveTrip}
          onAcceptParticipant={handleAcceptParticipant}
          onRejectParticipant={handleRejectParticipant}
          onEditTrip={handleEditTrip}
          onDeleteTrip={handleDeleteTrip}
        />
      )}

      {/* Edit Trip Modal */}
      {isEditModalOpen && tripToEdit && (
        <EditTripModal
          trip={tripToEdit}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleUpdateTrip}
        />
      )}
    </div>
  );
};

export default TripsPage;