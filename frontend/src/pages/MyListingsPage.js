

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiPackage, FiPlus, FiClock, FiCheck, FiX, FiEdit, FiTrash2, FiMessageSquare } from 'react-icons/fi';
// import Navbar from '../components/Navbar';
// import Button from '../components/Button';
// import Badge from '../components/Badge';
// import LoadingSpinner from '../components/LoadingSpinner';
// import EditItemModal from '../components/EditItemModal';
// import { marketplaceAPI } from '../services/api';

// const MyListingsPage = () => {
//   const navigate = useNavigate();
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [processingOrder, setProcessingOrder] = useState(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [itemToEdit, setItemToEdit] = useState(null);

//   useEffect(() => {
//     fetchMyItems();
//   }, []);

//   const fetchMyItems = async () => {
//     try {
//       setLoading(true);
//       const response = await marketplaceAPI.getMyItems();
      
//       if (response.success) {
//         setItems(response.items || []);
//       } else {
//         alert('Failed to fetch your listings');
//       }
//     } catch (error) {
//       console.error('Error fetching items:', error);
//       alert('Error loading listings: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOrderAction = async (itemId, orderId, action) => {
//     if (processingOrder) return;

//     const confirmMessage = action === 'confirmed' 
//       ? 'Accept this order?' 
//       : action === 'delivered'
//       ? 'Mark this order as delivered?'
//       : 'Reject this order?';

//     if (!window.confirm(confirmMessage)) return;

//     try {
//       setProcessingOrder(orderId);
//       const response = await marketplaceAPI.updateOrderStatus(itemId, orderId, action);

//       if (response.success) {
//         alert(`Order ${action} successfully!`);
//         fetchMyItems(); // Refresh
//       } else {
//         alert(response.message || `Failed to ${action} order`);
//       }
//     } catch (error) {
//       console.error('Error updating order:', error);
//       alert('Error updating order: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setProcessingOrder(null);
//     }
//   };

//   const handleEditItem = (item) => {
//     setItemToEdit(item);
//     setIsEditModalOpen(true);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//     setItemToEdit(null);
//   };

//   const handleUpdateItem = async (itemId, updateData) => {
//     try {
//       const response = await marketplaceAPI.updateItem(itemId, updateData);

//       if (response.success) {
//         alert('Item updated successfully!');
//         handleCloseEditModal();
//         fetchMyItems(); // Refresh items
//       } else {
//         alert(response.message || 'Failed to update item');
//       }
//     } catch (error) {
//       console.error('Error updating item:', error);
//       throw error; // Re-throw to be handled by modal
//     }
//   };

//   const handleDeleteItem = async (itemId) => {
//     if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) return;

//     try {
//       const response = await marketplaceAPI.deleteItem(itemId);

//       if (response.success) {
//         alert('Item deleted successfully!');
//         // Remove the item from the list immediately
//         setItems(prevItems => prevItems.filter(item => item._id !== itemId));
//       } else {
//         alert(response.message || 'Failed to delete item');
//       }
//     } catch (error) {
//       console.error('Error deleting item:', error);
//       alert('Error deleting item: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   const handleChatWithBuyer = (buyer) => {
//     navigate(`/chat?userId=${buyer._id}`);
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(price);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', { 
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       'pending': 'yellow',
//       'confirmed': 'blue',
//       'delivered': 'green',
//       'cancelled': 'red'
//     };
//     return colors[status] || 'gray';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />
//         <div className="flex items-center justify-center h-96">
//           <LoadingSpinner size="large" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
//               <FiPackage className="text-green-600" />
//               My Listings
//             </h1>
//             <p className="text-gray-600 mt-1">
//               Manage your items and orders
//             </p>
//           </div>
//           <Button
//             variant="primary"
//             onClick={() => navigate('/marketplace/create')}
//             icon={FiPlus}
//           >
//             List New Item
//           </Button>
//         </div>

//         {/* Items List */}
//         {items.length === 0 ? (
//           <div className="text-center py-12">
//             <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
//             <h3 className="mt-2 text-lg font-medium text-gray-900">No listings yet</h3>
//             <p className="mt-1 text-gray-500">Start selling items from your trips!</p>
//             <Button
//               variant="primary"
//               onClick={() => navigate('/marketplace/create')}
//               className="mt-4"
//               icon={FiPlus}
//             >
//               Create First Listing
//             </Button>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {items.map(item => (
//               <div key={item._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
//                 {/* Item Header */}
//                 <div className="p-6 border-b border-gray-200">
//                   <div className="flex items-start gap-4">
//                     {/* Item Image */}
//                     <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
//                       {item.itemDetails?.images && item.itemDetails.images.length > 0 ? (
//                         <img 
//                           src={item.itemDetails.images[0]} 
//                           alt={item.itemDetails?.name}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
//                           <FiPackage className="w-10 h-10 text-green-600" />
//                         </div>
//                       )}
//                     </div>

//                     {/* Item Info */}
//                     <div className="flex-1">
//                       <div className="flex items-start justify-between">
//                         <div>
//                           <h3 className="text-xl font-bold text-gray-900">
//                             {item.itemDetails?.name}
//                           </h3>
//                           <p className="text-gray-600 text-sm mt-1">
//                             {item.itemDetails?.description}
//                           </p>
//                           <div className="flex items-center gap-4 mt-2">
//                             <Badge color="blue">{item.itemDetails?.category}</Badge>
//                             <Badge color={item.status === 'available' ? 'green' : 'red'}>
//                               {item.status.toUpperCase().replace('_', ' ')}
//                             </Badge>
//                             <span className="text-sm text-gray-600">
//                               {item.quantity.available - item.quantity.sold} / {item.quantity.available} available
//                             </span>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-2xl font-bold text-green-600">
//                             {formatPrice(item.pricing?.totalPrice)}
//                           </div>
//                           <div className="text-sm text-gray-500 mt-1">
//                             Listed {formatDate(item.createdAt)}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleEditItem(item)}
//                         className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
//                         title="Edit Item"
//                       >
//                         <FiEdit className="w-4 h-4" />
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteItem(item._id)}
//                         className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm"
//                         title="Delete Item"
//                       >
//                         <FiTrash2 className="w-4 h-4" />
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Orders Section */}
//                 {item.orders && item.orders.length > 0 && (
//                   <div className="p-6 bg-gray-50">
//                     <h4 className="font-semibold text-gray-900 mb-4">
//                       Orders ({item.orders.length})
//                     </h4>
//                     <div className="space-y-4">
//                       {item.orders.map(order => (
//                         <div 
//                           key={order._id} 
//                           className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//                         >
//                           <div className="flex items-start justify-between gap-4">
//                             {/* Left Side - Order Info */}
//                             <div className="flex-1">
//                               {/* Buyer Info */}
//                               <div className="flex items-center gap-3 mb-3">
//                                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
//                                   <span className="text-green-600 font-bold">
//                                     {order.buyer?.name?.charAt(0)}
//                                   </span>
//                                 </div>
//                                 <div>
//                                   <div className="font-semibold text-gray-900">
//                                     {order.buyer?.name}
//                                   </div>
//                                   <div className="text-xs text-gray-600">
//                                     {order.buyer?.email}
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* Order Details */}
//                               <div className="flex items-center gap-6 text-sm mb-2">
//                                 <div>
//                                   <span className="text-gray-600">Quantity:</span>
//                                   <span className="ml-2 font-semibold text-gray-900">
//                                     {order.quantity}
//                                   </span>
//                                 </div>
//                                 <div>
//                                   <span className="text-gray-600">Amount:</span>
//                                   <span className="ml-2 font-semibold text-green-600">
//                                     {formatPrice(order.totalAmount)}
//                                   </span>
//                                 </div>
//                                 <div>
//                                   <span className="text-gray-600">Ordered:</span>
//                                   <span className="ml-2 font-medium text-gray-900">
//                                     {formatDate(order.orderedAt)}
//                                   </span>
//                                 </div>
//                               </div>

//                               {/* Delivery Notes */}
//                               {order.deliveryNotes && (
//                                 <div className="bg-blue-50 border border-blue-100 rounded px-3 py-2 text-sm">
//                                   <span className="font-medium text-blue-900">Notes:</span>
//                                   <span className="ml-2 text-blue-800">{order.deliveryNotes}</span>
//                                 </div>
//                               )}
//                             </div>

//                             {/* Right Side - Status & Action Buttons */}
//                             <div className="flex flex-col items-end gap-2 min-w-[140px]">
//                               <Badge color={getStatusColor(order.status)} className="text-xs px-3 py-1">
//                                 {order.status.toUpperCase()}
//                               </Badge>

//                               {order.status === 'pending' && (
//                                 <>
//                                   <button
//                                     onClick={() => handleOrderAction(item._id, order._id, 'confirmed')}
//                                     disabled={processingOrder === order._id}
//                                     className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                   >
//                                     <FiCheck className="w-4 h-4" />
//                                     {processingOrder === order._id ? 'Processing...' : 'Accept'}
//                                   </button>
//                                   <button
//                                     onClick={() => handleOrderAction(item._id, order._id, 'cancelled')}
//                                     disabled={processingOrder === order._id}
//                                     className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                   >
//                                     <FiX className="w-4 h-4" />
//                                     Reject
//                                   </button>
//                                 </>
//                               )}

//                               {order.status === 'confirmed' && (
//                                 <button
//                                   onClick={() => handleOrderAction(item._id, order._id, 'delivered')}
//                                   disabled={processingOrder === order._id}
//                                   className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                   <FiCheck className="w-4 h-4" />
//                                   {processingOrder === order._id ? 'Processing...' : 'Mark Delivered'}
//                                 </button>
//                               )}

//                               <button
//                                 onClick={() => handleChatWithBuyer(order.buyer)}
//                                 className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
//                               >
//                                 <FiMessageSquare className="w-4 h-4" />
//                                 Chat
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* No Orders Message */}
//                 {(!item.orders || item.orders.length === 0) && (
//                   <div className="p-6 bg-gray-50 text-center">
//                     <FiClock className="mx-auto h-8 w-8 text-gray-400" />
//                     <p className="text-gray-600 text-sm mt-2">No orders yet</p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Edit Item Modal */}
//       {isEditModalOpen && itemToEdit && (
//         <EditItemModal
//           item={itemToEdit}
//           isOpen={isEditModalOpen}
//           onClose={handleCloseEditModal}
//           onSave={handleUpdateItem}
//         />
//       )}
//     </div>
//   );
// };

// export default MyListingsPage;
























// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiPackage, FiPlus, FiClock, FiCheck, FiX, FiEdit, FiTrash2, FiMessageSquare } from 'react-icons/fi';
// import Navbar from '../components/Navbar';
// import Button from '../components/Button';
// import Badge from '../components/Badge';
// import LoadingSpinner from '../components/LoadingSpinner';
// import EditItemModal from '../components/EditItemModal';
// import { marketplaceAPI } from '../services/api';

// const MyListingsPage = () => {
//   const navigate = useNavigate();
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [processingOrder, setProcessingOrder] = useState(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [itemToEdit, setItemToEdit] = useState(null);
//   const [deletingItem, setDeletingItem] = useState(null);

//   useEffect(() => {
//     fetchMyItems();
//   }, []);

//   const fetchMyItems = async () => {
//     try {
//       setLoading(true);
//       const response = await marketplaceAPI.getMyItems();
      
//       if (response.success) {
//         setItems(response.items || []);
//       } else {
//         alert('Failed to fetch your listings');
//       }
//     } catch (error) {
//       console.error('Error fetching items:', error);
//       alert('Error loading listings: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOrderAction = async (itemId, orderId, action) => {
//     if (processingOrder) return;

//     const confirmMessage = action === 'confirmed' 
//       ? 'Accept this order?' 
//       : action === 'delivered'
//       ? 'Mark this order as delivered?'
//       : 'Reject this order?';

//     if (!window.confirm(confirmMessage)) return;

//     try {
//       setProcessingOrder(orderId);
//       const response = await marketplaceAPI.updateOrderStatus(itemId, orderId, action);

//       if (response.success) {
//         alert(`Order ${action} successfully!`);
//         fetchMyItems();
//       } else {
//         alert(response.message || `Failed to ${action} order`);
//       }
//     } catch (error) {
//       console.error('Error updating order:', error);
//       alert('Error updating order: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setProcessingOrder(null);
//     }
//   };

//   const handleEditItem = (item) => {
//     setItemToEdit(item);
//     setIsEditModalOpen(true);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//     setItemToEdit(null);
//   };

//   const handleUpdateItem = async (itemId, updateData) => {
//     try {
//       const response = await marketplaceAPI.updateItem(itemId, updateData);

//       if (response.success) {
//         alert('Item updated successfully!');
//         handleCloseEditModal();
//         fetchMyItems();
//       } else {
//         alert(response.message || 'Failed to update item');
//       }
//     } catch (error) {
//       console.error('Error updating item:', error);
//       throw error;
//     }
//   };

//   const handleDeleteItem = async (itemId) => {
//     if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) return;

//     try {
//       setDeletingItem(itemId);
//       const response = await marketplaceAPI.deleteItem(itemId);

//       if (response.success) {
//         alert('Item deleted successfully!');
//         // Remove from UI immediately
//         setItems(prevItems => prevItems.filter(item => item._id !== itemId));
//       } else {
//         alert(response.message || 'Failed to delete item');
//       }
//     } catch (error) {
//       console.error('Error deleting item:', error);
//       alert('Error deleting item: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setDeletingItem(null);
//     }
//   };

//   const handleChatWithBuyer = (buyer) => {
//     navigate(`/chat?userId=${buyer._id}`);
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(price);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', { 
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       'pending': 'yellow',
//       'confirmed': 'blue',
//       'delivered': 'green',
//       'cancelled': 'red'
//     };
//     return colors[status] || 'gray';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />
//         <div className="flex items-center justify-center h-96">
//           <LoadingSpinner size="large" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
//         {/* Header - Responsive */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
//               <FiPackage className="text-green-600" />
//               My Listings
//             </h1>
//             <p className="text-sm sm:text-base text-gray-600 mt-1">
//               Manage your items and orders
//             </p>
//           </div>
//           <Button
//             variant="primary"
//             onClick={() => navigate('/marketplace/create')}
//             icon={FiPlus}
//             className="w-full sm:w-auto"
//           >
//             List New Item
//           </Button>
//         </div>

//         {/* Items List */}
//         {items.length === 0 ? (
//           <div className="text-center py-12">
//             <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
//             <h3 className="mt-2 text-lg font-medium text-gray-900">No listings yet</h3>
//             <p className="mt-1 text-gray-500">Start selling items from your trips!</p>
//             <Button
//               variant="primary"
//               onClick={() => navigate('/marketplace/create')}
//               className="mt-4"
//               icon={FiPlus}
//             >
//               Create First Listing
//             </Button>
//           </div>
//         ) : (
//           <div className="space-y-4 sm:space-y-6">
//             {items.map(item => (
//               <div key={item._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
//                 {/* Item Header - Responsive */}
//                 <div className="p-4 sm:p-6 border-b border-gray-200">
//                   <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
//                     {/* Item Image */}
//                     <div className="w-full sm:w-20 h-32 sm:h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
//                       {item.itemDetails?.images && item.itemDetails.images.length > 0 ? (
//                         <img 
//                           src={item.itemDetails.images[0]} 
//                           alt={item.itemDetails?.name}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
//                           <FiPackage className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
//                         </div>
//                       )}
//                     </div>

//                     {/* Item Info - Responsive */}
//                     <div className="flex-1 min-w-0 w-full">
//                       <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
//                         <div className="flex-1 min-w-0">
//                           <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
//                             {item.itemDetails?.name}
//                           </h3>
//                           <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                             {item.itemDetails?.description}
//                           </p>
//                           <div className="flex flex-wrap items-center gap-2 mt-2">
//                             <Badge color="blue" className="text-xs">{item.itemDetails?.category}</Badge>
//                             <Badge color={item.status === 'available' ? 'green' : 'red'} className="text-xs">
//                               {item.status.toUpperCase().replace('_', ' ')}
//                             </Badge>
//                             <span className="text-xs sm:text-sm text-gray-600">
//                               {item.quantity.available - item.quantity.sold} / {item.quantity.available} available
//                             </span>
//                           </div>
//                         </div>
//                         <div className="text-left sm:text-right flex-shrink-0">
//                           <div className="text-xl sm:text-2xl font-bold text-green-600">
//                             {formatPrice(item.pricing?.totalPrice)}
//                           </div>
//                           <div className="text-xs sm:text-sm text-gray-500 mt-1">
//                             Listed {formatDate(item.createdAt)}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Actions - Responsive */}
//                     <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
//                       <button
//                         onClick={() => handleEditItem(item)}
//                         className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
//                         title="Edit Item"
//                       >
//                         <FiEdit className="w-4 h-4" />
//                         <span className="sm:inline">Edit</span>
//                       </button>
//                       <button
//                         onClick={() => handleDeleteItem(item._id)}
//                         disabled={deletingItem === item._id}
//                         className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                         title="Delete Item"
//                       >
//                         <FiTrash2 className="w-4 h-4" />
//                         <span className="sm:inline">{deletingItem === item._id ? 'Deleting...' : 'Delete'}</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Orders Section - Responsive */}
//                 {item.orders && item.orders.length > 0 && (
//                   <div className="p-4 sm:p-6 bg-gray-50">
//                     <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
//                       Orders ({item.orders.length})
//                     </h4>
//                     <div className="space-y-3 sm:space-y-4">
//                       {item.orders.map(order => (
//                         <div 
//                           key={order._id} 
//                           className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//                         >
//                           <div className="flex flex-col gap-3 sm:gap-4">
//                             {/* Buyer Info - Responsive */}
//                             <div className="flex items-center gap-2 sm:gap-3">
//                               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
//                                 <span className="text-green-600 font-bold text-sm sm:text-base">
//                                   {order.buyer?.name?.charAt(0)}
//                                 </span>
//                               </div>
//                               <div className="flex-1 min-w-0">
//                                 <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">
//                                   {order.buyer?.name}
//                                 </div>
//                                 <div className="text-xs text-gray-600 truncate">
//                                   {order.buyer?.email}
//                                 </div>
//                               </div>
//                               <Badge color={getStatusColor(order.status)} className="text-xs flex-shrink-0">
//                                 {order.status.toUpperCase()}
//                               </Badge>
//                             </div>

//                             {/* Order Details - Responsive Grid */}
//                             <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm">
//                               <div>
//                                 <span className="text-gray-600">Qty:</span>
//                                 <span className="ml-1 sm:ml-2 font-semibold text-gray-900">
//                                   {order.quantity}
//                                 </span>
//                               </div>
//                               <div>
//                                 <span className="text-gray-600">Amount:</span>
//                                 <span className="ml-1 sm:ml-2 font-semibold text-green-600">
//                                   {formatPrice(order.totalAmount)}
//                                 </span>
//                               </div>
//                               <div className="col-span-2 sm:col-span-1">
//                                 <span className="text-gray-600">Ordered:</span>
//                                 <span className="ml-1 sm:ml-2 font-medium text-gray-900">
//                                   {formatDate(order.orderedAt)}
//                                 </span>
//                               </div>
//                             </div>

//                             {/* Delivery Notes */}
//                             {order.deliveryNotes && (
//                               <div className="bg-blue-50 border border-blue-100 rounded px-2 sm:px-3 py-2 text-xs sm:text-sm">
//                                 <span className="font-medium text-blue-900">Notes:</span>
//                                 <span className="ml-2 text-blue-800">{order.deliveryNotes}</span>
//                               </div>
//                             )}

//                             {/* Action Buttons - Responsive */}
//                             <div className="flex flex-wrap gap-2">
//                               {order.status === 'pending' && (
//                                 <>
//                                   <button
//                                     onClick={() => handleOrderAction(item._id, order._id, 'confirmed')}
//                                     disabled={processingOrder === order._id}
//                                     className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                   >
//                                     <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
//                                     {processingOrder === order._id ? 'Processing...' : 'Accept'}
//                                   </button>
//                                   <button
//                                     onClick={() => handleOrderAction(item._id, order._id, 'cancelled')}
//                                     disabled={processingOrder === order._id}
//                                     className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                   >
//                                     <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
//                                     Reject
//                                   </button>
//                                 </>
//                               )}

//                               {order.status === 'confirmed' && (
//                                 <button
//                                   onClick={() => handleOrderAction(item._id, order._id, 'delivered')}
//                                   disabled={processingOrder === order._id}
//                                   className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                   <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
//                                   {processingOrder === order._id ? 'Processing...' : 'Mark Delivered'}
//                                 </button>
//                               )}

//                               <button
//                                 onClick={() => handleChatWithBuyer(order.buyer)}
//                                 className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
//                               >
//                                 <FiMessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
//                                 Chat
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* No Orders Message */}
//                 {(!item.orders || item.orders.length === 0) && (
//                   <div className="p-4 sm:p-6 bg-gray-50 text-center">
//                     <FiClock className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
//                     <p className="text-gray-600 text-xs sm:text-sm mt-2">No orders yet</p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Edit Item Modal */}
//       {isEditModalOpen && itemToEdit && (
//         <EditItemModal
//           item={itemToEdit}
//           isOpen={isEditModalOpen}
//           onClose={handleCloseEditModal}
//           onSave={handleUpdateItem}
//         />
//       )}
//     </div>
//   );
// };

// export default MyListingsPage;

























import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiPlus, FiClock, FiCheck, FiX, FiEdit, FiTrash2, FiMessageSquare, FiChevronDown, FiChevronUp, FiBell } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import EditItemModal from '../components/EditItemModal';
import { marketplaceAPI } from '../services/api';

const MyListingsPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({}); // NEW: Track expanded orders
  const [unreadOrderCounts, setUnreadOrderCounts] = useState({}); // NEW: Track unread orders

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      const response = await marketplaceAPI.getMyItems();
      
      if (response.success) {
        const itemsData = response.items || [];
        setItems(itemsData);
        
        // NEW: Calculate unread orders for each item
        const unreadCounts = {};
        itemsData.forEach(item => {
          const pendingOrders = item.orders?.filter(order => 
            order.status === 'pending'
          ).length || 0;
          unreadCounts[item._id] = pendingOrders;
        });
        setUnreadOrderCounts(unreadCounts);
      } else {
        alert('Failed to fetch your listings');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Error loading listings: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (itemId, orderId, action) => {
    if (processingOrder) return;

    const confirmMessage = action === 'confirmed' 
      ? 'Accept this order?' 
      : action === 'delivered'
      ? 'Mark this order as delivered?'
      : 'Reject this order?';

    if (!window.confirm(confirmMessage)) return;

    try {
      setProcessingOrder(orderId);
      const response = await marketplaceAPI.updateOrderStatus(itemId, orderId, action);

      if (response.success) {
        alert(`Order ${action} successfully!`);
        fetchMyItems();
      } else {
        alert(response.message || `Failed to ${action} order`);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessingOrder(null);
    }
  };

  const handleEditItem = (item) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setItemToEdit(null);
  };

  const handleUpdateItem = async (itemId, updateData) => {
    try {
      const response = await marketplaceAPI.updateItem(itemId, updateData);

      if (response.success) {
        alert('Item updated successfully!');
        handleCloseEditModal();
        fetchMyItems();
      } else {
        alert(response.message || 'Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) return;

    try {
      setDeletingItem(itemId);
      const response = await marketplaceAPI.deleteItem(itemId);

      if (response.success) {
        alert('Item deleted successfully!');
        setItems(prevItems => prevItems.filter(item => item._id !== itemId));
      } else {
        alert(response.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item: ' + (error.response?.data?.message || error.message));
    } finally {
      setDeletingItem(null);
    }
  };

  const handleChatWithBuyer = (buyer) => {
    navigate(`/chat?userId=${buyer._id}`);
  };

  // NEW: Toggle orders section
  const toggleOrders = (itemId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
    
    // Mark orders as "read" when expanded
    if (!expandedOrders[itemId]) {
      setUnreadOrderCounts(prev => ({
        ...prev,
        [itemId]: 0
      }));
    }
  };

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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FiPackage className="text-green-600" />
              My Listings
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage your items and orders
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/marketplace/create')}
            icon={FiPlus}
            className="w-full sm:w-auto"
          >
            List New Item
          </Button>
        </div>

        {/* Items List */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No listings yet</h3>
            <p className="mt-1 text-gray-500">Start selling items from your trips!</p>
            <Button
              variant="primary"
              onClick={() => navigate('/marketplace/create')}
              className="mt-4"
              icon={FiPlus}
            >
              Create First Listing
            </Button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {items.map(item => {
              const ordersCount = item.orders?.length || 0;
              const isExpanded = expandedOrders[item._id];
              const unreadCount = unreadOrderCounts[item._id] || 0;

              return (
                <div key={item._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Item Header - Responsive */}
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      {/* Item Image */}
                      <div className="w-full sm:w-20 h-32 sm:h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.itemDetails?.images && item.itemDetails.images.length > 0 ? (
                          <img 
                            src={item.itemDetails.images[0]} 
                            alt={item.itemDetails?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                            <FiPackage className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                          </div>
                        )}
                      </div>

                      {/* Item Info - Responsive */}
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                              {item.itemDetails?.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {item.itemDetails?.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge color="blue" className="text-xs">{item.itemDetails?.category}</Badge>
                              <Badge color={item.status === 'available' ? 'green' : 'red'} className="text-xs">
                                {item.status.toUpperCase().replace('_', ' ')}
                              </Badge>
                              <span className="text-xs sm:text-sm text-gray-600">
                                {item.quantity.available - item.quantity.sold} / {item.quantity.available} available
                              </span>
                            </div>
                          </div>
                          <div className="text-left sm:text-right flex-shrink-0">
                            <div className="text-xl sm:text-2xl font-bold text-green-600">
                              {formatPrice(item.pricing?.totalPrice)}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 mt-1">
                              Listed {formatDate(item.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions - Responsive */}
                      <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                          title="Edit Item"
                        >
                          <FiEdit className="w-4 h-4" />
                          <span className="sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          disabled={deletingItem === item._id}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Item"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          <span className="sm:inline">{deletingItem === item._id ? 'Deleting...' : 'Delete'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* NEW: Collapsible Orders Section */}
                  {ordersCount > 0 ? (
                    <div className="border-t border-gray-200">
                      {/* Orders Header - Clickable */}
                      <button
                        onClick={() => toggleOrders(item._id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900 text-sm sm:text-base">
                            Orders ({ordersCount})
                          </span>
                          
                          {/* NEW: Notification Badge */}
                          {unreadCount > 0 && !isExpanded && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-red-100 rounded-full">
                              <FiBell className="w-4 h-4 text-red-600" />
                              <span className="text-sm font-semibold text-red-600">
                                {unreadCount} new
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Arrow Icon */}
                        {isExpanded ? (
                          <FiChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <FiChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </button>

                      {/* Orders List - Collapsible */}
                      {isExpanded && (
                        <div className="p-4 sm:p-6 bg-gray-50">
                          <div className="space-y-3 sm:space-y-4">
                            {item.orders.map(order => (
                              <div 
                                key={order._id} 
                                className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex flex-col gap-3 sm:gap-4">
                                  {/* Buyer Info - Responsive */}
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="text-green-600 font-bold text-sm sm:text-base">
                                        {order.buyer?.name?.charAt(0)}
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                        {order.buyer?.name}
                                      </div>
                                      <div className="text-xs text-gray-600 truncate">
                                        {order.buyer?.email}
                                      </div>
                                    </div>
                                    <Badge color={getStatusColor(order.status)} className="text-xs flex-shrink-0">
                                      {order.status.toUpperCase()}
                                    </Badge>
                                  </div>

                                  {/* Order Details - Responsive Grid */}
                                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm">
                                    <div>
                                      <span className="text-gray-600">Qty:</span>
                                      <span className="ml-1 sm:ml-2 font-semibold text-gray-900">
                                        {order.quantity}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Amount:</span>
                                      <span className="ml-1 sm:ml-2 font-semibold text-green-600">
                                        {formatPrice(order.totalAmount)}
                                      </span>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                      <span className="text-gray-600">Ordered:</span>
                                      <span className="ml-1 sm:ml-2 font-medium text-gray-900">
                                        {formatDate(order.orderedAt)}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Delivery Notes */}
                                  {order.deliveryNotes && (
                                    <div className="bg-blue-50 border border-blue-100 rounded px-2 sm:px-3 py-2 text-xs sm:text-sm">
                                      <span className="font-medium text-blue-900">Notes:</span>
                                      <span className="ml-2 text-blue-800">{order.deliveryNotes}</span>
                                    </div>
                                  )}

                                  {/* Action Buttons - Responsive */}
                                  <div className="flex flex-wrap gap-2">
                                    {order.status === 'pending' && (
                                      <>
                                        <button
                                          onClick={() => handleOrderAction(item._id, order._id, 'confirmed')}
                                          disabled={processingOrder === order._id}
                                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                                          {processingOrder === order._id ? 'Processing...' : 'Accept'}
                                        </button>
                                        <button
                                          onClick={() => handleOrderAction(item._id, order._id, 'cancelled')}
                                          disabled={processingOrder === order._id}
                                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                                          Reject
                                        </button>
                                      </>
                                    )}

                                    {order.status === 'confirmed' && (
                                      <button
                                        onClick={() => handleOrderAction(item._id, order._id, 'delivered')}
                                        disabled={processingOrder === order._id}
                                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                                        {processingOrder === order._id ? 'Processing...' : 'Mark Delivered'}
                                      </button>
                                    )}

                                    <button
                                      onClick={() => handleChatWithBuyer(order.buyer)}
                                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
                                    >
                                      <FiMessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                                      Chat
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* No Orders Message */
                    <div className="p-4 sm:p-6 bg-gray-50 text-center border-t border-gray-200">
                      <FiClock className="mx-auto h-6 w-6 sm:h-8 sm:h-8 text-gray-400" />
                      <p className="text-gray-600 text-xs sm:text-sm mt-2">No orders yet</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Item Modal */}
      {isEditModalOpen && itemToEdit && (
        <EditItemModal
          item={itemToEdit}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleUpdateItem}
        />
      )}
    </div>
  );
};

export default MyListingsPage;