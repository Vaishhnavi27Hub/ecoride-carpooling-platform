// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   FiTruck, FiMapPin, FiShoppingBag, FiTrendingUp, 
//   FiUsers, FiCalendar, FiDollarSign, FiDroplet 
// } from 'react-icons/fi';
// import { useAuth } from '../context/AuthContext';
// // import { analyticsAPI } from '../services/api';
// import api from '../services/api';
// import Navbar from '../components/Navbar';
// import Card from '../components/Card';
// import LoadingSpinner from '../components/LoadingSpinner';
// import { formatCurrency, formatNumber } from '../utils/helpers';

// const Dashboard = () => {
//   const { user } = useAuth();
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardStats();
//   }, []);

//   // const fetchDashboardStats = async () => {
//   //   try {
//   //     const response = await analyticsAPI.getDashboard();
//   //     setStats(response.data);
//   //   } catch (error) {
//   //     console.error('Error fetching dashboard stats:', error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchDashboardStats = async () => {
//   try {
//     const response = await api.get('/dashboard/stats');  // ✅ Direct API call
//     console.log('✅ Dashboard Stats Response:', response.data);
//     setStats(response.data.data);  // Note: response.data.data
//   } catch (error) {
//     console.error('❌ Error fetching dashboard stats:', error);
//     // Set default values on error
//     setStats({
//       ridesOffered: 0,
//       ridesTaken: 0,
//       carbonSaved: 0,
//       moneySaved: 0,
//       activeRides: 0,
//       upcomingTrips: 0,
//       rating: 0,
//       totalRatings: 0
//     });
//   } finally {
//     setLoading(false);
//   }
// };


//   const quickActions = [
//     {
//       title: 'Find a Ride',
//       description: 'Search for available rides',
//       icon: <FiTruck className="text-3xl" />,
//       link: '/rides',
//       color: 'from-blue-400 to-blue-600',
//     },
//     {
//       title: 'Offer a Ride',
//       description: 'Create a new ride',
//       icon: <FiMapPin className="text-3xl" />,
//       link: '/rides/create',
//       color: 'from-green-400 to-green-600',
//     },
//     {
//       title: 'Browse Trips',
//       description: 'Explore group trips',
//       icon: <FiCalendar className="text-3xl" />,
//       link: '/trips',
//       color: 'from-purple-400 to-purple-600',
//     },
//     {
//       title: 'Marketplace',
//       description: 'Buy & sell items',
//       icon: <FiShoppingBag className="text-3xl" />,
//       link: '/marketplace',
//       color: 'from-pink-400 to-pink-600',
//     },
//   ];

//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <LoadingSpinner fullScreen message="Loading dashboard..." />
//       </>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Welcome Section */}
//         <div className="mb-8 animate-fade-in">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Welcome back, {user?.name?.split(' ')[0]}! 👋
//           </h1>
//           <p className="text-gray-600">
//             Here's what's happening with your eco-friendly journey today.
//           </p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Rides Offered</p>
//                 <p className="text-3xl font-bold text-gray-900">
//                   {formatNumber(stats?.ridesOffered || 0)}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                 <FiTruck className="text-2xl text-blue-600" />
//               </div>
//             </div>
//           </Card>

//           <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Rides Taken</p>
//                 <p className="text-3xl font-bold text-gray-900">
//                   {formatNumber(stats?.ridesTaken || 0)}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//                 <FiUsers className="text-2xl text-green-600" />
//               </div>
//             </div>
//           </Card>

//           <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Money Saved</p>
//                 <p className="text-3xl font-bold text-gray-900">
//                   {formatCurrency(stats?.moneySaved || 0)}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
//                 <FiDollarSign className="text-2xl text-yellow-600" />
//               </div>
//             </div>
//           </Card>

//           <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">CO₂ Saved</p>
//                 <p className="text-3xl font-bold text-gray-900">
//                   {formatNumber(stats?.carbonSaved || 0)} kg
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//                 <FiDroplet className="text-2xl text-green-600" />
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* Quick Actions */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {quickActions.map((action, index) => (
//               <Link
//                 key={index}
//                 to={action.link}
//                 className="animate-slide-up"
//                 style={{ animationDelay: `${0.1 * (index + 5)}s` }}
//               >
//                 <Card hover className="h-full">
//                   <div className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>
//                     {action.icon}
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                     {action.title}
//                   </h3>
//                   <p className="text-gray-600 text-sm">
//                     {action.description}
//                   </p>
//                 </Card>
//               </Link>
//             ))}
//           </div>
//         </div>

//         {/* Environmental Impact */}
//         <div className="grid md:grid-cols-2 gap-6">
//           <Card className="animate-slide-up">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                 <FiDroplet className="text-xl text-green-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900">
//                 Environmental Impact
//               </h3>
//             </div>
            
//             <div className="space-y-4">
//               <div>
//                 <div className="flex justify-between mb-2">
//                   <span className="text-sm text-gray-600">Carbon Reduction</span>
//                   <span className="text-sm font-semibold text-green-600">
//                     {formatNumber(stats?.carbonSaved || 0)} kg CO₂
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-green-500 h-2 rounded-full transition-all duration-500"
//                     style={{ width: `${Math.min((stats?.carbonSaved || 0) / 100 * 100, 100)}%` }}
//                   ></div>
//                 </div>
//               </div>

//               <div className="bg-green-50 rounded-lg p-4">
//                 <p className="text-sm text-green-800">
//                   🌳 That's equivalent to planting{' '}
//                   <span className="font-bold">
//                     {Math.floor((stats?.carbonSaved || 0) / 21)} trees
//                   </span>
//                   !
//                 </p>
//               </div>
//             </div>
//           </Card>

//           <Card className="animate-slide-up">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                 <FiTrendingUp className="text-xl text-blue-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900">
//                 Your Progress
//               </h3>
//             </div>
// {/* rating section commenting out */}
//             <div className="space-y-4">
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div className="flex items-center space-x-3">
//                   <div className="text-2xl">⭐</div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">Rating</p>
//                     <p className="text-xs text-gray-600">
//                       {stats?.totalRatings || 0} reviews
//                     </p>
//                   </div>
//                 </div>
//                 <p className="text-2xl font-bold text-yellow-600">
//                   {(stats?.rating || 0).toFixed(1)}
//                 </p>
//               </div>

//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div className="flex items-center space-x-3">
//                   <div className="text-2xl">🎯</div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">Total Rides</p>
//                     <p className="text-xs text-gray-600">Offered + Taken</p>
//                   </div>
//                 </div>
//                 <p className="text-2xl font-bold text-blue-600">
//                   {formatNumber((stats?.ridesOffered || 0) + (stats?.ridesTaken || 0))}
//                 </p>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;





import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiTruck, FiMapPin, FiShoppingBag, FiTrendingUp, 
  FiUsers, FiCalendar, FiDollarSign, FiDroplet 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
// import { analyticsAPI } from '../services/api';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, formatNumber } from '../utils/helpers';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // const fetchDashboardStats = async () => {
  //   try {
  //     const response = await analyticsAPI.getDashboard();
  //     setStats(response.data);
  //   } catch (error) {
  //     console.error('Error fetching dashboard stats:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');  // ✅ Direct API call
      console.log('✅ Dashboard Stats Response:', response.data);
      setStats(response.data.data);  // Note: response.data.data
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      // Set default values on error
      setStats({
        ridesOffered: 0,
        ridesTaken: 0,
        carbonSaved: 0,
        moneySaved: 0,
        activeRides: 0,
        upcomingTrips: 0,
        rating: 0,
        totalRatings: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Find a Ride',
      description: 'Search for available rides',
      icon: <FiTruck className="text-3xl" />,
      link: '/rides',
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: 'Offer a Ride',
      description: 'Create a new ride',
      icon: <FiMapPin className="text-3xl" />,
      link: '/rides/create',
      color: 'from-green-400 to-green-600',
    },
    {
      title: 'Browse Trips',
      description: 'Explore group trips',
      icon: <FiCalendar className="text-3xl" />,
      link: '/trips',
      color: 'from-purple-400 to-purple-600',
    },
    {
      title: 'Marketplace',
      description: 'Buy & sell items',
      icon: <FiShoppingBag className="text-3xl" />,
      link: '/marketplace',
      color: 'from-pink-400 to-pink-600',
    },
  ];

  // Calculate trees with more encouraging formula (shows decimal trees)
  const treesEquivalent = (stats?.carbonSaved / 10 || 0).toFixed(1);

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner fullScreen message="Loading dashboard..." />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your eco-friendly journey today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rides Offered</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatNumber(stats?.ridesOffered || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FiTruck className="text-2xl text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rides Taken</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatNumber(stats?.ridesTaken || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FiUsers className="text-2xl text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Money Saved</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(stats?.moneySaved || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <FiDollarSign className="text-2xl text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">CO₂ Saved</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatNumber(stats?.carbonSaved || 0)} kg
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FiDroplet className="text-2xl text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="animate-slide-up"
                style={{ animationDelay: `${0.1 * (index + 5)}s` }}
              >
                <Card hover className="h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {action.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Environmental Impact & Progress - Side by Side */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Environmental Impact Card */}
          <Card className="animate-slide-up">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FiDroplet className="text-xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Environmental Impact
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Carbon Reduction</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatNumber(stats?.carbonSaved || 0)} kg CO₂
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((stats?.carbonSaved || 0) / 100 * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  🌳 That's equivalent to planting{' '}
                  <span className="font-bold">
                    {treesEquivalent} {parseFloat(treesEquivalent) === 1 ? 'tree' : 'trees'}
                  </span>
                  !
                </p>
              </div>
            </div>
          </Card>

          {/* Your Progress Card - WITHOUT RATING */}
          <Card className="animate-slide-up">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FiTrendingUp className="text-xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Your Progress
              </h3>
            </div>

            <div className="space-y-4">
              {/* RATING SECTION REMOVED - Commented out for professional environment */}
              {/* 
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">⭐</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Rating</p>
                    <p className="text-xs text-gray-600">
                      {stats?.totalRatings || 0} reviews
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-yellow-600">
                  {(stats?.rating || 0).toFixed(1)}
                </p>
              </div>
              */}

              {/* Total Rides */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Total Rides</p>
                    <p className="text-xs text-gray-600">Offered + Taken</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {formatNumber((stats?.ridesOffered || 0) + (stats?.ridesTaken || 0))}
                </p>
              </div>

              {/* Active Rides */}
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🚗</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Active Rides</p>
                    <p className="text-xs text-gray-600">Currently ongoing</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatNumber(stats?.activeRides || 0)}
                </p>
              </div>

              {/* Upcoming Trips */}
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">📅</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Upcoming Trips</p>
                    <p className="text-xs text-gray-600">Planned adventures</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {formatNumber(stats?.upcomingTrips || 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;