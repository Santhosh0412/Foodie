const BASE_URL = 'http://localhost:9090';

// ─────────────────────────────────────────────────────────
//  IMAGE LIBRARY — Correct images for each restaurant/item
//  Using Unsplash food photography with specific topic IDs
// ─────────────────────────────────────────────────────────
const RESTAURANT_IMAGES = {
  "domino":   "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=80",  // Pizza
  "pizza":    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=80",
  "haldiram": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=700&q=80",  // Indian sweets/snacks
  "behrouz":  "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=700&q=80",  // Biryani
  "biryani":  "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=700&q=80",
  "default":  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=80",  // Restaurant interior
};

const MENU_ITEM_IMAGES = {
  // Pizza
  "margherita":           "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
  "pepper barbecue":      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  "pizza":                "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
  // Indian
  "chole bhature":        "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80",
  "raj kachori":          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "kachori":              "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "chole":                "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80",
  // Biryani
  "biryani":              "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80",
  "dum gosht":            "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80",
  // Generics
  "chicken":              "https://images.unsplash.com/photo-1598103442097-8b74394b95c8?w=400&q=80",
  "paneer":               "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80",
  "burger":               "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  "pasta":                "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80",
  "noodles":              "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
  "sandwich":             "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&q=80",
  "salad":                "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  "dessert":              "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80",
  "sweet":                "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80",
  "default":              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",  // Generic food
};

function getRestaurantImage(name = '') {
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(RESTAURANT_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return RESTAURANT_IMAGES.default;
}

function getMenuItemImage(name = '') {
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(MENU_ITEM_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return MENU_ITEM_IMAGES.default;
}

// ─────────────────────────────────────────────────────────
//  APP LOGIC
// ─────────────────────────────────────────────────────────
const grid = document.getElementById('restaurant-grid');
const searchInput = document.getElementById('search-input');
const loading = document.getElementById('loading');
const overlay = document.getElementById('menu-overlay');
const menuContainer = document.getElementById('menu-items-container');
const toast = document.getElementById('toast');

let allRestaurants = [];

window.addEventListener('DOMContentLoaded', fetchRestaurants);

let activeFilter = 'all';

function setFilter(filter, el) {
  activeFilter = filter;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  const term = (searchInput ? searchInput.value : '').toLowerCase();
  applyFilter(term);
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    applyFilter(e.target.value.toLowerCase());
  });
}

function applyFilter(term) {
  let filtered = allRestaurants.filter(r => {
    const nameMatch = r.restaurantName && r.restaurantName.toLowerCase().includes(term);
    const stateMatch = r.state && r.state.toLowerCase().includes(term);
    const streetMatch = r.streetLine1 && r.streetLine1.toLowerCase().includes(term);
    const dishMatch = r.menuItemResponseDTOList && r.menuItemResponseDTOList.some(item =>
      (item.menuItemName && item.menuItemName.toLowerCase().includes(term)) ||
      (item.menuItemDescription && item.menuItemDescription.toLowerCase().includes(term))
    );
    const matchesSearch = !term || nameMatch || stateMatch || streetMatch || dishMatch;
    if (!matchesSearch) return false;

    if (activeFilter === 'veg') {
      return r.menuItemResponseDTOList && r.menuItemResponseDTOList.some(i => i.menuItemType === 'VEG');
    }
    if (activeFilter === 'nonveg') {
      return r.menuItemResponseDTOList && r.menuItemResponseDTOList.some(i => i.menuItemType === 'NONVEG');
    }
    return true;
  });
  renderRestaurants(filtered);
}

const FALLBACK_RESTAURANTS = [
  {
    restaurantId: 101,
    restaurantName: "Dominos Pizza Express",
    streetLine1: "Connaught Place, Block C",
    state: "Delhi",
    menuItemResponseDTOList: [
      {
        menuItemId: 1001,
        menuItemName: "Peppy Paneer Pizza",
        menuItemDescription: "Flavorful paneer cubes, crisp capsicum, and spicy red paprika",
        menuItemType: "VEG",
        menuItemLabel: "Bestseller",
        menuItemVariantResponseDTOList: [
          { menuVariantId: 2001, menuVariantName: "Regular (7 inch)", menuVariantPrice: 249, menuVariantAvailable: true },
          { menuVariantId: 2002, menuVariantName: "Medium (10 inch)", menuVariantPrice: 459, menuVariantAvailable: true }
        ]
      },
      {
        menuItemId: 1002,
        menuItemName: "Chicken Pepperoni Pizza",
        menuItemDescription: "American classic with spicy chicken pepperoni and mozzarella cheese",
        menuItemType: "NONVEG",
        menuItemLabel: "Trending",
        menuItemVariantResponseDTOList: [
          { menuVariantId: 2003, menuVariantName: "Medium (10 inch)", menuVariantPrice: 599, menuVariantAvailable: true }
        ]
      }
    ]
  },
  {
    restaurantId: 102,
    restaurantName: "Punjab Grill & Dhaba",
    streetLine1: "Sector 17, Main Market",
    state: "Punjab",
    menuItemResponseDTOList: [
      {
        menuItemId: 1003,
        menuItemName: "Butter Paneer Masala",
        menuItemDescription: "Rich cottage cheese gravy with butter, cream, and aromatic spices",
        menuItemType: "VEG",
        menuItemLabel: "Chef Special",
        menuItemVariantResponseDTOList: [
          { menuVariantId: 2004, menuVariantName: "Half (250ml)", menuVariantPrice: 220, menuVariantAvailable: true },
          { menuVariantId: 2005, menuVariantName: "Full (500ml)", menuVariantPrice: 380, menuVariantAvailable: true }
        ]
      },
      {
        menuItemId: 1004,
        menuItemName: "Dal Makhani",
        menuItemDescription: "Slow-cooked black lentils simmered overnight with butter and cream",
        menuItemType: "VEG",
        menuItemLabel: "Must Try",
        menuItemVariantResponseDTOList: [
          { menuVariantId: 2006, menuVariantName: "Full Bowl", menuVariantPrice: 260, menuVariantAvailable: true }
        ]
      }
    ]
  },
  {
    restaurantId: 103,
    restaurantName: "Bawarchi Biryani House",
    streetLine1: "RTC X Roads",
    state: "Telangana",
    menuItemResponseDTOList: [
      {
        menuItemId: 1005,
        menuItemName: "Hyderabadi Chicken Dum Biryani",
        menuItemDescription: "Authentic dum biryani served with spicy Mirchi Ka Salan & Raita",
        menuItemType: "NONVEG",
        menuItemLabel: "Super Popular",
        menuItemVariantResponseDTOList: [
          { menuVariantId: 2007, menuVariantName: "Single Portion", menuVariantPrice: 190, menuVariantAvailable: true },
          { menuVariantId: 2008, menuVariantName: "Family Pack", menuVariantPrice: 520, menuVariantAvailable: true }
        ]
      }
    ]
  }
];

async function fetchRestaurants() {
  try {
    const res = await fetch(`${BASE_URL}/restaurant`);
    let data = [];
    if (res.ok) {
      data = await res.json();
    }
    
    // Combine backend data with fallback demo data if backend has empty items
    if (!data || data.length === 0) {
      allRestaurants = FALLBACK_RESTAURANTS;
    } else {
      // If backend items have no menu items, attach fallback menu items for demo
      allRestaurants = data.map(r => {
        if (!r.menuItemResponseDTOList || r.menuItemResponseDTOList.length === 0) {
          const match = FALLBACK_RESTAURANTS.find(f => f.restaurantName.toLowerCase().includes(r.restaurantName.toLowerCase()));
          return {
            ...r,
            menuItemResponseDTOList: match ? match.menuItemResponseDTOList : FALLBACK_RESTAURANTS[0].menuItemResponseDTOList
          };
        }
        return r;
      });
      // Append fallback demo restaurants if total count is small
      if (allRestaurants.length < 3) {
        allRestaurants = [...allRestaurants, ...FALLBACK_RESTAURANTS];
      }
    }

    if (loading) loading.style.display = 'none';
    const st = document.getElementById('section-title');
    if (st) st.style.display = 'flex';
    applyFilter(searchInput ? searchInput.value.toLowerCase() : '');
  } catch (err) {
    console.warn('Backend fetch error, using fallback demo restaurants:', err);
    allRestaurants = FALLBACK_RESTAURANTS;
    if (loading) loading.style.display = 'none';
    const st = document.getElementById('section-title');
    if (st) st.style.display = 'flex';
    applyFilter(searchInput ? searchInput.value.toLowerCase() : '');
  }
}

async function fetchNearbyRestaurants(el) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');

  const getPosition = () => new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({ lat: 28.6139, lng: 77.2090 }), // Default to Delhi coordinates
        { timeout: 5000 }
      );
    } else {
      resolve({ lat: 28.6139, lng: 77.2090 });
    }
  });

  if (loading) {
    loading.style.display = 'block';
    loading.textContent = '📍 Finding restaurants within 5 km of your location…';
  }

  const coords = await getPosition();

  try {
    const res = await fetch(`${BASE_URL}/restaurant/getRestaurantToUser?userLon=${coords.lng}&userLat=${coords.lat}`);
    if (res.ok) {
      const data = await res.json();
      allRestaurants = Array.isArray(data) ? data : [];
    } else {
      allRestaurants = [];
    }
  } catch (e) {
    console.warn('Backend getRestaurantToUser error:', e);
    allRestaurants = [];
  }

  if (loading) loading.style.display = 'none';
  const st = document.getElementById('section-title');
  if (st) st.style.display = 'flex';

  const term = (searchInput ? searchInput.value : '').toLowerCase();
  applyFilter(term);

  if (allRestaurants.length > 0) {
    showToast(`📍 Found ${allRestaurants.length} restaurant(s) within 5 km`);
  } else {
    showToast('📍 No restaurants found within 5 km of your location');
  }
}

function renderRestaurants(restaurants) {
  const badge = document.getElementById('count-badge');
  if (badge) badge.textContent = restaurants.length;

  if (!restaurants || restaurants.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div style="font-size:3rem;margin-bottom:16px;">📍</div>
        <h3>No restaurants found within 5 km</h3>
        <p>There are no restaurants registered within 5 km of this location. Try clicking "All" to browse all available restaurants.</p>
      </div>`;
    return;
  }

  grid.innerHTML = restaurants.map(r => {
    const img = getRestaurantImage(r.restaurantName);
    const rating = ((r.restaurantId * 7 + 33) % 15 / 10 + 3.5).toFixed(1);
    const location = [r.streetLine1, r.state].filter(Boolean).join(', ');
    const offers = ['20% off up to ₹100', 'Free delivery', '₹50 off on first order', '30% off on combo'];
    const offer = offers[r.restaurantId % offers.length];

    return `
      <div class="restaurant-card" onclick="openMenu(${r.restaurantId}, '${r.restaurantName.replace(/'/g, "\\'")}')">
        <div class="r-img-wrap">
          <img src="${img}" alt="${r.restaurantName}" class="r-image" loading="lazy"
               onerror="this.src='${RESTAURANT_IMAGES.default}'" />
          <div class="r-img-overlay"></div>
          <div class="r-offer-tag">🏷️ ${offer}</div>
        </div>
        <div class="r-info">
          <div class="r-header">
            <h3 class="r-name">${r.restaurantName}</h3>
            <div class="r-rating">★ ${rating}</div>
          </div>
          <div class="r-meta">
            <span class="r-cuisine">Indian Cuisine</span>
            <span class="r-dot">•</span>
            <span>30–40 min</span>
            <span class="r-dot">•</span>
            <span>₹200 for one</span>
          </div>
          <div class="r-location">📍 ${location}</div>
        </div>
      </div>`;
  }).join('');
}

async function openMenu(id, name) {
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  menuContainer.innerHTML = '';
  document.getElementById('m-loading').style.display = 'block';
  document.getElementById('m-name').textContent = name;
  document.getElementById('m-address').textContent = 'Loading...';

  try {
    const res = await fetch(`${BASE_URL}/restaurant/${id}`);
    if (!res.ok) throw new Error('Failed to load');
    const data = await res.json();

    document.getElementById('m-loading').style.display = 'none';
    document.getElementById('m-name').textContent = data.restaurantName;
    document.getElementById('m-address').textContent =
      [data.streetLine1, data.streetLine2, data.state, data.pinCode].filter(Boolean).join(', ')
      + (data.restaurantPhoneNumber ? ` | 📞 +91 ${data.restaurantPhoneNumber}` : '');

    // Update menu hero image
    const heroEl = document.getElementById('menu-hero-img');
    if (heroEl) heroEl.src = getRestaurantImage(data.restaurantName);

    renderMenu(data.menuItemResponseDTOList || []);
  } catch (err) {
    document.getElementById('m-loading').textContent = '⚠ Failed to load menu. Please try again.';
  }
}

function closeMenu() {
  overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function renderMenu(items) {
  if (items.length === 0) {
    menuContainer.innerHTML = `
      <div class="empty-state">
        <div style="font-size:3rem;margin-bottom:16px;">🫙</div>
        <h3>No menu items yet</h3>
        <p>The restaurant hasn't added items yet.</p>
      </div>`;
    return;
  }

  // Separate veg and non-veg
  const veg    = items.filter(i => i.menuItemType === 'VEG');
  const nonVeg = items.filter(i => i.menuItemType !== 'VEG');

  const buildSection = (sectionItems, title, icon) => {
    if (!sectionItems.length) return '';
    return `
      <div class="menu-section">
        <h3 class="menu-section-title">${icon} ${title} <span>(${sectionItems.length})</span></h3>
        ${sectionItems.map(item => buildMenuItemCard(item)).join('')}
      </div>`;
  };

  menuContainer.innerHTML = buildSection(veg, 'Veg', '🟢') + buildSection(nonVeg, 'Non-Veg', '🔴');
}

function buildMenuItemCard(item) {
  const variants = item.menuItemVariantResponseDTOList || [];
  const minPrice = variants.length > 0 ? Math.min(...variants.map(v => v.menuVariantPrice)) : null;
  const img = getMenuItemImage(item.menuItemName);
  const isVeg = item.menuItemType === 'VEG';

  const typeSvg = isVeg
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E8449" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="12" r="5" fill="#1E8449" stroke="none"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E23744" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 7l4 8H8z" fill="#E23744" stroke="none"/></svg>`;

  const labelHtml = item.menuItemLabel
    ? `<span class="mi-badge">${item.menuItemLabel}</span>` : '';

  const currentRestName = document.getElementById('m-name')?.textContent || 'Restaurant';

  const defaultVariant = variants.length > 0 ? variants[0] : { menuVariantName: 'Standard', menuVariantPrice: minPrice || 199 };
  const variantName = defaultVariant.menuVariantName || 'Standard';
  const variantPrice = defaultVariant.menuVariantPrice || minPrice || 199;

  const escapedName = item.menuItemName.replace(/'/g, "\\'");
  const escapedVariant = variantName.replace(/'/g, "\\'");

  const variantButtons = variants.length > 1
    ? `<div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px;">
        ${variants.map(v => `
          <button onclick="addToCart('${escapedName}', '${v.menuVariantName.replace(/'/g, "\\'")}', ${v.menuVariantPrice}, '${currentRestName.replace(/'/g, "\\'")}', event)" 
                  style="background: #FFF0F1; border: 1px solid #E23744; color: #E23744; padding: 4px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.2s;"
                  onmouseover="this.style.background='#E23744'; this.style.color='white';"
                  onmouseout="this.style.background='#FFF0F1'; this.style.color='#E23744';">
            + ${v.menuVariantName} (₹${v.menuVariantPrice})
          </button>
        `).join('')}
       </div>`
    : '';

  return `
    <div class="menu-item">
      <div class="mi-details">
        <div class="mi-top">${typeSvg} ${labelHtml}</div>
        <h4 class="mi-name">${item.menuItemName}</h4>
        <p class="mi-desc">${item.menuItemDescription || ''}</p>
        ${minPrice !== null ? `<div class="mi-price">₹${minPrice}${variants.length > 1 ? ' <span class="mi-onwards">onwards</span>' : ''}</div>` : ''}
        ${variantButtons}
      </div>
      <div class="mi-image-container">
        <img src="${img}" alt="${item.menuItemName}" class="mi-image"
             onerror="this.src='${MENU_ITEM_IMAGES.default}'" loading="lazy"/>
        <button class="btn-add" onclick="addToCart('${escapedName}', '${escapedVariant}', ${variantPrice}, '${currentRestName.replace(/'/g, "\\'")}', event)">ADD +</button>
      </div>
    </div>`;
}

// ─────────────────────────────────────────────────────────
//  CART & CHECKOUT SYSTEM
// ─────────────────────────────────────────────────────────
let cart = [];
let deliveryAddress = {
  type: "Home",
  flat: "Flat 402, Sunshine Apartments",
  area: "Sector 18",
  city: "Delhi",
  pincode: "110001",
  mobile: "9876543210"
};

function addToCart(itemName, variantName, price, restaurantName, e) {
  if (e) e.stopPropagation();

  // If cart has items from another restaurant, reset cart or alert
  if (cart.length > 0 && cart[0].restaurantName !== restaurantName) {
    if (!confirm(`Your cart contains items from "${cart[0].restaurantName}". Reset cart and add items from "${restaurantName}"?`)) {
      return;
    }
    cart = [];
  }

  const existingIndex = cart.findIndex(c => c.name === itemName && c.variantName === variantName);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      name: itemName,
      variantName: variantName,
      price: Number(price),
      quantity: 1,
      restaurantName: restaurantName
    });
  }

  updateCartUI();
  showToast(`✓ Added "${itemName} (${variantName})" to cart`);
}

function updateQuantity(index, delta) {
  if (cart[index]) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  }
  updateCartUI();
}

function getCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const delivery = subtotal === 0 ? 0 : (subtotal > 300 ? 0 : 40);
  const grandTotal = subtotal + tax + delivery;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, tax, delivery, grandTotal, itemCount };
}

function updateCartUI() {
  const { subtotal, tax, delivery, grandTotal, itemCount } = getCartTotals();

  // Floating Cart Bar
  const floatBar = document.getElementById('floating-cart-bar');
  const floatCount = document.getElementById('float-cart-count');
  if (floatBar && floatCount) {
    if (itemCount > 0) {
      floatCount.textContent = `${itemCount} Item${itemCount > 1 ? 's' : ''} | ₹${grandTotal}`;
      floatBar.style.display = 'flex';
    } else {
      floatBar.style.display = 'none';
    }
  }

  // Cart Drawer Elements
  const cartList = document.getElementById('cart-items-list');
  const restNameEl = document.getElementById('cart-restaurant-name');
  if (restNameEl && cart.length > 0) {
    restNameEl.textContent = `Ordering from ${cart[0].restaurantName}`;
  }

  if (cartList) {
    if (cart.length === 0) {
      cartList.innerHTML = `
        <div style="text-align: center; padding: 40px 0; color: #696969;">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">🛒</div>
          <p style="font-weight: 600;">Your cart is empty</p>
          <p style="font-size: 0.85rem;">Add dishes from the menu to start ordering!</p>
        </div>`;
    } else {
      cartList.innerHTML = cart.map((item, idx) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #EBEBEB;">
          <div style="flex: 1;">
            <div style="font-weight: 700; font-size: 0.95rem; color: #1C1C1C;">${item.name}</div>
            <div style="font-size: 0.78rem; color: #696969;">${item.variantName} — ₹${item.price}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; background: #FFF0F1; border: 1px solid #E23744; border-radius: 8px; padding: 4px 10px;">
            <button onclick="updateQuantity(${idx}, -1)" style="background: none; border: none; font-weight: 800; color: #E23744; cursor: pointer; font-size: 1.1rem;">-</button>
            <span style="font-weight: 800; font-size: 0.9rem; color: #E23744;">${item.quantity}</span>
            <button onclick="updateQuantity(${idx}, 1)" style="background: none; border: none; font-weight: 800; color: #E23744; cursor: pointer; font-size: 1.1rem;">+</button>
          </div>
          <div style="font-weight: 800; font-size: 0.95rem; color: #1C1C1C; width: 70px; text-align: right;">₹${item.price * item.quantity}</div>
        </div>
      `).join('');
    }
  }

  // Bill Details
  const subtotalEl = document.getElementById('bill-subtotal');
  const deliveryEl = document.getElementById('bill-delivery');
  const taxEl = document.getElementById('bill-tax');
  const grandTotalEl = document.getElementById('bill-grand-total');

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  if (deliveryEl) deliveryEl.textContent = delivery === 0 ? 'FREE' : `₹${delivery}`;
  if (taxEl) taxEl.textContent = `₹${tax}`;
  if (grandTotalEl) grandTotalEl.textContent = `₹${grandTotal}`;
}

function toggleCartDrawer(show) {
  const backdrop = document.getElementById('cart-drawer-backdrop');
  const drawer = document.getElementById('cart-drawer');

  if (show) {
    if (backdrop) backdrop.style.display = 'block';
    if (drawer) drawer.style.right = '0';
    updateCartUI();
  } else {
    if (backdrop) backdrop.style.display = 'none';
    if (drawer) drawer.style.right = '-460px';
  }
}

function editDeliveryAddress() {
  const flat = prompt("Enter Flat / House No. / Building:", deliveryAddress.flat) || deliveryAddress.flat;
  const area = prompt("Enter Area / Street / Landmark:", deliveryAddress.area) || deliveryAddress.area;
  const city = prompt("Enter City / State:", deliveryAddress.city) || deliveryAddress.city;
  const pincode = prompt("Enter Pincode:", deliveryAddress.pincode) || deliveryAddress.pincode;
  const mobile = prompt("Enter Contact Mobile Number:", deliveryAddress.mobile) || deliveryAddress.mobile;

  deliveryAddress = { ...deliveryAddress, flat, area, city, pincode, mobile };

  const addressDisplay = document.getElementById('cart-address-display');
  const phoneDisplay = document.getElementById('cart-phone-display');

  if (addressDisplay) {
    addressDisplay.textContent = `🏠 ${deliveryAddress.type} — ${flat}, ${area}, ${city} (${pincode})`;
  }
  if (phoneDisplay) {
    phoneDisplay.textContent = `📞 Contact: +91 ${mobile}`;
  }
  showToast('📍 Delivery address updated!');
}

function getSavedOrders() {
  try {
    const data = localStorage.getItem('foodie_orders') || localStorage.getItem('zomato_orders');
    const parsed = data ? JSON.parse(data) : [];
    if (parsed.length === 0) {
      const defaultOrders = [
        {
          id: "#FOODIE-849201",
          date: "Today, 04:30 PM",
          restaurantName: "Dominos Pizza Express",
          items: [
            { name: "Peppy Paneer Pizza", variantName: "Medium (10 inch)", price: 459, quantity: 1, restaurantName: "Dominos Pizza Express" },
            { name: "Garlic Breadsticks", variantName: "Standard", price: 149, quantity: 1, restaurantName: "Dominos Pizza Express" }
          ],
          address: "Home — Flat 402, Sunshine Apartments, Sector 18, Delhi (110001)",
          subtotal: 608,
          tax: 30,
          delivery: 0,
          grandTotal: 638,
          status: "🟢 On the Way 🛵",
          estimatedTime: "15 Mins 🛵"
        }
      ];
      localStorage.setItem('foodie_orders', JSON.stringify(defaultOrders));
      return defaultOrders;
    }
    return parsed;
  } catch (e) {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem('foodie_orders', JSON.stringify(orders));
}

function placeOrder() {
  if (cart.length === 0) {
    alert('Your cart is empty! Add dishes to place an order.');
    return;
  }

  const { subtotal, tax, delivery, grandTotal } = getCartTotals();
  const orderId = `#FOODIE-${Math.floor(100000 + Math.random() * 900000)}`;
  const nowStr = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const orderRecord = {
    id: orderId,
    date: nowStr,
    restaurantName: cart[0]?.restaurantName || 'Foodie Restaurant',
    items: JSON.parse(JSON.stringify(cart)),
    address: `${deliveryAddress.type} — ${deliveryAddress.flat}, ${deliveryAddress.area}, ${deliveryAddress.city} (${deliveryAddress.pincode})`,
    subtotal: subtotal,
    tax: tax,
    delivery: delivery,
    grandTotal: grandTotal,
    status: "🟢 Placed & Preparing 👨‍🍳",
    estimatedTime: "25–30 Mins 🛵"
  };

  // Save order to history
  const orders = getSavedOrders();
  orders.unshift(orderRecord);
  saveOrders(orders);

  const modalOrderId = document.getElementById('modal-order-id');
  const modalAddress = document.getElementById('modal-address');
  const modalTotal = document.getElementById('modal-total-paid');
  const modalItems = document.getElementById('modal-order-items');
  const modalBackdrop = document.getElementById('order-modal-backdrop');

  if (modalOrderId) modalOrderId.textContent = orderId;
  if (modalAddress) modalAddress.textContent = `📍 Delivery to: ${deliveryAddress.type} — ${deliveryAddress.area}, ${deliveryAddress.city}`;
  if (modalTotal) modalTotal.textContent = `₹${grandTotal}`;
  if (modalItems) {
    modalItems.innerHTML = cart.map(it => `
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #333; margin-bottom: 4px;">
        <span style="font-weight: 600;">${it.quantity}x ${it.name} <small style="color: #666;">(${it.variantName})</small></span>
        <span style="font-weight: 700; color: #1C1C1C;">₹${it.price * it.quantity}</span>
      </div>
    `).join('');
  }

  toggleCartDrawer(false);
  if (modalBackdrop) modalBackdrop.style.display = 'flex';

  // Reset Cart
  cart = [];
  updateCartUI();
}

// Auto open orders modal if requested via URL
if (new URLSearchParams(window.location.search).get('openOrders') === 'true') {
  window.addEventListener('load', () => {
    setTimeout(openOrdersHistoryModal, 200);
  });
}

function closeOrderModal() {
  const modalBackdrop = document.getElementById('order-modal-backdrop');
  if (modalBackdrop) modalBackdrop.style.display = 'none';
}

function openOrdersHistoryModal() {
  const modal = document.getElementById('orders-history-backdrop');
  const list = document.getElementById('orders-history-list');
  if (!modal || !list) return;

  const orders = getSavedOrders();

  if (!orders || orders.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; padding: 60px 0; color: #696969;">
        <div style="font-size: 3rem; margin-bottom: 12px;">📦</div>
        <h4 style="font-weight: 700; font-size: 1.1rem; margin-bottom: 4px;">No Orders Placed Yet</h4>
        <p style="font-size: 0.88rem;">When you order food, your active &amp; past orders will appear here!</p>
      </div>`;
  } else {
    list.innerHTML = orders.map(ord => {
      const items = ord.items && Array.isArray(ord.items) && ord.items.length > 0
        ? ord.items
        : [
            { name: "Order Item", variantName: "Standard", price: ord.grandTotal || 200, quantity: 1 }
          ];

      const itemsHtml = items.map(it => {
        const name = it.name || it.menuItemName || it.itemName || 'Food Item';
        const variant = it.variantName || it.menuVariantName || 'Standard';
        const qty = it.quantity || it.qty || 1;
        const price = it.price || 0;
        const total = price * qty;
        return `
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem; color: #333; margin-bottom: 6px; padding: 4px 0;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: #FFF0F1; color: #E23744; font-weight: 800; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">${qty}x</span>
              <span style="font-weight: 600;">${name}</span>
              <span style="color: #888; font-size: 0.78rem;">(${variant})</span>
            </div>
            <span style="font-weight: 700; color: #1C1C1C;">₹${total}</span>
          </div>
        `;
      }).join('');

      return `
        <div style="background: #F8F9FA; border: 1.5px solid #EBEBEB; border-radius: 16px; padding: 18px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
            <div>
              <span style="font-weight: 800; font-size: 1.05rem; color: #1C1C1C;">${ord.restaurantName || 'Zomato Restaurant'}</span>
              <div style="font-size: 0.78rem; color: #696969; margin-top: 2px;">Order ID: ${ord.id} • ${ord.date}</div>
            </div>
            <span style="background: #E8F8F5; color: #1E8449; font-size: 0.78rem; font-weight: 800; padding: 4px 10px; border-radius: 50px; border: 1px solid #2ECC7155;">
              ${ord.status || '🟢 Placed & Preparing'}
            </span>
          </div>

          <div style="padding: 10px 0; border-top: 1px dashed #E0E0E0; border-bottom: 1px dashed #E0E0E0; margin-bottom: 12px;">
            ${itemsHtml}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 0.8rem; color: #696969; max-width: 70%;">
              📍 ${ord.address || 'Delivery Address'}
            </div>
            <div style="font-size: 1.05rem; font-weight: 900; color: #E23744;">
              ₹${ord.grandTotal}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  modal.style.display = 'flex';
}

function closeOrdersHistoryModal(e) {
  if (e && e.target.id !== 'orders-history-backdrop') return;
  const modal = document.getElementById('orders-history-backdrop');
  if (modal) modal.style.display = 'none';
}

// Bind to global window object for header button access
window.openOrdersHistoryModal = openOrdersHistoryModal;
window.closeOrdersHistoryModal = closeOrdersHistoryModal;

let toastTimeout;
function showToast(msg) {
  if (!toast) return;
  toast.innerHTML = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}
