// Data: Product List
const products = [
  {
    id: 1,
    name: 'Premium Rose Bouquet',
    price: 999,
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 2,
    name: 'Luxury Choco Hamper',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 3,
    name: 'Festive Sparkle Gift Box',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 4,
    name: 'Personalized Mug Set',
    price: 599,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 5,
    name: 'Festive Sparkle Gift Box',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 6,
    name: 'Personalized Mug Set',
    price: 599,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  // {
  //   id: 7,
  //   name: 'Aromatic Candle Collection',
  //   price: 899,
  //   image: 'https://images.unsplash.com/photo-1602874801007-bd458fc1d317?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  // },
  // {
  //   id: 8,
  //   name: 'Teddy Bear & Treats',
  //   price: 1299,
  //   image: 'https://images.unsplash.com/photo-1559479083-d3b131e50080?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  // },
];

// State: Cart
let cart = [];

// DOM Elements
const productsContainer = document.getElementById('products-container');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total-price');
const checkoutForm = document.getElementById('checkout-form');
const contactForm = document.getElementById('contact-form');
const emptyCartMsg = document.querySelector('.empty-cart-msg');

// Offcanvas Elements
const cartOverlay = document.getElementById('cart-overlay');
const offcanvasCart = document.getElementById('offcanvas-cart');
const closeCartBtn = document.getElementById('close-cart-btn');
const offcanvasItemsContainer = document.getElementById('offcanvas-items-container');
const offcanvasTotalPrice = document.getElementById('offcanvas-total-price');
const continueShoppingBtn = document.getElementById('continue-shopping-btn');
const checkoutDrawerBtn = document.getElementById('checkout-drawer-btn');
const navCartBtn = document.getElementById('nav-cart-btn');

const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');

// Mobile Menu Toggle
if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Offcanvas Handlers
function openCart() {
  cartOverlay.classList.add('active');
  offcanvasCart.classList.add('active');
}

function closeCart() {
  cartOverlay.classList.remove('active');
  offcanvasCart.classList.remove('active');
}

cartOverlay.addEventListener('click', closeCart);
closeCartBtn.addEventListener('click', closeCart);
continueShoppingBtn.addEventListener('click', closeCart);
navCartBtn.addEventListener('click', (e) => {
  e.preventDefault();
  openCart();
});
checkoutDrawerBtn.addEventListener('click', () => {
  closeCart();
});

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && offcanvasCart.classList.contains('active')) {
    closeCart();
  }
});

// Initialize App
function init() {
  renderProducts();
  loadCart();
  initSwiper();
}

// Render Products
function renderProducts() {
  if (!productsContainer) return;
  productsContainer.innerHTML = '';
  products.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card swiper-slide animate__animated animate__fadeInUp';
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">₹${product.price}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
        `;
    productsContainer.appendChild(card);
    observer.observe(card);
  });
}

// Swiper Initialization
function initSwiper() {
  new Swiper('.mySwiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });
}

// Load Cart from sessionStorage
function loadCart() {
  const savedCart = sessionStorage.getItem('sajigaz_cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  } else {
    cart = [];
  }
  updateCartUI();
}

// Save Cart to sessionStorage
function saveCart() {
  sessionStorage.setItem('sajigaz_cart', JSON.stringify(cart));
}

// Add to Cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartUI();

  // Open offcanvas cart and confetti
  openCart();
  triggerConfetti();
}

// Update Quantity
function updateQuantity(productId, change) {
  const itemIndex = cart.findIndex((item) => item.id === productId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += change;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    saveCart();
    updateCartUI();
  }
}

// Remove from Cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  updateCartUI();
}

// Update Cart UI
function updateCartUI() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
    offcanvasItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
    cartCountElement.textContent = '0';
    cartTotalElement.textContent = '₹0';
    offcanvasTotalPrice.textContent = '₹0';
    return;
  }

  cartItemsContainer.innerHTML = '';
  offcanvasItemsContainer.innerHTML = '';
  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach((item) => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;

    const cartItemEl = document.createElement('div');
    cartItemEl.className = 'cart-item animate__animated animate__fadeIn';
    cartItemEl.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div>
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                </div>
            </div>
            <div class="cart-controls">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="qty-display">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    cartItemsContainer.appendChild(cartItemEl);

    // Offcanvas Item
    const offcanvasItemEl = document.createElement('div');
    offcanvasItemEl.className = 'offcanvas-item animate__animated animate__fadeIn';
    offcanvasItemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="offcanvas-item-img">
            <div class="offcanvas-item-details">
                <div class="offcanvas-item-title">${item.name}</div>
                <div class="offcanvas-item-price">₹${item.price}</div>
                <div class="offcanvas-qty-controls">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="offcanvas-qty-display">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})" style="margin-left:auto; color:var(--primary);"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    offcanvasItemsContainer.appendChild(offcanvasItemEl);
  });

  cartCountElement.textContent = totalItems;
  cartTotalElement.textContent = `₹${totalPrice}`;
  offcanvasTotalPrice.textContent = `₹${totalPrice}`;
}

// Confetti Effect
function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#dc112f', '#50075d', '#f3b902', '#ca1d74', '#dfaac9', '#f5e297', '#c74253', '#744175'],
  });
}

// Checkout Form Submission
if (checkoutForm) {
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Your cart is empty! Add some gifts before ordering.');
      return;
    }

    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();

    let orderDetails = `*New Order from Sajigaz Gifts*\n\n`;
    orderDetails += `*Customer Details:*\n`;
    orderDetails += `Name: ${name}\n`;
    orderDetails += `Phone: ${phone}\n`;
    orderDetails += `Address: ${address}\n\n`;

    orderDetails += `*Order Items:*\n`;
    let totalPrice = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      orderDetails += `- ${item.name} x${item.quantity} = ₹${itemTotal}\n`;
    });

    orderDetails += `\n*Total Amount: ₹${totalPrice}*\n`;
    orderDetails += `\nThank you!`;

    const encodedMessage = encodeURIComponent(orderDetails);
    const whatsappUrl = `https://wa.me/+919566502152?text=${encodedMessage}`;

    // Celebration!
    triggerConfetti();
    setTimeout(triggerConfetti, 500);

    // Clear cart upon successful order preparation (optional, but good UX)
    cart = [];
    saveCart();
    updateCartUI();
    checkoutForm.reset();

    // Redirect to WhatsApp
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1000);
  });
}

// Contact Form Submission
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    let msg = `*New Inquiry from Website*\n\n`;
    msg += `Name: ${name}\n`;
    msg += `Phone: ${phone}\n`;
    msg += `Message: ${message}\n`;

    const encoded = encodeURIComponent(msg);
    const url = `https://wa.me/+919566502152?text=${encoded}`;

    triggerConfetti();
    contactForm.reset();

    setTimeout(() => window.open(url, '_blank'), 1000);
  });
}

// Scroll Animation and Move to Top Button
const moveToTopBtn = document.getElementById('move-to-top-btn');

// Show/Hide button on scroll
if (moveToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      moveToTopBtn.classList.add('visible');
    } else {
      moveToTopBtn.classList.remove('visible');
    }
  });

  // Smooth scroll to top
  moveToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('scroll-animate');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach((element) => {
  observer.observe(element);
});

// Run Init
document.addEventListener('DOMContentLoaded', init);
