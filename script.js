// DOM Elements
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const cartBtn = document.getElementById('cart-btn');
const cartPanel = document.getElementById('cart-panel');
const closeCartBtn = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartCount = document.querySelector('.cart-count');

// Sample cake data
const cakes = [
  {
    id: '1',
    name: 'Chocolate Delight',
    price: 45.99,
    img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
    category: 'birthday'
  },
  {
    id: '2',
    name: 'Vanilla Dream',
    price: 39.99,
    img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
    category: 'birthday'
  },
  {
    id: '3',
    name: 'Wedding Elegance',
    price: 129.99,
    img: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
    category: 'wedding'
  },
  {
    id: '4',
    name: 'Strawberry Cupcakes',
    price: 24.99,
    img: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
    category: 'cupcakes'
  },
  {
    id: '5',
    name: 'Fruit Pastry',
    price: 18.99,
    img: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
    category: 'pastries'
  },
  {
    id: '6',
    name: 'Red Velvet Cake',
    price: 42.99,
    img: 'https://images.unsplash.com/photo-1586788224331-947f68671cf1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
    category: 'birthday'
  }
];

// Shopping cart
let cart = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart from localStorage if available
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartUI();
  }

  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  // Cart panel toggle
  cartBtn.addEventListener('click', toggleCartPanel);
  closeCartBtn.addEventListener('click', closeCartPanel);
  overlay.addEventListener('click', closeCartPanel);

  // Menu page - if we're on it
  const menuContainer = document.getElementById('menu-container');
  if (menuContainer) {
    renderMenu(cakes);
    
    // Category filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        
        // Update active class
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter menu
        if (category === 'all') {
          renderMenu(cakes);
        } else {
          const filteredCakes = cakes.filter(cake => cake.category === category);
          renderMenu(filteredCakes);
        }
      });
    });
  }
});

// Toggle mobile menu
function toggleMobileMenu() {
  mobileMenu.classList.toggle('active');
}

// Toggle cart panel
function toggleCartPanel() {
  cartPanel.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.style.overflow = cartPanel.classList.contains('active') ? 'hidden' : '';
}

// Close cart panel
function closeCartPanel() {
  cartPanel.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Add item to cart
function addToCart(id) {
  const cake = cakes.find(c => c.id === id);
  if (!cake) return;
  
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...cake, quantity: 1 });
  }
  
  // Save to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update UI
  updateCartUI();
  
  // Show notification
  showNotification(`Added ${cake.name} to cart!`);
}

// Remove item from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  
  // Save to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update UI
  updateCartUI();
}

// Update item quantity
function updateQuantity(id, change) {
  const item = cart.find(item => item.id === id);
  if (!item) return;
  
  item.quantity += change;
  
  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }
  
  // Save to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update UI
  updateCartUI();
}

// Update cart UI
function updateCartUI() {
  // Update cart count
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  // Update cart items
  cartItems.innerHTML = '';
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    cartTotalPrice.textContent = '$0.00';
    return;
  }
  
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const cartItemEl = document.createElement('div');
    cartItemEl.className = 'cart-item';
    cartItemEl.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-quantity">
          <button class="quantity-button" onclick="updateQuantity('${item.id}', -1)">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-button" onclick="updateQuantity('${item.id}', 1)">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">Remove</button>
      </div>
    `;
    
    cartItems.appendChild(cartItemEl);
  });
  
  cartTotalPrice.textContent = `$${total.toFixed(2)}`;
}

// Render menu on the menu page
function renderMenu(cakesToRender) {
  const menuContainer = document.getElementById('menu-container');
  if (!menuContainer) return;
  
  menuContainer.innerHTML = '';
  
  cakesToRender.forEach(cake => {
    const cakeEl = document.createElement('div');
    cakeEl.className = 'menu-item';
    cakeEl.innerHTML = `
      <div class="menu-item-image">
        <img src="${cake.img}" alt="${cake.name}">
      </div>
      <div class="menu-item-details">
        <h3>${cake.name}</h3>
        <div class="menu-item-price">$${cake.price.toFixed(2)}</div>
        <button class="add-to-cart-btn" onclick="addToCart('${cake.id}')">Add to Cart</button>
      </div>
    `;
    
    menuContainer.appendChild(cakeEl);
  });
}

// Show notification
function showNotification(message) {
  // Create notification element if it doesn't exist
  let notification = document.querySelector('.notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);
  }
  
  // Set message and show
  notification.textContent = message;
  notification.classList.add('active');
  
  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove('active');
  }, 3000);
}

// Add styles for notification
const style = document.createElement('style');
style.textContent = `
  .notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--primary-color);
    color: white;
    padding: 12px 20px;
    border-radius: var(--radius);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s;
    z-index: 1000;
  }
  
  .notification.active {
    transform: translateY(0);
    opacity: 1;
  }
  
  .empty-cart {
    text-align: center;
    padding: 2rem 0;
    color: var(--muted-foreground-color);
  }
  
  .menu-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }
  
  .menu-item {
    background-color: white;
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .menu-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .menu-item-image img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .menu-item-details {
    padding: 1.5rem;
  }
  
  .menu-item-details h3 {
    margin-bottom: 0.5rem;
  }
  
  .menu-item-price {
    color: var(--accent-color);
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .add-to-cart-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: var(--radius);
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .add-to-cart-btn:hover {
    background-color: var(--primary-hover-color);
  }
  
  .category-filter {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }
  
  .category-btn {
    background-color: var(--muted-color);
    border: none;
    padding: 0.5rem 1.5rem;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .category-btn.active {
    background-color: var(--primary-color);
    color: white;
  }
`;

document.head.appendChild(style);