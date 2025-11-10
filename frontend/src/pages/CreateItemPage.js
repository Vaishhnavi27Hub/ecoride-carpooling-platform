// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { FiShoppingBag, FiImage, FiDollarSign, FiTag, FiAlertCircle } from 'react-icons/fi';
// // import Navbar from '../components/Navbar';
// // import Button from '../components/Button';
// // import Input from '../components/Input';
// // import Card from '../components/Card';
// // import LoadingSpinner from '../components/LoadingSpinner';
// // import { marketplaceAPI, tripAPI } from '../services/api';
// // import { ITEM_CATEGORIES, ITEM_CONDITIONS } from '../utils/constants';

// // const CreateItemPage = () => {
// //   const navigate = useNavigate();
// //   const [loading, setLoading] = useState(false);
// //   const [trips, setTrips] = useState([]);
// //   const [formData, setFormData] = useState({
// //     title: '',
// //     description: '',
// //     category: '',
// //     price: '',
// //     originalPrice: '',
// //     condition: 'New',
// //     availability: 'available',
// //     trip: '',
// //     images: []
// //   });
// //   const [errors, setErrors] = useState({});
// //   const [imagePreview, setImagePreview] = useState(null);

// //   // Fetch user's trips
// //   useEffect(() => {
// //     fetchTrips();
// //   }, []);

// //   const fetchTrips = async () => {
// //     try {
// //       const response = await tripAPI.getTrips();
// //       if (response.success) {
// //         // Filter to show only user's trips
// //         setTrips(response.data || []);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching trips:', error);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //     // Clear error for this field
// //     if (errors[name]) {
// //       setErrors(prev => ({
// //         ...prev,
// //         [name]: ''
// //       }));
// //     }
// //   };

// //   const handleImageChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       // Validate file size (max 5MB)
// //       if (file.size > 5 * 1024 * 1024) {
// //         setErrors(prev => ({
// //           ...prev,
// //           images: 'Image size should be less than 5MB'
// //         }));
// //         return;
// //       }

// //       // Validate file type
// //       if (!file.type.startsWith('image/')) {
// //         setErrors(prev => ({
// //           ...prev,
// //           images: 'Please upload an image file'
// //         }));
// //         return;
// //       }

// //       // Create preview
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         setImagePreview(reader.result);
// //         setFormData(prev => ({
// //           ...prev,
// //           images: [reader.result]
// //         }));
// //       };
// //       reader.readAsDataURL(file);

// //       // Clear error
// //       setErrors(prev => ({
// //         ...prev,
// //         images: ''
// //       }));
// //     }
// //   };

// //   const validateForm = () => {
// //     const newErrors = {};

// //     if (!formData.title.trim()) {
// //       newErrors.title = 'Item title is required';
// //     }

// //     if (!formData.description.trim()) {
// //       newErrors.description = 'Description is required';
// //     } else if (formData.description.length < 20) {
// //       newErrors.description = 'Description should be at least 20 characters';
// //     }

// //     if (!formData.category) {
// //       newErrors.category = 'Please select a category';
// //     }

// //     if (!formData.price) {
// //       newErrors.price = 'Price is required';
// //     } else if (formData.price <= 0) {
// //       newErrors.price = 'Price must be greater than 0';
// //     }

// //     if (formData.originalPrice && formData.originalPrice < formData.price) {
// //       newErrors.originalPrice = 'Original price should be greater than selling price';
// //     }

// //     if (!formData.condition) {
// //       newErrors.condition = 'Please select item condition';
// //     }

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!validateForm()) {
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       // Prepare data for backend
// //       const itemData = {
// //         title: formData.title.trim(),
// //         description: formData.description.trim(),
// //         category: formData.category,
// //         price: parseFloat(formData.price),
// //         originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
// //         condition: formData.condition,
// //         availability: formData.availability,
// //         trip: formData.trip || undefined,
// //         images: formData.images.length > 0 ? formData.images : []
// //       };

// //       console.log('Creating item:', itemData);

// //       const response = await marketplaceAPI.createItem(itemData);

// //       if (response.success) {
// //         alert('Item listed successfully! ✅');
// //         navigate('/marketplace');
// //       } else {
// //         alert('Failed to list item. Please try again.');
// //       }
// //     } catch (error) {
// //       console.error('Error creating item:', error);
// //       alert('Error listing item: ' + (error.response?.data?.message || error.message));
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <Navbar />
      
// //       <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         {/* Header */}
// //         <div className="mb-6">
// //           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
// //             <FiShoppingBag className="text-green-600" />
// //             List an Item
// //           </h1>
// //           <p className="text-gray-600 mt-1">
// //             Sell items from your trips to other colleagues
// //           </p>
// //         </div>

// //         {/* Form */}
// //         <form onSubmit={handleSubmit}>
// //           <Card className="p-6">
// //             {/* Item Title */}
// //             <div className="mb-6">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Item Title <span className="text-red-500">*</span>
// //               </label>
// //               <Input
// //                 name="title"
// //                 value={formData.title}
// //                 onChange={handleChange}
// //                 placeholder="e.g., Handmade wooden souvenirs from Goa"
// //                 error={errors.title}
// //               />
// //             </div>

// //             {/* Description */}
// //             <div className="mb-6">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Description <span className="text-red-500">*</span>
// //               </label>
// //               <textarea
// //                 name="description"
// //                 value={formData.description}
// //                 onChange={handleChange}
// //                 placeholder="Describe the item in detail..."
// //                 rows={4}
// //                 className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
// //                   errors.description ? 'border-red-500' : 'border-gray-300'
// //                 }`}
// //               />
// //               {errors.description && (
// //                 <p className="mt-1 text-sm text-red-600">{errors.description}</p>
// //               )}
// //               <p className="mt-1 text-sm text-gray-500">
// //                 {formData.description.length} characters (minimum 20)
// //               </p>
// //             </div>

// //             {/* Category & Condition */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Category <span className="text-red-500">*</span>
// //                 </label>
// //                 <select
// //                   name="category"
// //                   value={formData.category}
// //                   onChange={handleChange}
// //                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
// //                     errors.category ? 'border-red-500' : 'border-gray-300'
// //                   }`}
// //                 >
// //                   <option value="">Select category</option>
// //                   {ITEM_CATEGORIES.map(cat => (
// //                     <option key={cat} value={cat}>{cat}</option>
// //                   ))}
// //                 </select>
// //                 {errors.category && (
// //                   <p className="mt-1 text-sm text-red-600">{errors.category}</p>
// //                 )}
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Condition <span className="text-red-500">*</span>
// //                 </label>
// //                 <select
// //                   name="condition"
// //                   value={formData.condition}
// //                   onChange={handleChange}
// //                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
// //                 >
// //                   {ITEM_CONDITIONS.map(cond => (
// //                     <option key={cond} value={cond}>{cond}</option>
// //                   ))}
// //                 </select>
// //               </div>
// //             </div>

// //             {/* Price & Original Price */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Price (₹) <span className="text-red-500">*</span>
// //                 </label>
// //                 <Input
// //                   type="number"
// //                   name="price"
// //                   value={formData.price}
// //                   onChange={handleChange}
// //                   placeholder="500"
// //                   icon={FiDollarSign}
// //                   error={errors.price}
// //                   min="0"
// //                   step="1"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Original Price (₹) <span className="text-gray-500 text-xs">(optional)</span>
// //                 </label>
// //                 <Input
// //                   type="number"
// //                   name="originalPrice"
// //                   value={formData.originalPrice}
// //                   onChange={handleChange}
// //                   placeholder="800"
// //                   icon={FiTag}
// //                   error={errors.originalPrice}
// //                   min="0"
// //                   step="1"
// //                 />
// //                 <p className="mt-1 text-xs text-gray-500">
// //                   Show discount if applicable
// //                 </p>
// //               </div>
// //             </div>

// //             {/* Trip Reference */}
// //             <div className="mb-6">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Related Trip <span className="text-gray-500 text-xs">(optional)</span>
// //               </label>
// //               <select
// //                 name="trip"
// //                 value={formData.trip}
// //                 onChange={handleChange}
// //                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
// //               >
// //                 <option value="">Not related to any trip</option>
// //                 {trips.map(trip => (
// //                   <option key={trip._id} value={trip._id}>
// //                     {trip.title} - {new Date(trip.startDate).toLocaleDateString()}
// //                   </option>
// //                 ))}
// //               </select>
// //               <p className="mt-1 text-xs text-gray-500">
// //                 Link this item to a trip if you bought it during the trip
// //               </p>
// //             </div>

// //             {/* Image Upload */}
// //             <div className="mb-6">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Item Image <span className="text-gray-500 text-xs">(optional)</span>
// //               </label>
              
// //               {imagePreview ? (
// //                 <div className="relative">
// //                   <img
// //                     src={imagePreview}
// //                     alt="Preview"
// //                     className="w-full h-64 object-cover rounded-lg"
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       setImagePreview(null);
// //                       setFormData(prev => ({ ...prev, images: [] }));
// //                     }}
// //                     className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
// //                   >
// //                     <FiAlertCircle className="w-5 h-5" />
// //                   </button>
// //                 </div>
// //               ) : (
// //                 <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
// //                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
// //                     <FiImage className="w-12 h-12 text-gray-400 mb-3" />
// //                     <p className="mb-2 text-sm text-gray-500">
// //                       <span className="font-semibold">Click to upload</span> or drag and drop
// //                     </p>
// //                     <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
// //                   </div>
// //                   <input
// //                     type="file"
// //                     className="hidden"
// //                     accept="image/*"
// //                     onChange={handleImageChange}
// //                   />
// //                 </label>
// //               )}
              
// //               {errors.images && (
// //                 <p className="mt-1 text-sm text-red-600">{errors.images}</p>
// //               )}
// //             </div>

// //             {/* Info Box */}
// //             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
// //               <div className="flex gap-3">
// //                 <FiAlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
// //                 <div>
// //                   <h4 className="font-medium text-blue-900 mb-1">Listing Guidelines</h4>
// //                   <ul className="text-sm text-blue-800 space-y-1">
// //                     <li>• Be honest about item condition</li>
// //                     <li>• Price items fairly</li>
// //                     <li>• Provide clear photos and descriptions</li>
// //                     <li>• Respond promptly to buyer inquiries</li>
// //                   </ul>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Action Buttons */}
// //             <div className="flex gap-4">
// //               <Button
// //                 type="button"
// //                 variant="outline"
// //                 onClick={() => navigate('/marketplace')}
// //                 className="flex-1"
// //                 disabled={loading}
// //               >
// //                 Cancel
// //               </Button>
// //               <Button
// //                 type="submit"
// //                 variant="primary"
// //                 className="flex-1"
// //                 disabled={loading}
// //               >
// //                 {loading ? (
// //                   <>
// //                     <LoadingSpinner size="small" />
// //                     <span className="ml-2">Listing Item...</span>
// //                   </>
// //                 ) : (
// //                   'List Item'
// //                 )}
// //               </Button>
// //             </div>
// //           </Card>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CreateItemPage;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiShoppingBag, FiImage, FiDollarSign, FiTag, FiAlertCircle, FiMapPin, FiPackage, FiTruck, FiCalendar } from 'react-icons/fi';
// import Navbar from '../components/Navbar';
// import Button from '../components/Button';
// import Input from '../components/Input';
// import Card from '../components/Card';
// import LoadingSpinner from '../components/LoadingSpinner';
// import { marketplaceAPI, tripAPI } from '../services/api';
// import { ITEM_CATEGORIES, ITEM_CONDITIONS, DELIVERY_METHODS } from '../utils/constants';

// const CreateItemPage = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [trips, setTrips] = useState([]);
//   const [formData, setFormData] = useState({
//     // Basic info
//     name: '',
//     description: '',
//     category: '',
//     condition: 'New',
//     images: [],
    
//     // Location
//     acquiredFrom: '',
    
//     // Pricing
//     originalPrice: '',
//     deliveryCharge: '',
    
//     // Quantity
//     quantity: '',
    
//     // Delivery
//     estimatedDeliveryDate: '',
//     deliveryLocation: 'XYZ Office',
//     deliveryMethod: 'Office Delivery',
    
//     // Optional
//     trip: '',
//     expiryDate: '',
//     tags: []
//   });
//   const [errors, setErrors] = useState({});
//   const [imagePreview, setImagePreview] = useState(null);

//   // Fetch user's trips
//   useEffect(() => {
//     fetchTrips();
//     // Set default expiry date to 30 days from now
//     const defaultExpiry = new Date();
//     defaultExpiry.setDate(defaultExpiry.getDate() + 30);
//     setFormData(prev => ({
//       ...prev,
//       expiryDate: defaultExpiry.toISOString().split('T')[0]
//     }));
//     // Set default delivery date to 7 days from now
//     const defaultDelivery = new Date();
//     defaultDelivery.setDate(defaultDelivery.getDate() + 7);
//     setFormData(prev => ({
//       ...prev,
//       estimatedDeliveryDate: defaultDelivery.toISOString().split('T')[0]
//     }));
//   }, []);

//   const fetchTrips = async () => {
//     try {
//       const response = await tripAPI.getTrips();
//       if (response.success) {
//         setTrips(response.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching trips:', error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear error for this field
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         setErrors(prev => ({
//           ...prev,
//           images: 'Image size should be less than 5MB'
//         }));
//         return;
//       }

//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         setErrors(prev => ({
//           ...prev,
//           images: 'Please upload an image file'
//         }));
//         return;
//       }

//       // Create preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//         setFormData(prev => ({
//           ...prev,
//           images: [reader.result]
//         }));
//       };
//       reader.readAsDataURL(file);

//       // Clear error
//       setErrors(prev => ({
//         ...prev,
//         images: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = 'Item name is required';
//     }

//     if (!formData.description.trim()) {
//       newErrors.description = 'Description is required';
//     } else if (formData.description.length < 20) {
//       newErrors.description = 'Description should be at least 20 characters';
//     }

//     if (!formData.category) {
//       newErrors.category = 'Please select a category';
//     }

//     if (!formData.acquiredFrom.trim()) {
//       newErrors.acquiredFrom = 'Location where item was acquired is required';
//     }

//     if (!formData.originalPrice) {
//       newErrors.originalPrice = 'Original price is required';
//     } else if (parseFloat(formData.originalPrice) <= 0) {
//       newErrors.originalPrice = 'Price must be greater than 0';
//     }

//     if (!formData.deliveryCharge) {
//       newErrors.deliveryCharge = 'Delivery charge is required';
//     } else if (parseFloat(formData.deliveryCharge) < 0) {
//       newErrors.deliveryCharge = 'Delivery charge cannot be negative';
//     }

//     if (!formData.quantity) {
//       newErrors.quantity = 'Quantity is required';
//     } else if (parseInt(formData.quantity) < 1) {
//       newErrors.quantity = 'Quantity must be at least 1';
//     }

//     if (!formData.estimatedDeliveryDate) {
//       newErrors.estimatedDeliveryDate = 'Estimated delivery date is required';
//     }

//     if (!formData.expiryDate) {
//       newErrors.expiryDate = 'Expiry date is required';
//     }

//     if (!formData.condition) {
//       newErrors.condition = 'Please select item condition';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       setLoading(true);

//       // Prepare data in the CORRECT nested structure for backend
//       const itemData = {
//         // Optional trip reference
//         trip: formData.trip || undefined,
        
//         // Item details (NESTED)
//         itemDetails: {
//           name: formData.name.trim(),
//           description: formData.description.trim(),
//           category: formData.category,
//           images: formData.images.length > 0 ? formData.images : [],
//           condition: formData.condition
//         },
        
//         // Location (NESTED)
//         location: {
//           acquiredFrom: formData.acquiredFrom.trim()
//         },
        
//         // Pricing (NESTED)
//         pricing: {
//           originalPrice: parseFloat(formData.originalPrice),
//           deliveryCharge: parseFloat(formData.deliveryCharge)
//           // totalPrice will be auto-calculated by backend
//         },
        
//         // Quantity (NESTED)
//         quantity: {
//           available: parseInt(formData.quantity)
//         },
        
//         // Delivery (NESTED)
//         delivery: {
//           estimatedDeliveryDate: new Date(formData.estimatedDeliveryDate).toISOString(),
//           deliveryLocation: formData.deliveryLocation,
//           deliveryMethod: formData.deliveryMethod
//         },
        
//         // Expiry date
//         expiryDate: new Date(formData.expiryDate).toISOString(),
        
//         // Tags (optional)
//         tags: formData.tags || []
//       };

//       console.log('Creating item with data:', itemData);

//       const response = await marketplaceAPI.createItem(itemData);

//       if (response.success) {
//         alert('Item listed successfully! ✅');
//         navigate('/marketplace');
//       } else {
//         alert('Failed to list item: ' + (response.message || 'Please try again.'));
//       }
//     } catch (error) {
//       console.error('Error creating item:', error);
//       const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
//       alert('Error listing item: ' + errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate total price
//   const totalPrice = formData.originalPrice && formData.deliveryCharge
//     ? parseFloat(formData.originalPrice) + parseFloat(formData.deliveryCharge)
//     : 0;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
//             <FiShoppingBag className="text-green-600" />
//             List an Item
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Sell items from your trips to other colleagues
//           </p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit}>
//           <Card className="p-6">
//             {/* Item Name */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Item Name <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="e.g., Handmade wooden souvenirs from Goa"
//                 error={errors.name}
//               />
//             </div>

//             {/* Description */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Describe the item in detail..."
//                 rows={4}
//                 className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                   errors.description ? 'border-red-500' : 'border-gray-300'
//                 }`}
//               />
//               {errors.description && (
//                 <p className="mt-1 text-sm text-red-600">{errors.description}</p>
//               )}
//               <p className="mt-1 text-sm text-gray-500">
//                 {formData.description.length} characters (minimum 20)
//               </p>
//             </div>

//             {/* Category & Condition */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Category <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.category ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 >
//                   <option value="">Select category</option>
//                   {ITEM_CATEGORIES.map(cat => (
//                     <option key={cat} value={cat}>{cat}</option>
//                   ))}
//                 </select>
//                 {errors.category && (
//                   <p className="mt-1 text-sm text-red-600">{errors.category}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Condition <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="condition"
//                   value={formData.condition}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 >
//                   {ITEM_CONDITIONS.map(cond => (
//                     <option key={cond} value={cond}>{cond}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Location */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <FiMapPin className="inline w-4 h-4 mr-1" />
//                 Acquired From <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="acquiredFrom"
//                 value={formData.acquiredFrom}
//                 onChange={handleChange}
//                 placeholder="e.g., Goa, Panaji Market"
//                 error={errors.acquiredFrom}
//               />
//               <p className="mt-1 text-xs text-gray-500">
//                 Where did you buy this item?
//               </p>
//             </div>

//             {/* Pricing */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Original Price (₹) <span className="text-red-500">*</span>
//                 </label>
//                 <Input
//                   type="number"
//                   name="originalPrice"
//                   value={formData.originalPrice}
//                   onChange={handleChange}
//                   placeholder="500"
//                   icon={FiDollarSign}
//                   error={errors.originalPrice}
//                   min="0"
//                   step="1"
//                 />
//                 <p className="mt-1 text-xs text-gray-500">
//                   Price you paid for the item
//                 </p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Delivery Charge (₹) <span className="text-red-500">*</span>
//                 </label>
//                 <Input
//                   type="number"
//                   name="deliveryCharge"
//                   value={formData.deliveryCharge}
//                   onChange={handleChange}
//                   placeholder="50"
//                   icon={FiTag}
//                   error={errors.deliveryCharge}
//                   min="0"
//                   step="1"
//                 />
//                 <p className="mt-1 text-xs text-gray-500">
//                   Your delivery/handling charge
//                 </p>
//               </div>
//             </div>

//             {/* Total Price Display */}
//             {totalPrice > 0 && (
//               <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-700 font-medium">Total Price for Buyer:</span>
//                   <span className="text-2xl font-bold text-green-600">₹{totalPrice}</span>
//                 </div>
//                 <p className="text-xs text-gray-600 mt-1">
//                   Original Price + Delivery Charge
//                 </p>
//               </div>
//             )}

//             {/* Quantity */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <FiPackage className="inline w-4 h-4 mr-1" />
//                 Available Quantity <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 type="number"
//                 name="quantity"
//                 value={formData.quantity}
//                 onChange={handleChange}
//                 placeholder="5"
//                 error={errors.quantity}
//                 min="1"
//                 step="1"
//               />
//               <p className="mt-1 text-xs text-gray-500">
//                 How many units are available?
//               </p>
//             </div>

//             {/* Delivery Details */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <FiCalendar className="inline w-4 h-4 mr-1" />
//                   Estimated Delivery Date <span className="text-red-500">*</span>
//                 </label>
//                 <Input
//                   type="date"
//                   name="estimatedDeliveryDate"
//                   value={formData.estimatedDeliveryDate}
//                   onChange={handleChange}
//                   error={errors.estimatedDeliveryDate}
//                   min={new Date().toISOString().split('T')[0]}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <FiTruck className="inline w-4 h-4 mr-1" />
//                   Delivery Method <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="deliveryMethod"
//                   value={formData.deliveryMethod}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 >
//                   {DELIVERY_METHODS.map(method => (
//                     <option key={method} value={method}>{method}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Delivery Location */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Delivery Location <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="deliveryLocation"
//                 value={formData.deliveryLocation}
//                 onChange={handleChange}
//                 placeholder="XYZ Office"
//                 error={errors.deliveryLocation}
//               />
//             </div>

//             {/* Expiry Date */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Listing Expiry Date <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 type="date"
//                 name="expiryDate"
//                 value={formData.expiryDate}
//                 onChange={handleChange}
//                 error={errors.expiryDate}
//                 min={new Date().toISOString().split('T')[0]}
//               />
//               <p className="mt-1 text-xs text-gray-500">
//                 Item will be automatically delisted after this date
//               </p>
//             </div>

//             {/* Trip Reference */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Related Trip <span className="text-gray-500 text-xs">(optional)</span>
//               </label>
//               <select
//                 name="trip"
//                 value={formData.trip}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               >
//                 <option value="">Not related to any trip</option>
//                 {trips.map(trip => (
//                   <option key={trip._id} value={trip._id}>
//                     {trip.title} - {new Date(trip.startDate || trip.schedule?.startDate).toLocaleDateString()}
//                   </option>
//                 ))}
//               </select>
//               <p className="mt-1 text-xs text-gray-500">
//                 Link this item to a trip if you bought it during the trip
//               </p>
//             </div>

//             {/* Image Upload */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Item Image <span className="text-gray-500 text-xs">(optional)</span>
//               </label>
              
//               {imagePreview ? (
//                 <div className="relative">
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="w-full h-64 object-cover rounded-lg"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setImagePreview(null);
//                       setFormData(prev => ({ ...prev, images: [] }));
//                     }}
//                     className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
//                   >
//                     <FiAlertCircle className="w-5 h-5" />
//                   </button>
//                 </div>
//               ) : (
//                 <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
//                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                     <FiImage className="w-12 h-12 text-gray-400 mb-3" />
//                     <p className="mb-2 text-sm text-gray-500">
//                       <span className="font-semibold">Click to upload</span> or drag and drop
//                     </p>
//                     <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
//                   </div>
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                   />
//                 </label>
//               )}
              
//               {errors.images && (
//                 <p className="mt-1 text-sm text-red-600">{errors.images}</p>
//               )}
//             </div>

//             {/* Info Box */}
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//               <div className="flex gap-3">
//                 <FiAlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
//                 <div>
//                   <h4 className="font-medium text-blue-900 mb-1">Listing Guidelines</h4>
//                   <ul className="text-sm text-blue-800 space-y-1">
//                     <li>• Be honest about item condition</li>
//                     <li>• Price items fairly</li>
//                     <li>• Provide clear photos and descriptions</li>
//                     <li>• Respond promptly to buyer inquiries</li>
//                     <li>• Items will be paid Cash on Delivery</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => navigate('/marketplace')}
//                 className="flex-1"
//                 disabled={loading}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 variant="primary"
//                 className="flex-1"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <LoadingSpinner size="small" />
//                     <span className="ml-2">Listing Item...</span>
//                   </>
//                 ) : (
//                   'List Item'
//                 )}
//               </Button>
//             </div>
//           </Card>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateItemPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiImage, FiDollarSign, FiTag, FiAlertCircle, FiMapPin, FiPackage, FiTruck, FiCalendar } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { marketplaceAPI, tripAPI } from '../services/api';
import { ITEM_CATEGORIES, ITEM_CONDITIONS, DELIVERY_METHODS } from '../utils/constants';

const CreateItemPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [formData, setFormData] = useState({
    // Basic info
    name: '',
    description: '',
    category: '',
    condition: 'New',
    images: [],
    
    // Location
    acquiredFrom: '',
    
    // Pricing
    originalPrice: '',
    deliveryCharge: '',
    
    // Quantity
    quantity: '',
    
    // Delivery
    estimatedDeliveryDate: '',
    deliveryLocation: 'XYZ Office',
    deliveryMethod: 'Office Delivery',
    
    // Optional
    trip: '',
    expiryDate: '',
    tags: []
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch user's trips
  useEffect(() => {
    fetchTrips();
    // Set default expiry date to 30 days from now
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 30);
    setFormData(prev => ({
      ...prev,
      expiryDate: defaultExpiry.toISOString().split('T')[0]
    }));
    // Set default delivery date to 7 days from now
    const defaultDelivery = new Date();
    defaultDelivery.setDate(defaultDelivery.getDate() + 7);
    setFormData(prev => ({
      ...prev,
      estimatedDeliveryDate: defaultDelivery.toISOString().split('T')[0]
    }));
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await tripAPI.getTrips();
      if (response.success) {
        setTrips(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          images: 'Image size should be less than 5MB'
        }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          images: 'Please upload an image file'
        }));
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          images: [reader.result]
        }));
      };
      reader.readAsDataURL(file);

      // Clear error
      setErrors(prev => ({
        ...prev,
        images: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.acquiredFrom.trim()) {
      newErrors.acquiredFrom = 'Location where item was acquired is required';
    }

    if (!formData.originalPrice) {
      newErrors.originalPrice = 'Original price is required';
    } else if (parseFloat(formData.originalPrice) <= 0) {
      newErrors.originalPrice = 'Price must be greater than 0';
    }

    if (!formData.deliveryCharge) {
      newErrors.deliveryCharge = 'Delivery charge is required';
    } else if (parseFloat(formData.deliveryCharge) < 0) {
      newErrors.deliveryCharge = 'Delivery charge cannot be negative';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (parseInt(formData.quantity) < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }

    if (!formData.estimatedDeliveryDate) {
      newErrors.estimatedDeliveryDate = 'Estimated delivery date is required';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }

    if (!formData.condition) {
      newErrors.condition = 'Please select item condition';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Prepare data in the CORRECT nested structure for backend
      const itemData = {
        // Optional trip reference
        trip: formData.trip || undefined,
        
        // Item details (NESTED)
        itemDetails: {
          name: formData.name.trim(),
          description: formData.description.trim(),
          category: formData.category,
          images: formData.images.length > 0 ? formData.images : [],
          condition: formData.condition
        },
        
        // Location (NESTED)
        location: {
          acquiredFrom: formData.acquiredFrom.trim()
        },
        
        // Pricing (NESTED)
        pricing: {
          originalPrice: parseFloat(formData.originalPrice),
          deliveryCharge: parseFloat(formData.deliveryCharge)
          // totalPrice will be auto-calculated by backend
        },
        
        // Quantity (NESTED)
        quantity: {
          available: parseInt(formData.quantity)
        },
        
        // Delivery (NESTED)
        delivery: {
          estimatedDeliveryDate: new Date(formData.estimatedDeliveryDate).toISOString(),
          deliveryLocation: formData.deliveryLocation,
          deliveryMethod: formData.deliveryMethod
        },
        
        // Expiry date
        expiryDate: new Date(formData.expiryDate).toISOString(),
        
        // Tags (optional)
        tags: formData.tags || []
      };

      console.log('Creating item with data:', itemData);

      const response = await marketplaceAPI.createItem(itemData);

      if (response.success) {
        alert('Item listed successfully! ✅');
        navigate('/marketplace');
      } else {
        alert('Failed to list item: ' + (response.message || 'Please try again.'));
      }
    } catch (error) {
      console.error('Error creating item:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert('Error listing item: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total price
  const totalPrice = formData.originalPrice && formData.deliveryCharge
    ? parseFloat(formData.originalPrice) + parseFloat(formData.deliveryCharge)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FiShoppingBag className="text-green-600" />
            List an Item
          </h1>
          <p className="text-gray-600 mt-1">
            Sell items from your trips to other colleagues
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="p-6">
            {/* Item Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Handmade wooden souvenirs from Goa"
                error={errors.name}
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the item in detail..."
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.description.length} characters (minimum 20)
              </p>
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  {ITEM_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {ITEM_CONDITIONS.map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiMapPin className="inline w-4 h-4 mr-1" />
                Acquired From <span className="text-red-500">*</span>
              </label>
              <Input
                name="acquiredFrom"
                value={formData.acquiredFrom}
                onChange={handleChange}
                placeholder="e.g., Goa, Panaji Market"
                error={errors.acquiredFrom}
              />
              <p className="mt-1 text-xs text-gray-500">
                Where did you buy this item?
              </p>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price (₹) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="500"
                  icon={FiDollarSign}
                  error={errors.originalPrice}
                  min="0"
                  step="1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Price you paid for the item
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Charge (₹) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="deliveryCharge"
                  value={formData.deliveryCharge}
                  onChange={handleChange}
                  placeholder="50"
                  icon={FiTag}
                  error={errors.deliveryCharge}
                  min="0"
                  step="1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Your delivery/handling charge
                </p>
              </div>
            </div>

            {/* Total Price Display */}
            {totalPrice > 0 && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Total Price for Buyer:</span>
                  <span className="text-2xl font-bold text-green-600">₹{totalPrice}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Original Price + Delivery Charge
                </p>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiPackage className="inline w-4 h-4 mr-1" />
                Available Quantity <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="5"
                error={errors.quantity}
                min="1"
                step="1"
              />
              <p className="mt-1 text-xs text-gray-500">
                How many units are available?
              </p>
            </div>

            {/* Delivery Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline w-4 h-4 mr-1" />
                  Estimated Delivery Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  name="estimatedDeliveryDate"
                  value={formData.estimatedDeliveryDate}
                  onChange={handleChange}
                  error={errors.estimatedDeliveryDate}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiTruck className="inline w-4 h-4 mr-1" />
                  Delivery Method <span className="text-red-500">*</span>
                </label>
                <select
                  name="deliveryMethod"
                  value={formData.deliveryMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {DELIVERY_METHODS.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Delivery Location */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Location <span className="text-red-500">*</span>
              </label>
              <Input
                name="deliveryLocation"
                value={formData.deliveryLocation}
                onChange={handleChange}
                placeholder="XYZ Office"
                error={errors.deliveryLocation}
              />
            </div>

            {/* Expiry Date */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Listing Expiry Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                error={errors.expiryDate}
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="mt-1 text-xs text-gray-500">
                Item will be automatically delisted after this date
              </p>
            </div>

            {/* Trip Reference */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related Trip <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <select
                name="trip"
                value={formData.trip}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Not related to any trip</option>
                {trips.map(trip => (
                  <option key={trip._id} value={trip._id}>
                    {trip.title} - {new Date(trip.startDate || trip.schedule?.startDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Link this item to a trip if you bought it during the trip
              </p>
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Image <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, images: [] }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  >
                    <FiAlertCircle className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiImage className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
              
              {errors.images && (
                <p className="mt-1 text-sm text-red-600">{errors.images}</p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <FiAlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Listing Guidelines</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Be honest about item condition</li>
                    <li>• Price items fairly</li>
                    <li>• Provide clear photos and descriptions</li>
                    <li>• Respond promptly to buyer inquiries</li>
                    <li>• Items will be paid Cash on Delivery</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/marketplace')}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Listing Item...</span>
                  </>
                ) : (
                  'List Item'
                )}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default CreateItemPage;