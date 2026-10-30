// Admin Dashboard JavaScript

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
    dashboard: 'Admin Dashboard',
    vendors: 'Vendors',
    customers: 'Customers',
    products: 'Products',
    orders: 'Orders',
    categories: 'Categories',
    coupons: 'Coupons',
  };
  document.getElementById('pageTitle').textContent = titles[section] || 'Admin Dashboard';

  // Load section data
  if (section === 'dashboard') loadDashboard();
  if (section === 'vendors') loadVendors();
  if (section === 'products') loadProducts();
  if (section === 'orders') loadOrders();
}

// Load Dashboard
async function loadDashboard() {
  try {
    const response = await api.getAdminDashboard();
    if (response.success) {
      document.getElementById('totalRevenue').textContent = formatPrice(response.stats.total_revenue);
      document.getElementById('platformRevenue').textContent = formatPrice(response.stats.platform_revenue);
      document.getElementById('totalVendors').textContent = response.stats.total_vendors;
      document.getElementById('pendingVendors').textContent = response.stats.pending_vendors;
      document.getElementById('totalCustomers').textContent = response.stats.total_customers;
      document.getElementById('totalProducts').textContent = response.stats.total_products;
      document.getElementById('totalOrders').textContent = response.stats.total_orders;
      document.getElementById('pendingOrders').textContent = response.stats.pending_orders;
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// Load Vendors
async function loadVendors() {
  try {
    const response = await api.getVendors();
    if (response.success) {
      const vendorsTableBody = document.getElementById('vendorsTableBody');
      if (vendorsTableBody) {
        vendorsTableBody.innerHTML = response.vendors.map(vendor => `
          <tr>
            <td>${vendor.id}</td>
            <td>${vendor.business_name}</td>
            <td>${vendor.first_name} ${vendor.last_name}</td>
            <td>${vendor.email}</td>
            <td><span class="status-badge ${getVendorStatusClass(vendor.status)}">${vendor.status}</span></td>
            <td>${vendor.commission_rate}%</td>
            <td>
              <button class="action-btn action-btn-view" onclick="viewVendor(${vendor.id})">View</button>
            </td>
          </tr>
        `).join('');
      }
    }
  } catch (error) {
    console.error('Error loading vendors:', error);
  }
}

// Load Products
async function loadProducts() {
  try {
    const response = await api.getProducts({ limit: 50 });
    if (response.success) {
      const productsTableBody = document.getElementById('productsTableBody');
      if (productsTableBody) {
        productsTableBody.innerHTML = response.products.map(product => `
          <tr>
            <td>${product.name}</td>
            <td>${product.vendor_name}</td>
            <td>${product.category_name}</td>
            <td>${formatPrice(product.price)}</td>
            <td>${product.current_stock || 0}</td>
            <td><span class="status-badge ${getProductStatusClass(product.status)}">${product.status}</span></td>
            <td>
              <button class="action-btn action-btn-view" onclick="viewProduct(${product.id})">View</button>
            </td>
          </tr>
        `).join('');
      }
    }
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Load Orders
async function loadOrders() {
  try {
    const response = await api.getOrders({ limit: 50 });
    if (response.success) {
      const ordersTableBody = document.getElementById('ordersTableBody');
      if (ordersTableBody) {
        ordersTableBody.innerHTML = response.orders.map(order => `
          <tr>
            <td>${order.order_number}</td>
            <td>-</td>
            <td>${formatDate(order.created_at)}</td>
            <td>${formatPrice(order.total_amount)}</td>
            <td><span class="status-badge ${getPaymentStatusClass(order.payment_status)}">${order.payment_status}</span></td>
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

// View Vendor
function viewVendor(vendorId) {
  showToast('Vendor details feature coming soon', 'info');
}

// View Product
function viewProduct(productId) {
  showToast('Product details feature coming soon', 'info');
}

// View Order
function viewOrder(orderId) {
  showToast('Order details feature coming soon', 'info');
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

// Get Payment Status Class
function getPaymentStatusClass(status) {
  const classes = {
    PENDING: 'warning',
    COMPLETED: 'success',
    FAILED: 'danger',
    REFUNDED: 'info',
  };
  return classes[status] || 'info';
}

// Get Vendor Status Class
function getVendorStatusClass(status) {
  const classes = {
    APPROVED: 'success',
    PENDING: 'warning',
    REJECTED: 'danger',
    SUSPENDED: 'danger',
  };
  return classes[status] || 'info';
}

// Get Product Status Class
function getProductStatusClass(status) {
  const classes = {
    ACTIVE: 'success',
    DRAFT: 'info',
    OUT_OF_STOCK: 'danger',
    PENDING_APPROVAL: 'warning',
    REJECTED: 'danger',
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
  if (user.role !== 'ADMIN') {
    // Redirect to appropriate dashboard
    if (user.role === 'CUSTOMER') {
      window.location.href = 'customer-dashboard.html';
    } else if (user.role === 'VENDOR') {
      window.location.href = 'vendor-dashboard.html';
    } else if (user.role === 'DELIVERY_PARTNER') {
      window.location.href = 'delivery-dashboard.html';
    } else {
      window.location.href = 'index.html';
    }
    return;
  }

  loadDashboard();
});
