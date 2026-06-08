let cart = JSON.parse(localStorage.getItem('turkishDelightCart')) || [];

document.addEventListener("DOMContentLoaded", () => {
    updateCart();
});

// Sepeti sağdan kaydırarak açıp kapatan ana fonksiyon
function toggleCart() {
    const sideCart = document.getElementById('side-cart');
    if(sideCart) {
        sideCart.classList.toggle('active');
    }
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    saveCart();
    updateCart();
    
    // Ürün eklenince sepetin otomatik açılmasını garantiliyoruz
    const sideCart = document.getElementById('side-cart');
    if(sideCart) {
        sideCart.classList.add('active');
    }
}

function changeQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
            return;
        }
    }
    saveCart();
    updateCart();
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCart();
}

function saveCart() {
    localStorage.setItem('turkishDelightCart', JSON.stringify(cart));
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    if(!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align:center; margin-top:50px; color:#aaa;">
                <i class="fas fa-shopping-cart" style="font-size:3rem; color:#b56576; margin-bottom:15px;"></i>
                <p>Your cart is empty.</p>
            </div>`;
        if(cartCount) cartCount.innerText = '0';
        if(cartTotal) cartTotal.innerText = '0.00';
        return;
    }

    let total = 0;
    let totalCount = 0;

    cart.forEach(item => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;
        totalCount += item.quantity;

        const itemElement = document.createElement('div');
        itemElement.classList.add('trendyol-cart-item');
        
        itemElement.innerHTML = `
            <div class="cart-item-details">
                <span class="item-title">${item.name}</span>
                <span class="item-price">${item.price}.00 TL</span>
                <div class="trendyol-counter">
                    <button onclick="changeQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <span class="item-total-price">${itemTotal.toLocaleString('tr-TR')}.00 TL</span>
                <span class="trendyol-delete" onclick="removeFromCart('${item.name}')">
                    <i class="fas fa-trash-alt"></i>
                </span>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    if(cartCount) cartCount.innerText = totalCount;
    if(cartTotal) cartTotal.innerText = total.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
}

