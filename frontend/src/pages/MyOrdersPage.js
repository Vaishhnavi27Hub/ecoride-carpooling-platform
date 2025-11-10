
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiPackage, FiClock, FiCheck, FiTruck, FiMessageSquare, /* FiStar, FiX */ } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import { marketplaceAPI } from '../services/api';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // RATING FEATURE COMMENTED OUT
  // const [ratingModal, setRatingModal] = useState(null);
  // const [rating, setRating] = useState(5);
  // const [comment, setComment] = useState('');
  // const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const response = await marketplaceAPI.getMyOrders();
      
      if (response.success) {
        setOrders(response.orders || []);
      } else {
        alert('Failed to fetch your orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Error loading orders: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChatWithSeller = (seller) => {
    navigate(`/chat?userId=${seller._id}`);
  };

  // RATING FUNCTIONS COMMENTED OUT
  /*
  const handleRateItem = (itemId) => {
    setRatingModal(itemId);
    setRating(5);
    setComment('');
  };

  const handleSubmitRating = async () => {
    if (!ratingModal) return;

    try {
      setSubmittingRating(true);
      const response = await marketplaceAPI.addRating(ratingModal, {
        rating,
        comment: comment.trim()
      });

      if (response.success) {
        alert('Rating submitted successfully!');
        setRatingModal(null);
        fetchMyOrders();
      } else {
        alert(response.message || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmittingRating(false);
    }
  };
  */

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'yellow',
      'confirmed': 'blue',
      'delivered': 'green',
      'cancelled': 'red'
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': FiClock,
      'confirmed': FiCheck,
      'delivered': FiTruck,
      'cancelled': null
    };
    return icons[status];
  };

  const getStatusMessage = (status) => {
    const messages = {
      'pending': 'Waiting for seller confirmation',
      'confirmed': 'Order confirmed - Waiting for delivery',
      'delivered': 'Order delivered',
      'cancelled': 'Order cancelled'
    };
    return messages[status] || status;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FiShoppingCart className="text-green-600" />
            My Orders
          </h1>
          <p className="text-gray-600 mt-1">
            Track your orders and purchases
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-gray-500">Start shopping from the marketplace!</p>
            <Button
              variant="primary"
              onClick={() => navigate('/marketplace')}
              className="mt-4"
            >
              Browse Items
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(orderGroup => (
              orderGroup.orders.map(order => (
                <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Order Header - Compact */}
                  <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="text-sm text-gray-600">
                          Order placed: <span className="font-medium text-gray-900">{formatDate(order.orderedAt)}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Order ID: <span className="font-mono text-xs">{order._id}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          {formatPrice(order.totalAmount)}
                        </div>
                        <div className="text-xs text-gray-500">Cash on Delivery</div>
                      </div>
                    </div>
                  </div>

                  {/* Order Content - Compact Layout */}
                  <div className="p-4">
                    <div className="flex gap-4">
                      {/* Item Image - Smaller */}
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {orderGroup.item?.itemDetails?.images && orderGroup.item.itemDetails.images.length > 0 ? (
                          <img 
                            src={orderGroup.item.itemDetails.images[0]} 
                            alt={orderGroup.item.itemDetails?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                            <FiPackage className="w-8 h-8 text-green-600" />
                          </div>
                        )}
                      </div>

                      {/* Item Details - Compact */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 truncate">
                          {orderGroup.item?.itemDetails?.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                          {orderGroup.item?.itemDetails?.description}
                        </p>
                        
                        {/* Inline Details */}
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <Badge color="blue" className="text-xs">
                            {orderGroup.item?.itemDetails?.category}
                          </Badge>
                          <span className="text-gray-600">
                            Qty: <span className="font-medium text-gray-900">{order.quantity}</span>
                          </span>
                          <span className="text-gray-600">
                            Price: <span className="font-medium text-gray-900">{formatPrice(orderGroup.item?.pricing?.totalPrice)}</span>
                          </span>
                        </div>

                        {/* Delivery Notes - Compact */}
                        {order.deliveryNotes && (
                          <div className="mt-2 bg-blue-50 border border-blue-100 rounded px-3 py-1.5 text-sm">
                            <span className="font-medium text-blue-900">Notes:</span>
                            <span className="ml-2 text-blue-800">{order.deliveryNotes}</span>
                          </div>
                        )}
                      </div>

                      {/* Right Side - Status & Actions Stacked */}
                      <div className="flex flex-col gap-2 items-end min-w-[140px]">
                        <Badge color={getStatusColor(order.status)} className="text-xs px-3 py-1">
                          {order.status.toUpperCase()}
                        </Badge>
                        
                        {/* RATING BUTTON COMMENTED OUT */}
                        {/* {order.status === 'delivered' && (
                          <button
                            onClick={() => handleRateItem(orderGroup.item._id)}
                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white text-sm font-medium rounded-lg transition-all"
                          >
                            <FiStar className="w-4 h-4" />
                            Rate Item
                          </button>
                        )} */}
                      </div>
                    </div>

                    {/* Seller Info - Compact Row at Bottom */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 font-bold text-sm">
                            {orderGroup.item?.seller?.name?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {orderGroup.item?.seller?.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {orderGroup.item?.seller?.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {getStatusIcon(order.status) && 
                            React.createElement(getStatusIcon(order.status), {
                              className: `w-4 h-4 ${
                                order.status === 'pending' ? 'text-yellow-600' :
                                order.status === 'confirmed' ? 'text-blue-600' :
                                order.status === 'delivered' ? 'text-green-600' :
                                'text-gray-600'
                              }`
                            })
                          }
                          <span className="font-medium">{getStatusMessage(order.status)}</span>
                        </div>
                        
                        <button
                          onClick={() => handleChatWithSeller(orderGroup.item?.seller)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <FiMessageSquare className="w-4 h-4" />
                          Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ))}
          </div>
        )}
      </div>

      {/* RATING MODAL COMPLETELY COMMENTED OUT */}
      {/* {ratingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Rate This Item</h3>
              <button
                onClick={() => setRatingModal(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Rating
              </label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transform hover:scale-110 transition-transform"
                  >
                    <FiStar 
                      className={`w-10 h-10 ${
                        star <= rating 
                          ? 'text-yellow-500 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center mt-2 text-sm font-medium text-gray-600">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Review (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this item..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setRatingModal(null)}
                disabled={submittingRating}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={submittingRating}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingRating ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default MyOrdersPage;