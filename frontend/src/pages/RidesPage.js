
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiClock, FiDollarSign, FiUsers, FiTruck, FiStar, FiFilter, FiPlus, FiCheckCircle } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import RideDetailsModal from '../components/RideDetailsModal';
import { ridesAPI } from '../services/api';
import { formatDate, formatTime } from '../utils/helpers';

const RidesPage = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active'); // NEW: status filter state
  const [selectedRide, setSelectedRide] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchRides();
  }, [statusFilter]); // NEW: refetch when status changes

  useEffect(() => {
    filterRides();
  }, [rides, searchTerm, dateFilter]);

  const fetchRides = async () => {
    try {
      setLoading(true);
      
      // NEW: Pass includeCompleted param when viewing completed rides
      const params = statusFilter === 'completed' ? { includeCompleted: 'true' } : {};
      
      const response = await ridesAPI.getAllRides(params);
      console.log('Fetch Rides Response:', response);
      console.log('Response Data:', response.data);
      
      const ridesData = response.data?.data || response.data?.rides || [];
      
      console.log('Extracted Rides:', ridesData);
      
      // Transform rides to include origin/destination for backward compatibility
      const transformedRides = ridesData.map(ride => ({
        ...ride,
        origin: ride.route?.startLocation?.address || ride.origin || 'Unknown',
        destination: ride.route?.endLocation?.address || ride.destination || 'Unknown',
        date: ride.schedule?.departureTime || ride.departureTime || ride.date,
        time: ride.schedule?.departureTime || ride.departureTime || ride.time,
        seatsAvailable: ride.availableSeats || ride.seatsAvailable || 0,
        totalSeats: ride.totalSeats || ride.seatsAvailable || 0,
        vehicleType: ride.vehicleDetails?.vehicleType || ride.vehicleType || 'Car'
      }));
      
      // NEW: Filter rides by status
      const statusFiltered = statusFilter === 'completed'
        ? transformedRides.filter(ride => ride.status === 'completed')
        : transformedRides.filter(ride => ride.status === 'active' || ride.status === 'full');
      
      console.log('Status Filtered Rides:', statusFiltered);
      
      setRides(statusFiltered);
    } catch (error) {
      console.error('Error fetching rides:', error);
      console.error('Error Response:', error.response);
      alert('Failed to load rides. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const filterRides = () => {
    let filtered = [...rides];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ride => {
        const origin = ride.origin || '';
        const destination = ride.destination || '';
        const driverName = ride.driver?.name || '';
        
        return origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
               destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
               driverName.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Date filter - only apply for active rides
    if (statusFilter !== 'completed') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);

      if (dateFilter === 'today') {
        filtered = filtered.filter(ride => {
          const rideDate = new Date(ride.date);
          rideDate.setHours(0, 0, 0, 0);
          return rideDate.getTime() === today.getTime();
        });
      } else if (dateFilter === 'tomorrow') {
        filtered = filtered.filter(ride => {
          const rideDate = new Date(ride.date);
          rideDate.setHours(0, 0, 0, 0);
          return rideDate.getTime() === tomorrow.getTime();
        });
      } else if (dateFilter === 'week') {
        filtered = filtered.filter(ride => {
          const rideDate = new Date(ride.date);
          rideDate.setHours(0, 0, 0, 0);
          return rideDate >= today && rideDate <= weekFromNow;
        });
      }
    }

    setFilteredRides(filtered);
  };

  const handleViewDetails = async (ride) => {
    try {
      console.log('Opening ride details for:', ride);
      // Fetch fresh ride data to get latest passenger status
      const response = await ridesAPI.getRideById(ride._id);
      const freshRideData = response.data?.data || response.data || ride;
      setSelectedRide(freshRideData);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching ride details:', error);
      // Fallback to existing ride data
      setSelectedRide(ride);
      setShowDetailsModal(true);
    }
  };

  const handleRequestJoin = async (rideId) => {
    try {
      // Default pickup location data
      const requestData = {
        pickupLocation: {
          address: 'Pickup location to be confirmed',
          coordinates: {
            latitude: 12.9716,
            longitude: 77.5946
          }
        },
        message: 'I would like to join your ride. Please accept my request.'
      };

      await ridesAPI.requestRide(rideId, requestData);
      alert('Join request sent successfully! The driver will review your request.');
      setShowDetailsModal(false);
      fetchRides(); // Refresh the rides list
    } catch (error) {
      console.error('Error requesting ride:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send join request';
      alert(errorMessage);
    }
  };

  const handleRideUpdate = (updatedRide) => {
    setRides(prevRides =>
      prevRides.map(ride =>
        ride._id === updatedRide._id ? {
          ...updatedRide,
          origin: updatedRide.route?.startLocation?.address || updatedRide.origin,
          destination: updatedRide.route?.endLocation?.address || updatedRide.destination,
          date: updatedRide.schedule?.departureTime || updatedRide.date,
          time: updatedRide.schedule?.departureTime || updatedRide.time,
          seatsAvailable: updatedRide.availableSeats || updatedRide.seatsAvailable,
          vehicleType: updatedRide.vehicleDetails?.vehicleType || updatedRide.vehicleType
        } : ride
      )
    );
    setSelectedRide(updatedRide);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner message="Loading rides..." />
      </div>
    );
  }

  // NEW: Check if viewing completed rides
  const isCompletedView = statusFilter === 'completed';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Available Rides</h1>
              <p className="text-gray-600 mt-2">Find and join rides with your colleagues</p>
            </div>
            <Button
              onClick={() => navigate('/rides/create')}
              icon={<FiPlus />}
            >
              Offer a Ride
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by origin, destination, or driver name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Date Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <FiFilter className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by date:</span>
              {[
                { value: 'all', label: 'All Rides' },
                { value: 'today', label: 'Today' },
                { value: 'tomorrow', label: 'Tomorrow' },
                { value: 'week', label: 'This Week' },
                { value: 'completed', label: 'Completed', icon: <FiCheckCircle /> } // NEW: Completed filter
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    if (filter.value === 'completed') {
                      setStatusFilter('completed');
                      setDateFilter('all');
                    } else {
                      setStatusFilter('active');
                      setDateFilter(filter.value);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    (statusFilter === 'completed' && filter.value === 'completed') ||
                    (statusFilter === 'active' && dateFilter === filter.value && filter.value !== 'completed')
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.icon && filter.icon}
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredRides.length}</span> ride{filteredRides.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Rides Grid */}
        {filteredRides.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              {isCompletedView ? <FiCheckCircle className="w-8 h-8 text-gray-400" /> : <FiMapPin className="w-8 h-8 text-gray-400" />}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isCompletedView ? 'No Completed Rides' : 'No Rides Found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isCompletedView 
                ? 'Your ride history will appear here once rides are completed'
                : searchTerm || dateFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to offer a ride!'}
            </p>
            {!isCompletedView && (
              <Button onClick={() => navigate('/rides/create')}>
                Offer a Ride
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRides.map((ride) => {
              const totalSeats = ride.totalSeats || ride.seatsAvailable || 0;
              const bookedSeats = ride.passengers?.filter(p => p.status === 'accepted').length || 0;
              const availableSeats = totalSeats - bookedSeats;
              const isFull = availableSeats <= 0;
              const isCompleted = ride.status === 'completed'; // NEW: Check if ride is completed

              return (
                <Card 
                  key={ride._id} 
                  className={`hover:shadow-xl transition-all duration-300 ${
                    isCompleted ? 'opacity-60 bg-gray-50' : isFull ? 'opacity-50' : ''
                  }`}
                >
                  <div className="space-y-4">
                    {/* NEW: Completed Badge */}
                    {isCompleted && (
                      <div className="flex items-center justify-center gap-2 p-2 bg-purple-100 rounded-lg">
                        <FiCheckCircle className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-semibold text-purple-700">Ride Completed</span>
                      </div>
                    )}

                    {/* Driver Info */}
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold ${
                        isCompleted ? 'bg-gray-400' : 'bg-gradient-to-br from-green-400 to-blue-500'
                      }`}>
                        {ride.driver?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{ride.driver?.name || 'Unknown Driver'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <FiStar className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">
                              {ride.driver?.rating?.toFixed(1) || '0.0'}
                            </span>
                          </div>
                          {ride.driver?.isVerified && (
                            <Badge variant="success" size="sm">Verified</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Route Info */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isCompleted ? 'bg-gray-200' : 'bg-green-100'}`}>
                          <FiMapPin className={`w-4 h-4 ${isCompleted ? 'text-gray-600' : 'text-green-600'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">From</p>
                          <p className="text-sm font-semibold text-gray-900">{ride.origin}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isCompleted ? 'bg-gray-200' : 'bg-red-100'}`}>
                          <FiMapPin className={`w-4 h-4 ${isCompleted ? 'text-gray-600' : 'text-red-600'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">To</p>
                          <p className="text-sm font-semibold text-gray-900">{ride.destination}</p>
                        </div>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className={`flex items-center gap-2 text-sm text-gray-600 px-3 py-2 rounded-lg ${
                      isCompleted ? 'bg-gray-200' : 'bg-blue-50'
                    }`}>
                      <FiClock className={`w-4 h-4 ${isCompleted ? 'text-gray-600' : 'text-blue-600'}`} />
                      <span className="font-medium">{formatDate(ride.date)}</span>
                      <span>•</span>
                      <span className="font-medium">{formatTime(ride.date)}</span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                          <FiDollarSign className="w-4 h-4" />
                        </div>
                        <p className="text-lg font-bold text-gray-900">₹{ride.pricePerSeat || 0}</p>
                        <p className="text-xs text-gray-500">per seat</p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                          <FiUsers className="w-4 h-4" />
                        </div>
                        <p className={`text-lg font-bold ${
                          isCompleted ? 'text-gray-600' : isFull ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {availableSeats}
                        </p>
                        <p className="text-xs text-gray-500">seats left</p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                          <FiTruck className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {ride.vehicleType}
                        </p>
                        <p className="text-xs text-gray-500">vehicle</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {!isCompleted && isFull && (
                      <Badge variant="danger" className="w-full justify-center">
                        Ride Full
                      </Badge>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewDetails(ride)}
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      {/* NEW: Hide join button for completed rides */}
                      {!isCompleted && (
                        <Button
                          size="sm"
                          onClick={() => handleRequestJoin(ride._id)}
                          disabled={isFull}
                          className="flex-1"
                        >
                          {isFull ? 'Full' : 'Join'}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Ride Details Modal */}
      {showDetailsModal && selectedRide && (
        <RideDetailsModal
          ride={selectedRide}
          onClose={() => setShowDetailsModal(false)}
          onRequestJoin={handleRequestJoin}
          onUpdate={handleRideUpdate}
        />
      )}
    </div>
  );
};

export default RidesPage;