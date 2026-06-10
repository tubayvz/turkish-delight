let cart = JSON.parse(localStorage.getItem('turkishDelightCart')) || [];

// Sayfa yüklendiğinde hem sepeti listele hem de butonları ayarla
document.addEventListener("DOMContentLoaded", () => {
    updateCart();

    // Sipariş tamamlama ve sepeti kalıcı sıfırlama sistemi
    const checkoutButtons = document.querySelectorAll('.checkout-btn');

    checkoutButtons.forEach(btn => {
        // HTML sayfalarındaki eski alert kodunu tamamen iptal et
        btn.removeAttribute('onclick');

        btn.addEventListener('click', () => {
            // 1. KONTROL: Sepet gerçekten boş mu?
            if (cart.length === 0) {
                alert("Your cart is empty! Please add some items first. 🛍️");
                return;
            }

            // 2. BAŞARI MESAJI
            alert("🎉 Order successfully received! Thank you for choosing Turkish Delight.");

            // 3. SEPETİ KALICI OLARAK SIFIRLAMA (Hata buradaydı, düzeltildi)
            cart = []; 
            saveCart();   // 'turkishDelightCart' adıyla boş sepeti hafızaya kazır
            updateCart(); // Arayüzü yeniler ve o şık boş sepet ikonunu ekrana basar

            // 4. SEPET PANELİNİ OTOMATİK KAPAT
            const sideCart = document.getElementById('side-cart');
            if(sideCart) {
                sideCart.classList.remove('active');
            }
        });
    });
});

// Sepeti sağdan kaydırarak açıp kapatan ana fonksiyon
function toggleCart() {
    const sideCart = document.getElementById('side-cart');
    if(sideCart) {
        sideCart.classList.toggle('active');
    }
}

// Ürün Ekleme Fonksiyonu
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

    if(!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';

    // Sepet boşsa görünecek o şık Trendyol tarzı alan
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

    // Sepetteki ürünleri listeleme döngüsü
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
// 🚨 TÜM SİTEYE GENİŞLETİLMİŞ BEDEN/YAŞ SEÇENEĞİ EKLEYEN AKILLI KOD 🚨
function automaticSizeInjector() {
    // Eğer kozmetik (beauty) sayfasındaysak beden ekleme, direkt çık
    if (window.location.pathname.includes("beauty.html")) return;

    // Sitedeki tüm ürün kartlarını bul
    const productCards = document.querySelectorAll(".product-card");
    
    // Şu an bir çocuk sayfasında olup olmadığımızı kontrol et
    const isKidsPage = window.location.pathname.includes("kids");

    productCards.forEach(card => {
        const cartBtn = card.querySelector(".add-to-cart-btn");
        
        // Eğer kartın içinde sepet butonu varsa ve daha önce beden eklenmemişse
        if (cartBtn && !card.querySelector(".size-selector")) {
            const sizeDiv = document.createElement("div");
            sizeDiv.className = "size-selector";
            // 5 buton yan yana sığsın diye gap mesafesi 6px yapıldı
            sizeDiv.style.cssText = "display: flex; justify-content: center; gap: 6px; margin-bottom: 15px; margin-top: 5px;";
            
            // Eğer çocuk sayfasıysa 5 farklı YAŞ seçeneği, büyükse XS-XL arası 5 BEDEN seçeneği
            if (isKidsPage) {
                sizeDiv.innerHTML = `
                    <span style="border: 1px solid #ddd; padding: 4px 7px; font-size: 0.75rem; border-radius: 4px; cursor: pointer; transition: all 0.2s; white-space: nowrap;" onclick="selectProductSize(this)">3-4 Y</span>
                    <span style="border: 1px solid #ddd; padding: 4px 7px; font-size: 0.75rem; border-radius: 4px; cursor: pointer; transition: all 0.2s; white-space: nowrap;" onclick="selectProductSize(this)">5-6 Y</span>
                    <span style="border: 1px solid #ddd; padding: 4px 7px; font-size: 0.75rem; border-radius: 4px; cursor: pointer; transition: all 0.2s; white-space: nowrap;" onclick="selectProductSize(this)">7-8 Y</span>
                    <span style="border: 1px solid #ddd; padding: 4px 7px; font-size: 0.75rem; border-radius: 4px; cursor: pointer; transition: all 0.2s; white-space: nowrap;" onclick="selectProductSize(this)">9-10 Y</span>
                    <span style="border: 1px solid #ddd; padding: 4px 7px; font-size: 0.75rem; border-radius: 4px; cursor: pointer; transition: all 0.2s; white-space: nowrap;" onclick="selectProductSize(this)">11-12 Y</span>
                `;
            } else {
                sizeDiv.innerHTML = `
                    <span style="border: 1px solid #ddd; padding: 4px 8px; font-size: 0.75rem; border-radius: 4px; cursor: pointer; transition: all 0.2s;" onclick="selectProductSize(this)">XS</span>
                    <span style="border: 1px solid #ddd; padding: 4px 8px; font-size: 0.75rem; border-radius: 4px; cursor: pointer; transition: all 0.2s;" onclick="selectProductSize(this)">S</span>
                    <span style="border: 1px solid #ddd; padding: 4px 8px; font-size: 0.75rem; border-radius: 4px; cursor: pointer; transition: all 0.2s;" onclick="selectProductSize(this)">M</span>
                    <span style="border: 1px solid #ddd; padding: 4px 8px; font-size: 0.75rem; border-radius: 4px; cursor: pointer; transition: all 0.2s;" onclick="selectProductSize(this)">L</span>
                    <span style="border: 1px solid #ddd; padding: 4px 8px; font-size: 0.75rem; border-radius: 4px; cursor: pointer; transition: all 0.2s;" onclick="selectProductSize(this)">XL</span>
                `;
            }
            
            // Bedenleri "Add to Cart" butonunun hemen üstüne yerleştir
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
}

// Sayfa yüklendiğinde ve arama sonuçları gecikmeli geldiğinde otomatik tetikle
window.addEventListener("DOMContentLoaded", automaticSizeInjector);
setTimeout(automaticSizeInjector, 600);