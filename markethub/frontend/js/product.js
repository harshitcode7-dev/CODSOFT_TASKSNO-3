// Product Page JavaScript

let currentProduct = null;
let selectedQuantity = 1;

// Load Product Details
async function loadProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    window.location.href = 'shop.html';
    return;
  }

  const loading = document.getElementById('loading');
  const productDetail = document.getElementById('productDetail');

  if (loading) loading.style.display = 'flex';
  if (productDetail) productDetail.innerHTML = '';

  try {
    const response = await api.getProduct(productId);

    if (loading) loading.style.display = 'none';

    if (response.success) {
      currentProduct = response.product;
      renderProductDetails(response.product);
      loadProductReviews(productId);
    } else {
      productDetail.innerHTML = '<p>Product not found</p>';
    }
  } catch (error) {
    console.error('Error loading product:', error);
    if (loading) loading.style.display = 'none';
  }
}

// Render Product Details
function renderProductDetails(product) {
  const productDetail = document.getElementById('productDetail');
  if (!productDetail) return;

  const imageUrl = product.images && product.images.length > 0 ? product.images[0].image_url : 'https://via.placeholder.com/400';
  const vendorName = product.vendor_name || 'Unknown Vendor';
  const rating = product.rating || 0;
  const reviews = product.total_reviews || 0;
  const price = product.price;
  const discountPrice = product.discount_price;
  const discountPercentage = product.discount_percentage || 0;
  const stock = product.inventory ? product.inventory.available_stock : 0;

  productDetail.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
      <div>
        <div style="background: var(--white); border-radius: var(--border-radius); overflow: hidden; box-shadow: var(--shadow);">
          <img src="${imageUrl}" alt="${product.name}" style="width: 100%; height: auto;" onerror="this.src='https://via.placeholder.com/400'">
        </div>
      </div>
      <div>
        <div style="margin-bottom: 12px; color: var(--gray-600);">Sold by: ${vendorName}</div>
        <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 16px;">${product.name}</h1>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
          <span style="font-size: 20px;">⭐ ${rating.toFixed(1)}</span>
          <span style="color: var(--gray-500);">(${reviews} reviews)</span>
        </div>
        <div style="margin-bottom: 24px;">
          <span style="font-size: 32px; font-weight: 700; color: var(--primary-color);">${formatPrice(discountPrice || price)}</span>
          ${discountPrice ? `<span style="font-size: 20px; color: var(--gray-500); text-decoration: line-through; margin-left: 12px;">${formatPrice(price)}</span>` : ''}
          ${discountPercentage > 0 ? `<span style="font-size: 16px; color: var(--success-color); font-weight: 600; margin-left: 12px;">${discountPercentage}% off</span>` : ''}
        </div>
        <div style="margin-bottom: 24px;">
          <span style="font-weight: 600;">Availability: </span>
          <span style="color: ${stock > 0 ? 'var(--success-color)' : 'var(--danger-color)'}; font-weight: 600;">${stock > 0 ? `${stock} in stock` : 'Out of stock'}</span>
        </div>
        <div style="margin-bottom: 24px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 600;">Quantity</label>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button onclick="decreaseQuantity()" style="width: 40px; height: 40px; border: 1px solid var(--gray-300); background: var(--white); border-radius: var(--border-radius-sm); font-size: 20px;">-</button>
            <input type="number" id="quantity" value="${selectedQuantity}" min="1" max="${stock}" style="width: 60px; padding: 8px; text-align: center; border: 1px solid var(--gray-300); border-radius: var(--border-radius-sm);">
            <button onclick="increaseQuantity()" style="width: 40px; height: 40px; border: 1px solid var(--gray-300); background: var(--white); border-radius: var(--border-radius-sm); font-size: 20px;">+</button>
          </div>
        </div>
        <div style="display: flex; gap: 12px; margin-bottom: 24px;">
          <button class="btn btn-primary-colored" style="flex: 1;" onclick="addToCart()" ${stock === 0 ? 'disabled' : ''}>Add to Cart</button>
          <button class="btn btn-secondary" style="flex: 1;" onclick="buyNow()" ${stock === 0 ? 'disabled' : ''}>Buy Now</button>
          <button class="btn btn-secondary" onclick="addToWishlist()">❤️</button>
        </div>
        <div style="padding: 20px; background: var(--gray-100); border-radius: var(--border-radius); margin-bottom: 24px;">
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px;">Description</h3>
          <p style="color: var(--gray-700); line-height: 1.6;">${product.description || 'No description available.'}</p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="padding: 16px; background: var(--gray-100); border-radius: var(--border-radius);">
            <div style="font-weight: 600; margin-bottom: 8px;">🚚 Delivery</div>
            <div style="font-size: 14px; color: var(--gray-600);">Free delivery on orders above ₹999</div>
          </div>
          <div style="padding: 16px; background: var(--gray-100); border-radius: var(--border-radius);">
            <div style="font-weight: 600; margin-bottom: 8px;">↩️ Returns</div>
            <div style="font-size: 14px; color: var(--gray-600);">7 days return policy</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Load Product Reviews
async function loadProductReviews(productId) {
  try {
    const response = await api.getProductReviews(productId);
    if (response.success) {
      const reviewsList = document.getElementById('reviewsList');
      if (reviewsList) {
        if (response.reviews.length > 0) {
          reviewsList.innerHTML = response.reviews.map(review => `
            <div style="padding: 20px; background: var(--white); border-radius: var(--border-radius); margin-bottom: 16px; box-shadow: var(--shadow);">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <div>
                  <div style="font-weight: 600;">${review.first_name} ${review.last_name}</div>
                  <div style="font-size: 14px; color: var(--gray-500);">${formatDate(review.created_at)}</div>
                </div>
                <div style="font-size: 18px;">⭐ ${review.rating}</div>
              </div>
              ${review.title ? `<h4 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">${review.title}</h4>` : ''}
              <p style="color: var(--gray-700);">${review.review}</p>
              ${review.is_verified_purchase ? '<span style="display: inline-block; padding: 4px 12px; background: var(--primary-light); color: var(--primary-color); border-radius: var(--border-radius-sm); font-size: 12px; font-weight: 600; margin-top: 8px;">✓ Verified Purchase</span>' : ''}
            </div>
          `).join('');
        } else {
          reviewsList.innerHTML = '<p style="text-align: center; color: var(--gray-600);">No reviews yet. Be the first to review!</p>';
        }
      }
    }
  } catch (error) {
    console.error('Error loading reviews:', error);
  }
}

// Increase Quantity
function increaseQuantity() {
  const quantityInput = document.getElementById('quantity');
  const maxStock = currentProduct.inventory ? currentProduct.inventory.available_stock : 10;
  if (selectedQuantity < maxStock) {
    selectedQuantity++;
    quantityInput.value = selectedQuantity;
  }
}

// Decrease Quantity
function decreaseQuantity() {
  const quantityInput = document.getElementById('quantity');
  if (selectedQuantity > 1) {
    selectedQuantity--;
    quantityInput.value = selectedQuantity;
  }
}

// Add to Cart
async function addToCart() {
  if (!checkAuth()) {
    showToast('Please login to add items to cart', 'warning');
    window.location.href = 'login.html';
    return;
  }

  try {
    await api.addToCart({ product_id: currentProduct.id, quantity: selectedQuantity });
    showToast('Added to cart!', 'success');
    updateCartBadge();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Buy Now
async function buyNow() {
  if (!checkAuth()) {
    showToast('Please login to buy', 'warning');
    window.location.href = 'login.html';
    return;
  }

  try {
    await api.addToCart({ product_id: currentProduct.id, quantity: selectedQuantity });
    window.location.href = 'checkout.html';
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Add to Wishlist
async function addToWishlist() {
  if (!checkAuth()) {
    showToast('Please login to add items to wishlist', 'warning');
    window.location.href = 'login.html';
    return;
  }

  try {
    await api.addToWishlist({ product_id: currentProduct.id });
    showToast('Added to wishlist!', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
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
  loadProduct();
  updateCartBadge();
});
