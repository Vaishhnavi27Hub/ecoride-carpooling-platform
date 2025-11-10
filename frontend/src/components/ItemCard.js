import React from 'react';
import { FiShoppingBag, FiMapPin, FiTag, FiClock } from 'react-icons/fi';
import Card from './Card';
import Button from './Button';
import Badge from './Badge';

const ItemCard = ({ item, onViewDetails, onOrder }) => {
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'Food & Snacks': 'blue',
      'Souvenirs': 'purple',
      'Adventure Gear': 'orange',
      'Electronics': 'indigo',
      'Clothing': 'pink',
      'Books': 'green',
      'Other': 'gray'
    };
    return colors[category] || 'gray';
  };

  // Get availability color
  const getAvailabilityColor = (status) => {
    const colors = {
      'available': 'green',
      'sold': 'red',
      'reserved': 'yellow'
    };
    return colors[status] || 'gray';
  };

  return (
    <Card hover className="h-full flex flex-col">
      {/* Item Image */}
      <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <img 
            src={item.images[0]} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
            <FiShoppingBag className="w-16 h-16 text-green-600" />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <Badge color={getCategoryColor(item.category)}>
            {item.category}
          </Badge>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-2 right-2">
          <Badge color={getAvailabilityColor(item.availability)}>
            {item.availability}
          </Badge>
        </div>
      </div>

      {/* Item Details */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title & Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-2 line-clamp-2">
            {item.title}
          </h3>
          <div className="text-right">
            <div className="text-xl font-bold text-green-600">
              {formatPrice(item.price)}
            </div>
            {item.originalPrice && item.originalPrice > item.price && (
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(item.originalPrice)}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Seller Info */}
        {/* <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <FiUser className="w-4 h-4" />
          <span className="font-medium">{item.seller?.name || 'Unknown Seller'}</span>
          {item.seller?.rating && (
            <div className="flex items-center gap-1 ml-2">
              <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{item.seller.rating.toFixed(1)}</span>
            </div>
          )}
        </div> */}

        {/* Trip Reference */}
        {item.trip && (
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <FiMapPin className="w-4 h-4" />
            <span className="truncate">From: {item.trip.title}</span>
          </div>
        )}

        {/* Condition */}
        {item.condition && (
          <div className="flex items-center gap-2 mb-3 text-sm">
            <FiTag className="w-4 h-4 text-gray-600" />
            <span className="text-gray-600">
              Condition: <span className="font-medium text-gray-900">{item.condition}</span>
            </span>
          </div>
        )}

        {/* Listed Date */}
        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
          <FiClock className="w-4 h-4" />
          <span>Listed on {formatDate(item.createdAt || new Date())}</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex gap-2">
          <Button
            variant="outline"
            onClick={() => onViewDetails(item)}
            className="flex-1"
          >
            View Details
          </Button>
          {item.availability === 'available' && (
            <Button
              variant="primary"
              onClick={() => onOrder(item)}
              className="flex-1"
            >
              <FiShoppingBag className="w-4 h-4 mr-1" />
              Order Now
            </Button>
          )}
        </div>

        {/* Sold/Reserved Message */}
        {item.availability !== 'available' && (
          <div className="mt-2 text-center">
            <Badge 
              color={item.availability === 'sold' ? 'red' : 'yellow'}
              className="w-full"
            >
              {item.availability === 'sold' ? 'SOLD OUT' : 'RESERVED'}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ItemCard;