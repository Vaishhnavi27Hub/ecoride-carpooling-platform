
// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// App Configuration
export const APP_NAME = 'EcoRide';
export const COMPANY_NAME = 'XYZ Office';
export const COMPANY_EMAIL_DOMAIN = '@xyz.com';

// Pagination
export const ITEMS_PER_PAGE = 10;
export const RIDES_PER_PAGE = 12;
export const TRIPS_PER_PAGE = 9;

// Date & Time Formats
export const DATE_FORMAT = 'MMM DD, YYYY';
export const TIME_FORMAT = 'hh:mm A';
export const DATETIME_FORMAT = 'MMM DD, YYYY hh:mm A';

// Vehicle Types
export const VEHICLE_TYPES = [
  'Sedan',
  'Hatchback',
  'SUV',
  'MUV',
  'Bike',
  'Scooter'
];

// Popular Locations in Bangalore
export const POPULAR_LOCATIONS = [
  'Koramangala',
  'Indiranagar',
  'Electronic City',
  'Whitefield',
  'Marathahalli',
  'HSR Layout',
  'BTM Layout',
  'Jayanagar',
  'JP Nagar',
  'Banashankari',
  'Rajajinagar',
  'Malleshwaram',
  'Hebbal',
  'Yelahanka',
  'Sarjapur Road',
  'Bellandur',
  'Bommanahalli',
  'KR Puram',
  'Majestic',
  'Silk Board'
];

// Trip Categories
export const TRIP_CATEGORIES = [
  'Weekend Getaway',
  'Team Outing',
  'Adventure',
  'Beach',
  'Mountains',
  'Religious',
  'Historical',
  'Wildlife',
  'Cultural',
  'Food Tour',
  'Other'
];

// Trip Difficulty Levels
export const DIFFICULTY_LEVELS = [
  'Easy',
  'Moderate',
  'Challenging',
  'Difficult'
];

// ============================================
// MARKETPLACE CONSTANTS
// ============================================

// Item Categories - UPDATED to match backend
export const ITEM_CATEGORIES = [
  'Food',
  'Handicrafts',
  'Clothing',
  'Souvenirs',
  'Electronics',
  'Books',
  'Other'
];

// Item Conditions - UPDATED to match backend
export const ITEM_CONDITIONS = [
  'New',
  'Like New',
  'Good',
  'Fair'
];

// Item Availability Status
export const ITEM_AVAILABILITY_STATUS = {
  AVAILABLE: 'available',
  SOLD_OUT: 'sold_out',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
};

// Order Status - UPDATED for marketplace workflow
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Order Status Colors - UPDATED
export const ORDER_STATUS_COLORS = {
  pending: 'yellow',
  confirmed: 'blue',
  delivered: 'green',
  cancelled: 'red'
};

// ============================================
// USER & DEPARTMENT CONSTANTS
// ============================================

// Departments
export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Customer Support',
  'Legal',
  'Other'
];

// ============================================
// STATUS CONSTANTS
// ============================================

// Ride Status
export const RIDE_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Ride Status Colors
export const RIDE_STATUS_COLORS = {
  active: 'green',
  completed: 'gray',
  cancelled: 'red'
};

// Trip Status
export const TRIP_STATUS = {
  PLANNED: 'planned',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Trip Status Colors
export const TRIP_STATUS_COLORS = {
  planned: 'blue',
  ongoing: 'green',
  completed: 'gray',
  cancelled: 'red'
};

// ============================================
// NOTIFICATION CONSTANTS
// ============================================

// Notification Types
export const NOTIFICATION_TYPES = {
  RIDE_REQUEST: 'ride_request',
  RIDE_ACCEPTED: 'ride_accepted',
  RIDE_REJECTED: 'ride_rejected',
  RIDE_CANCELLED: 'ride_cancelled',
  TRIP_INVITE: 'trip_invite',
  TRIP_UPDATE: 'trip_update',
  ORDER_RECEIVED: 'order_received',
  ORDER_STATUS: 'order_status',
  CHAT_MESSAGE: 'chat_message',
  SYSTEM: 'system'
};

// Notification Priority
export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// ============================================
// CHAT CONSTANTS
// ============================================

// Chat Context Types
export const CHAT_CONTEXT_TYPES = {
  RIDE: 'ride',
  TRIP: 'trip',
  ITEM: 'item',
  GENERAL: 'general'
};

// ============================================
// USER PREFERENCES
// ============================================

// Music Preferences
export const MUSIC_PREFERENCES = [
  'Any',
  'Pop',
  'Rock',
  'Classical',
  'Jazz',
  'Electronic',
  'Hip Hop',
  'Country',
  'Silent'
];

// Chattiness Levels
export const CHATTINESS_LEVELS = [
  'Quiet',
  'Moderate',
  'Chatty'
];

// ============================================
// ENVIRONMENTAL & COST FACTORS
// ============================================

// Carbon Emission Factors (kg CO2 per km)
export const CARBON_FACTORS = {
  car: 0.12,
  bike: 0.05,
  scooter: 0.04,
  suv: 0.18,
  sedan: 0.12,
  hatchback: 0.10,
  muv: 0.15
};

// Average fuel costs (per km in INR)
export const FUEL_COSTS = {
  car: 6,
  bike: 2,
  scooter: 1.5,
  suv: 8,
  sedan: 6,
  hatchback: 5,
  muv: 7
};

// ============================================
// PAYMENT & MARKETPLACE
// ============================================

// Payment Methods
export const PAYMENT_METHODS = [
  'Cash',
  'UPI',
  'Bank Transfer',
  'Card',
  'Other'
];

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded'
};

// Delivery Methods
export const DELIVERY_METHODS = [
  'Hand Delivery',
  'Office Delivery',
  'Meetup'
];

// Rating Levels
export const RATING_LEVELS = {
  EXCELLENT: 5,
  GOOD: 4,
  AVERAGE: 3,
  POOR: 2,
  TERRIBLE: 1
};

// Review Categories
export const REVIEW_CATEGORIES = [
  'Product Quality',
  'Description Accuracy',
  'Seller Communication',
  'Delivery Speed',
  'Packaging',
  'Value for Money'
];

// ============================================
// VALIDATION RULES
// ============================================

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_LENGTH: 10,
  EMPLOYEE_ID_PATTERN: /^XYZ\d+$/,
  VEHICLE_NUMBER_PATTERN: /^[A-Z]{2}-\d{2}-[A-Z]{1,2}-\d{4}$/,
  MAX_SEATS: 8,
  MIN_PRICE: 0,
  MAX_PRICE: 10000,
  ITEM_NAME_MAX_LENGTH: 100,
  ITEM_DESCRIPTION_MAX_LENGTH: 1000,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 100
};

// ============================================
// MESSAGES
// ============================================

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized. Please login again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_INPUT: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please fill all required fields correctly.',
  ORDER_FAILED: 'Failed to place order. Please try again.',
  ITEM_UNAVAILABLE: 'This item is no longer available.',
  INSUFFICIENT_QUANTITY: 'Insufficient quantity available.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  RIDE_CREATED: 'Ride created successfully!',
  RIDE_UPDATED: 'Ride updated successfully!',
  RIDE_CANCELLED: 'Ride cancelled successfully!',
  RIDE_REQUEST_SENT: 'Join request sent successfully!',
  TRIP_CREATED: 'Trip created successfully!',
  ITEM_LISTED: 'Item listed successfully!',
  ITEM_UPDATED: 'Item updated successfully!',
  ITEM_DELETED: 'Item deleted successfully!',
  ORDER_PLACED: 'Order placed successfully!',
  ORDER_ACCEPTED: 'Order accepted successfully!',
  ORDER_REJECTED: 'Order rejected successfully!',
  ORDER_DELIVERED: 'Order marked as delivered!',
  RATING_SUBMITTED: 'Rating submitted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  MESSAGE_SENT: 'Message sent successfully!'
};

// ============================================
// STORAGE & CONFIGURATION
// ============================================

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'ecoride_token',
  USER: 'ecoride_user',
  THEME: 'ecoride_theme',
  PREFERENCES: 'ecoride_preferences'
};

// Animation Durations (in ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// Debounce Delays (in ms)
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 200
};

// File Upload Limits
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  MAX_FILES: 5
};

// Rating System
export const RATING = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 0
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: [12.9716, 77.5946], // Bangalore coordinates
  DEFAULT_ZOOM: 12,
  MIN_ZOOM: 10,
  MAX_ZOOM: 18
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
  API_URL,
  APP_NAME,
  COMPANY_NAME,
  COMPANY_EMAIL_DOMAIN,
  ITEMS_PER_PAGE,
  RIDES_PER_PAGE,
  TRIPS_PER_PAGE,
  DATE_FORMAT,
  TIME_FORMAT,
  DATETIME_FORMAT,
  VEHICLE_TYPES,
  POPULAR_LOCATIONS,
  TRIP_CATEGORIES,
  DIFFICULTY_LEVELS,
  ITEM_CATEGORIES,
  ITEM_CONDITIONS,
  ITEM_AVAILABILITY_STATUS,
  ORDER_STATUS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS,
  DELIVERY_METHODS,
  DEPARTMENTS,
  RIDE_STATUS,
  RIDE_STATUS_COLORS,
  TRIP_STATUS,
  TRIP_STATUS_COLORS,
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITY,
  CHAT_CONTEXT_TYPES,
  MUSIC_PREFERENCES,
  CHATTINESS_LEVELS,
  CARBON_FACTORS,
  FUEL_COSTS,
  PAYMENT_METHODS,
  RATING_LEVELS,
  REVIEW_CATEGORIES,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  ANIMATION_DURATION,
  DEBOUNCE_DELAY,
  FILE_UPLOAD,
  RATING,
  MAP_CONFIG
};