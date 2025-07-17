document.addEventListener('DOMContentLoaded', async () => {
  const hotelId = new URLSearchParams(window.location.search).get('id');
  if (!hotelId) return;

  await loadHotelDetails(hotelId);
  await loadHotelImages(hotelId);
});

// 👉 Otel detay bilgilerini çek ve göster
async function loadHotelDetails(hotelId) {
  try {
    const res = await fetch(`http://localhost:3000/api/hotels/${hotelId}`);
    if (!res.ok) throw new Error('Otel detayı alınamadı');

    const hotel = await res.json();
    renderHotelDetail(hotel);
  } catch (err) {
    console.error('Detay verisi alınamadı:', err);
    document.getElementById('hotel-detail').innerHTML = `<p>❌ Otel bulunamadı.</p>`;
  }
}

// 👉 Otel detaylarını HTML'e bas
function renderHotelDetail(hotel) {
  const detail = document.getElementById('hotel-detail');
  if (!detail) return;

  detail.innerHTML = `
    <h2>${hotel.name}</h2>
    <p><strong>Konum:</strong> ${hotel.city} / ${hotel.district}</p>
    <p><strong>Puan:</strong> ⭐ ${hotel.rating}</p>
    <p><strong>Fiyat:</strong> ₺${hotel.price}</p>
    <p><strong>Evcil Hayvan:</strong> ${hotel.pets_allowed ? 'Kabul Edilir 🐾' : 'Kabul Edilmez 🚫'}</p>
    <p><strong>Kahvaltı:</strong> ${hotel.breakfast_included ? 'Dahil 🍳' : 'Hariç 🥐'}</p>
    <p><strong>Açıklama:</strong> ${hotel.description}</p>
  `;
}

// 👉 Fotoğrafları yükle ve galeriye yerleştir
async function loadHotelImages(hotelId) {
  const mainImage = document.getElementById('main-image');
  console.log(mainImage);
  const thumbnailContainer = document.getElementById('thumbnail-container');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');

  let imageList = [];
  let currentIndex = 0;

  try {
    const res = await fetch(`http://localhost:3000/api/hotel-images/${hotelId}`);
    if (!res.ok) throw new Error('Görseller yüklenemedi');
    imageList = await res.json();

    if (imageList.length > 0) {
      mainImage.src = imageList[0].image_url;

      imageList.forEach((img, i) => {
        const thumb = document.createElement('img');
        thumb.src = img.image_url;
        thumb.classList.add('thumbnail');
        thumb.addEventListener('click', () => {
          currentIndex = i;
          updateMainImage();
        });
        thumbnailContainer.appendChild(thumb);
      });

      leftArrow.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
        updateMainImage();
      });

      rightArrow.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % imageList.length;
        updateMainImage();
      });
    }
  } catch (err) {
    console.error('Görseller alınamadı:', err);
  }

  function updateMainImage() {
    mainImage.src = imageList[currentIndex].image_url;
  }
}
