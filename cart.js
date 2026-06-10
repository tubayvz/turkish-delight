let cart = JSON.parse(localStorage.getItem('turkishDelightCart')) || [];

// Sayfa yüklendiğinde hem sepeti listele hem de butonları ayarla
document.addEventListener("DOMContentLoaded", () => {
    updateCart();

    // Sipariş tamamlama ve sepeti kalıcı sıfırlama sistemi
    const checkoutButtons = document.querySelectorAll('.checkout-btn');
    
    checkoutButtons.forEach(btn => {
        btn.removeAttribute('onclick');
        
        btn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your cart is empty! Please add some items first. 🛍️");
                return;
            }
            
            alert("🎉 Order successfully received! Thank you for choosing Turkish Delight.");
            
            cart = []; 
            saveCart();   
            updateCart(); 
            
            const sideCart = document.getElementById('side-cart');
            if (sideCart) {
                sideCart.classList.remove('active');
            }
        });
    });
});

// Sepeti sağdan kaydırarak açıp kapatan ana fonksiyon
function toggleCart() {
    const sideCart = document.getElementById('side-cart');
    if (sideCart) {
        sideCart.classList.toggle('active');
    }
}

// Ürün Ekleme Fonksiyonu
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }
    saveCart();
    updateCart();
    
    const sideCart = document.getElementById('side-cart');
    if (sideCart) {
        sideCart.classList.add('active');
    }
}

// Adet Değiştirme Fonksiyonu (+ / - Butonları İçin)
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

// Sepetten Ürün Silme Fonksiyonu (Çöp Kutusu İçin)
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCart();
}

// Hafızaya Kaydetme Fonksiyonu
function saveCart() {
    localStorage.setItem('turkishDelightCart', JSON.stringify(cart));
}

// Sepet Arayüzünü Güncelleyen Ana Fonksiyon
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align:center; margin-top:50px; color:#aaa;">
                <i class="fas fa-shopping-cart" style="font-size:3rem; color:#b56576; margin-bottom:15px;"></i>
                <p>Your cart is empty.</p>
            </div>`;
        if (cartCount) cartCount.innerText = '0';
        if (cartTotal) cartTotal.innerText = '0.00';
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

    if (cartCount) cartCount.innerText = totalCount;
    if (cartTotal) cartTotal.innerText = total.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
}

// 🚨 SADECE KOZMETİĞİ YAKALAYIP GİZLEYEN, DİĞER HER ŞEYE BEDEN BASAN ENJEKTÖR 🚨
function automaticSizeInjector() {
    const productCards = document.querySelectorAll(".product-card");
    
    productCards.forEach(card => {
        const cartBtn = card.querySelector(".add-to-cart-btn");
        const titleElement = card.querySelector("h3");
        
        if (cartBtn && titleElement && !card.querySelector(".size-selector")) {
            
            const title = titleElement.innerText.toLowerCase();
            const pagePath = window.location.pathname.toLowerCase();
            const imgElement = card.querySelector("img");
            const imgSrc = imgElement ? imgElement.getAttribute("src").toLowerCase() : "";

            // 🎯 SADECE KOZMETİK TESPİTİ (Favoriler sayfasında bile bu kelimelerden veya resimden yakalar)
            const isBeauty = pagePath.includes("beauty") || 
                             imgSrc.includes("beauty") || 
                             title.includes("toner") || title.includes("cream") || 
                             title.includes("lotion") || title.includes("serum") || 
                             title.includes("glow") || title.includes("gloss") || 
                             title.includes("mist") || title.includes("oil") || title.includes("lip");

            const sizeDiv = document.createElement("div");
            sizeDiv.className = "size-selector";
            sizeDiv.style.cssText = "display: flex; justify-content: center; gap: 6px; margin-bottom: 15px; margin-top: 5px; height: 26px;";
            
            // Eğer Kozmetik ürünü ise içini boş bırak ve görünmez yap (Hizayı tam korur!)
            if (isBeauty) {
                sizeDiv.innerHTML = "";
                sizeDiv.style.visibility = "hidden";
            } 
            // Geri kalan her şeye (Kadın, Erkek, Çocuk) standart beden kutularını bas!
            else {
                sizeDiv.innerHTML = `
                    <span style="border: 1px solid #ddd; padding: 4px 8px; font-size: 0.75rem; border-radius: 4px; cursor: pointer; transition: all 0.2s; color: #3d3434; background: transparent;" onclick="selectProductSize(this)">XS</span>
                    <span style="border: 1px solid #ddd; padding: 4px 8px; font-size: 0.75rem; border-radius: 4px; cursor: pointer; transition: all 0.2s; color: #3d3434; background: transparent;" onclick="selectProductSize(this)">S</span>
                    <span style="border: 1px solid #ddd; padding: 4px 8px; font-size: 0.75rem; border-radius: 4px; cursor: pointer; transition: all 0.2s; color: #3d3434; background: transparent;" onclick="selectProductSize(this)">M</span>
                    <span style="border: 1px solid #ddd; padding: 4px 8px; font-size: 0.75rem; border-radius: 4px; cursor: pointer; transition: all 0.2s; color: #3d3434; background: transparent;" onclick="selectProductSize(this)">L</span>
                    <span style="border: 1px solid #ddd; padding: 4px 8px; font-size: 0.75rem; border-radius: 4px; cursor: pointer; transition: all 0.2s; color: #3d3434; background: transparent;" onclick="selectProductSize(this)">XL</span>
                `;
            }
            
            // Kutuyu butonun hemen üstüne yerleştir
            card.insertBefore(sizeDiv, cartBtn);
        }
    });
}

// Beden tıklandığında lüks pembe rengimize boyanmasını sağlayan fonksiyon
window.selectProductSize = function(element) {
    const allSizes = element.parentElement.querySelectorAll("span");
    allSizes.forEach(size => {
        size.style.borderColor = "#ddd";
        size.style.backgroundColor = "transparent";
        size.style.color = "#3d3434";
    });
    element.style.borderColor = "#b56576";
    element.style.backgroundColor = "#b56576";
    element.style.color = "#ffffff";
};

// Sayfa ilk yüklendiğinde çalıştır
window.addEventListener("DOMContentLoaded", () => {
    setTimeout(automaticSizeInjector, 300);
});

// Sitedeki tıklamalarda (Örn: favorilere geçiş yapıldığında) butonları kontrol et
window.addEventListener("click", () => {
    setTimeout(automaticSizeInjector, 150);
});