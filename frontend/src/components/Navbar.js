// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import {
//   FiHome,
//   FiTruck,
//   FiCalendar,
//   FiShoppingBag,
//   FiMessageSquare,
//   FiUser,
//   FiLogOut,
//   FiMenu,
//   FiX,
// } from 'react-icons/fi';
// import { FaRobot } from 'react-icons/fa';
// import { useAuth } from '../context/AuthContext';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logout } = useAuth();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const isActive = (path) => {
//     return location.pathname === path;
//   };

//   const navLinks = [
//     { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
//     { path: '/rides', icon: FiTruck, label: 'Rides' },
//     { path: '/trips', icon: FiCalendar, label: 'Trips' },
//     { path: '/marketplace', icon: FiShoppingBag, label: 'Marketplace' },
//     { path: '/chat', icon: FiMessageSquare, label: 'Chat' },
//     // { path: '/chatbot', icon: FaRobot, label: 'AI Assistant' }, // NEW: AI Chatbot
//     // { path: '/analytics', icon: FiBarChart2, label: 'Analytics' }, // COMMENTED OUT - Analytics temporarily disabled
//   ];

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link to="/dashboard" className="flex items-center gap-2">
//             <FiTruck className="text-green-600 text-2xl" />
//             <span className="text-xl font-bold text-green-600">EcoRide</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-1">
//             {navLinks.map((link) => {
//               const Icon = link.icon;
//               return (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
//                     isActive(link.path)
//                       ? 'bg-green-100 text-green-600'
//                       : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   <Icon className="w-4 h-4" />
//                   {link.label}
//                 </Link>
//               );
//             })}

//             {/* COMMENTED OUT - Notifications temporarily disabled */}
//             {/* Notifications with Badge */}
//             {/* <Link
//               to="/notifications"
//               className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 relative transition-colors ${
//                 isActive('/notifications')
//                   ? 'bg-green-100 text-green-600'
//                   : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
//               }`}
//             >
//               <FiBell className="w-4 h-4" />
//               Notifications
//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                   {unreadCount > 9 ? '9+' : unreadCount}
//                 </span>
//               )}
//             </Link> */}

//             {/* Profile Dropdown */}
//             <div className="ml-3 relative">
//               <button
//                 onClick={() => navigate('/profile')}
//                 className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                   isActive('/profile')
//                     ? 'bg-green-100 text-green-600'
//                     : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
//                 }`}
//               >
//                 <FiUser className="w-4 h-4" />
//                 {user?.name?.split(' ')[0] || 'Profile'}
//               </button>
//             </div>

//             {/* Logout Button */}
//             <button
//               onClick={handleLogout}
//               className="ml-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
//             >
//               <FiLogOut className="w-4 h-4" />
//               Logout
//             </button>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 transition-colors"
//           >
//             {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden bg-white border-t border-gray-200">
//           <div className="px-2 pt-2 pb-3 space-y-1">
//             {navLinks.map((link) => {
//               const Icon = link.icon;
//               return (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   onClick={() => setIsMenuOpen(false)}
//                   className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 transition-colors ${
//                     isActive(link.path)
//                       ? 'bg-green-100 text-green-600'
//                       : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   <Icon className="w-5 h-5" />
//                   {link.label}
//                 </Link>
//               );
//             })}

//             {/* COMMENTED OUT - Notifications temporarily disabled */}
//             {/* Notifications */}
//             {/* <Link
//               to="/notifications"
//               onClick={() => setIsMenuOpen(false)}
//               className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 relative transition-colors ${
//                 isActive('/notifications')
//                   ? 'bg-green-100 text-green-600'
//                   : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
//               }`}
//             >
//               <FiBell className="w-5 h-5" />
//               Notifications
//               {unreadCount > 0 && (
//                 <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                   {unreadCount > 9 ? '9+' : unreadCount}
//                 </span>
//               )}
//             </Link> */}

//             {/* Profile */}
//             <Link
//               to="/profile"
//               onClick={() => setIsMenuOpen(false)}
//               className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 transition-colors ${
//                 isActive('/profile')
//                   ? 'bg-green-100 text-green-600'
//                   : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
//               }`}
//             >
//               <FiUser className="w-5 h-5" />
//               {user?.name || 'Profile'}
//             </Link>

//             {/* Logout */}
//             <button
//               onClick={() => {
//                 setIsMenuOpen(false);
//                 handleLogout();
//               }}
//               className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
//             >
//               <FiLogOut className="w-5 h-5" />
//               Logout
//             </button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
























import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiTruck,
  FiCalendar,
  FiShoppingBag,
  FiMessageSquare,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';
// import { FaRobot } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/chatAPI';
import { useSocket } from '../context/SocketContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { socket } = useSocket();

  // Fetch total unread count
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  // Listen for new messages via socket
  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', () => {
      // Refresh unread count when new message arrives
      fetchUnreadCount();
    });

    return () => {
      socket.off('receive_message');
    };
  }, [socket]);

  const fetchUnreadCount = async () => {
    try {
      const response = await chatAPI.getChats();
      if (response.data && Array.isArray(response.data)) {
        const total = response.data.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
        setTotalUnreadCount(total);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/rides', icon: FiTruck, label: 'Rides' },
    { path: '/trips', icon: FiCalendar, label: 'Trips' },
    { path: '/marketplace', icon: FiShoppingBag, label: 'Marketplace' },
    { path: '/chat', icon: FiMessageSquare, label: 'Chat', badge: totalUnreadCount },
    // { path: '/chatbot', icon: FaRobot, label: 'AI Assistant' }, // NEW: AI Chatbot
    // { path: '/analytics', icon: FiBarChart2, label: 'Analytics' }, // COMMENTED OUT - Analytics temporarily disabled
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <FiTruck className="text-green-600 text-2xl" />
            <span className="text-xl font-bold text-green-600">EcoRide</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 relative transition-colors ${
                    isActive(link.path)
                      ? 'bg-green-100 text-green-600'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                  {/* Unread Badge for Chat */}
                  {link.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {link.badge > 9 ? '9+' : link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* COMMENTED OUT - Notifications temporarily disabled */}
            {/* Notifications with Badge */}
            {/* <Link
              to="/notifications"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 relative transition-colors ${
                isActive('/notifications')
                  ? 'bg-green-100 text-green-600'
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              <FiBell className="w-4 h-4" />
              Notifications
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link> */}

            {/* Profile Dropdown */}
            <div className="ml-3 relative">
              <button
                onClick={() => navigate('/profile')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/profile')
                    ? 'bg-green-100 text-green-600'
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                <FiUser className="w-4 h-4" />
                {user?.name?.split(' ')[0] || 'Profile'}
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <FiLogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 relative transition-colors ${
                    isActive(link.path)
                      ? 'bg-green-100 text-green-600'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                  {/* Unread Badge for Chat (Mobile) */}
                  {link.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {link.badge > 9 ? '9+' : link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* COMMENTED OUT - Notifications temporarily disabled */}
            {/* Notifications */}
            {/* <Link
              to="/notifications"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 relative transition-colors ${
                isActive('/notifications')
                  ? 'bg-green-100 text-green-600'
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              <FiBell className="w-5 h-5" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link> */}

            {/* Profile */}
            <Link
              to="/profile"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 transition-colors ${
                isActive('/profile')
                  ? 'bg-green-100 text-green-600'
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              <FiUser className="w-5 h-5" />
              {user?.name || 'Profile'}
            </Link>

            {/* Logout */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;