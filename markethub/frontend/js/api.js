// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Set token in localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
const removeToken = () => {
  localStorage.removeItem('token');
};

// Get user from localStorage
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Set user in localStorage
const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove user from localStorage
const removeUser = () => {
  localStorage.removeItem('user');
};

// API Request Helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// API Methods
const api = {
  // Auth
  register: (data) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (data) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getMe: () => apiRequest('/auth/me'),

  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),

  // Products
  getProducts: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products?${queryString}`);
  },

  getProduct: (id) => apiRequest(`/products/${id}`),

  createProduct: (data) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateProduct: (id, data) => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  deleteProduct: (id) => apiRequest(`/products/${id}`, {
    method: 'DELETE',
  }),

  // Categories
  getCategories: () => apiRequest('/categories'),

  getCategory: (id) => apiRequest(`/categories/${id}`),

  createCategory: (data) => apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateCategory: (id, data) => apiRequest(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  deleteCategory: (id) => apiRequest(`/categories/${id}`, {
    method: 'DELETE',
  }),

  // Cart
  getCart: () => apiRequest('/cart'),

  addToCart: (data) => apiRequest('/cart', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateCartItem: (id, data) => apiRequest(`/cart/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  removeCartItem: (id) => apiRequest(`/cart/${id}`, {
    method: 'DELETE',
  }),

  clearCart: () => apiRequest('/cart', {
    method: 'DELETE',
  }),

  // Orders
  getOrders: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/orders?${queryString}`);
  },

  getOrder: (id) => apiRequest(`/orders/${id}`),

  createOrder: (data) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateOrderStatus: (id, data) => apiRequest(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  cancelOrder: (id) => apiRequest(`/orders/${id}/cancel`, {
    method: 'PUT',
  }),

  // Payments
  createPayment: (data) => apiRequest('/payments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getPayment: (id) => apiRequest(`/payments/${id}`),

  // Coupons
  getCoupons: () => apiRequest('/coupons'),

  validateCoupon: (data) => apiRequest('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Reviews
  getProductReviews: (productId) => apiRequest(`/reviews/product/${productId}`),

  createReview: (data) => apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Wishlist
  getWishlist: () => apiRequest('/wishlist'),

  addToWishlist: (data) => apiRequest('/wishlist', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  removeFromWishlist: (id) => apiRequest(`/wishlist/${id}`, {
    method: 'DELETE',
  }),

  // Notifications
  getNotifications: () => apiRequest('/notifications'),

  markNotificationRead: (id) => apiRequest(`/notifications/${id}/read`, {
    method: 'PUT',
  }),

  // Admin
  getAdminDashboard: () => apiRequest('/admin/dashboard'),

  getPendingVendors: () => apiRequest('/admin/vendors/pending'),

  getPendingProducts: () => apiRequest('/admin/products/pending'),

  approveVendor: (id) => apiRequest(`/admin/vendors/${id}/approve`, {
    method: 'PUT',
  }),

  approveProduct: (id) => apiRequest(`/admin/products/${id}/approve`, {
    method: 'PUT',
  }),

  rejectProduct: (id) => apiRequest(`/admin/products/${id}/reject`, {
    method: 'PUT',
  }),

  // Vendor
  getVendorDashboard: () => apiRequest('/vendor/dashboard'),

  getVendorOrders: () => apiRequest('/vendor/orders'),

  getVendorProducts: () => apiRequest('/vendor/products'),

  updateVendorOrderStatus: (id, data) => apiRequest(`/vendor/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Customer
  getCustomerDashboard: () => apiRequest('/customer/dashboard'),

  // Additional vendor methods
  getVendors: () => apiRequest('/vendors'),

  // Delivery Partner
  getDeliveryAssignments: () => apiRequest('/delivery/assignments'),
  updateDeliveryStatus: (id, data) => apiRequest(`/delivery/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Vendor Registration
  registerVendor: (data) => apiRequest('/vendors/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Addresses
  getAddresses: () => apiRequest('/addresses'),
  createAddress: (data) => apiRequest('/addresses', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateAddress: (id, data) => apiRequest(`/addresses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteAddress: (id) => apiRequest(`/addresses/${id}`, {
    method: 'DELETE',
  }),
};

// Utility Functions
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};

const checkAuth = () => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

const redirectIfNotAuth = () => {
  if (!checkAuth()) {
    window.location.href = 'login.html';
  }
};

const redirectIfAuth = () => {
  if (checkAuth()) {
    const user = getUser();
    if (user.role === 'CUSTOMER') {
      window.location.href = 'customer-dashboard.html';
    } else if (user.role === 'VENDOR') {
      window.location.href = 'vendor-dashboard.html';
    } else if (user.role === 'ADMIN') {
      window.location.href = 'admin-dashboard.html';
    }
  }
};

const logout = () => {
  removeToken();
  removeUser();
  window.location.href = 'login.html';
};
