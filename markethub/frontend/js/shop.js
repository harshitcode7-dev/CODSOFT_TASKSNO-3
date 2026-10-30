// Shop Page JavaScript

let currentPage = 1;
let currentFilters = {};

// Load Categories
async function loadCategories() {
  try {
    const response = await api.getCategories();
    if (response.success) {
      const categoryFilter = document.getElementById('categoryFilter');
      if (categoryFilter) {
        response.categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category.id;
          option.textContent = category.name;
          categoryFilter.appendChild(option);
        });
      }
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

// Load Products
async function loadProducts() {
  const loading = document.getElementById('loading');
  const emptyState = document.getElementById('emptyState');
  const productsGrid = document.getElementById('productsGrid');

  if (loading) loading.style.display = 'flex';
  if (emptyState) emptyState.style.display = 'none';
  if (productsGrid) productsGrid.innerHTML = '';

  try {
    const params = {
      page: currentPage,
      limit: 12,
      ...currentFilters,
    };

    const response = await api.getProducts(params);

    if (loading) loading.style.display = 'none';

    if (response.success && response.products.length > 0) {
      if (productsGrid) {
        productsGrid.innerHTML = response.products.map(product => createProductCard(product)).join('');
      }
      renderPagination(response.total, response.pages);
    } else {
      if (emptyState) emptyState.style.display = 'block';
    }
  } catch (error) {
    console.error('Error loading products:', error);
    if (loading) loading.style.display = 'none';
  }
}

// Apply Filters
function applyFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');
  const sortFilter = document.getElementById('sortFilter');
  const searchInput = document.getElementById('searchInput');

  currentFilters = {};

  if (categoryFilter && categoryFilter.value) {
    currentFilters.category = categoryFilter.value;
  }

  if (priceFilter && priceFilter.value) {
    const [min, max] = priceFilter.value.split('-');
    currentFilters.min_price = min;
    currentFilters.max_price = max;
  }

  if (sortFilter && sortFilter.value) {
    currentFilters.sort = sortFilter.value;
  }

  if (searchInput && searchInput.value) {
    currentFilters.search = searchInput.value;
  }

  currentPage = 1;
  loadProducts();
}

// Reset Filters
function resetFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');
  const sortFilter = document.getElementById('sortFilter');
  const searchInput = document.getElementById('searchInput');

  if (categoryFilter) categoryFilter.value = '';
  if (priceFilter) priceFilter.value = '';
  if (sortFilter) sortFilter.value = 'newest';
  if (searchInput) searchInput.value = '';

  currentFilters = {};
  currentPage = 1;
  loadProducts();
}

// Render Pagination
function renderPagination(total, pages) {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;

  let html = '';

  if (currentPage > 1) {
    html += `<button class="pagination-item" onclick="changePage(${currentPage - 1})">←</button>`;
  }

  for (let i = 1; i <= pages; i++) {
    html += `<button class="pagination-item ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
  }

  if (currentPage < pages) {
    html += `<button class="pagination-item" onclick="changePage(${currentPage + 1})">→</button>`;
  }

  pagination.innerHTML = html;
}

// Change Page
function changePage(page) {
  currentPage = page;
  loadProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  const search = urlParams.get('search');

  if (category) {
    currentFilters.category = category;
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) categoryFilter.value = category;
  }

  if (search) {
    currentFilters.search = search;
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = search;
  }

  loadCategories();
  loadProducts();
  updateCartBadge();
});
