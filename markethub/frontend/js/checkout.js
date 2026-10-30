// Checkout Page JavaScript

let currentStep = 1;
let cartData = null;
let addressData = null;

// Load Cart
async function loadCart() {
  if (!checkAuth()) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await api.getCart();
    if (response.success) {
      cartData = response.cart;
      renderCheckoutSummary(response.cart);
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
}

// Render Checkout Summary
function renderCheckoutSummary(cart) {
  const checkoutSummary = document.getElementById('checkoutSummary');
  if (!checkoutSummary) return;

  const subtotal = cart.subtotal || 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = (subtotal + shipping) * 0.18;
  const total = subtotal + shipping + tax;

  checkoutSummary.innerHTML = `
    <div style="margin-bottom: 16px;">
      ${cart.items.map(item => `
        <div style="display: flex; gap: 12px; margin-bottom: 12px;">
          <img src="${item.primary_image || 'https://via.placeholder.com/60'}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--border-radius-sm);" onerror="this.src='https://via.placeholder.com/60'">
          <div style="flex: 1;">
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">${item.name}</div>
            <div style="font-size: 13px; color: var(--gray-600);">Qty: ${item.quantity}</div>
          </div>
          <div style="font-weight: 600;">${formatPrice(item.price * item.quantity)}</div>
        </div>
      `).join('')}
    </div>
    <hr style="margin: 16px 0; border: none; border-top: 1px solid var(--gray-200);">
    <div style="margin-bottom: 12px; display: flex; justify-content: space-between;">
      <span>Subtotal</span>
      <span>${formatPrice(subtotal)}</span>
    </div>
    <div style="margin-bottom: 12px; display: flex; justify-content: space-between;">
      <span>Shipping</span>
      <span>${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
    </div>
    <div style="margin-bottom: 12px; display: flex; justify-content: space-between;">
      <span>Tax (18%)</span>
      <span>${formatPrice(tax)}</span>
    </div>
    <hr style="margin: 16px 0; border: none; border-top: 1px solid var(--gray-200);">
    <div style="margin-bottom: 16px; display: flex; justify-content: space-between; font-size: 18px; font-weight: 700;">
      <span>Total</span>
      <span>${formatPrice(total)}</span>
    </div>
  `;
}

// Go to Step
function goToStep(step) {
  if (step < currentStep) {
    // Can go back
    showStep(step);
  } else if (step > currentStep) {
    // Validate current step before proceeding
    if (validateStep(currentStep)) {
      showStep(step);
    }
  }
}

// Show Step
function showStep(step) {
  // Hide all steps
  for (let i = 1; i <= 4; i++) {
    const stepElement = document.getElementById(`step${i}`);
    if (stepElement) {
      stepElement.style.display = 'none';
    }
  }

  // Show current step
  const currentStepElement = document.getElementById(`step${step}`);
  if (currentStepElement) {
    currentStepElement.style.display = 'block';
  }

  // Update progress indicators
  document.querySelectorAll('.step').forEach(stepEl => {
    const stepNum = parseInt(stepEl.dataset.step);
    const circle = stepEl.querySelector('div');

    if (stepNum <= step) {
      circle.style.backgroundColor = 'var(--primary-color)';
      circle.style.color = 'var(--white)';
    } else {
      circle.style.backgroundColor = 'var(--gray-300)';
      circle.style.color = 'var(--gray-600)';
    }
  });

  currentStep = step;

  // Load order summary on step 4
  if (step === 4) {
    renderOrderSummary();
  }
}

// Validate Step
function validateStep(step) {
  if (step === 1) {
    const fullName = document.getElementById('fullName').value;
    const mobileNumber = document.getElementById('mobileNumber').value;
    const houseFlat = document.getElementById('houseFlat').value;
    const street = document.getElementById('street').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const pincode = document.getElementById('pincode').value;

    if (!fullName || !mobileNumber || !houseFlat || !street || !city || !state || !pincode) {
      showToast('Please fill in all required fields', 'warning');
      return false;
    }

    addressData = {
      full_name: fullName,
      phone: mobileNumber,
      house_flat: houseFlat,
      street,
      city,
      state,
      pincode,
    };
  }

  return true;
}

// Render Order Summary
function renderOrderSummary() {
  const orderSummary = document.getElementById('orderSummary');
  if (!orderSummary) return;

  const deliveryOption = document.querySelector('input[name="delivery"]:checked')?.value || 'standard';
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'cod';

  const subtotal = cartData.subtotal || 0;
  const shipping = deliveryOption === 'express' ? 99 : (subtotal > 999 ? 0 : 99);
  const tax = (subtotal + shipping) * 0.18;
  const total = subtotal + shipping + tax;

  orderSummary.innerHTML = `
    <div style="margin-bottom: 24px;">
      <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Delivery Address</h4>
      <div style="padding: 16px; background: var(--gray-100); border-radius: var(--border-radius);">
        <div style="font-weight: 600;">${addressData.full_name}</div>
        <div style="color: var(--gray-600);">${addressData.phone}</div>
        <div style="margin-top: 8px;">${addressData.house_flat}, ${addressData.street}</div>
        <div>${addressData.city}, ${addressData.state} - ${addressData.pincode}</div>
      </div>
    </div>
    <div style="margin-bottom: 24px;">
      <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Payment Method</h4>
      <div style="padding: 16px; background: var(--gray-100); border-radius: var(--border-radius);">
        <div style="font-weight: 600; text-transform: capitalize;">${paymentMethod.replace('_', ' ')}</div>
      </div>
    </div>
    <div style="margin-bottom: 24px;">
      <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Order Items</h4>
      ${cartData.items.map(item => `
        <div style="display: flex; gap: 12px; margin-bottom: 12px;">
          <img src="${item.primary_image || 'https://via.placeholder.com/60'}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--border-radius-sm);" onerror="this.src='https://via.placeholder.com/60'">
          <div style="flex: 1;">
            <div style="font-size: 14px; font-weight: 600;">${item.name}</div>
            <div style="font-size: 13px; color: var(--gray-600);">Qty: ${item.quantity}</div>
          </div>
          <div style="font-weight: 600;">${formatPrice(item.price * item.quantity)}</div>
        </div>
      `).join('')}
    </div>
    <hr style="margin: 16px 0; border: none; border-top: 1px solid var(--gray-200);">
    <div style="margin-bottom: 12px; display: flex; justify-content: space-between;">
      <span>Subtotal</span>
      <span>${formatPrice(subtotal)}</span>
    </div>
    <div style="margin-bottom: 12px; display: flex; justify-content: space-between;">
      <span>Shipping</span>
      <span>${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
    </div>
    <div style="margin-bottom: 12px; display: flex; justify-content: space-between;">
      <span>Tax (18%)</span>
      <span>${formatPrice(tax)}</span>
    </div>
    <hr style="margin: 16px 0; border: none; border-top: 1px solid var(--gray-200);">
    <div style="margin-bottom: 16px; display: flex; justify-content: space-between; font-size: 20px; font-weight: 700;">
      <span>Total</span>
      <span>${formatPrice(total)}</span>
    </div>
  `;
}

// Place Order
async function placeOrder() {
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'cod';

  const subtotal = cartData.subtotal || 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = (subtotal + shipping) * 0.18;
  const total = subtotal + shipping + tax;

  try {
    // First, create the address
    const addressResponse = await api.createAddress({
      address_type: 'HOME',
      full_name: addressData.full_name,
      phone: addressData.phone,
      house_flat: addressData.house_flat,
      street: addressData.street,
      city: addressData.city,
      state: addressData.state,
      pincode: addressData.pincode,
      is_default: true,
    });
    
    if (!addressResponse.success) {
      showToast('Failed to save address', 'error');
      return;
    }

    // Create order with the new address
    const response = await api.createOrder({
      address_id: addressResponse.address.id,
      payment_method: paymentMethod,
    });

    if (response.success) {
      // Create payment
      await api.createPayment({
        order_id: response.order.id,
        payment_method: paymentMethod,
        amount: total,
      });

      showToast('Order placed successfully!', 'success');

      setTimeout(() => {
        window.location.href = 'customer-dashboard.html';
      }, 2000);
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  showStep(1);
});
