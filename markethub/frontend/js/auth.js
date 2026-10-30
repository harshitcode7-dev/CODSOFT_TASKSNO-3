// Auth Functions

// Register Form Handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;

    if (password !== confirmPassword) {
      showAlert('Passwords do not match', 'danger');
      return;
    }

    try {
      const response = await api.register({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password,
        role,
      });

      if (response.success) {
        showAlert('Registration successful! Please login.', 'success');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      }
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  });
}

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await api.login({ email, password });

      if (response.success) {
        setToken(response.token);
        setUser(response.user);

        showAlert('Login successful!', 'success');

        // Redirect based on role
        setTimeout(() => {
          if (response.user.role === 'CUSTOMER') {
            window.location.href = 'customer-dashboard.html';
          } else if (response.user.role === 'VENDOR') {
            window.location.href = 'vendor-dashboard.html';
          } else if (response.user.role === 'ADMIN') {
            window.location.href = 'admin-dashboard.html';
          } else if (response.user.role === 'DELIVERY_PARTNER') {
            window.location.href = 'delivery-dashboard.html';
          } else {
            window.location.href = 'index.html';
          }
        }, 1000);
      }
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  });
}

// Show Alert Function
function showAlert(message, type) {
  const alertDiv = document.getElementById('alert');
  if (alertDiv) {
    alertDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
      alertDiv.innerHTML = '';
    }, 5000);
  }
}
