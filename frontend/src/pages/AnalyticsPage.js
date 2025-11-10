// import React, { useState, useEffect } from 'react';
// import { Line, Bar, Doughnut } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// } from 'chart.js';
// import {
//   FiTrendingUp,
//   FiAward,
//   FiActivity,
//   FiUsers,
//   FiTruck,
//   FiCalendar,
//   FiShoppingBag,
//   FiLeaf
// } from 'react-icons/fi';
// import Navbar from '../components/Navbar';
// import LoadingSpinner from '../components/LoadingSpinner';
// import Card from '../components/Card';
// import Badge from '../components/Badge';
// import { analyticsAPI } from '../services/analyticsAPI';

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const AnalyticsPage = () => {
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [dashboardStats, setDashboardStats] = useState(null);
//   const [trends, setTrends] = useState(null);
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [activity, setActivity] = useState(null);
//   const [departments, setDepartments] = useState([]);
//   const [leaderboardType, setLeaderboardType] = useState('carbon');

//   useEffect(() => {
//     fetchAnalytics();
//   }, []);

//   useEffect(() => {
//     if (activeTab === 'leaderboard') {
//       fetchLeaderboard(leaderboardType);
//     }
//   }, [leaderboardType]);

//   const fetchAnalytics = async () => {
//     try {
//       setLoading(true);
//       const [statsRes, trendsRes, activityRes, deptRes] = await Promise.all([
//         analyticsAPI.getDashboardStats(),
//         analyticsAPI.getMonthlyTrends(),
//         analyticsAPI.getUserActivity(),
//         analyticsAPI.getDepartmentStats()
//       ]);

//       setDashboardStats(statsRes.data.data);
//       setTrends(trendsRes.data.data);
//       setActivity(activityRes.data.data);
//       setDepartments(deptRes.data.data);

//       // Fetch initial leaderboard
//       const leaderboardRes = await analyticsAPI.getLeaderboard('carbon', 10);
//       setLeaderboard(leaderboardRes.data.data);
//     } catch (error) {
//       console.error('Fetch analytics error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLeaderboard = async (type) => {
//     try {
//       const response = await analyticsAPI.getLeaderboard(type, 10);
//       setLeaderboard(response.data.data);
//     } catch (error) {
//       console.error('Fetch leaderboard error:', error);
//     }
//   };

//   // Chart configurations
//   const trendsChartData = trends ? {
//     labels: trends.months,
//     datasets: [
//       {
//         label: 'Rides',
//         data: trends.rides,
//         borderColor: 'rgb(34, 197, 94)',
//         backgroundColor: 'rgba(34, 197, 94, 0.1)',
//         fill: true,
//         tension: 0.4
//       },
//       {
//         label: 'Carbon Saved (kg)',
//         data: trends.carbon,
//         borderColor: 'rgb(59, 130, 246)',
//         backgroundColor: 'rgba(59, 130, 246, 0.1)',
//         fill: true,
//         tension: 0.4,
//         yAxisID: 'y1'
//       }
//     ]
//   } : null;

//   const trendsChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     interaction: {
//       mode: 'index',
//       intersect: false
//     },
//     plugins: {
//       legend: {
//         position: 'top'
//       },
//       title: {
//         display: true,
//         text: 'Your Activity Trends (Last 6 Months)'
//       }
//     },
//     scales: {
//       y: {
//         type: 'linear',
//         display: true,
//         position: 'left',
//         title: {
//           display: true,
//           text: 'Rides'
//         }
//       },
//       y1: {
//         type: 'linear',
//         display: true,
//         position: 'right',
//         title: {
//           display: true,
//           text: 'Carbon (kg CO₂)'
//         },
//         grid: {
//           drawOnChartArea: false
//         }
//       }
//     }
//   };

//   const activityChartData = activity ? {
//     labels: ['Upcoming', 'Completed', 'Cancelled'],
//     datasets: [{
//       data: [activity.rides.upcoming, activity.rides.completed, activity.rides.cancelled],
//       backgroundColor: [
//         'rgba(59, 130, 246, 0.8)',
//         'rgba(34, 197, 94, 0.8)',
//         'rgba(239, 68, 68, 0.8)'
//       ],
//       borderWidth: 0
//     }]
//   } : null;

//   const activityChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'bottom'
//       },
//       title: {
//         display: true,
//         text: 'Ride Distribution'
//       }
//     }
//   };

//   const departmentChartData = departments.length > 0 ? {
//     labels: departments.map(d => d.department),
//     datasets: [{
//       label: 'Carbon Saved (kg CO₂)',
//       data: departments.map(d => d.carbonSaved),
//       backgroundColor: 'rgba(34, 197, 94, 0.8)',
//       borderColor: 'rgb(34, 197, 94)',
//       borderWidth: 1
//     }]
//   } : null;

//   const departmentChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false
//       },
//       title: {
//         display: true,
//         text: 'Top Departments by Carbon Savings'
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'kg CO₂'
//         }
//       }
//     }
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
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//             <FiTrendingUp className="text-green-600" />
//             Analytics Dashboard
//           </h1>
//           <p className="text-gray-600 mt-2">Track your environmental impact and activity</p>
//         </div>

//         {/* Tabs */}
//         <div className="mb-6 border-b border-gray-200">
//           <nav className="flex space-x-8">
//             {['overview', 'trends', 'leaderboard', 'departments'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
//                   activeTab === tab
//                     ? 'border-green-600 text-green-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Overview Tab */}
//         {activeTab === 'overview' && dashboardStats && (
//           <div className="space-y-6">
//             {/* Key Metrics */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <Card>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600">Total Rides</p>
//                     <p className="text-3xl font-bold text-gray-900 mt-2">
//                       {dashboardStats.totalRides}
//                     </p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {dashboardStats.ridesOffered} offered · {dashboardStats.ridesTaken} taken
//                     </p>
//                   </div>
//                   <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                     <FiTruck className="w-6 h-6 text-green-600" />
//                   </div>
//                 </div>
//               </Card>

//               <Card>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600">Carbon Saved</p>
//                     <p className="text-3xl font-bold text-gray-900 mt-2">
//                       {dashboardStats.carbonSaved}
//                       <span className="text-sm text-gray-500 ml-1">kg</span>
//                     </p>
//                     <p className="text-xs text-green-600 mt-1">CO₂ emissions reduced</p>
//                   </div>
//                   <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                     <FiLeaf className="w-6 h-6 text-blue-600" />
//                   </div>
//                 </div>
//               </Card>

//               <Card>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600">Money Saved</p>
//                     <p className="text-3xl font-bold text-gray-900 mt-2">
//                       ₹{dashboardStats.moneySaved.toLocaleString()}
//                     </p>
//                     <p className="text-xs text-green-600 mt-1">Through carpooling</p>
//                   </div>
//                   <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                     <FiActivity className="w-6 h-6 text-purple-600" />
//                   </div>
//                 </div>
//               </Card>

//               <Card>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600">Your Rating</p>
//                     <p className="text-3xl font-bold text-gray-900 mt-2">
//                       {dashboardStats.rating > 0 ? dashboardStats.rating.toFixed(1) : 'N/A'}
//                       <span className="text-sm text-gray-500 ml-1">⭐</span>
//                     </p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {dashboardStats.totalRatings} ratings
//                     </p>
//                   </div>
//                   <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
//                     <FiAward className="w-6 h-6 text-yellow-600" />
//                   </div>
//                 </div>
//               </Card>
//             </div>

//             {/* Activity Breakdown */}
//             {activity && (
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 <Card>
//                   <div className="flex items-center gap-3 mb-4">
//                     <FiTruck className="w-5 h-5 text-green-600" />
//                     <h3 className="font-semibold text-gray-900">Rides</h3>
//                   </div>
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">Upcoming</span>
//                       <Badge variant="info">{activity.rides.upcoming}</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">Completed</span>
//                       <Badge variant="success">{activity.rides.completed}</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">Cancelled</span>
//                       <Badge variant="danger">{activity.rides.cancelled}</Badge>
//                     </div>
//                     <div className="pt-3 border-t border-gray-200">
//                       <div className="flex justify-between items-center font-semibold">
//                         <span className="text-gray-900">Total</span>
//                         <span className="text-gray-900">{activity.rides.total}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </Card>

//                 <Card>
//                   <div className="flex items-center gap-3 mb-4">
//                     <FiCalendar className="w-5 h-5 text-purple-600" />
//                     <h3 className="font-semibold text-gray-900">Trips</h3>
//                   </div>
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">Active</span>
//                       <Badge variant="info">{activity.trips.active}</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">Completed</span>
//                       <Badge variant="success">{activity.trips.past}</Badge>
//                     </div>
//                     <div className="pt-3 border-t border-gray-200">
//                       <div className="flex justify-between items-center font-semibold">
//                         <span className="text-gray-900">Total</span>
//                         <span className="text-gray-900">{activity.trips.total}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </Card>

//                 <Card>
//                   <div className="flex items-center gap-3 mb-4">
//                     <FiShoppingBag className="w-5 h-5 text-orange-600" />
//                     <h3 className="font-semibold text-gray-900">Marketplace</h3>
//                   </div>
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">Active Listings</span>
//                       <Badge variant="info">{activity.marketplace.active}</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">Sold Items</span>
//                       <Badge variant="success">{activity.marketplace.sold}</Badge>
//                     </div>
//                     <div className="pt-3 border-t border-gray-200">
//                       <div className="flex justify-between items-center font-semibold">
//                         <span className="text-gray-900">Total Listed</span>
//                         <span className="text-gray-900">{activity.marketplace.listed}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </Card>
//               </div>
//             )}

//             {/* Charts */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {activityChartData && (
//                 <Card>
//                   <div style={{ height: '300px' }}>
//                     <Doughnut data={activityChartData} options={activityChartOptions} />
//                   </div>
//                 </Card>
//               )}

//               <Card>
//                 <div className="text-center py-12">
//                   <FiAward className="w-16 h-16 text-green-600 mx-auto mb-4" />
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">
//                     Keep Going! 🎉
//                   </h3>
//                   <p className="text-gray-600 mb-2">
//                     You've saved <span className="font-bold text-green-600">
//                       {dashboardStats.carbonSaved} kg CO₂
//                     </span>
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Equivalent to planting {Math.round(dashboardStats.carbonSaved / 20)} trees! 🌳
//                   </p>
//                 </div>
//               </Card>
//             </div>
//           </div>
//         )}

//         {/* Trends Tab */}
//         {activeTab === 'trends' && trendsChartData && (
//           <div className="space-y-6">
//             <Card>
//               <div style={{ height: '400px' }}>
//                 <Line data={trendsChartData} options={trendsChartOptions} />
//               </div>
//             </Card>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <Card>
//                 <div className="text-center">
//                   <FiTrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
//                   <p className="text-sm text-gray-600 mb-1">Total Rides (6 months)</p>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {trends.rides.reduce((a, b) => a + b, 0)}
//                   </p>
//                 </div>
//               </Card>

//               <Card>
//                 <div className="text-center">
//                   <FiLeaf className="w-8 h-8 text-blue-600 mx-auto mb-3" />
//                   <p className="text-sm text-gray-600 mb-1">Total Carbon Saved</p>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {trends.carbon.reduce((a, b) => a + b, 0).toFixed(1)} kg
//                   </p>
//                 </div>
//               </Card>

//               <Card>
//                 <div className="text-center">
//                   <FiActivity className="w-8 h-8 text-purple-600 mx-auto mb-3" />
//                   <p className="text-sm text-gray-600 mb-1">Monthly Average</p>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {(trends.rides.reduce((a, b) => a + b, 0) / 6).toFixed(1)} rides
//                   </p>
//                 </div>
//               </Card>
//             </div>
//           </div>
//         )}

//         {/* Leaderboard Tab */}
//         {activeTab === 'leaderboard' && (
//           <div className="space-y-6">
//             {/* Leaderboard Type Selector */}
//             <div className="flex gap-4 mb-6">
//               <button
//                 onClick={() => setLeaderboardType('carbon')}
//                 className={`px-4 py-2 rounded-lg font-medium transition ${
//                   leaderboardType === 'carbon'
//                     ? 'bg-green-600 text-white'
//                     : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                 }`}
//               >
//                 🌱 Carbon Heroes
//               </button>
//               <button
//                 onClick={() => setLeaderboardType('rides')}
//                 className={`px-4 py-2 rounded-lg font-medium transition ${
//                   leaderboardType === 'rides'
//                     ? 'bg-green-600 text-white'
//                     : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                 }`}
//               >
//                 🚗 Most Active
//               </button>
//               <button
//                 onClick={() => setLeaderboardType('rating')}
//                 className={`px-4 py-2 rounded-lg font-medium transition ${
//                   leaderboardType === 'rating'
//                     ? 'bg-green-600 text-white'
//                     : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                 }`}
//               >
//                 ⭐ Top Rated
//               </button>
//             </div>

//             <Card>
//               <div className="space-y-4">
//                 {leaderboard.length === 0 ? (
//                   <div className="text-center py-12">
//                     <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//                     <p className="text-gray-600">No data available</p>
//                   </div>
//                 ) : (
//                   leaderboard.map((user, index) => (
//                     <div
//                       key={user._id}
//                       className={`flex items-center gap-4 p-4 rounded-lg transition ${
//                         index < 3
//                           ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'
//                           : 'bg-gray-50 hover:bg-gray-100'
//                       }`}
//                     >
//                       {/* Rank */}
//                       <div className="flex-shrink-0">
//                         {index === 0 && (
//                           <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
//                             🥇
//                           </div>
//                         )}
//                         {index === 1 && (
//                           <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
//                             🥈
//                           </div>
//                         )}
//                         {index === 2 && (
//                           <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
//                             🥉
//                           </div>
//                         )}
//                         {index > 2 && (
//                           <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold text-lg">
//                             {index + 1}
//                           </div>
//                         )}
//                       </div>

//                       {/* User Info */}
//                       <div className="flex-1 min-w-0">
//                         <h4 className="font-semibold text-gray-900 truncate">
//                           {user.name}
//                         </h4>
//                         <p className="text-sm text-gray-600 truncate">{user.department}</p>
//                       </div>

//                       {/* Stats */}
//                       <div className="text-right">
//                         {leaderboardType === 'carbon' && (
//                           <>
//                             <p className="font-bold text-lg text-green-600">
//                               {user.carbonSaved.toFixed(1)} kg
//                             </p>
//                             <p className="text-xs text-gray-500">CO₂ saved</p>
//                           </>
//                         )}
//                         {leaderboardType === 'rides' && (
//                           <>
//                             <p className="font-bold text-lg text-blue-600">
//                               {user.ridesOffered}
//                             </p>
//                             <p className="text-xs text-gray-500">rides offered</p>
//                           </>
//                         )}
//                         {leaderboardType === 'rating' && (
//                           <>
//                             <p className="font-bold text-lg text-yellow-600">
//                               {user.rating > 0 ? user.rating.toFixed(1) : 'N/A'} ⭐
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               {user.totalRatings} ratings
//                             </p>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </Card>
//           </div>
//         )}

//         {/* Departments Tab */}
//         {activeTab === 'departments' && departmentChartData && (
//           <div className="space-y-6">
//             <Card>
//               <div style={{ height: '400px' }}>
//                 <Bar data={departmentChartData} options={departmentChartOptions} />
//               </div>
//             </Card>

//             <Card>
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Department Statistics
//               </h3>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead>
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Department
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Users
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Rides Offered
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Rides Taken
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Carbon Saved
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Avg Rating
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {departments.map((dept, index) => (
//                       <tr key={index} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="font-medium text-gray-900">{dept.department}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                           {dept.users}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                           {dept.ridesOffered}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                           {dept.ridesTaken}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="text-sm font-medium text-green-600">
//                             {dept.carbonSaved} kg
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="text-sm text-yellow-600">
//                             {dept.averageRating > 0 ? `${dept.averageRating} ⭐` : 'N/A'}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AnalyticsPage; 

import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  FiTrendingUp,
  FiAward,
  FiActivity,
  FiUsers,
  FiTruck,
  FiCalendar,
  FiShoppingBag,
  FiWind
} from 'react-icons/fi';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { analyticsAPI } from '../services/analyticsAPI';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [trends, setTrends] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activity, setActivity] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [leaderboardType, setLeaderboardType] = useState('carbon');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (activeTab === 'leaderboard') {
      fetchLeaderboard(leaderboardType);
    }
  }, [leaderboardType, activeTab]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, trendsRes, activityRes, deptRes] = await Promise.all([
        analyticsAPI.getDashboardStats(),
        analyticsAPI.getMonthlyTrends(),
        analyticsAPI.getUserActivity(),
        analyticsAPI.getDepartmentStats()
      ]);

      setDashboardStats(statsRes.data.data);
      setTrends(trendsRes.data.data);
      setActivity(activityRes.data.data);
      setDepartments(deptRes.data.data);

      // Fetch initial leaderboard
      const leaderboardRes = await analyticsAPI.getLeaderboard('carbon', 10);
      setLeaderboard(leaderboardRes.data.data);
    } catch (error) {
      console.error('Fetch analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async (type) => {
    try {
      const response = await analyticsAPI.getLeaderboard(type, 10);
      setLeaderboard(response.data.data);
    } catch (error) {
      console.error('Fetch leaderboard error:', error);
    }
  };

  // Chart configurations
  const trendsChartData = trends ? {
    labels: trends.months,
    datasets: [
      {
        label: 'Rides',
        data: trends.rides,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Carbon Saved (kg)',
        data: trends.carbon,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  } : null;

  const trendsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Your Activity Trends (Last 6 Months)'
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Rides'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Carbon (kg CO₂)'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  const activityChartData = activity ? {
    labels: ['Upcoming', 'Completed', 'Cancelled'],
    datasets: [{
      data: [activity.rides.upcoming, activity.rides.completed, activity.rides.cancelled],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 0
    }]
  } : null;

  const activityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Ride Distribution'
      }
    }
  };

  const departmentChartData = departments.length > 0 ? {
    labels: departments.map(d => d.department),
    datasets: [{
      label: 'Carbon Saved (kg CO₂)',
      data: departments.map(d => d.carbonSaved),
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 1
    }]
  } : null;

  const departmentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Top Departments by Carbon Savings'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'kg CO₂'
        }
      }
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FiTrendingUp className="text-green-600" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Track your environmental impact and activity</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {['overview', 'trends', 'leaderboard', 'departments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === tab
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && dashboardStats && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Rides</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {dashboardStats.totalRides}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {dashboardStats.ridesOffered} offered · {dashboardStats.ridesTaken} taken
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiTruck className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Carbon Saved</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {dashboardStats.carbonSaved}
                      <span className="text-sm text-gray-500 ml-1">kg</span>
                    </p>
                    <p className="text-xs text-green-600 mt-1">CO₂ emissions reduced</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiWind className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Money Saved</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      ₹{dashboardStats.moneySaved.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 mt-1">Through carpooling</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FiActivity className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Your Rating</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {dashboardStats.rating > 0 ? dashboardStats.rating.toFixed(1) : 'N/A'}
                      <span className="text-sm text-gray-500 ml-1">⭐</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {dashboardStats.totalRatings} ratings
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FiAward className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Activity Breakdown */}
            {activity && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <FiTruck className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Rides</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Upcoming</span>
                      <Badge variant="info">{activity.rides.upcoming}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Completed</span>
                      <Badge variant="success">{activity.rides.completed}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cancelled</span>
                      <Badge variant="danger">{activity.rides.cancelled}</Badge>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center font-semibold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">{activity.rides.total}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <FiCalendar className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Trips</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active</span>
                      <Badge variant="info">{activity.trips.active}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Completed</span>
                      <Badge variant="success">{activity.trips.past}</Badge>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center font-semibold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">{activity.trips.total}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <FiShoppingBag className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-900">Marketplace</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Listings</span>
                      <Badge variant="info">{activity.marketplace.active}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Sold Items</span>
                      <Badge variant="success">{activity.marketplace.sold}</Badge>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center font-semibold">
                        <span className="text-gray-900">Total Listed</span>
                        <span className="text-gray-900">{activity.marketplace.listed}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activityChartData && (
                <Card>
                  <div style={{ height: '300px' }}>
                    <Doughnut data={activityChartData} options={activityChartOptions} />
                  </div>
                </Card>
              )}

              <Card>
                <div className="text-center py-12">
                  <FiAward className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Keep Going! 🎉
                  </h3>
                  <p className="text-gray-600 mb-2">
                    You've saved <span className="font-bold text-green-600">
                      {dashboardStats.carbonSaved} kg CO₂
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Equivalent to planting {Math.round(dashboardStats.carbonSaved / 20)} trees! 🌳
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && trendsChartData && (
          <div className="space-y-6">
            <Card>
              <div style={{ height: '400px' }}>
                <Line data={trendsChartData} options={trendsChartOptions} />
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="text-center">
                  <FiTrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Total Rides (6 months)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {trends.rides.reduce((a, b) => a + b, 0)}
                  </p>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <FiWind className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Total Carbon Saved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {trends.carbon.reduce((a, b) => a + b, 0).toFixed(1)} kg
                  </p>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <FiActivity className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Monthly Average</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(trends.rides.reduce((a, b) => a + b, 0) / 6).toFixed(1)} rides
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            {/* Leaderboard Type Selector */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setLeaderboardType('carbon')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  leaderboardType === 'carbon'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                🌱 Carbon Heroes
              </button>
              <button
                onClick={() => setLeaderboardType('rides')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  leaderboardType === 'rides'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                🚗 Most Active
              </button>
              <button
                onClick={() => setLeaderboardType('rating')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  leaderboardType === 'rating'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                ⭐ Top Rated
              </button>
            </div>

            <Card>
              <div className="space-y-4">
                {leaderboard.length === 0 ? (
                  <div className="text-center py-12">
                    <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No data available</p>
                  </div>
                ) : (
                  leaderboard.map((user, index) => (
                    <div
                      key={user._id}
                      className={`flex items-center gap-4 p-4 rounded-lg transition ${
                        index < 3
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex-shrink-0">
                        {index === 0 && (
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            🥇
                          </div>
                        )}
                        {index === 1 && (
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            🥈
                          </div>
                        )}
                        {index === 2 && (
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            🥉
                          </div>
                        )}
                        {index > 2 && (
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold text-lg">
                            {index + 1}
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {user.name}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">{user.department}</p>
                      </div>

                      {/* Stats */}
                      <div className="text-right">
                        {leaderboardType === 'carbon' && (
                          <>
                            <p className="font-bold text-lg text-green-600">
                              {user.carbonSaved.toFixed(1)} kg
                            </p>
                            <p className="text-xs text-gray-500">CO₂ saved</p>
                          </>
                        )}
                        {leaderboardType === 'rides' && (
                          <>
                            <p className="font-bold text-lg text-blue-600">
                              {user.ridesOffered}
                            </p>
                            <p className="text-xs text-gray-500">rides offered</p>
                          </>
                        )}
                        {leaderboardType === 'rating' && (
                          <>
                            <p className="font-bold text-lg text-yellow-600">
                              {user.rating > 0 ? user.rating.toFixed(1) : 'N/A'} ⭐
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.totalRatings} ratings
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Departments Tab */}
        {activeTab === 'departments' && departmentChartData && (
          <div className="space-y-6">
            <Card>
              <div style={{ height: '400px' }}>
                <Bar data={departmentChartData} options={departmentChartOptions} />
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Department Statistics
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Users
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rides Offered
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rides Taken
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Carbon Saved
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {departments.map((dept, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{dept.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {dept.users}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {dept.ridesOffered}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {dept.ridesTaken}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-green-600">
                            {dept.carbonSaved} kg
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-yellow-600">
                            {dept.averageRating > 0 ? `${dept.averageRating} ⭐` : 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;