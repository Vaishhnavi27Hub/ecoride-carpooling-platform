// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { FiMapPin, FiClock, FiDollarSign, FiUsers, FiTruck, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
// // import Navbar from '../components/Navbar';
// // import Button from '../components/Button';
// // import Input from '../components/Input';
// // import Card from '../components/Card';
// // import RouteMap from '../components/RouteMap';
// // import { ridesAPI } from '../services/api';
// // import { VEHICLE_TYPES, POPULAR_LOCATIONS } from '../utils/constants';

// // const CreateRidePage = () => {
// //   const navigate = useNavigate();
// //   const [loading, setLoading] = useState(false);
// //   const [errors, setErrors] = useState({});
// //   const [showMapPreview, setShowMapPreview] = useState(false);

// //   const [formData, setFormData] = useState({
// //     origin: '',
// //     destination: '',
// //     date: '',
// //     time: '',
// //     availableSeats: '',
// //     pricePerSeat: '',
// //     vehicleType: '',
// //     vehicleModel: '',
// //     vehicleNumber: '',
// //     notes: ''
// //   });

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

// //   const validateForm = () => {
// //     const newErrors = {};

// //     if (!formData.origin.trim()) {
// //       newErrors.origin = 'Origin is required';
// //     }

// //     if (!formData.destination.trim()) {
// //       newErrors.destination = 'Destination is required';
// //     }

// //     if (formData.origin === formData.destination) {
// //       newErrors.destination = 'Destination must be different from origin';
// //     }

// //     if (!formData.date) {
// //       newErrors.date = 'Date is required';
// //     } else {
// //       const selectedDate = new Date(formData.date);
// //       const today = new Date();
// //       today.setHours(0, 0, 0, 0);
// //       if (selectedDate < today) {
// //         newErrors.date = 'Date cannot be in the past';
// //       }
// //     }

// //     if (!formData.time) {
// //       newErrors.time = 'Time is required';
// //     }

// //     if (!formData.availableSeats) {
// //       newErrors.availableSeats = 'Number of seats is required';
// //     } else if (formData.availableSeats < 1 || formData.availableSeats > 8) {
// //       newErrors.availableSeats = 'Seats must be between 1 and 8';
// //     }

// //     if (!formData.pricePerSeat) {
// //       newErrors.pricePerSeat = 'Price per seat is required';
// //     } else if (formData.pricePerSeat < 0) {
// //       newErrors.pricePerSeat = 'Price cannot be negative';
// //     }

// //     if (!formData.vehicleType) {
// //       newErrors.vehicleType = 'Vehicle type is required';
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
      
// //       // Transform data to match backend structure
// //       const rideData = {
// //         vehicleDetails: {
// //           vehicleType: formData.vehicleType,
// //           vehicleModel: formData.vehicleModel || 'Not specified',
// //           vehicleNumber: formData.vehicleNumber || 'NA',
// //           vehicleColor: 'Not specified'
// //         },
// //         route: {
// //           startLocation: {
// //             address: formData.origin,
// //             coordinates: {
// //               latitude: 12.9716, // Default Bangalore coordinates
// //               longitude: 77.5946
// //             }
// //           },
// //           endLocation: {
// //             address: formData.destination,
// //             coordinates: {
// //               latitude: 12.9716,
// //               longitude: 77.5946
// //             }
// //           },
// //           distance: 10, // Default distance
// //           estimatedDuration: 30 // Default duration in minutes
// //         },
// //         schedule: {
// //           departureTime: new Date(`${formData.date}T${formData.time}`),
// //           isRecurring: false,
// //           recurringDays: [],
// //           flexibilityMinutes: 15
// //         },
// //         availableSeats: parseInt(formData.availableSeats),
// //         totalSeats: parseInt(formData.availableSeats),
// //         pricePerSeat: parseFloat(formData.pricePerSeat),
// //         preferences: {
// //           smokingAllowed: false,
// //           petsAllowed: false,
// //           musicPreference: 'Any',
// //           luggageSpace: 'Medium'
// //         },
// //         notes: formData.notes || ''
// //       };
      
// //       await ridesAPI.createRide(rideData);
// //       alert('Ride created successfully!');
// //       navigate('/rides');
// //     } catch (error) {
// //       console.error('Error creating ride:', error);
// //       alert(error.response?.data?.message || 'Failed to create ride');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Get today's date in YYYY-MM-DD format for min date
// //   const today = new Date().toISOString().split('T')[0];

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <Navbar />
      
// //       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <h1 className="text-3xl font-bold text-gray-900">Offer a Ride</h1>
// //           <p className="text-gray-600 mt-2">Share your journey and help reduce carbon emissions</p>
// //         </div>

// //         <form onSubmit={handleSubmit} className="space-y-6">
// //           {/* Route Details */}
// //           <Card>
// //             <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
// //               <FiMapPin className="text-green-600" />
// //               Route Details
// //             </h2>

// //             <div className="space-y-4">
// //               {/* Origin */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Pickup Point (Origin) *
// //                 </label>
// //                 <div className="relative">
// //                   <input
// //                     type="text"
// //                     name="origin"
// //                     value={formData.origin}
// //                     onChange={handleChange}
// //                     placeholder="e.g., Koramangala, Bangalore"
// //                     list="origin-suggestions"
// //                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
// //                       errors.origin ? 'border-red-500' : 'border-gray-300'
// //                     }`}
// //                   />
// //                   <datalist id="origin-suggestions">
// //                     {POPULAR_LOCATIONS.map((location, index) => (
// //                       <option key={index} value={location} />
// //                     ))}
// //                   </datalist>
// //                 </div>
// //                 {errors.origin && (
// //                   <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
// //                     <FiAlertCircle className="w-4 h-4" />
// //                     {errors.origin}
// //                   </p>
// //                 )}
// //               </div>

// //               {/* Destination */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Drop Point (Destination) *
// //                 </label>
// //                 <div className="relative">
// //                   <input
// //                     type="text"
// //                     name="destination"
// //                     value={formData.destination}
// //                     onChange={handleChange}
// //                     placeholder="e.g., Electronic City, Bangalore"
// //                     list="destination-suggestions"
// //                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
// //                       errors.destination ? 'border-red-500' : 'border-gray-300'
// //                     }`}
// //                   />
// //                   <datalist id="destination-suggestions">
// //                     {POPULAR_LOCATIONS.map((location, index) => (
// //                       <option key={index} value={location} />
// //                     ))}
// //                   </datalist>
// //                 </div>
// //                 {errors.destination && (
// //                   <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
// //                     <FiAlertCircle className="w-4 h-4" />
// //                     {errors.destination}
// //                   </p>
// //                 )}
// //               </div>
// //             </div>
// //           </Card>

// //           {/* Map Preview Section */}
// //           {formData.origin && formData.destination && (
// //             <Card>
// //               <div className="flex items-center justify-between mb-4">
// //                 <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
// //                   <FiMapPin className="text-green-600" />
// //                   Route Preview
// //                 </h2>
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowMapPreview(!showMapPreview)}
// //                   className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
// //                 >
// //                   {showMapPreview ? (
// //                     <>
// //                       <FiEyeOff className="w-4 h-4" />
// //                       Hide Map
// //                     </>
// //                   ) : (
// //                     <>
// //                       <FiEye className="w-4 h-4" />
// //                       Show Map
// //                     </>
// //                   )}
// //                 </button>
// //               </div>

// //               {showMapPreview && (
// //                 <div className="space-y-3">
// //                   <RouteMap
// //                     origin={formData.origin}
// //                     destination={formData.destination}
// //                     height="300px"
// //                     showRoute={true}
// //                   />
// //                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
// //                     <p className="text-sm text-blue-800">
// //                       <span className="font-semibold">💡 Tip:</span> Passengers will see this route when viewing your ride details
// //                     </p>
// //                   </div>
// //                 </div>
// //               )}
// //             </Card>
// //           )}

// //           {/* Date & Time */}
// //           <Card>
// //             <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
// //               <FiClock className="text-blue-600" />
// //               Date & Time
// //             </h2>

// //             <div className="grid md:grid-cols-2 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Date *
// //                 </label>
// //                 <input
// //                   type="date"
// //                   name="date"
// //                   value={formData.date}
// //                   onChange={handleChange}
// //                   min={today}
// //                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
// //                     errors.date ? 'border-red-500' : 'border-gray-300'
// //                   }`}
// //                 />
// //                 {errors.date && (
// //                   <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
// //                     <FiAlertCircle className="w-4 h-4" />
// //                     {errors.date}
// //                   </p>
// //                 )}
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Departure Time *
// //                 </label>
// //                 <input
// //                   type="time"
// //                   name="time"
// //                   value={formData.time}
// //                   onChange={handleChange}
// //                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
// //                     errors.time ? 'border-red-500' : 'border-gray-300'
// //                   }`}
// //                 />
// //                 {errors.time && (
// //                   <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
// //                     <FiAlertCircle className="w-4 h-4" />
// //                     {errors.time}
// //                   </p>
// //                 )}
// //               </div>
// //             </div>
// //           </Card>

// //           {/* Ride Details */}
// //           <Card>
// //             <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
// //               <FiDollarSign className="text-purple-600" />
// //               Ride Details
// //             </h2>

// //             <div className="grid md:grid-cols-2 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Available Seats *
// //                 </label>
// //                 <div className="relative">
// //                   <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //                   <input
// //                     type="number"
// //                     name="availableSeats"
// //                     value={formData.availableSeats}
// //                     onChange={handleChange}
// //                     min="1"
// //                     max="8"
// //                     placeholder="e.g., 3"
// //                     className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
// //                       errors.availableSeats ? 'border-red-500' : 'border-gray-300'
// //                     }`}
// //                   />
// //                 </div>
// //                 {errors.availableSeats && (
// //                   <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
// //                     <FiAlertCircle className="w-4 h-4" />
// //                     {errors.availableSeats}
// //                   </p>
// //                 )}
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Price per Seat (₹) *
// //                 </label>
// //                 <div className="relative">
// //                   <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //                   <input
// //                     type="number"
// //                     name="pricePerSeat"
// //                     value={formData.pricePerSeat}
// //                     onChange={handleChange}
// //                     min="0"
// //                     placeholder="e.g., 50"
// //                     className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
// //                       errors.pricePerSeat ? 'border-red-500' : 'border-gray-300'
// //                     }`}
// //                   />
// //                 </div>
// //                 {errors.pricePerSeat && (
// //                   <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
// //                     <FiAlertCircle className="w-4 h-4" />
// //                     {errors.pricePerSeat}
// //                   </p>
// //                 )}
// //               </div>
// //             </div>
// //           </Card>

// //           {/* Vehicle Details */}
// //           <Card>
// //             <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
// //               <FiTruck className="text-orange-600" />
// //               Vehicle Information
// //             </h2>

// //             <div className="space-y-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Vehicle Type *
// //                 </label>
// //                 <select
// //                   name="vehicleType"
// //                   value={formData.vehicleType}
// //                   onChange={handleChange}
// //                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
// //                     errors.vehicleType ? 'border-red-500' : 'border-gray-300'
// //                   }`}
// //                 >
// //                   <option value="">Select vehicle type</option>
// //                   {VEHICLE_TYPES.map((type, index) => (
// //                     <option key={index} value={type}>
// //                       {type}
// //                     </option>
// //                   ))}
// //                 </select>
// //                 {errors.vehicleType && (
// //                   <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
// //                     <FiAlertCircle className="w-4 h-4" />
// //                     {errors.vehicleType}
// //                   </p>
// //                 )}
// //               </div>

// //               <div className="grid md:grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Vehicle Model (Optional)
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="vehicleModel"
// //                     value={formData.vehicleModel}
// //                     onChange={handleChange}
// //                     placeholder="e.g., Honda City"
// //                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Vehicle Number (Optional)
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="vehicleNumber"
// //                     value={formData.vehicleNumber}
// //                     onChange={handleChange}
// //                     placeholder="e.g., KA-01-AB-1234"
// //                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           </Card>

// //           {/* Additional Notes */}
// //           <Card>
// //             <h2 className="text-xl font-semibold text-gray-900 mb-4">
// //               Additional Notes (Optional)
// //             </h2>
// //             <textarea
// //               name="notes"
// //               value={formData.notes}
// //               onChange={handleChange}
// //               rows="4"
// //               placeholder="Any additional information for passengers (e.g., pickup instructions, preferences, etc.)"
// //               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
// //             />
// //           </Card>

// //           {/* Action Buttons */}
// //           <div className="flex gap-4">
// //             <Button
// //               type="button"
// //               variant="secondary"
// //               onClick={() => navigate('/rides')}
// //               className="flex-1"
// //             >
// //               Cancel
// //             </Button>
// //             <Button
// //               type="submit"
// //               disabled={loading}
// //               className="flex-1"
// //             >
// //               {loading ? 'Creating Ride...' : 'Create Ride'}
// //             </Button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CreateRidePage;























// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiMapPin, FiClock, FiDollarSign, FiUsers, FiTruck, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
// import Navbar from '../components/Navbar';
// import Button from '../components/Button';
// import Input from '../components/Input';
// import Card from '../components/Card';
// import RouteMap from '../components/RouteMap';
// import { ridesAPI } from '../services/api';
// import { VEHICLE_TYPES, POPULAR_LOCATIONS } from '../utils/constants';

// const CreateRidePage = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [showMapPreview, setShowMapPreview] = useState(false);

//   const [formData, setFormData] = useState({
//     origin: '',
//     destination: '',
//     date: '',
//     time: '',
//     availableSeats: '',
//     pricePerSeat: '',
//     vehicleType: '',
//     vehicleModel: '',
//     vehicleNumber: '',
//     notes: ''
//   });

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

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.origin.trim()) {
//       newErrors.origin = 'Origin is required';
//     }

//     if (!formData.destination.trim()) {
//       newErrors.destination = 'Destination is required';
//     }

//     if (formData.origin === formData.destination) {
//       newErrors.destination = 'Destination must be different from origin';
//     }

//     if (!formData.date) {
//       newErrors.date = 'Date is required';
//     } else {
//       const selectedDate = new Date(formData.date);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       if (selectedDate < today) {
//         newErrors.date = 'Date cannot be in the past';
//       }
//     }

//     if (!formData.time) {
//       newErrors.time = 'Time is required';
//     }

//     if (!formData.availableSeats) {
//       newErrors.availableSeats = 'Number of seats is required';
//     } else if (formData.availableSeats < 1 || formData.availableSeats > 8) {
//       newErrors.availableSeats = 'Seats must be between 1 and 8';
//     }

//     if (!formData.pricePerSeat) {
//       newErrors.pricePerSeat = 'Price per seat is required';
//     } else if (formData.pricePerSeat < 0) {
//       newErrors.pricePerSeat = 'Price cannot be negative';
//     }

//     if (!formData.vehicleType) {
//       newErrors.vehicleType = 'Vehicle type is required';
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
      
//       // Combine date and time into ISO string
//       const departureDateTime = new Date(`${formData.date}T${formData.time}`);
      
//       // Transform data to match backend Ride model structure EXACTLY
//       const rideData = {
//         vehicleDetails: {
//           vehicleType: formData.vehicleType,
//           vehicleModel: formData.vehicleModel || 'Not specified',
//           vehicleNumber: formData.vehicleNumber || 'NA',
//           vehicleColor: 'Not specified'
//         },
//         route: {
//           startLocation: {
//             address: formData.origin,
//             coordinates: {
//               latitude: 12.9716, // Default Bangalore coordinates
//               longitude: 77.5946
//             }
//           },
//           endLocation: {
//             address: formData.destination,
//             coordinates: {
//               latitude: 12.9716,
//               longitude: 77.5946
//             }
//           },
//           distance: 10, // Default distance in km
//           estimatedDuration: 30 // Required field - duration in minutes
//         },
//         schedule: {
//           departureTime: departureDateTime.toISOString(),
//           isRecurring: false,
//           recurringDays: [],
//           flexibilityMinutes: 15
//         },
//         availableSeats: parseInt(formData.availableSeats),
//         totalSeats: parseInt(formData.availableSeats),
//         pricePerSeat: parseFloat(formData.pricePerSeat),
//         preferences: {
//           smokingAllowed: false,
//           petsAllowed: false,
//           musicPreference: 'Any',
//           luggageSpace: 'Medium'
//         },
//         notes: formData.notes || '',
//         status: 'active'
//       };
      
//       console.log('Sending ride data:', rideData);
      
//       const response = await ridesAPI.createRide(rideData);
//       console.log('Create ride response:', response);
      
//       alert('Ride created successfully!');
//       navigate('/rides');
//     } catch (error) {
//       console.error('Error creating ride:', error);
//       console.error('Error response:', error.response?.data);
//       alert(error.response?.data?.message || 'Failed to create ride. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get today's date in YYYY-MM-DD format for min date
//   const today = new Date().toISOString().split('T')[0];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Offer a Ride</h1>
//           <p className="text-gray-600 mt-2">Share your journey and help reduce carbon emissions</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Route Details */}
//           <Card>
//             <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//               <FiMapPin className="text-green-600" />
//               Route Details
//             </h2>

//             <div className="space-y-4">
//               {/* Origin */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Pickup Point (Origin) *
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     name="origin"
//                     value={formData.origin}
//                     onChange={handleChange}
//                     placeholder="e.g., Koramangala, Bangalore"
//                     list="origin-suggestions"
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                       errors.origin ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   />
//                   <datalist id="origin-suggestions">
//                     {POPULAR_LOCATIONS.map((location, index) => (
//                       <option key={index} value={location} />
//                     ))}
//                   </datalist>
//                 </div>
//                 {errors.origin && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                     <FiAlertCircle className="w-4 h-4" />
//                     {errors.origin}
//                   </p>
//                 )}
//               </div>

//               {/* Destination */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Drop Point (Destination) *
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     name="destination"
//                     value={formData.destination}
//                     onChange={handleChange}
//                     placeholder="e.g., Electronic City, Bangalore"
//                     list="destination-suggestions"
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                       errors.destination ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   />
//                   <datalist id="destination-suggestions">
//                     {POPULAR_LOCATIONS.map((location, index) => (
//                       <option key={index} value={location} />
//                     ))}
//                   </datalist>
//                 </div>
//                 {errors.destination && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                     <FiAlertCircle className="w-4 h-4" />
//                     {errors.destination}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </Card>

//           {/* Map Preview Section */}
//           {formData.origin && formData.destination && (
//             <Card>
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//                   <FiMapPin className="text-green-600" />
//                   Route Preview
//                 </h2>
//                 <button
//                   type="button"
//                   onClick={() => setShowMapPreview(!showMapPreview)}
//                   className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
//                 >
//                   {showMapPreview ? (
//                     <>
//                       <FiEyeOff className="w-4 h-4" />
//                       Hide Map
//                     </>
//                   ) : (
//                     <>
//                       <FiEye className="w-4 h-4" />
//                       Show Map
//                     </>
//                   )}
//                 </button>
//               </div>

//               {showMapPreview && (
//                 <div className="space-y-3">
//                   <RouteMap
//                     origin={formData.origin}
//                     destination={formData.destination}
//                     height="300px"
//                     showRoute={true}
//                   />
//                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                     <p className="text-sm text-blue-800">
//                       <span className="font-semibold">💡 Tip:</span> Passengers will see this route when viewing your ride details
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </Card>
//           )}

//           {/* Date & Time */}
//           <Card>
//             <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//               <FiClock className="text-blue-600" />
//               Date & Time
//             </h2>

//             <div className="grid md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Date *
//                 </label>
//                 <input
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleChange}
//                   min={today}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.date ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 />
//                 {errors.date && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                     <FiAlertCircle className="w-4 h-4" />
//                     {errors.date}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Departure Time *
//                 </label>
//                 <input
//                   type="time"
//                   name="time"
//                   value={formData.time}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.time ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 />
//                 {errors.time && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                     <FiAlertCircle className="w-4 h-4" />
//                     {errors.time}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </Card>

//           {/* Ride Details */}
//           <Card>
//             <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//               <FiDollarSign className="text-purple-600" />
//               Ride Details
//             </h2>

//             <div className="grid md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Available Seats *
//                 </label>
//                 <div className="relative">
//                   <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="number"
//                     name="availableSeats"
//                     value={formData.availableSeats}
//                     onChange={handleChange}
//                     min="1"
//                     max="8"
//                     placeholder="e.g., 3"
//                     className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                       errors.availableSeats ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   />
//                 </div>
//                 {errors.availableSeats && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                     <FiAlertCircle className="w-4 h-4" />
//                     {errors.availableSeats}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Price per Seat (₹) *
//                 </label>
//                 <div className="relative">
//                   <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="number"
//                     name="pricePerSeat"
//                     value={formData.pricePerSeat}
//                     onChange={handleChange}
//                     min="0"
//                     placeholder="e.g., 50"
//                     className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                       errors.pricePerSeat ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   />
//                 </div>
//                 {errors.pricePerSeat && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                     <FiAlertCircle className="w-4 h-4" />
//                     {errors.pricePerSeat}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </Card>

//           {/* Vehicle Details */}
//           <Card>
//             <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//               <FiTruck className="text-orange-600" />
//               Vehicle Information
//             </h2>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Vehicle Type *
//                 </label>
//                 <select
//                   name="vehicleType"
//                   value={formData.vehicleType}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.vehicleType ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 >
//                   <option value="">Select vehicle type</option>
//                   {VEHICLE_TYPES.map((type, index) => (
//                     <option key={index} value={type}>
//                       {type}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.vehicleType && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                     <FiAlertCircle className="w-4 h-4" />
//                     {errors.vehicleType}
//                   </p>
//                 )}
//               </div>

//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Vehicle Model (Optional)
//                   </label>
//                   <input
//                     type="text"
//                     name="vehicleModel"
//                     value={formData.vehicleModel}
//                     onChange={handleChange}
//                     placeholder="e.g., Honda City"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Vehicle Number (Optional)
//                   </label>
//                   <input
//                     type="text"
//                     name="vehicleNumber"
//                     value={formData.vehicleNumber}
//                     onChange={handleChange}
//                     placeholder="e.g., KA-01-AB-1234"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//             </div>
//           </Card>

//           {/* Additional Notes */}
//           <Card>
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">
//               Additional Notes (Optional)
//             </h2>
//             <textarea
//               name="notes"
//               value={formData.notes}
//               onChange={handleChange}
//               rows="4"
//               placeholder="Any additional information for passengers (e.g., pickup instructions, preferences, etc.)"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
//             />
//           </Card>

//           {/* Action Buttons */}
//           <div className="flex gap-4">
//             <Button
//               type="button"
//               variant="secondary"
//               onClick={() => navigate('/rides')}
//               className="flex-1"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={loading}
//               className="flex-1"
//             >
//               {loading ? 'Creating Ride...' : 'Create Ride'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateRidePage;


























import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiClock, FiDollarSign, FiUsers, FiTruck, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import RouteMap from '../components/RouteMap';
import { ridesAPI } from '../services/api';
import { VEHICLE_TYPES, POPULAR_LOCATIONS } from '../utils/constants';

const CreateRidePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showMapPreview, setShowMapPreview] = useState(false);

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    availableSeats: '',
    pricePerSeat: '',
    vehicleType: '',
    vehicleModel: '',
    vehicleNumber: '',
    notes: ''
  });

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.origin.trim()) {
      newErrors.origin = 'Origin is required';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (formData.origin === formData.destination) {
      newErrors.destination = 'Destination must be different from origin';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (!formData.availableSeats) {
      newErrors.availableSeats = 'Number of seats is required';
    } else if (formData.availableSeats < 1 || formData.availableSeats > 8) {
      newErrors.availableSeats = 'Seats must be between 1 and 8';
    }

    if (!formData.pricePerSeat) {
      newErrors.pricePerSeat = 'Price per seat is required';
    } else if (formData.pricePerSeat < 0) {
      newErrors.pricePerSeat = 'Price cannot be negative';
    }

    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Vehicle type is required';
    }

    if (!formData.vehicleModel.trim()) {
      newErrors.vehicleModel = 'Vehicle model is required';
    }

    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle number is required';
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
      
      // Combine date and time into ISO string
      const departureDateTime = new Date(`${formData.date}T${formData.time}`);
      
      // Transform data to match backend Ride model structure EXACTLY
      const rideData = {
        vehicleDetails: {
          vehicleType: formData.vehicleType,
          vehicleModel: formData.vehicleModel, // Required by schema
          vehicleNumber: formData.vehicleNumber, // Required by schema
          vehicleColor: 'Not specified'
        },
        route: {
          startLocation: {
            address: formData.origin,
            coordinates: {
              latitude: 12.9716, // Default Bangalore coordinates
              longitude: 77.5946
            }
          },
          endLocation: {
            address: formData.destination,
            coordinates: {
              latitude: 12.9716,
              longitude: 77.5946
            }
          },
          distance: 10, // Default distance in km
          estimatedDuration: 30 // Required field - duration in minutes
        },
        schedule: {
          departureTime: departureDateTime.toISOString(),
          isRecurring: false,
          recurringDays: [],
          flexibilityMinutes: 15
        },
        availableSeats: parseInt(formData.availableSeats),
        totalSeats: parseInt(formData.availableSeats),
        pricePerSeat: parseFloat(formData.pricePerSeat),
        preferences: {
          smokingAllowed: false,
          petsAllowed: false,
          musicPreference: 'Any',
          luggageSpace: 'Medium'
        },
        notes: formData.notes || '',
        status: 'active'
      };
      
      console.log('='.repeat(60));
      console.log('🚗 CREATING RIDE - FORM DATA:');
      console.log('='.repeat(60));
      console.log('Origin:', formData.origin);
      console.log('Destination:', formData.destination);
      console.log('Date:', formData.date);
      console.log('Time:', formData.time);
      console.log('Seats:', formData.availableSeats);
      console.log('Price:', formData.pricePerSeat);
      console.log('Vehicle Type:', formData.vehicleType);
      console.log('Vehicle Model:', formData.vehicleModel);
      console.log('Vehicle Number:', formData.vehicleNumber);
      console.log('='.repeat(60));
      
      console.log('\n📦 SENDING RIDE DATA:');
      console.log(JSON.stringify(rideData, null, 2));
      console.log('='.repeat(60));
      
      const response = await ridesAPI.createRide(rideData);
      console.log('\n✅ CREATE RIDE RESPONSE:');
      console.log(JSON.stringify(response, null, 2));
      
      alert('Ride created successfully!');
      navigate('/rides');
    } catch (error) {
      console.error('Error creating ride:', error);
      console.error('Error response:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to create ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Offer a Ride</h1>
          <p className="text-gray-600 mt-2">Share your journey and help reduce carbon emissions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Route Details */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FiMapPin className="text-green-600" />
              Route Details
            </h2>

            <div className="space-y-4">
              {/* Origin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Point (Origin) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    placeholder="e.g., Koramangala, Bangalore"
                    list="origin-suggestions"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.origin ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <datalist id="origin-suggestions">
                    {POPULAR_LOCATIONS.map((location, index) => (
                      <option key={index} value={location} />
                    ))}
                  </datalist>
                </div>
                {errors.origin && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.origin}
                  </p>
                )}
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Drop Point (Destination) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="e.g., Electronic City, Bangalore"
                    list="destination-suggestions"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.destination ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <datalist id="destination-suggestions">
                    {POPULAR_LOCATIONS.map((location, index) => (
                      <option key={index} value={location} />
                    ))}
                  </datalist>
                </div>
                {errors.destination && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.destination}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Map Preview Section */}
          {formData.origin && formData.destination && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FiMapPin className="text-green-600" />
                  Route Preview
                </h2>
                <button
                  type="button"
                  onClick={() => setShowMapPreview(!showMapPreview)}
                  className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                >
                  {showMapPreview ? (
                    <>
                      <FiEyeOff className="w-4 h-4" />
                      Hide Map
                    </>
                  ) : (
                    <>
                      <FiEye className="w-4 h-4" />
                      Show Map
                    </>
                  )}
                </button>
              </div>

              {showMapPreview && (
                <div className="space-y-3">
                  <RouteMap
                    origin={formData.origin}
                    destination={formData.destination}
                    height="300px"
                    showRoute={true}
                  />
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">💡 Tip:</span> Passengers will see this route when viewing your ride details
                    </p>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Date & Time */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FiClock className="text-blue-600" />
              Date & Time
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.date}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departure Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.time ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.time}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Ride Details */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FiDollarSign className="text-purple-600" />
              Ride Details
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Seats *
                </label>
                <div className="relative">
                  <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="availableSeats"
                    value={formData.availableSeats}
                    onChange={handleChange}
                    min="1"
                    max="8"
                    placeholder="e.g., 3"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.availableSeats ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.availableSeats && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.availableSeats}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Seat (₹) *
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="pricePerSeat"
                    value={formData.pricePerSeat}
                    onChange={handleChange}
                    min="0"
                    placeholder="e.g., 50"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.pricePerSeat ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.pricePerSeat && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.pricePerSeat}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Vehicle Details */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FiTruck className="text-orange-600" />
              Vehicle Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type *
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.vehicleType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select vehicle type</option>
                  {VEHICLE_TYPES.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.vehicleType && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.vehicleType}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Model *
                  </label>
                  <input
                    type="text"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    placeholder="e.g., Honda City"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.vehicleModel ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.vehicleModel && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="w-4 h-4" />
                      {errors.vehicleModel}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    placeholder="e.g., KA-01-AB-1234"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.vehicleNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.vehicleNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="w-4 h-4" />
                      {errors.vehicleNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Notes */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Additional Notes (Optional)
            </h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Any additional information for passengers (e.g., pickup instructions, preferences, etc.)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/rides')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Creating Ride...' : 'Create Ride'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRidePage;