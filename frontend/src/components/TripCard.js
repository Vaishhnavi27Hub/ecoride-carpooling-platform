
import React from 'react';
import { FiMapPin, FiCalendar, FiUsers, FiDollarSign, FiClock, FiTrash2, FiEdit } from 'react-icons/fi';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';

const TripCard = ({ trip, onViewDetails, onJoinTrip, onDeleteTrip, onEditTrip, currentUserId }) => {
  // Get current user from JWT token if not provided
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

  // Calculate participants
  const confirmedCount = trip.participants?.filter(p => p.status === 'confirmed').length || 0;
  const maxParticipants = trip.capacity?.maxParticipants || 0;
  const spotsLeft = maxParticipants - confirmedCount;
  const isFull = spotsLeft <= 0;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    const variants = {
      planned: 'info',
      ongoing: 'success',
      completed: 'secondary',
      cancelled: 'danger'
    };
    return variants[status] || 'info';
  };

  // Get difficulty badge variant
  const getDifficultyVariant = (difficulty) => {
    const variants = {
      Easy: 'success',
      Moderate: 'warning',
      Hard: 'danger'
    };
    return variants[difficulty] || 'warning';
  };

  // Handle delete
  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent card click
    
    if (window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      try {
        await onDeleteTrip(trip._id);
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer relative">
      <div className="space-y-4" onClick={() => onViewDetails(trip)}>
        {/* Header with Status and Difficulty Badges */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(trip.status)}>
              {trip.status?.charAt(0).toUpperCase() + trip.status?.slice(1) || 'Planned'}
            </Badge>
            {trip.difficulty && (
              <Badge variant={getDifficultyVariant(trip.difficulty)}>
                {trip.difficulty}
              </Badge>
            )}
            {trip.tripType && (
              <Badge variant="secondary">
                {trip.tripType}
              </Badge>
            )}
          </div>
          
          {/* Edit and Delete Buttons (Only for Organizer) */}
          {isOrganizer && (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTrip(trip);
                }}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                title="Edit trip"
              >
                <FiEdit className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                title="Delete trip"
              >
                <FiTrash2 className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
              </button>
            </div>
          )}
        </div>

        {/* Trip Title */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h3>
          {trip.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{trip.description}</p>
          )}
        </div>

        {/* Destination */}
        <div className="flex items-start gap-3 bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
          <FiMapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500">Destination</p>
            <p className="text-sm font-semibold text-gray-900">{trip.destination}</p>
          </div>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2 text-sm">
          <FiCalendar className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-gray-700">
            {formatDate(trip.schedule?.startDate || trip.startDate)} - {formatDate(trip.schedule?.endDate || trip.endDate)}
          </span>
        </div>

        {/* Duration */}
        {(trip.schedule?.duration || trip.duration) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiClock className="w-4 h-4" />
            <span>{trip.schedule?.duration || trip.duration} days</span>
          </div>
        )}

        {/* Organizer Info */}
        <div className="flex items-center gap-3 py-3 border-t border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {trip.organizer?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-xs text-gray-500">Organized by</p>
            <p className="text-sm font-semibold text-gray-900">{trip.organizer?.name || 'Unknown'}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
          {/* Participants */}
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
              <FiUsers className="w-4 h-4" />
            </div>
            <p className={`text-lg font-bold ${isFull ? 'text-red-600' : 'text-green-600'}`}>
              {confirmedCount}/{maxParticipants}
            </p>
            <p className="text-xs text-gray-500">
              {isFull ? 'Full' : `${spotsLeft} spots left`}
            </p>
          </div>

          {/* Cost */}
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
              <FiDollarSign className="w-4 h-4" />
            </div>
            <p className="text-lg font-bold text-gray-900">
              ₹{trip.costDetails?.estimatedCost?.toLocaleString() || trip.estimatedCost?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-gray-500">Estimated Cost</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="primary"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(trip);
            }}
            className="flex-1"
          >
            View Details
          </Button>
          
          {!isOrganizer && !isFull && trip.status === 'planned' && (
            <Button
              variant="success"
              onClick={(e) => {
                e.stopPropagation();
                onJoinTrip(trip._id);
              }}
              className="flex-1"
            >
              Join Trip
            </Button>
          )}

          {isFull && !isOrganizer && (
            <Button
              variant="secondary"
              disabled
              className="flex-1"
            >
              Trip Full
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TripCard;