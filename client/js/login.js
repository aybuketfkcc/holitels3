document.addEventListener('DOMContentLoaded', () => {
  // Çıkış kontrolü ve kullanıcı adını gösterme
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

  // Giriş formu işlemleri
  const form = document.getElementById('loginForm');
  const statusText = document.getElementById('login-status');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        if (res.ok) {
          statusText.innerText = '✅ Giriş başarılı!';
          localStorage.setItem('user', JSON.stringify(data.user));
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1000);
        } else {
          statusText.innerText = '❌ Hata: ' + data.message;
        }
      } catch (err) {
        console.error('İstek hatası:', err);
        statusText.innerText = '❌ Bağlantı hatası!';
      }
    });
  }
});
