import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

// ============================================
// DATE & TIME HELPERS
// ============================================

export const formatDate = (date) => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'MMM dd, yyyy');
};

export const formatTime = (date) => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'hh:mm a');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'MMM dd, yyyy hh:mm a');
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(parsedDate)) {
    return `Today at ${format(parsedDate, 'hh:mm a')}`;
  }
  
  if (isYesterday(parsedDate)) {
    return `Yesterday at ${format(parsedDate, 'hh:mm a')}`;
  }
  
  return formatDistanceToNow(parsedDate, { addSuffix: true });
};

// ============================================
// VALIDATION HELPERS
// ============================================

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[+]?[\d\s-()]{10,}$/;
  return regex.test(phone);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

export const validateEmployeeId = (id) => {
  // Format: XYZ followed by numbers
  const regex = /^XYZ\d+$/;
  return regex.test(id);
};

// ============================================
// FORMATTING HELPERS
// ============================================

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num);
};

export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// ============================================
// RIDE & TRIP HELPERS
// ============================================

export const calculateMatchScore = (score) => {
  if (score >= 80) return { label: 'Excellent', color: 'green' };
  if (score >= 60) return { label: 'Good', color: 'blue' };
  if (score >= 40) return { label: 'Fair', color: 'yellow' };
  return { label: 'Poor', color: 'red' };
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'yellow',
    active: 'blue',
    completed: 'green',
    cancelled: 'red',
    accepted: 'green',
    rejected: 'red',
    confirmed: 'green',
    delivered: 'green',
  };
  return colors[status] || 'gray';
};

export const getStatusLabel = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Haversine formula
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

export const calculateCarbonSaved = (distance, passengers = 1) => {
  // Average car emits 120g CO2 per km
  // Carpooling saves emissions by sharing
  const emissionPerKm = 0.12; // kg CO2 per km
  const savedPerPassenger = emissionPerKm * distance * passengers;
  return savedPerPassenger.toFixed(2);
};

// ============================================
// ARRAY & OBJECT HELPERS
// ============================================

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    }
    return a[key] < b[key] ? 1 : -1;
  });
};

export const filterByDate = (array, dateKey, startDate, endDate) => {
  return array.filter(item => {
    const itemDate = new Date(item[dateKey]);
    return itemDate >= startDate && itemDate <= endDate;
  });
};

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

// ============================================
// ERROR HANDLING
// ============================================

export const getErrorMessage = (error) => {
  if (error.response) {
    return error.response.data?.message || 'Server error occurred';
  }
  if (error.request) {
    return 'Network error. Please check your connection.';
  }
  return error.message || 'An unexpected error occurred';
};

export const handleAPIError = (error, defaultMessage = 'Something went wrong') => {
  console.error('API Error:', error);
  return {
    success: false,
    message: getErrorMessage(error) || defaultMessage,
  };
};

// ============================================
// NOTIFICATION HELPERS
// ============================================

export const showToast = (message, type = 'info') => {
  // This will be used with a toast library later
  console.log(`[${type.toUpperCase()}] ${message}`);
  // You can integrate react-toastify or similar library here
};

// ============================================
// FILE HELPERS
// ============================================

export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const isImageFile = (filename) => {
  const ext = getFileExtension(filename).toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
};

// ============================================
// SEARCH & FILTER HELPERS
// ============================================

export const searchItems = (items, searchTerm, searchKeys) => {
  if (!searchTerm) return items;
  
  const term = searchTerm.toLowerCase();
  return items.filter(item => 
    searchKeys.some(key => 
      item[key]?.toString().toLowerCase().includes(term)
    )
  );
};

export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};