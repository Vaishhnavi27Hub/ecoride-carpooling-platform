
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiPlus, FiSearch, FiFilter, FiX, FiPackage, FiShoppingCart } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import ItemCard from '../components/ItemCard';
import ItemDetailsModal from '../components/ItemDetailsModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { marketplaceAPI } from '../services/api';
import { ITEM_CATEGORIES, ITEM_CONDITIONS } from '../utils/constants';

const MarketplacePage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    condition: 'all',
    priceRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Get current user ID from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Fetch items
  useEffect(() => {
    fetchItems();
  }, []);

  // Apply filters whenever search or filters change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, items]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await marketplaceAPI.getItems();
      
      console.log('Fetch items response:', response);
      
      if (response.success) {
        setItems(response.items || []);
      } else {
        console.error('Failed to fetch items');
        alert('Failed to load items. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Error loading items: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...items];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.itemDetails?.name?.toLowerCase().includes(query) ||
        item.itemDetails?.description?.toLowerCase().includes(query) ||
        item.seller?.name?.toLowerCase().includes(query) ||
        item.itemDetails?.category?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.itemDetails?.category === filters.category);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    // Condition filter
    if (filters.condition !== 'all') {
      filtered = filtered.filter(item => item.itemDetails?.condition === filters.condition);
    }

    // Price range filter
    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(item => {
        const price = item.pricing?.totalPrice;
        switch (filters.priceRange) {
          case 'under500':
            return price < 500;
          case '500-1000':
            return price >= 500 && price < 1000;
          case '1000-2000':
            return price >= 1000 && price < 2000;
          case 'above2000':
            return price >= 2000;
          default:
            return true;
        }
      });
    }

    setFilteredItems(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      status: 'all',
      condition: 'all',
      priceRange: 'all'
    });
    setSearchQuery('');
  };

  const handleViewDetails = async (item) => {
    try {
      // Fetch full item details
      const response = await marketplaceAPI.getItemById(item._id);
      if (response.success) {
        setSelectedItem(response.item);
      } else {
        alert('Failed to load item details');
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
      alert('Error loading item details: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleOrder = async (orderData) => {
    try {
      const response = await marketplaceAPI.placeOrder(orderData.itemId, {
        quantity: orderData.quantity,
        deliveryNotes: orderData.deliveryNotes
      });

      if (response.success) {
        alert('Order placed successfully! The seller will review your request.');
        setSelectedItem(null);
        fetchItems(); // Refresh items
      } else {
        alert(response.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleChat = (seller) => {
    // Navigate to chat with seller
    navigate(`/chat?userId=${seller._id}`);
  };

  const activeFilterCount = Object.values(filters).filter(val => val !== 'all').length;

  // Transform items for ItemCard component
  const transformItemForCard = (item) => ({
    _id: item._id,
    title: item.itemDetails?.name,
    description: item.itemDetails?.description,
    category: item.itemDetails?.category,
    condition: item.itemDetails?.condition,
    images: item.itemDetails?.images,
    price: item.pricing?.totalPrice,
    originalPrice: item.pricing?.originalPrice,
    seller: item.seller,
    trip: item.trip,
    availability: item.status,
    createdAt: item.createdAt
  });

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FiShoppingBag className="text-green-600" />
              Marketplace
            </h1>
            <p className="text-gray-600 mt-1">
              Buy and sell items from trips • {filteredItems.length} items available
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/marketplace/my-listings')}
              icon={FiPackage}
            >
              My Listings
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/marketplace/my-orders')}
              icon={FiShoppingCart}
            >
              My Orders
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/marketplace/create')}
              icon={FiPlus}
            >
              List an Item
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search items, sellers, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              icon={FiFilter}
            >
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>

            {/* Clear Filters */}
            {(activeFilterCount > 0 || searchQuery) && (
              <Button
                variant="outline"
                onClick={clearFilters}
                icon={FiX}
              >
                Clear
              </Button>
            )}
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {ITEM_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="sold_out">Sold Out</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Conditions</option>
                  {ITEM_CONDITIONS.map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Prices</option>
                  <option value="under500">Under ₹500</option>
                  <option value="500-1000">₹500 - ₹1,000</option>
                  <option value="1000-2000">₹1,000 - ₹2,000</option>
                  <option value="above2000">Above ₹2,000</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No items found</h3>
            <p className="mt-1 text-gray-500">
              {searchQuery || activeFilterCount > 0
                ? 'Try adjusting your search or filters'
                : 'Be the first to list an item!'}
            </p>
            {(searchQuery || activeFilterCount > 0) && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <ItemCard
                key={item._id}
                item={transformItemForCard(item)}
                onViewDetails={() => handleViewDetails(item)}
                onOrder={() => handleViewDetails(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Item Details Modal */}
      {selectedItem && (
        <ItemDetailsModal
          item={selectedItem}
          currentUserId={currentUserId}
          onClose={() => setSelectedItem(null)}
          onOrder={handleOrder}
          onChat={handleChat}
        />
      )}
    </div>
  );
};

export default MarketplacePage;