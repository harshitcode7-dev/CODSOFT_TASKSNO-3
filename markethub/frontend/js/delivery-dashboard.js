// Delivery Dashboard JavaScript

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
    dashboard: 'Delivery Dashboard',
    assignments: 'Delivery Assignments',
    history: 'Delivery History',
    profile: 'Profile',
  };
  document.getElementById('pageTitle').textContent = titles[section] || 'Delivery Dashboard';

  // Load section data
  if (section === 'dashboard') loadDashboard();
  if (section === 'assignments') loadAssignments();
  if (section === 'history') loadHistory();
  if (section === 'profile') loadProfile();
}

// Load Dashboard
async function loadDashboard() {
  try {
    const response = await api.getDeliveryAssignments();
    if (response.success) {
      const orders = response.orders;
      const total = orders.length;
      const pending = orders.filter(o => o.order_status === 'SHIPPED').length;
      const completed = orders.filter(o => o.order_status === 'DELIVERED').length;
      const inTransit = orders.filter(o => o.order_status === 'OUT_FOR_DELIVERY').length;

      document.getElementById('totalDeliveries').textContent = total;
      document.getElementById('pendingDeliveries').textContent = pending;
      document.getElementById('completedDeliveries').textContent = completed;
      document.getElementById('inTransit').textContent = inTransit;
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// Load Assignments
async function loadAssignments() {
  try {
    const response = await api.getDeliveryAssignments();
    if (response.success) {
      const assignmentsTableBody = document.getElementById('assignmentsTableBody');
      if (assignmentsTableBody) {
        if (response.orders.length > 0) {
          assignmentsTableBody.innerHTML = response.orders.map(order => `
            <tr>
              <td>${order.order_number}</td>
              <td>${order.full_name || 'N/A'}</td>
              <td>${order.city}, ${order.state}</td>
              <td>${order.phone || 'N/A'}</td>
              <td><span class="status-badge ${getStatusClass(order.order_status)}">${order.order_status}</span></td>
              <td>
                <button class="action-btn action-btn-view" onclick="updateDeliveryStatus(${order.id}, 'OUT_FOR_DELIVERY')">Out for Delivery</button>
                <button class="action-btn action-btn-approve" onclick="updateDeliveryStatus(${order.id}, 'DELIVERED')">Delivered</button>
              </td>
            </tr>
          `).join('');
        } else {
          assignmentsTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--gray-600);">No delivery assignments</td></tr>';
        }
      }
    }
  } catch (error) {
    console.error('Error loading assignments:', error);
  }
}

// Load History
async function loadHistory() {
  try {
    const response = await api.getDeliveryAssignments();
    if (response.success) {
      const historyTableBody = document.getElementById('historyTableBody');
      if (historyTableBody) {
        const deliveredOrders = response.orders.filter(o => o.order_status === 'DELIVERED');
        if (deliveredOrders.length > 0) {
          historyTableBody.innerHTML = deliveredOrders.map(order => `
            <tr>
              <td>${order.order_number}</td>
              <td>${order.full_name || 'N/A'}</td>
              <td>${formatDate(order.updated_at)}</td>
              <td><span class="status-badge success">DELIVERED</span></td>
            </tr>
          `).join('');
        } else {
          historyTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--gray-600);">No delivery history</td></tr>';
        }
      }
    }
  } catch (error) {
    console.error('Error loading history:', error);
  }
}

// Load Profile
async function loadProfile() {
  try {
    const response = await api.getMe();
    if (response.success) {
      const user = response.user;

      document.getElementById('deliveryAvatar').textContent = (user.first_name?.[0] || 'D').toUpperCase();
      document.getElementById('deliveryName').textContent = `${user.first_name} ${user.last_name}`;
      document.getElementById('deliveryEmail').textContent = user.email;
      document.getElementById('deliveryRole').textContent = user.role;
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

// Update Delivery Status
async function updateDeliveryStatus(orderId, status) {
  try {
    await api.updateDeliveryStatus(orderId, { order_status: status });
    showToast(`Order status updated to ${status}`, 'success');
    loadAssignments();
    loadDashboard();
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
    OUT_FOR_DELIVERY: 'primary',
    DELIVERED: 'success',
    CANCELLED: 'danger',
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
  if (user.role !== 'DELIVERY_PARTNER') {
    window.location.href = 'index.html';
    return;
  }

  loadDashboard();
});
