


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiTruck, FiUsers, FiDollarSign, FiAward, FiShield, FiClock, 
  FiCalendar, FiShoppingBag, FiMapPin, FiPackage, FiPhone, 
  FiMail, FiLinkedin, FiInstagram, FiX 
} from 'react-icons/fi';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <FiTruck className="text-green-600 text-3xl" />
              <span className="text-2xl font-bold text-green-600">EcoRide</span>
            </div>

            {/* Nav Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-700 hover:text-green-600 font-medium px-4 py-2 transition-colors duration-200"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
              Smart Carpooling for{' '}
              <span className="text-green-600">Sustainable Living</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join XYZ Office's eco-friendly commute revolution. Save money, reduce emissions, 
              and connect with colleagues on your daily journey.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/register')}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                Get Started Free
                <span className="text-xl">→</span>
              </button>
              <button
                onClick={() => navigate('/login')}
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold px-8 py-4 rounded-lg transition-colors duration-200"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Right Content - Sample Card */}
          <div className="bg-green-500 rounded-3xl p-8 shadow-2xl">
            <div className="bg-white rounded-2xl p-6">
              {/* Today's Ride Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-3 rounded-full">
                  <FiTruck className="text-green-600 text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Today's Ride</h3>
                  <p className="text-gray-600 text-sm">Koramangala → Electronic City</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-3xl font-bold text-green-600">₹45</p>
                  <p className="text-gray-600 text-sm">You saved today</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">2.4 kg</p>
                  <p className="text-gray-600 text-sm">CO₂ reduced</p>
                </div>
              </div>

              {/* User Avatars */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold border-2 border-white">
                    U1
                  </div>
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold border-2 border-white">
                    U2
                  </div>
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold border-2 border-white">
                    U3
                  </div>
                </div>
                <span className="text-gray-600 font-medium">+2</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose EcoRide Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Benefits */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose EcoRide?</h2>
            <p className="text-lg text-gray-600 mb-8">
              More than just carpooling - it's a community-driven movement towards sustainable 
              commuting and meaningful connections.
            </p>
            <div className="space-y-4 mb-8">
              {[
                { icon: FiDollarSign, text: 'Save money on daily commute' },
                { icon: FiTruck, text: 'Reduce traffic congestion' },
                { icon: FiAward, text: 'Lower carbon emissions' },
                { icon: FiUsers, text: 'Build workplace connections' },
                { icon: FiShield, text: 'Safe and verified community' },
                { icon: FiClock, text: 'Flexible scheduling' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="bg-green-600 p-2 rounded-full">
                    <item.icon className="text-white text-lg" />
                  </div>
                  <p className="text-gray-700 font-medium">{item.text}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/register')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              Join the Movement
              <span className="text-xl">→</span>
            </button>
          </div>
        {/* Right - Stats Cards */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-4xl font-bold text-green-600 mb-2">500+</p>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-4xl font-bold text-green-600 mb-2">1,200+</p>
            <p className="text-gray-600">Rides Shared</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-4xl font-bold text-green-600 mb-2">2.5 Tons</p>
            <p className="text-gray-600 text-sm">CO₂ Saved</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-4xl font-bold text-green-600 mb-2">₹50,000+</p>
            <p className="text-gray-600">Money Saved</p>
          </div>
        </div>
         </div>
      </section>

      {/* Enhanced Features Section - Trips and Marketplace */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore More Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Beyond daily carpooling, EcoRide offers comprehensive solutions for group trips and sustainable marketplace
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan Group Trips Card */}
          <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 opacity-50"></div>
            
            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-cyan-200 rounded-full blur-2xl opacity-30"></div>
            
            <div className="relative z-10 p-8">
              {/* Icon with Gradient */}
              <div className="mb-6 relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FiCalendar className="text-white text-4xl" />
                </div>
                <div className="absolute -right-2 -top-2 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
                  <FiMapPin className="text-white text-sm" />
                </div>
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                Plan Group Trips
              </h3>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Organize unforgettable weekend getaways, team outings, and adventure trips with your colleagues. Share experiences, split costs, and create lasting memories together.
              </p>

              {/* Features List */}
              <div className="space-y-3">
                {[
                  'Organize multi-day adventures',
                  'Coordinate with multiple participants',
                  'Share travel itineraries',
                  'Split expenses easily'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>

              {/* Clickable Link */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => navigate('/register')}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all duration-200 flex items-center gap-2"
                  >
                    Start Planning →
                  </button>
                  <div className="flex gap-2">
                    {['🏔️', '🏖️', '🎒'].map((emoji, i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center text-sm transform group-hover:scale-110 transition-transform duration-200">
                        {emoji}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Community Marketplace Card */}
          <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 opacity-50"></div>
            
            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-pink-200 rounded-full blur-2xl opacity-30"></div>
            
            <div className="relative z-10 p-8">
              {/* Icon with Gradient */}
              <div className="mb-6 relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FiShoppingBag className="text-white text-4xl" />
                </div>
                <div className="absolute -right-2 -top-2 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                  <FiPackage className="text-white text-sm" />
                </div>
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                Community Marketplace
              </h3>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Buy and sell unique items from your trips. Share local treasures, souvenirs, and special finds with your office community. Support sustainable consumption!
              </p>

              {/* Features List */}
              <div className="space-y-3">
                {[
                  'List items for sale or delivery',
                  'Order from fellow travelers',
                  'Safe in-office transactions',
                  'Eco-friendly item sharing'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <p className="text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>

              {/* Clickable Link */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => navigate('/register')}
                    className="text-sm font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-all duration-200 flex items-center gap-2"
                  >
                    Browse Items →
                  </button>
                  <div className="flex gap-2">
                    {['🎁', '🏔️', '🎨'].map((emoji, i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-sm transform group-hover:scale-110 transition-transform duration-200">
                        {emoji}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">How It Works</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Getting started with EcoRide is simple. Follow these three easy steps to begin your 
            sustainable commute journey.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600">
                Create your account with your XYZ Office email and set up your profile.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Find a Ride</h3>
              <p className="text-gray-600">
                Browse available rides or post your own. Our AI matches you with compatible riders.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Start Saving</h3>
              <p className="text-gray-600">
                Enjoy your commute while saving money and reducing your carbon footprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Eco-Friendly Journey?
          </h2>
          <p className="text-xl text-green-50 mb-8">
            Join hundreds of XYZ Office employees already making a difference.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white hover:bg-gray-100 text-green-600 font-bold px-10 py-4 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            Get Started Today
            <span className="text-xl">→</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FiTruck className="text-green-500 text-2xl" />
                <span className="text-xl font-bold">EcoRide</span>
              </div>
              <p className="text-gray-400">
                Making sustainable commuting simple and rewarding for XYZ Office.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/register')} className="hover:text-white">Find Rides</button></li>
                <li><button onClick={() => navigate('/register')} className="hover:text-white">Plan Trip</button></li>
                <li><button onClick={() => navigate('/register')} className="hover:text-white">Marketplace</button></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => openModal('about')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openModal('contact')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openModal('privacy')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <p className="text-gray-400 mb-4">
                Follow us on social media
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://www.linkedin.com/in/vaishhnavikadiyala/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <FiLinkedin className="text-xl" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/vaishhnavikadiyala/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <FiInstagram className="text-xl" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EcoRide - XYZ Office. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modal Overlays */}
      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeModal === 'about' && 'About Us'}
                {activeModal === 'contact' && 'Contact Us'}
                {activeModal === 'privacy' && 'Privacy Policy'}
              </h2>
              <button
                onClick={closeModal}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <FiX className="text-xl text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">
              {activeModal === 'about' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                    <p className="text-gray-700 leading-relaxed">
                      At EcoRide, we believe that every journey matters. Born from a simple yet powerful vision, 
                      we're on a mission to transform the way XYZ Office employees commute, travel, and connect.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">🌍 Fighting Pollution, One Ride at a Time</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      India's cities are choking under the weight of vehicular pollution. Every single-occupancy 
                      vehicle on the road contributes to this growing crisis. We saw colleagues driving solo to the 
                      same destination, cars sitting idle in parking lots, and emissions rising needlessly. 
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      <strong className="text-green-600">EcoRide was born to change this.</strong> By connecting colleagues 
                      who share similar routes, we're not just reducing the number of vehicles on the road—we're cutting 
                      down thousands of kilograms of CO₂ emissions every month. Together, we're building a cleaner, 
                      greener future for our city and our planet.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">🛍️ Bridging Distances Through Community</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Have you ever wanted something from a distant place but couldn't access it easily? 
                      Maybe it's a handcrafted souvenir from Rajasthan, fresh spices from Kerala, or unique 
                      handicrafts from the Northeast. Traditional delivery services are expensive and slow.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      <strong className="text-purple-600">Our marketplace solves this beautifully.</strong> When colleagues 
                      travel for work or leisure, they can bring back items for others. No hefty courier charges, 
                      no long wait times—just community members helping each other access the treasures of our 
                      diverse country. It's sustainable, it's economical, and it brings us closer together.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">💰 Saving Money, Building Friendships</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Fuel prices are soaring, and so is the cost of daily commutes. But carpooling isn't just 
                      about splitting costs—it's about splitting the journey with someone interesting. Some of 
                      the best conversations happen during commutes. New friendships form. Ideas are exchanged. 
                      The workplace becomes more than just cubicles and meetings.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">🌟 More Than Just an App</h3>
                    <p className="text-gray-700 leading-relaxed">
                      EcoRide isn't just a carpooling platform or a marketplace. It's a movement towards conscious 
                      living. Every ride shared is a step towards cleaner air. Every item exchanged is a testament 
                      to trust and community. Every rupee saved is a small victory in these challenging times.
                    </p>
                    <p className="text-gray-700 leading-relaxed mt-3">
                      <strong>We started with XYZ Office, but our dream is bigger.</strong> We envision workplaces 
                      across India adopting this model—reducing emissions, fostering connections, and creating 
                      sustainable communities. One office at a time, one ride at a time, one shared item at a time.
                    </p>
                  </div>

                  <div className="text-center py-4">
                    <p className="text-lg font-semibold text-green-600">
                      Join us in making every journey count. 🚗💚
                    </p>
                  </div>
                </div>
              )}

              {activeModal === 'contact' && (
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    We'd love to hear from you! Whether you have questions, feedback, or need support, 
                    our team is here to help.
                  </p>

                  <div className="space-y-4">
                    {/* Phone */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiPhone className="text-green-600 text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                        <a href="tel:+919845667234" className="text-green-600 hover:underline">
                          +91 98456 67234
                        </a>
                        <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9:00 AM - 6:00 PM</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiMail className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                        <a href="mailto:support@ecoride.xyz" className="text-blue-600 hover:underline">
                          support@ecoride.xyz
                        </a>
                        <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                      </div>
                    </div>

                    {/* Office Address */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiMapPin className="text-purple-600 text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Office Address</h4>
                        <p className="text-gray-700">
                          Prestige Tech Park<br />
                          Bangalore, Karnataka
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <h4 className="font-semibold text-gray-900 mb-2">🚀 Quick Response Tips</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Include your registered email in your message</li>
                      <li>• Describe your issue clearly with screenshots if possible</li>
                      <li>• Check our FAQs before reaching out</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeModal === 'privacy' && (
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    At EcoRide, we take your privacy seriously. This policy outlines how we collect, 
                    use, and protect your information.
                  </p>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">1. Information We Collect</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li><strong>Account Information:</strong> Name, email address (@xyz.com), phone number, and profile details</li>
                      <li><strong>Ride Information:</strong> Pickup/drop locations, ride preferences, and scheduling details</li>
                      <li><strong>Trip Data:</strong> Group trip details, participant information, and itineraries</li>
                      <li><strong>Marketplace Activity:</strong> Item listings, orders, ratings, and transaction history</li>
                      <li><strong>Communication Data:</strong> In-app messages, notifications, and support inquiries</li>
                      <li><strong>Usage Analytics:</strong> App interactions, feature usage, and performance data</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">2. How We Use Your Information</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Facilitate ride matching and group trip coordination</li>
                      <li>Process marketplace transactions and deliveries</li>
                      <li>Send ride notifications, updates, and important announcements</li>
                      <li>Improve platform features and user experience</li>
                      <li>Calculate carbon savings and environmental impact</li>
                      <li>Provide customer support and resolve issues</li>
                      <li>Ensure platform security and prevent fraud</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">3. Information Sharing</h3>
                    <p className="text-gray-700 mb-2">
                      We <strong>DO NOT</strong> sell your personal information to third parties. We only share data:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>With other XYZ Office employees for ride coordination (name, photo, contact)</li>
                      <li>In aggregated, anonymized form for analytics and reporting</li>
                      <li>When required by law or legal process</li>
                      <li>To protect rights, safety, and security of our users</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">4. Data Security</h3>
                    <p className="text-gray-700 mb-2">
                      We implement industry-standard security measures including:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Encrypted data transmission (HTTPS/SSL)</li>
                      <li>Secure password storage with hashing</li>
                      <li>Regular security audits and updates</li>
                      <li>Restricted access to personal data</li>
                      <li>Email domain verification (@xyz.com only)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">5. Your Rights</h3>
                    <p className="text-gray-700 mb-2">You have the right to:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Access and download your personal data</li>
                      <li>Update or correct your information</li>
                      <li>Delete your account and associated data</li>
                      <li>Opt-out of non-essential notifications</li>
                      <li>Request information about data processing</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">6. Cookies and Tracking</h3>
                    <p className="text-gray-700">
                      We use cookies and similar technologies to enhance your experience, remember preferences, 
                      and analyze platform usage. You can control cookie settings through your browser.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">7. Data Retention</h3>
                    <p className="text-gray-700">
                      We retain your data as long as your account is active or as needed to provide services. 
                      After account deletion, we anonymize or remove personal information within 30 days, 
                      except where required by law.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">8. Children's Privacy</h3>
                    <p className="text-gray-700">
                      EcoRide is intended for XYZ Office employees (18+ years). We do not knowingly collect 
                      information from individuals under 18.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">9. Changes to Privacy Policy</h3>
                    <p className="text-gray-700">
                      We may update this policy periodically. Users will be notified of significant changes 
                      via email or in-app notifications. Continued use after changes indicates acceptance.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h4 className="font-semibold text-gray-900 mb-2">📧 Questions About Privacy?</h4>
                    <p className="text-sm text-gray-700">
                      Contact us at <a href="mailto:support@ecoride.xyz" className="text-blue-600 hover:underline">support@ecoride.xyz</a> or 
                      call <a href="tel:+919845667234" className="text-blue-600 hover:underline">+91 98456 67234</a>
                    </p>
                  </div>

                  <p className="text-sm text-gray-500 text-center">
                    Last updated: June 2025
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <button
                onClick={closeModal}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;

