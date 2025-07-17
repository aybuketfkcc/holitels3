document.addEventListener('DOMContentLoaded', () => {
  const userInfo = document.getElementById('user-info');
  const loginLink = document.getElementById('login-link');

  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
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

  const params = new URLSearchParams(window.location.search);
  const query = [...params.entries()]
    .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
    .join('&');

  fetch(`http://localhost:3000/api/search?${query}`)
    .then(res => res.json())
    .then(hotels => {
      const list = document.getElementById('hotel-list');

      if (!hotels.length) {
        list.innerHTML = '<p>Sonuç bulunamadı.</p>';
        return;
      }

      hotels.forEach(hotel => {
        const card = document.createElement('div');
        card.className = 'hotel-card';
        card.innerHTML = `
          <img src="${hotel.image_url}" alt="${hotel.name}">
          <h3>${hotel.name}</h3>
          <p>${hotel.city} / ${hotel.district}</p>
          <p>⭐ ${hotel.rating}</p>
          <p>₺ ${hotel.price}</p>
          <p>${hotel.description}</p>
        `;
        card.addEventListener('click', () => {
          window.location.href = `hotel-detail.html?id=${hotel.id}`;
        });
        list.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Arama sonuçları alınamadı:', err);
    });
});
