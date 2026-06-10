// fav.js - Kalıcı Favori Sistemi
document.addEventListener("DOMContentLoaded", () => {
    updateFavBadge();
    checkCurrentPageHearts();
});

// 1. Üst menüdeki kalp sayısını günceller
function updateFavBadge() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const badges = document.querySelectorAll('#fav-count');
    badges.forEach(badge => {
        badge.textContent = wishlist.length;
    });
}

// 2. Sayfa açıldığında daha önce beğenilen ürünlerin kalbini dolu yapar
function checkCurrentPageHearts() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const h3 = card.querySelector('h3');
        if (h3) {
            const productName = h3.textContent.trim();
            const isLiked = wishlist.some(item => item.name === productName);
            const heartIcon = card.querySelector('.fav-heart-btn i');
            
            if (heartIcon) {
                if (isLiked) {
                    heartIcon.classList.remove('far');
                    heartIcon.classList.add('fas');
                } else {
                    heartIcon.classList.remove('fas');
                    heartIcon.classList.add('far');
                }
            }
        }
    });
}

// 3. Kalbe basıldığında ürünü hafızaya ekler veya siler (Senin eski fonksiyona bağladık!)
window.toggleFavCounter = function(el) {
    const card = el.closest('.product-card');
    if (!card) return;

    const name = card.querySelector('h3').textContent.trim();
    const priceText = card.querySelector('.price').textContent.trim();
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    
    let imgSrc = '';
    const img = card.querySelector('img');
    if (img) {
        imgSrc = img.getAttribute('src');
    }

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.findIndex(item => item.name === name);

    if (index === -1) {
        // Hafızada yoksa EKLE
        wishlist.push({ name, price, imgSrc });
        el.classList.remove('far');
        el.classList.add('fas');
    } else {
        // Hafızada varsa SİL
        wishlist.splice(index, 1);
        el.classList.remove('fas');
        el.classList.add('far');
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateFavBadge();

    // Eğer favoriler sayfasındaysak ve kalbe basıldıysa ürünü ekrandan anında düşür
    if (window.location.pathname.includes('wishlist.html')) {
        card.remove();
        if (wishlist.length === 0) {
            location.reload();
        }
    }
}