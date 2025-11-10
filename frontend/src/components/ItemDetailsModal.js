import React, { useState } from 'react';
import { FiX, FiShoppingBag, FiMapPin, FiUser, FiStar, FiTag, FiClock, FiPackage, FiTruck, FiMessageSquare } from 'react-icons/fi';
import Button from './Button';
import Badge from './Badge';

const ItemDetailsModal = ({ item, onClose, onOrder, onChat, currentUserId }) => {
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);

  if (!item) return null;

  const isSeller = item.seller?._id === currentUserId;
  const remainingQuantity = item.quantity.available - item.quantity.sold;

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

  const handleOrderSubmit = () => {
    if (orderQuantity < 1 || orderQuantity > remainingQuantity) {
      alert(`Please enter a valid quantity (1-${remainingQuantity})`);
      return;
    }

    onOrder({
      itemId: item._id,
      quantity: orderQuantity,
      deliveryNotes: deliveryNotes.trim()
    });
  };

  const totalPrice = item.pricing.totalPrice * orderQuantity;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Item Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Images */}
            <div>
              <div className="relative h-64 lg:h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
                {item.itemDetails?.images && item.itemDetails.images.length > 0 ? (
                  <img 
                    src={item.itemDetails.images[0]} 
                    alt={item.itemDetails?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                    <FiShoppingBag className="w-24 h-24 text-green-600" />
                  </div>
                )}
              </div>

              {/* Additional Images */}
              {item.itemDetails?.images && item.itemDetails.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {item.itemDetails.images.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="h-20 bg-gray-200 rounded overflow-hidden">
                      <img src={img} alt={`${item.itemDetails?.name} ${idx + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div>
              {/* Title & Category */}
              <div className="mb-4">
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900 flex-1">
                    {item.itemDetails?.name}
                  </h3>
                  <Badge color="blue">
                    {item.itemDetails?.category}
                  </Badge>
                </div>
                <Badge color={item.status === 'available' ? 'green' : 'red'}>
                  {item.status === 'available' ? 'AVAILABLE' : item.status.toUpperCase().replace('_', ' ')}
                </Badge>
              </div>

              {/* Price */}
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Original Price:</span>
                  <span className="text-lg font-semibold">{formatPrice(item.pricing.originalPrice)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Delivery Charge:</span>
                  <span className="text-lg font-semibold">{formatPrice(item.pricing.deliveryCharge)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-green-200">
                  <span className="text-gray-900 font-semibold">Total Price:</span>
                  <span className="text-2xl font-bold text-green-600">{formatPrice(item.pricing.totalPrice)}</span>
                </div>
              </div>

              {/* Quantity & Condition */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <FiPackage className="w-4 h-4" />
                    <span>Available</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {remainingQuantity} / {item.quantity.available}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <FiTag className="w-4 h-4" />
                    <span>Condition</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {item.itemDetails?.condition}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.itemDetails?.description}
                </p>
              </div>

              {/* Location */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FiMapPin className="w-4 h-4" />
                  <span className="font-semibold">Acquired From:</span>
                </div>
                <p className="text-gray-900 ml-6">{item.location?.acquiredFrom}</p>
              </div>

              {/* Delivery Info */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-blue-900 font-semibold mb-2">
                  <FiTruck className="w-5 h-5" />
                  <span>Delivery Information</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="text-gray-900 font-medium">{item.delivery?.deliveryLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="text-gray-900 font-medium">{item.delivery?.deliveryMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Delivery:</span>
                    <span className="text-gray-900 font-medium">{formatDate(item.delivery?.estimatedDeliveryDate)}</span>
                  </div>
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{item.seller?.name}</div>
                      <div className="text-sm text-gray-600">{item.seller?.email}</div>
                      {item.seller?.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{item.seller.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {!isSeller && (
                    <button
                      onClick={() => onChat(item.seller)}
                      className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <FiMessageSquare className="w-4 h-4" />
                      Chat
                    </button>
                  )}
                </div>
              </div>

              {/* Trip Reference */}
              {item.trip && (
                <div className="bg-purple-50 rounded-lg p-3 mb-4">
                  <div className="text-sm text-purple-900">
                    <span className="font-semibold">From Trip:</span> {item.trip.title}
                  </div>
                  {item.trip.destination && (
                    <div className="text-sm text-purple-700 mt-1">
                      Destination: {item.trip.destination}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {!isSeller && item.status === 'available' && remainingQuantity > 0 && (
                <div>
                  {!showOrderForm ? (
                    <Button
                      variant="primary"
                      onClick={() => setShowOrderForm(true)}
                      icon={FiShoppingBag}
                      className="w-full"
                    >
                      Place Order
                    </Button>
                  ) : (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Place Your Order</h4>
                      
                      {/* Quantity Selector */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity (Max: {remainingQuantity})
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={remainingQuantity}
                          value={orderQuantity}
                          onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      {/* Delivery Notes */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Notes (Optional)
                        </label>
                        <textarea
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          placeholder="Any specific delivery instructions..."
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        />
                      </div>

                      {/* Total Price */}
                      <div className="bg-white rounded-lg p-3 mb-3 border border-green-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">Total Amount:</span>
                          <span className="text-2xl font-bold text-green-600">{formatPrice(totalPrice)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          Cash on Delivery
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowOrderForm(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleOrderSubmit}
                          className="flex-1"
                        >
                          Confirm Order
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Seller Message */}
              {isSeller && (
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-blue-900 font-medium">This is your listing</p>
                  <p className="text-blue-700 text-sm mt-1">
                    Go to "My Listings" to manage orders
                  </p>
                </div>
              )}

              {/* Sold Out Message */}
              {item.status !== 'available' && (
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <p className="text-red-900 font-medium">
                    {item.status === 'sold_out' ? 'This item is sold out' : 'This item is no longer available'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ratings Section */}
          {item.ratings && item.ratings.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiStar className="text-yellow-500" />
                Ratings & Reviews ({item.ratings.length})
              </h4>
              <div className="space-y-4">
                {item.ratings.map((rating, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <FiUser className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{rating.user?.name}</div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < rating.rating
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(rating.createdAt)}
                      </div>
                    </div>
                    {rating.comment && (
                      <p className="text-gray-600 text-sm">{rating.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsModal;