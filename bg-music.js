document.addEventListener('DOMContentLoaded', () => {
    // 1. Ses elementini ve kontrol butonunu dinamik olarak oluştur
    const audio = document.createElement('audio');
    audio.id = 'bg-track';
    audio.src = 'minor-dawn.mp3'; // Adım 1'deki dosya adı ile birebir aynı
    audio.loop = true;

    // Sol alta sabitlenen şık bir müzik butonu
    const musicBtn = document.createElement('button');
    musicBtn.id = 'music-toggle-btn';
    musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    musicBtn.style.cssText = `
        position: fixed; bottom: 20px; left: 20px; z-index: 9999;
        background: #b56576; color: white; border: none;
        width: 45px; height: 45px; border-radius: 50%; cursor: pointer;
        box-shadow: 0 4px 15px rgba(181, 101, 118, 0.3); transition: all 0.3s;
    `;
    document.body.appendChild(musicBtn);

    // 2. Hafızadan durumu kontrol et (Kaldığı saniyeyi hatırlar)
    const savedTime = localStorage.getItem('musicTime');
    if (savedTime) { audio.currentTime = parseFloat(savedTime); }

    const isPlaying = localStorage.getItem('musicPlaying') === 'true';

    // Eğer önceki sayfada çalıyorsa, yeni sayfada da devam ettir
    if (isPlaying) {
        audio.play().then(() => {
            musicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }).catch(() => {
            musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            localStorage.setItem('musicPlaying', 'false');
        });
    }

    // 3. Butona tıklandığında aç/kapat
    musicBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            musicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            localStorage.setItem('musicPlaying', 'true');
        } else {
            audio.pause();
            musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            localStorage.setItem('musicPlaying', 'false');
        }
    });

    // 4. Saniyeyi tarayıcı hafızasına sürekli kaydet
    audio.addEventListener('timeupdate', () => {
        localStorage.setItem('musicTime', audio.currentTime);
    });
});