// Cart Page JavaScript

let cartData = null;
let appliedCoupon = null;

// Load Cart
async function loadCart() {
  if (!checkAuth()) {
    window.location.href = 'login.html';
    return;
  }

  const loading = document.getElementById('loading');
  const cartItems = document.getElementById('cartItems');
  const emptyState = document.getElementById('emptyState');

  if (loading) loading.style.display = 'flex';
  if (cartItems) cartItems.innerHTML = '';
  if (emptyState) emptyState.style.display = 'none';

  try {
    const response = await api.getCart();

    if (loading) loading.style.display = 'none';

    if (response.success) {
      cartData = response.cart;

      if (response.cart.items.length > 0) {
        renderCartItems(response.cart.items);
        updateOrderSummary(response.cart);
      } else {
        if (emptyState) emptyState.style.display = 'block';
      }
    }
  } catch (error) {
    console.error('Error loading cart:', error);
    if (loading) loading.style.display = 'none';
  }
}

// Render Cart Items
function renderCartItems(items) {
  const cartItems = document.getElementById('cartItems');
  if (!cartItems) return;

  // Group by vendor
  const vendorGroups = {};
  items.forEach(item => {
    if (!vendorGroups[item.vendor_name]) {
      vendorGroups[item.vendor_name] = [];
    }
    vendorGroups[item.vendor_name].push(item);
  });

  let html = '';
  for (const [vendorName, vendorItems] of Object.entries(vendorGroups)) {
    html += `
      <div style="margin-bottom: 32px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid var(--gray-200);">${vendorName}</h3>
        ${vendorItems.map(item => `
          <div style="display: grid; grid-template-columns: 100px 1fr auto; gap: 16px; padding: 16px; background: var(--white); border-radius: var(--border-radius); margin-bottom: 12px; box-shadow: var(--shadow);">
            <div>
              <img src="${item.primary_image || 'https://via.placeholder.com/100'}" alt="${item.name}" style="width: 100%; height: 100px; object-fit: cover; border-radius: var(--border-radius-sm);" onerror="this.src='https://via.placeholder.com/100'">
            </div>
            <div>
              <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">
                <a href="product.html?id=${item.product_id}" style="color: var(--gray-800);">${item.name}</a>
              </h4>
              <div style="font-size: 14px; color: var(--gray-600); margin-bottom: 8px;">SKU: ${item.product_sku || 'N/A'}</div>
              <div style="font-size: 18px; font-weight: 700; color: var(--primary-color);">${formatPrice(item.price)}</div>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" style="width: 32px; height: 32px; border: 1px solid var(--gray-300); background: var(--white); border-radius: var(--border-radius-sm);">-</button>
                <span style="min-width: 32px; text-align: center;">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" style="width: 32px; height: 32px; border: 1px solid var(--gray-300); background: var(--white); border-radius: var(--border-radius-sm);">+</button>
              </div>
              <button onclick="removeItem(${item.id})" style="color: var(--danger-color); background: none; border: none; font-size: 14px; cursor: pointer;">Remove</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  cartItems.innerHTML = html;
}

// Update Order Summary
function updateOrderSummary(cart) {
  const subtotal = cart.subtotal || 0;
  const discount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = (subtotal - discount + shipping) * 0.18;
  const total = subtotal - discount + shipping + tax;

  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('discount').textContent = `-${formatPrice(discount)}`;
  document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
  document.getElementById('tax').textContent = formatPrice(tax);
  document.getElementById('total').textContent = formatPrice(total);
}

// Update Quantity
async function updateQuantity(itemId, quantity) {
  if (quantity < 1) {
    removeItem(itemId);
    return;
  }

  try {
    await api.updateCartItem(itemId, { quantity });
    loadCart();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Remove Item
async function removeItem(itemId) {
  try {
    await api.removeCartItem(itemId);
    loadCart();
    showToast('Item removed from cart', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Apply Coupon
async function applyCoupon() {
  const couponCode = document.getElementById('couponCode').value.trim();

  if (!couponCode) {
    showToast('Please enter a coupon code', 'warning');
    return;
  }

  try {
    const response = await api.validateCoupon({
      code: couponCode,
      order_amount: cartData.subtotal,
    });

    if (response.success) {
      appliedCoupon = response;
      showToast(`Coupon applied! You saved ${formatPrice(response.discount_amount)}`, 'success');
      updateOrderSummary(cartData);
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Proceed to Checkout
function proceedToCheckout() {
  if (!cartData || cartData.items.length === 0) {
    showToast('Your cart is empty', 'warning');
    return;
  }

  window.location.href = 'checkout.html';
}

// Update Cart Badge
async function updateCartBadge() {
  if (!checkAuth()) return;

  try {
    const response = await api.getCart();
    if (response.success) {
      const cartBadge = document.getElementById('cartBadge');
      if (cartBadge) {
        cartBadge.textContent = response.cart.items.length;
      }
    }
  } catch (error) {
    console.error('Error updating cart badge:', error);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  updateCartBadge();
});
