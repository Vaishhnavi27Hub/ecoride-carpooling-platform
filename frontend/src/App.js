import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Import pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import RidesPage from './pages/RidesPage';
import CreateRidePage from './pages/CreateRidePage';
import TripsPage from './pages/TripsPage';
import CreateTripPage from './pages/CreateTripPage';
import MarketplacePage from './pages/MarketplacePage';
import CreateItemPage from './pages/CreateItemPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotificationsPage from './pages/NotificationsPage';
import MyListingsPage from './pages/MyListingsPage';
import MyOrdersPage from './pages/MyOrdersPage';
// import ChatbotPage from './pages/ChatbotPage';


function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Rides Routes */}
            <Route path="/rides" element={<RidesPage />} />
            <Route path="/rides/create" element={<CreateRidePage />} />
            
            {/* Trips Routes */}
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/create" element={<CreateTripPage />} />
            
            {/* Marketplace Routes */}
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/marketplace/create" element={<CreateItemPage />} />
            <Route path="/marketplace/my-listings" element={<MyListingsPage />} />
            <Route path="/marketplace/my-orders" element={<MyOrdersPage />} />
            
            {/* Profile Route */}
            <Route path="/profile" element={<ProfilePage />} />
            
            <Route path="/chat" element={<ChatPage />} />
           
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;