document.addEventListener('DOMContentLoaded', () => {
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

  const form = document.getElementById('reservationForm');
  const statusText = document.getElementById('reservation-status');
  const urlParams = new URLSearchParams(window.location.search);
  const hotelId = urlParams.get('id');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const guest_name = document.getElementById('guestName').value;
      const check_in = document.getElementById('checkin').value;
      const check_out = document.getElementById('checkout').value;
      const person_count = parseInt(document.getElementById('guests').value);
      const user = JSON.parse(localStorage.getItem('user'));
      const user_id = user ? user.id : null;

      try {
        const res = await fetch('http://localhost:3000/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hotel_id: hotelId, guest_name, check_in, check_out, person_count, user_id })
        });

        const data = await res.json();
        if (res.ok) {
          statusText.innerText = '✅ Rezervasyon başarılı!';
          form.reset();
        } else {
          statusText.innerText = '❌ Üye girişi yapmalısınız.' + data.message;
        }
      } catch (err) {
        console.error('İstek hatası:', err);
        statusText.innerText = '❌ Bağlantı hatası!';
      }
    });
  }

  // Rezervasyonları listele
  if (user && user.id) {
    fetch(`http://localhost:3000/api/reservations?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        const list = document.getElementById('reservation-list');
        if (!list) return;

        if (data.length === 0) {
          list.innerHTML = '<p>Hiç rezervasyon bulunamadı.</p>';
          return;
        }

        data.forEach(resv => {
          const card = document.createElement('div');
          card.className = 'reservation-card';
          card.innerHTML = `
            <h3>${resv.guest_name}</h3>
            <p>Giriş: ${new Date(resv.check_in).toLocaleDateString('tr-TR')}</p>
            <p>Çıkış: ${new Date(resv.check_out).toLocaleDateString('tr-TR')}</p>
            <p>Kişi Sayısı: ${resv.person_count}</p>
            <p>Otel: ${resv.hotel_name}</p>
            <button class="delete-btn" data-id="${resv.id}">❌ Sil</button>
          `;
          list.appendChild(card);
        });

        // Silme işlemi
        document.addEventListener('click', async (e) => {
          if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            if (confirm('Bu rezervasyonu silmek istediğinizden emin misiniz?')) {
              try {
                const res = await fetch(`http://localhost:3000/api/reservations/${id}`, {
                  method: 'DELETE'
                });

                const result = await res.json();

                if (res.ok) {
                  showMessage('✅ Rezervasyon silindi', 'success');
                  setTimeout(() => location.reload(), 1500);
                } else {
                  showMessage('❌ Hata: ' + result.message, 'error');
                }
              } catch (err) {
                console.error('Silme hatası:', err);
                showMessage('❌ Bağlantı hatası', 'error');
              }
            }
          }
        });
      })
      .catch(err => {
        console.error('Rezervasyonlar alınamadı:', err);
      });
  }
});

// Mesaj gösterme fonksiyonu
function showMessage(text, type) {
  const msg = document.getElementById('reservation-message');
  if (!msg) return;

  msg.textContent = text;
  msg.className = 'message-area ' + type;
  msg.style.display = 'block';

  setTimeout(() => {
    msg.style.display = 'none';
  }, 3000);
}
