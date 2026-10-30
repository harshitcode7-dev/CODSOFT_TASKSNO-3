// Vendor Dashboard JavaScript

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
    dashboard: 'Vendor Dashboard',
    products: 'My Products',
    'add-product': 'Add Product',
    orders: 'Vendor Orders',
    earnings: 'Earnings',
    profile: 'Profile',
  };
  document.getElementById('pageTitle').textContent = titles[section] || 'Vendor Dashboard';

  // Load section data
  if (section === 'dashboard') loadDashboard();
  if (section === 'products') loadProducts();
  if (section === 'add-product') loadCategories();
  if (section === 'orders') loadOrders();
  if (section === 'profile') loadProfile();
}

// Load Dashboard
async function loadDashboard() {
  try {
    const response = await api.getVendorDashboard();
    if (response.success) {
      document.getElementById('totalSales').textContent = formatPrice(response.stats.total_sales);
      document.getElementById('totalOrders').textContent = response.stats.total_orders;
      document.getElementById('totalProducts').textContent = response.stats.total_products;
      document.getElementById('lowStock').textContent = response.stats.low_stock;
      document.getElementById('totalEarnings').textContent = formatPrice(response.stats.total_earnings);
      document.getElementById('availableBalance').textContent = formatPrice(response.stats.available_balance);
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// Load Products
async function loadProducts() {
  try {
    const response = await api.getVendorProducts();
    if (response.success) {
      const productsTableBody = document.getElementById('productsTableBody');
      if (productsTableBody) {
        productsTableBody.innerHTML = response.products.map(product => `
          <tr>
            <td>${product.name}</td>
            <td>${product.sku}</td>
            <td>${formatPrice(product.price)}</td>
            <td>${product.current_stock || 0}</td>
            <td><span class="status-badge ${getProductStatusClass(product.status)}">${product.status}</span></td>
            <td>
              <button class="action-btn action-btn-edit" onclick="editProduct(${product.id})">Edit</button>
              <button class="action-btn action-btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
          </tr>
        `).join('');
      }
    }
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Load Categories (for add product form)
async function loadCategories() {
  try {
    const response = await api.getCategories();
    if (response.success) {
      const productCategory = document.getElementById('productCategory');
      if (productCategory) {
        productCategory.innerHTML = '<option value="">Select Category</option>' +
          response.categories.map(category => `
            <option value="${category.id}">${category.name}</option>
          `).join('');
      }
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

// Load Orders
async function loadOrders() {
  try {
    const response = await api.getVendorOrders();
    if (response.success) {
      const vendorOrdersTableBody = document.getElementById('vendorOrdersTableBody');
      if (vendorOrdersTableBody) {
        vendorOrdersTableBody.innerHTML = response.orders.map(order => `
          <tr>
            <td>${order.vendor_order_number}</td>
            <td>${formatDate(order.created_at)}</td>
            <td>-</td>
            <td>${formatPrice(order.vendor_earnings)}</td>
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

// Load Profile
async function loadProfile() {
  try {
    const response = await api.getMe();
    if (response.success) {
      const user = response.user;

      document.getElementById('vendorAvatar').textContent = (user.business_name?.[0] || 'V').toUpperCase();
      document.getElementById('vendorBusinessName').textContent = user.business_name || 'Business Name';
      document.getElementById('vendorEmail').textContent = user.email;
      document.getElementById('vendorStatus').textContent = user.status || 'UNKNOWN';
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

// Add Product Form Handler
const addProductForm = document.getElementById('addProductForm');
if (addProductForm) {
  addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = getUser();
    const vendorId = user.id; // In production, get from vendor profile

    const productData = {
      vendor_id: vendorId,
      category_id: document.getElementById('productCategory').value,
      sku: document.getElementById('productSku').value,
      name: document.getElementById('productName').value,
      slug: document.getElementById('productName').value.toLowerCase().replace(/ /g, '-'),
      description: document.getElementById('productDescription').value,
      price: parseFloat(document.getElementById('productPrice').value),
      discount_price: document.getElementById('productDiscountPrice').value ? parseFloat(document.getElementById('productDiscountPrice').value) : null,
    };

    try {
      const response = await api.createProduct(productData);
      if (response.success) {
        showToast('Product added successfully!', 'success');
        addProductForm.reset();
        showSection('products');
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

// Edit Product
function editProduct(productId) {
  showToast('Edit product feature coming soon', 'info');
}

// Delete Product
async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    await api.deleteProduct(productId);
    showToast('Product deleted successfully', 'success');
    loadProducts();
  } catch (error) {
    showToast(error.message, 'error');
  }
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
    PACKED: 'warning',
    SHIPPED: 'warning',
    OUT_FOR_DELIVERY: 'warning',
    DELIVERED: 'success',
    CANCELLED: 'danger',
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
  if (user.role !== 'VENDOR') {
    // Redirect to appropriate dashboard
    if (user.role === 'CUSTOMER') {
      window.location.href = 'customer-dashboard.html';
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
