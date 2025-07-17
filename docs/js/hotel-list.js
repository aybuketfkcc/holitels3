document.addEventListener('DOMContentLoaded', () => {
  // Kullanıcı bilgisi kontrolü ve çıkış işlemi
  const userInfo = document.getElementById('user-info');
  const loginLink = document.getElementById('login-link');

  const user = JSON.parse(localStorage.getItem('user'));

  if (user && userInfo && loginLink) {
    userInfo.textContent = `👤 ${user.username}`;
    userInfo.classList.remove('hidden');
    loginLink.classList.add('hidden');

    userInfo.style.cursor = 'pointer';
    userInfo.title = 'Çıkış yapmak için tıkla';

    userInfo.addEventListener('click', () => {
      localStorage.removeItem('user');
      location.reload();
    });
  }

  // Otel verilerini API'den çekme ve listeleme
  fetch('http://localhost:3000/api/hotels')
    .then(response => response.json())
    .then(hotels => {
      const container = document.getElementById('hotel-list');
      if (!container) return;

      hotels.forEach(hotel => {
        const card = document.createElement('div');
        card.className = 'hotel-card';
        card.innerHTML = `
          <img src="${hotel.image_url}" alt="${hotel.name}" />
          <h2>${hotel.name}</h2>
          <p><strong>Şehir:</strong> ${hotel.city}</p>
          <p><strong>İlçe:</strong> ${hotel.district}</p>
          <p>${hotel.description}</p>
          <p><strong>Puan:</strong> ${hotel.rating ?? "Yok"} ⭐</p>
        `;
        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Veriler alınamadı:', error);
    });
});
