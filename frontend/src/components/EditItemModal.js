import React, { useState, useEffect } from 'react';
import { FiX, FiUpload, FiTrash2 } from 'react-icons/fi';
import Button from './Button';
import { ITEM_CATEGORIES, ITEM_CONDITIONS } from '../utils/constants';

function EditItemModal({ item, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    condition: '',
    originalPrice: '',
    totalPrice: '',
    availableQuantity: '',
    expiryDate: '',
    pickupLocation: '',
    deliveryAvailable: false,
    tags: ''
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item && isOpen) {
      setFormData({
        name: item.itemDetails?.name || '',
        description: item.itemDetails?.description || '',
        category: item.itemDetails?.category || '',
        condition: item.itemDetails?.condition || '',
        originalPrice: item.pricing?.originalPrice || '',
        totalPrice: item.pricing?.totalPrice || '',
        availableQuantity: item.quantity?.available || '',
        expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
        pickupLocation: item.location?.address || '',
        deliveryAvailable: item.delivery?.available || false,
        tags: item.tags?.join(', ') || ''
      });
      setImages(item.itemDetails?.images || []);
    }
  }, [item, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...imageUrls].slice(0, 5));
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Item name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.totalPrice || formData.totalPrice <= 0) newErrors.totalPrice = 'Valid price is required';
    if (!formData.availableQuantity || formData.availableQuantity <= 0) newErrors.availableQuantity = 'Valid quantity is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.pickupLocation.trim()) newErrors.pickupLocation = 'Pickup location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const updateData = {
        itemDetails: {
          name: formData.name.trim(),
          description: formData.description.trim(),
          category: formData.category,
          condition: formData.condition,
          images: images
        },
        pricing: {
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.totalPrice),
          totalPrice: parseFloat(formData.totalPrice),
          deliveryCharge: item.pricing?.deliveryCharge || 0 // Keep existing or default to 0
        },
        quantity: {
          available: parseInt(formData.availableQuantity),
          sold: item.quantity?.sold || 0
        },
        location: {
          address: formData.pickupLocation.trim(),
          acquiredFrom: item.location?.acquiredFrom || formData.pickupLocation.trim() // Keep existing or use pickup location
        },
        delivery: {
          available: formData.deliveryAvailable,
          estimatedDeliveryDate: item.delivery?.estimatedDeliveryDate || item.expiryDate, // Keep existing or use expiry date
          deliveryLocation: item.delivery?.deliveryLocation || formData.pickupLocation.trim() // Keep existing or use pickup location
        },
        expiryDate: new Date(formData.expiryDate),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };
      await onSave(item._id, updateData);
      onClose();
    } catch (error) {
      console.error('Error updating item:', error);
      alert(error.response?.data?.message || 'Failed to update item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Edit Item</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FiX className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Images Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Images (Max 5)</label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square">
                  <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg border border-gray-300" />
                  <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full">
                    <FiTrash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-500 transition-colors">
                  <div className="text-center">
                    <FiUpload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <span className="text-xs text-gray-500">Upload</span>
                  </div>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="e.g., Handmade Pottery Set" 
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="3" 
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="Describe your item..." 
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Category and Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Category</option>
                {ITEM_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
              <select 
                name="condition" 
                value={formData.condition} 
                onChange={handleChange} 
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.condition ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Condition</option>
                {ITEM_CONDITIONS.map(cond => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
              {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
              <input 
                type="number" 
                name="originalPrice" 
                value={formData.originalPrice} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                placeholder="Optional" 
                min="0" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹) *</label>
              <input 
                type="number" 
                name="totalPrice" 
                value={formData.totalPrice} 
                onChange={handleChange} 
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.totalPrice ? 'border-red-500' : 'border-gray-300'}`} 
                placeholder="Enter price" 
                min="1" 
              />
              {errors.totalPrice && <p className="text-red-500 text-sm mt-1">{errors.totalPrice}</p>}
            </div>
          </div>

          {/* Quantity and Expiry */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Quantity *</label>
              <input 
                type="number" 
                name="availableQuantity" 
                value={formData.availableQuantity} 
                onChange={handleChange} 
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.availableQuantity ? 'border-red-500' : 'border-gray-300'}`} 
                placeholder="e.g., 5" 
                min="1" 
              />
              {errors.availableQuantity && <p className="text-red-500 text-sm mt-1">{errors.availableQuantity}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
              <input 
                type="date" 
                name="expiryDate" 
                value={formData.expiryDate} 
                onChange={handleChange} 
                min={new Date().toISOString().split('T')[0]} 
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
            </div>
          </div>

          {/* Pickup Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location *</label>
            <input 
              type="text" 
              name="pickupLocation" 
              value={formData.pickupLocation} 
              onChange={handleChange} 
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.pickupLocation ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="e.g., Office lobby, Building A" 
            />
            {errors.pickupLocation && <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>}
          </div>

          {/* Delivery Option */}
          <div className="flex items-center">
            <input 
              type="checkbox" 
              name="deliveryAvailable" 
              checked={formData.deliveryAvailable} 
              onChange={handleChange} 
              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" 
            />
            <label className="ml-2 text-sm text-gray-700">Delivery available</label>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
            <input 
              type="text" 
              name="tags" 
              value={formData.tags} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              placeholder="e.g., handmade, pottery, unique" 
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditItemModal;