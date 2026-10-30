// Customer Dashboard JavaScript

// Navigation
document.querySelectorAll('.dashboard-nav-link[data-section]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = link.dataset.section;
    showSection(section);
  });
});

// Show Section
function showSection(section) {
  // Hide all sections
  document.querySelectorAll('[id$="Section"]').forEach(el => {
    el.style.display = 'none';
  });

  // Show selected section
  const sectionElement = document.getElementById(`${section}Section`);
  if (sectionElement) {
    sectionElement.style.display = 'block';
  }

  // Update nav links
  document.querySelectorAll('.dashboard-nav-link').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector(`[data-section="${section}"]`)?.classList.add('active');

  // Update page title
  const titles = {
    dashboard: 'Dashboard',
    orders: 'My Orders',
    wishlist: 'Wishlist',
    addresses: 'Addresses',
    profile: 'Profile',
    notifications: 'Notifications',
  };
  document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';

  // Load section data
  if (section === 'dashboard') loadDashboard();
  if (section === 'orders') loadOrders();
  if (section === 'wishlist') loadWishlist();
  if (section === 'profile') loadProfile();
  if (section === 'notifications') loadNotifications();
}

// Load Dashboard
async function loadDashboard() {
  try {
    const response = await api.getCustomerDashboard();
    if (response.success) {
      document.getElementById('totalOrders').textContent = response.stats.total_orders;
      document.getElementById('pendingOrders').textContent = response.stats.pending_orders;
      document.getElementById('deliveredOrders').textContent = response.stats.delivered_orders;
      document.getElementById('wishlistItems').textContent = response.stats.wishlist_items;
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// Load Orders
async function loadOrders() {
  try {
    const response = await api.getOrders();
    if (response.success) {
      const ordersTableBody = document.getElementById('ordersTableBody');
      if (ordersTableBody) {
        ordersTableBody.innerHTML = response.orders.map(order => `
          <tr>
            <td>${order.order_number}</td>
            <td>${formatDate(order.created_at)}</td>
            <td>${formatPrice(order.total_amount)}</td>
            <td><span class="status-badge ${getStatusClass(order.order_status)}">${order.order_status}</span></td>
            <td>
              <button class="action-btn action-btn-view" onclick="viewOrder(${order.id})">View</button>
            </td>
          </tr>
        `).join('');
      }
    }
  } catch (error) {
    console.error('Error loading orders:', error);
  }
}

// Load Wishlist
async function loadWishlist() {
  try {
    const response = await api.getWishlist();
    if (response.success) {
      const wishlistGrid = document.getElementById('wishlistGrid');
      if (wishlistGrid) {
        if (response.items.length > 0) {
          wishlistGrid.innerHTML = response.items.map(item => `
            <div class="card">
              <div class="card-image">
                <img src="${item.primary_image || 'https://via.placeholder.com/200'}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/200'">
              </div>
              <div class="card-content">
                <div class="card-vendor">${item.vendor_name}</div>
                <h3 class="card-title">
                  <a href="product.html?id=${item.product_id}">${item.name}</a>
                </h3>
                <div class="card-price">
                  <span class="card-price-current">${formatPrice(item.discount_price || item.price)}</span>
                </div>
                <div class="card-actions">
                  <button class="btn btn-primary-colored btn-sm" onclick="addToCart(${item.product_id})">Add to Cart</button>
                  <button class="btn btn-danger btn-sm" onclick="removeFromWishlist(${item.id})">Remove</button>
                </div>
              </div>
            </div>
          `).join('');
        } else {
          wishlistGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--gray-600);">Your wishlist is empty</p>';
        }
      }
    }
  } catch (error) {
    console.error('Error loading wishlist:', error);
  }
}

// Load Profile
async function loadProfile() {
  try {
    const response = await api.getMe();
    if (response.success) {
      const user = response.user;

      document.getElementById('profileAvatar').textContent = (user.first_name?.[0] || 'U').toUpperCase();
      document.getElementById('profileName').textContent = `${user.first_name} ${user.last_name}`;
      document.getElementById('profileEmail').textContent = user.email;
      document.getElementById('profileRole').textContent = user.role;

      document.getElementById('editFirstName').value = user.first_name || '';
      document.getElementById('editLastName').value = user.last_name || '';
      document.getElementById('editEmail').value = user.email || '';
      document.getElementById('editPhone').value = user.phone || '';
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

// Load Notifications
async function loadNotifications() {
  try {
    const response = await api.getNotifications();
    if (response.success) {
      const notificationList = document.getElementById('notificationList');
      if (notificationList) {
        if (response.notifications.length > 0) {
          notificationList.innerHTML = response.notifications.map(notification => `
            <li class="notification-item ${!notification.is_read ? 'unread' : ''}">
              <div class="notification-header">
                <span class="notification-title">${notification.title}</span>
                <span class="notification-time">${formatDate(notification.created_at)}</span>
              </div>
              <p class="notification-message">${notification.message}</p>
            </li>
          `).join('');
        } else {
          notificationList.innerHTML = '<li style="padding: 16px; text-align: center; color: var(--gray-600);">No notifications</li>';
        }
      }
    }
  } catch (error) {
    console.error('Error loading notifications:', error);
  }
}

// View Order
async function viewOrder(orderId) {
  try {
    const response = await api.getOrder(orderId);
    if (response.success) {
      console.log('Order details:', response.order);
      // In a real app, show order details in a modal
      showToast('Order details loaded', 'success');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Add to Cart
async function addToCart(productId) {
  try {
    await api.addToCart({ product_id: productId, quantity: 1 });
    showToast('Added to cart!', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Remove from Wishlist
async function removeFromWishlist(itemId) {
  try {
    await api.removeFromWishlist(itemId);
    showToast('Removed from wishlist', 'success');
    loadWishlist();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Get Status Class
function getStatusClass(status) {
  const classes = {
    PLACED: 'info',
    CONFIRMED: 'primary',
    PROCESSING: 'warning',
    SHIPPED: 'warning',
    OUT_FOR_DELIVERY: 'warning',
    DELIVERED: 'success',
    CANCELLED: 'danger',
    RETURNED: 'danger',
  };
  return classes[status] || 'info';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (!checkAuth()) {
    window.location.href = 'login.html';
    return;
  }

  const user = getUser();
  if (user.role !== 'CUSTOMER') {
    // Redirect to appropriate dashboard
    if (user.role === 'VENDOR') {
      window.location.href = 'vendor-dashboard.html';
    } else if (user.role === 'ADMIN') {
      window.location.href = 'admin-dashboard.html';
    } else if (user.role === 'DELIVERY_PARTNER') {
      window.location.href = 'delivery-dashboard.html';
    } else {
      window.location.href = 'index.html';
    }
    return;
  }

  loadDashboard();
});
