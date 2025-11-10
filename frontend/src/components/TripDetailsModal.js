

import React, { useState } from 'react';
import { FiX, FiMapPin, FiCalendar, FiUsers, FiDollarSign, FiClock, FiCheck, FiAlertCircle, FiEdit, FiTrash2 } from 'react-icons/fi';
import Button from './Button';
import Badge from './Badge';

const TripDetailsModal = ({ trip, isOpen, onClose, onJoinTrip, onLeaveTrip, onAcceptParticipant, onRejectParticipant, onEditTrip, onDeleteTrip, currentUserId }) => {
  const [loading, setLoading] = useState(false);
  const [processingParticipant, setProcessingParticipant] = useState(null);

  if (!isOpen || !trip) return null;

  // Get current user from JWT token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const loggedInUserId = currentUserId || getUserIdFromToken();
  const isOrganizer = trip.organizer?._id === loggedInUserId;
  
  // Check participation status
  const userParticipation = trip.participants?.find(p => p.user?._id === loggedInUserId || p.user === loggedInUserId);
  const isParticipant = !!userParticipation;
  const participationStatus = userParticipation?.status;

  // Calculate available spots
  const confirmedCount = trip.participants?.filter(p => p.status === 'confirmed').length || 0;
  const pendingCount = trip.participants?.filter(p => p.status === 'pending').length || 0;
  const availableSpots = (trip.capacity?.maxParticipants || 0) - confirmedCount;
  const isFull = availableSpots <= 0;

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Handle join trip
  const handleJoin = async () => {
    setLoading(true);
    try {
      await onJoinTrip(trip._id);
    } catch (error) {
      console.error('Error joining trip:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle leave trip
  const handleLeave = async () => {
    if (window.confirm('Are you sure you want to leave this trip?')) {
      setLoading(true);
      try {
        await onLeaveTrip(trip._id);
      } catch (error) {
        console.error('Error leaving trip:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle accept/reject participant
  const handleParticipantAction = async (participantId, action) => {
    setProcessingParticipant(participantId);
    try {
      if (action === 'accept') {
        await onAcceptParticipant(trip._id, participantId);
      } else {
        await onRejectParticipant(trip._id, participantId);
      }
    } catch (error) {
      console.error(`Error ${action}ing participant:`, error);
    } finally {
      setProcessingParticipant(null);
    }
  };

  // Handle edit trip
  const handleEdit = () => {
    if (onEditTrip) {
      onEditTrip(trip);
    }
  };

  // Handle delete trip
  const handleDelete = () => {
    if (onDeleteTrip) {
      onDeleteTrip(trip._id);
    }
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    const variants = {
      planned: 'info',
      ongoing: 'success',
      completed: 'secondary',
      cancelled: 'danger'
    };
    return variants[status] || 'secondary';
  };

  const getDifficultyVariant = (difficulty) => {
    const variants = {
      Easy: 'success',
      Moderate: 'warning',
      Hard: 'danger'
    };
    return variants[difficulty] || 'secondary';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{trip.title}</h2>
              <Badge variant={getStatusVariant(trip.status)}>
                {trip.status?.charAt(0).toUpperCase() + trip.status?.slice(1)}
              </Badge>
              {trip.difficulty && (
                <Badge variant={getDifficultyVariant(trip.difficulty)}>
                  {trip.difficulty}
                </Badge>
              )}
            </div>
            <p className="text-gray-600">Organized by {trip.organizer?.name || 'Unknown'}</p>
          </div>
          
          {/* Edit and Delete buttons for organizer */}
          {isOrganizer && (
            <div className="flex gap-2 mr-2">
              <button
                onClick={handleEdit}
                className="p-2 hover:bg-purple-50 rounded-lg transition-colors group"
                title="Edit Trip"
              >
                <FiEdit className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                title="Delete Trip"
              >
                <FiTrash2 className="w-5 h-5 text-red-600 group-hover:text-red-700" />
              </button>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Information Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <FiMapPin className="w-5 h-5 text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Destination</p>
              <p className="font-semibold text-gray-900">{trip.destination}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <FiCalendar className="w-5 h-5 text-green-600 mb-2" />
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-semibold text-gray-900">
                {trip.schedule?.duration || 0} days
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <FiUsers className="w-5 h-5 text-purple-600 mb-2" />
              <p className="text-sm text-gray-600">Participants</p>
              <p className="font-semibold text-gray-900">
                {confirmedCount}/{trip.capacity?.maxParticipants || 0}
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <FiDollarSign className="w-5 h-5 text-orange-600 mb-2" />
              <p className="text-sm text-gray-600">Estimated Cost</p>
              <p className="font-semibold text-gray-900">
                ₹{trip.costDetails?.estimatedCost?.toLocaleString() || trip.estimatedCost?.toLocaleString() || 0}
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiClock className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Trip Dates</h3>
            </div>
            <p className="text-gray-700">
              {formatDate(trip.schedule?.startDate || trip.startDate)} - {formatDate(trip.schedule?.endDate || trip.endDate)}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">About This Trip</h3>
            <p className="text-gray-700 whitespace-pre-line">{trip.description}</p>
          </div>

          {/* Itinerary */}
          {trip.itinerary && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Itinerary</h3>
              <p className="text-gray-700 whitespace-pre-line">{trip.itinerary}</p>
            </div>
          )}

          {/* Requirements */}
          {trip.requirements?.notes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
              <p className="text-gray-700 whitespace-pre-line">{trip.requirements.notes}</p>
            </div>
          )}

          {/* Additional Notes */}
          {trip.additionalNotes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Additional Information</h3>
              <p className="text-gray-700 whitespace-pre-line">{trip.additionalNotes}</p>
            </div>
          )}

          {/* Organizer Section (For Organizer Only) */}
          {isOrganizer && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiUsers className="text-yellow-600" />
                Manage Participants ({pendingCount} pending requests)
              </h3>

              {/* Pending Requests */}
              {pendingCount > 0 ? (
                <div className="space-y-3">
                  {trip.participants
                    ?.filter(p => p.status === 'pending')
                    .map(participant => (
                      <div
                        key={participant._id}
                        className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-semibold">
                              {participant.user?.name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {participant.user?.name || 'Unknown User'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {participant.user?.email || 'No email'}
                            </p>
                            {participant.message && (
                              <p className="text-sm text-gray-600 mt-1 italic">
                                "{participant.message}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleParticipantAction(participant._id, 'accept')}
                            disabled={processingParticipant === participant._id || isFull}
                            icon={<FiCheck />}
                          >
                            {processingParticipant === participant._id ? 'Processing...' : 'Accept'}
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleParticipantAction(participant._id, 'reject')}
                            disabled={processingParticipant === participant._id}
                            icon={<FiX />}
                          >
                            {processingParticipant === participant._id ? 'Processing...' : 'Reject'}
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No pending requests</p>
              )}

              {/* Confirmed Participants */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  Confirmed Participants ({confirmedCount})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {trip.participants
                    ?.filter(p => p.status === 'confirmed')
                    .map(participant => (
                      <div
                        key={participant._id}
                        className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                          <span className="text-green-700 font-semibold text-sm">
                            {participant.user?.name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {participant.user?.name || 'Unknown'}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Participants List (For Non-Organizers) */}
          {!isOrganizer && confirmedCount > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Confirmed Participants ({confirmedCount})
              </h3>
              <div className="flex flex-wrap gap-2">
                {trip.participants
                  ?.filter(p => p.status === 'confirmed')
                  .map(participant => (
                    <div
                      key={participant._id}
                      className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold text-sm">
                          {participant.user?.name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {participant.user?.name || 'Unknown'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Status Messages */}
          {isFull && !isOrganizer && !isParticipant && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
              <FiAlertCircle className="text-red-600 flex-shrink-0" />
              <p className="text-red-800">This trip is full. No more participants can join.</p>
            </div>
          )}

          {isParticipant && participationStatus === 'pending' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-2">
              <FiClock className="text-blue-600 flex-shrink-0" />
              <p className="text-blue-800">
                Your join request is pending approval from the organizer.
              </p>
            </div>
          )}

          {isParticipant && participationStatus === 'confirmed' && !isOrganizer && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
              <FiCheck className="text-green-600 flex-shrink-0" />
              <p className="text-green-800">You are confirmed for this trip!</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Close
          </Button>

          {/* Show Join button if not organizer, not participant, and trip not full */}
          {!isOrganizer && !isParticipant && !isFull && trip.status === 'planned' && (
            <Button
              onClick={handleJoin}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Joining...' : 'Request to Join'}
            </Button>
          )}

          {/* Show Leave button if participant (not organizer) */}
          {!isOrganizer && isParticipant && (
            <Button
              variant="danger"
              onClick={handleLeave}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Leaving...' : 'Leave Trip'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetailsModal;