
import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, DollarSign, Users, Star, Music, MessageCircle, Cigarette, Trash2 } from 'lucide-react';
import RouteMap from './RouteMap';
import api from '../services/api';

const RideDetailsModal = ({ ride, onClose, onUpdate, onRequestJoin }) => {
  const [processingPassengerId, setProcessingPassengerId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get current user from token by calling backend
  useEffect(() => {
    const getUserFromToken = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token found:', !!token);
        
        if (!token) {
          console.error('No token found in localStorage');
          setLoading(false);
          return;
        }

        // Decode JWT token to get user ID (basic decode, not verification)
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Decoded token payload:', payload);
          
          // Token payload usually has: { id: '...', email: '...', iat: ..., exp: ... }
          if (payload.id || payload._id || payload.userId) {
            const userId = payload.id || payload._id || payload.userId;
            setCurrentUser({ _id: userId, ...payload });
            console.log('✅ User extracted from token:', { _id: userId, ...payload });
          } else {
            console.error('No user ID found in token payload:', payload);
          }
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getUserFromToken();
  }, []);

  // Safety checks
  if (!ride) {
    console.error('RideDetailsModal: No ride data provided');
    return null;
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-700 mb-4">
            Your session has expired. Please log out and log in again.
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 mb-2"
          >
            Go to Login
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Safe driver ID comparison
  const getDriverId = () => {
    if (!ride.driver) return null;
    return typeof ride.driver === 'string' ? ride.driver : ride.driver._id;
  };

  const getUserId = () => {
    if (!currentUser) return null;
    return currentUser._id || currentUser.id;
  };

  const driverId = getDriverId();
  const userId = getUserId();
  const isDriver = driverId && userId && driverId === userId;

  console.log('Auth Debug:', { driverId, userId, isDriver, currentUser, rideDriver: ride.driver });

  const formatTime = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  const handleAcceptPassenger = async (passengerId) => {
    try {
      setProcessingPassengerId(passengerId);
      
      const response = await api.put(
        `/rides/${ride._id}/passenger/${passengerId}`,
        { status: 'accepted' }
      );

      if (response.data.success) {
        alert('Passenger accepted successfully!');
        if (onUpdate) {
          onUpdate(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error accepting passenger:', error);
      alert(error.response?.data?.message || 'Failed to accept passenger');
    } finally {
      setProcessingPassengerId(null);
    }
  };

  const handleRejectPassenger = async (passengerId) => {
    try {
      setProcessingPassengerId(passengerId);
      
      const response = await api.put(
        `/rides/${ride._id}/passenger/${passengerId}`,
        { status: 'rejected' }
      );

      if (response.data.success) {
        alert('Passenger rejected');
        if (onUpdate) {
          onUpdate(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error rejecting passenger:', error);
      alert(error.response?.data?.message || 'Failed to reject passenger');
    } finally {
      setProcessingPassengerId(null);
    }
  };

  const handleDeleteRide = async () => {
    if (!window.confirm('Are you sure you want to delete this ride? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await api.delete(`/rides/${ride._id}`);
      
      if (response.data.success) {
        alert('Ride deleted successfully!');
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting ride:', error);
      alert(error.response?.data?.message || 'Failed to delete ride');
    } finally {
      setDeleting(false);
    }
  };

  const handleCompleteRide = async () => {
  if (!window.confirm('Mark this ride as completed? This will calculate CO₂ and money saved for all passengers.')) {
    return;
  }

  try {
    setDeleting(true); // Reusing the loading state
    const response = await api.put(`/rides/${ride._id}/complete`);
    
    if (response.data.success) {
      alert('Ride completed successfully! Stats have been updated for all passengers.');
      onClose();
      window.location.reload(); // Refresh to show updated stats
    }
  } catch (error) {
    console.error('Error completing ride:', error);
    alert(error.response?.data?.message || 'Failed to complete ride');
  } finally {
    setDeleting(false);
  }
};

  // Safe data extraction
  const pendingRequests = Array.isArray(ride.passengers) 
    ? ride.passengers.filter(p => p && p.status === 'pending') 
    : [];
  
  const acceptedPassengers = Array.isArray(ride.passengers)
    ? ride.passengers.filter(p => p && p.status === 'accepted')
    : [];
  
  const getDriverName = () => {
    if (!ride.driver) return 'Unknown Driver';
    if (typeof ride.driver === 'string') return 'Driver';
    return ride.driver.name || 'Unknown Driver';
  };

  const getDriverEmail = () => {
    if (!ride.driver || typeof ride.driver === 'string') return '';
    return ride.driver.email || '';
  };

  const getDriverDepartment = () => {
    if (!ride.driver || typeof ride.driver === 'string') return '';
    return ride.driver.department || '';
  };

  const getDriverRating = () => {
    if (!ride.driver || typeof ride.driver === 'string') return 0;
    return ride.driver.rating || 0;
  };

  const driverName = getDriverName();
  const driverEmail = getDriverEmail();
  const driverDepartment = getDriverDepartment();
  const driverRating = getDriverRating();
  
  const startAddress = ride.route?.startLocation?.address || 'N/A';
  const endAddress = ride.route?.endLocation?.address || 'N/A';
  const departureDate = ride.schedule?.departureTime || ride.departureTime || new Date();
  
  const vehicleType = ride.vehicleDetails?.vehicleType || ride.vehicleType || 'Car';
  const vehicleNumber = ride.vehicleDetails?.vehicleNumber || ride.vehicleNumber || '';
  
  const totalSeats = ride.totalSeats || ride.availableSeats || 0;
  const availableSeats = Math.max(0, totalSeats - acceptedPassengers.length);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Ride Details</h2>
            <p className="text-sm text-gray-500">{formatDate(departureDate)} at {formatTime(departureDate)}</p>
          </div>
          <div className="flex items-center gap-2">
            {isDriver && (
              <button
                onClick={handleDeleteRide}
                disabled={deleting}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete Ride"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Route Information */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="text-green-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-xs text-gray-500">From</p>
                  <p className="font-semibold text-gray-800">{startAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-red-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-xs text-gray-500">To</p>
                  <p className="font-semibold text-gray-800">{endAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          {ride.route?.startLocation?.coordinates && ride.route?.endLocation?.coordinates && (
            <div className="rounded-xl overflow-hidden border-2 border-gray-200">
              <RouteMap
                startLocation={ride.route.startLocation}
                endLocation={ride.route.endLocation}
                height="300px"
              />
            </div>
          )}

          {/* Driver Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Driver Information</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                {driverName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{driverName}</p>
                {driverEmail && <p className="text-sm text-gray-500 truncate">{driverEmail}</p>}
                {driverDepartment && <p className="text-xs text-gray-400 truncate">{driverDepartment}</p>}
              </div>
              {driverRating > 0 && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="text-yellow-400 fill-yellow-400" size={16} />
                  <span className="font-semibold">{driverRating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Ride Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="text-blue-600" size={18} />
                <p className="text-xs text-gray-600">Departure Time</p>
              </div>
              <p className="font-semibold text-gray-800">{formatTime(departureDate)}</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="text-purple-600" size={18} />
                <p className="text-xs text-gray-600">Price per Seat</p>
              </div>
              <p className="font-semibold text-gray-800">₹{ride.pricePerSeat || 0}</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="text-orange-600" size={18} />
                <p className="text-xs text-gray-600">Seats Available</p>
              </div>
              <p className="font-semibold text-gray-800">{availableSeats} / {totalSeats}</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-600 font-semibold">🚗</span>
                <p className="text-xs text-gray-600">Vehicle</p>
              </div>
              <p className="font-semibold text-gray-800">{vehicleType}</p>
              {vehicleNumber && <p className="text-xs text-gray-500 font-mono">{vehicleNumber}</p>}
            </div>
          </div>

          {/* Preferences */}
          {ride.preferences && (Object.keys(ride.preferences).length > 0) && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Preferences</h3>
              <div className="flex flex-wrap gap-3">
                {ride.preferences.musicPreference && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg">
                    <Music className="text-purple-600" size={16} />
                    <span className="text-sm text-gray-700">{ride.preferences.musicPreference}</span>
                  </div>
                )}
                {ride.preferences.chattinessLevel && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg">
                    <MessageCircle className="text-blue-600" size={16} />
                    <span className="text-sm text-gray-700">{ride.preferences.chattinessLevel}</span>
                  </div>
                )}
                {ride.preferences.smokingAllowed !== undefined && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg">
                    <Cigarette className="text-red-600" size={16} />
                    <span className="text-sm text-gray-700">
                      {ride.preferences.smokingAllowed ? 'Smoking OK' : 'No Smoking'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pending Requests (Driver Only) */}
          {isDriver && pendingRequests.length > 0 && (
            <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Users className="text-yellow-600" size={18} />
                Pending Requests ({pendingRequests.length})
              </h3>
              <div className="space-y-3">
                {pendingRequests.map((passenger, idx) => {
                  const passengerId = passenger.user?._id || passenger.user;
                  const passengerName = passenger.user?.name || 'Unknown User';
                  const passengerEmail = passenger.user?.email || '';
                  
                  return (
                    <div 
                      key={passengerId || idx} 
                      className="bg-white rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {passengerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-800 truncate">{passengerName}</p>
                          {passengerEmail && <p className="text-xs text-gray-500 truncate">{passengerEmail}</p>}
                          {passenger.message && (
                            <p className="text-xs text-gray-600 italic mt-1 line-clamp-2">
                              "{passenger.message}"
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleAcceptPassenger(passengerId)}
                          disabled={processingPassengerId === passengerId}
                          className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium whitespace-nowrap"
                        >
                          {processingPassengerId === passengerId ? 'Processing...' : 'Accept'}
                        </button>
                        <button
                          onClick={() => handleRejectPassenger(passengerId)}
                          disabled={processingPassengerId === passengerId}
                          className="flex-1 sm:flex-none bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium whitespace-nowrap"
                        >
                          {processingPassengerId === passengerId ? 'Processing...' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Accepted Passengers */}
          {acceptedPassengers.length > 0 && (
            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Users className="text-green-600" size={18} />
                Confirmed Passengers ({acceptedPassengers.length})
              </h3>
              <div className="space-y-2">
                {acceptedPassengers.map((passenger, idx) => {
                  const passengerName = passenger.user?.name || 'Unknown User';
                  const passengerEmail = passenger.user?.email || '';
                  
                  return (
                    <div key={passenger._id || idx} className="bg-white rounded-lg p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {passengerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800 truncate">{passengerName}</p>
                        {passengerEmail && <p className="text-xs text-gray-500 truncate">{passengerEmail}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {/* <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
          >
            Close
          </button>
        </div> */}
        {/* Footer */}
<div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
  {isDriver && acceptedPassengers.length > 0 && ride.status !== 'completed' ? (
    <div className="space-y-3">
      <button
        onClick={handleCompleteRide}
        disabled={deleting}
        className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {deleting ? 'Processing...' : '✅ Complete Ride & Calculate Savings'}
      </button>
      <button
        onClick={onClose}
        className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
      >
        Close
      </button>
    </div>
  ) : (
    <button
      onClick={onClose}
      className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
    >
      Close
    </button>
  )}
</div>
      </div>
    </div>
  );
};

export default RideDetailsModal;