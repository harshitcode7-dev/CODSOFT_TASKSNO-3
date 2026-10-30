// Home Page JavaScript

// Load Categories
async function loadCategories() {
  try {
    const response = await api.getCategories();
    if (response.success) {
      const categoriesGrid = document.getElementById('categoriesGrid');
      if (categoriesGrid) {
        categoriesGrid.innerHTML = response.categories.map(category => `
          <div class="card category-card" onclick="window.location.href='shop.html?category=${category.id}'">
            <div class="category-icon">📦</div>
            <div class="category-name">${category.name}</div>
          </div>
        `).join('');
      }
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

// Load Featured Products
async function loadFeaturedProducts() {
  try {
    const response = await api.getProducts({ is_featured: true, limit: 8 });
    if (response.success) {
      const featuredProducts = document.getElementById('featuredProducts');
      if (featuredProducts) {
        featuredProducts.innerHTML = response.products.map(product => createProductCard(product)).join('');
      }
    }
  } catch (error) {
    console.error('Error loading featured products:', error);
  }
}

// Load Top Vendors
async function loadTopVendors() {
  try {
    // For demo, show static vendor cards
    const topVendors = document.getElementById('topVendors');
    if (topVendors) {
      topVendors.innerHTML = `
        <div class="card" style="padding: 24px; text-align: center;">
          <div style="font-size: 40px; margin-bottom: 12px;">🏪</div>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">TechWorld</h3>
          <p style="font-size: 13px; color: var(--gray-600);">Electronics</p>
          <div style="margin-top: 12px; font-size: 14px;">⭐ 4.5</div>
        </div>
        <div class="card" style="padding: 24px; text-align: center;">
          <div style="font-size: 40px; margin-bottom: 12px;">👗</div>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">FashionHub</h3>
          <p style="font-size: 13px; color: var(--gray-600);">Fashion</p>
          <div style="margin-top: 12px; font-size: 14px;">⭐ 4.3</div>
        </div>
        <div class="card" style="padding: 24px; text-align: center;">
          <div style="font-size: 40px; margin-bottom: 12px;">🏠</div>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">HomeMart</h3>
          <p style="font-size: 13px; color: var(--gray-600);">Home & Kitchen</p>
          <div style="margin-top: 12px; font-size: 14px;">⭐ 4.4</div>
        </div>
        <div class="card" style="padding: 24px; text-align: center;">
          <div style="font-size: 40px; margin-bottom: 12px;">📱</div>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">ElectroZone</h3>
          <p style="font-size: 13px; color: var(--gray-600);">Gadgets</p>
          <div style="margin-top: 12px; font-size: 14px;">⭐ 4.2</div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading top vendors:', error);
  }
}

// Load Flash Deals
async function loadFlashDeals() {
  try {
    const response = await api.getProducts({ sort: 'price_low', limit: 4 });
    if (response.success) {
      const flashDeals = document.getElementById('flashDeals');
      if (flashDeals) {
        flashDeals.innerHTML = response.products.map(product => createProductCard(product)).join('');
      }
    }
  } catch (error) {
    console.error('Error loading flash deals:', error);
  }
}

// Create Product Card
function createProductCard(product) {
  const imageUrl = product.primary_image || 'https://via.placeholder.com/200';
  const vendorName = product.vendor_name || 'Unknown Vendor';
  const rating = product.rating || 0;
  const reviews = product.total_reviews || 0;
  const price = product.price;
  const discountPrice = product.discount_price;
  const discountPercentage = product.discount_percentage || 0;

  return `
    <div class="card">
      <div class="card-image">
        <img src="${imageUrl}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200'">
        ${discountPercentage > 0 ? `<span class="card-badge">${discountPercentage}% OFF</span>` : ''}
      </div>
      <div class="card-content">
        <div class="card-vendor">${vendorName}</div>
        <h3 class="card-title">
          <a href="product.html?id=${product.id}">${product.name}</a>
        </h3>
        <div class="card-rating">
          <span>⭐ ${rating.toFixed(1)}</span>
          <span style="color: var(--gray-500);">(${reviews} reviews)</span>
        </div>
        <div class="card-price">
          <span class="card-price-current">${formatPrice(discountPrice || price)}</span>
          ${discountPrice ? `<span class="card-price-original">${formatPrice(price)}</span>` : ''}
          ${discountPercentage > 0 ? `<span class="card-price-discount">${discountPercentage}% off</span>` : ''}
        </div>
        <div class="card-actions">
          <button class="btn btn-primary-colored btn-sm" onclick="addToCart(${product.id})">Add to Cart</button>
          <button class="btn btn-secondary btn-sm" onclick="addToWishlist(${product.id})">❤️</button>
        </div>
      </div>
    </div>
  `;
}

// Add to Cart
async function addToCart(productId) {
  if (!checkAuth()) {
    showToast('Please login to add items to cart', 'warning');
    window.location.href = 'login.html';
    return;
  }

  try {
    await api.addToCart({ product_id: productId, quantity: 1 });
    showToast('Added to cart!', 'success');
    updateCartBadge();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Add to Wishlist
async function addToWishlist(productId) {
  if (!checkAuth()) {
    showToast('Please login to add items to wishlist', 'warning');
    window.location.href = 'login.html';
    return;
  }

  try {
    await api.addToWishlist({ product_id: productId });
    showToast('Added to wishlist!', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Search Products
function searchProducts() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
    }
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
  loadCategories();
  loadFeaturedProducts();
  loadTopVendors();
  loadFlashDeals();
  updateCartBadge();
});
