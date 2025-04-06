// Menu Data
const menuItems = [
    // Breakfast
    {
        id: 1,
        name: "Continental Breakfast",
        description: "Fresh fruits, pastries, yogurt, and coffee",
        price: 12.99,
        category: "breakfast",
        image: "images/breakfast.jpg"
    },
    {
        id: 2,
        name: "Eggs Benedict",
        description: "Poached eggs on English muffins with hollandaise sauce",
        price: 15.99,
        category: "breakfast",
        image: "images/eggs-benedict.jpg"
    },
    // Lunch
    {
        id: 3,
        name: "Caesar Salad",
        description: "Romaine lettuce, croutons, parmesan with Caesar dressing",
        price: 10.99,
        category: "lunch",
        image: "images/caesar-salad.jpg"
    },
    {
        id: 4,
        name: "Club Sandwich",
        description: "Triple-decker with turkey, bacon, lettuce, and tomato",
        price: 13.99,
        category: "lunch",
        image: "images/club-sandwich.jpg"
    },
    // Dinner
    {
        id: 5,
        name: "Filet Mignon",
        description: "8oz tender beef filet with roasted vegetables",
        price: 32.99,
        category: "dinner",
        image: "images/filet-mignon.jpg"
    },
    {
        id: 6,
        name: "Grilled Salmon",
        description: "Atlantic salmon with lemon butter sauce",
        price: 26.99,
        category: "dinner",
        image: "images/salmon.jpg"
    },
    // Desserts
    {
        id: 7,
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with molten center and vanilla ice cream",
        price: 8.99,
        category: "desserts",
        image: "images/lava-cake.jpg"
    }
];

// Shopping Cart
let cart = [];

// DOM Elements
const menuSections = {
    breakfast: document.querySelector('#breakfast .menu-items'),
    lunch: document.querySelector('#lunch .menu-items'),
    dinner: document.querySelector('#dinner .menu-items'),
    desserts: document.querySelector('#desserts .menu-items')
};

const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeModal = document.querySelector('.close');
const cartItemsContainer = document.getElementById('cartItems');
const totalAmountElement = document.getElementById('totalAmount');
const cartCountElement = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');

// Initialize the menu
function initializeMenu() {
    menuItems.forEach(item => {
        const menuItemElement = createMenuItemElement(item);
        menuSections[item.category].appendChild(menuItemElement);
    });
}

// Create menu item element
function createMenuItemElement(item) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="item-image">
        <div class="item-details">
            <h3>${item.name}</h3>
            <p class="item-description">${item.description}</p>
            <div class="item-footer">
                <span class="item-price">$${item.price.toFixed(2)}</span>
                <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
            </div>
        </div>
    `;
    return menuItem;
}

// Add to cart function
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCart();
}

// Remove from cart function
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// Update quantity function
function updateQuantity(itemId, newQuantity) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            removeFromCart(itemId);
        }
    }
    updateCart();
}

// Update cart UI
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Update cart modal
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        totalAmountElement.textContent = '0.00';
    } else {
        let totalAmount = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <button class="quantity-btn remove-btn" data-id="${item.id}">×</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        totalAmountElement.textContent = totalAmount.toFixed(2);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeMenu();
    
    // Add to cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            addToCart(itemId);
        }
    });
    
    // Cart modal buttons
    cartBtn.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });
    
    closeModal.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Cart item quantity controls
    cartItemsContainer.addEventListener('click', (e) => {
        const itemId = parseInt(e.target.getAttribute('data-id'));
        
        if (e.target.classList.contains('minus')) {
            const item = cart.find(i => i.id === itemId);
            if (item) {
                updateQuantity(itemId, item.quantity - 1);
            }
        } else if (e.target.classList.contains('plus')) {
            const item = cart.find(i => i.id === itemId);
            if (item) {
                updateQuantity(itemId, item.quantity + 1);
            }
        } else if (e.target.classList.contains('remove-btn')) {
            removeFromCart(itemId);
        }
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Thank you for your order! Your total is $' + totalAmountElement.textContent);
            cart = [];
            updateCart();
            cartModal.style.display = 'none';
        }
    });
});

// Smooth scrolling for navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});