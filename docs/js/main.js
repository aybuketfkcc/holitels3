// main.js



















document.addEventListener('DOMContentLoaded', () => {
  const userInfo = document.getElementById('user-info');
  const loginLink = document.getElementById('login-link');

  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    // Giriş yapılmış
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
// Detaylı arama formunu dinle
const searchForm = document.getElementById('searchForm');
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const city = document.getElementById('city').value.trim();
    const district = document.getElementById('district').value.trim();
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    const petsAllowed = document.getElementById('petsAllowed').checked;
    const breakfastIncluded = document.getElementById('breakfastIncluded').checked;

    // Parametreleri query string olarak oluştur
    const query = new URLSearchParams({
      city,
      district,
      minPrice,
      maxPrice,
      petsAllowed,
      breakfastIncluded
    });

    // Sonuç sayfasına yönlendir
    window.location.href = `search-results.html?${query.toString()}`;
  });
}


   

});

fetch('http://localhost:3000/api/hotels')
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('hotel-list');

    data.forEach(hotel => {
      const card = document.createElement('div');
      card.className = 'hotel-card';
      card.innerHTML = `
        <img src="${hotel.image_url}" alt="${hotel.name}">
        <h3>${hotel.name}</h3>
        <p>${hotel.city} / ${hotel.district}</p>
        <p>⭐ ${hotel.rating}</p>
        <p>${hotel.description}</p>
      `;
      card.addEventListener('click', () => {
      window.location.href = `hotel-detail.html?id=${hotel.id}`;
      });

      list.appendChild(card);
    });
  })
  .catch(err => {
    console.error('Veriler alınamadı:', err);
  });
