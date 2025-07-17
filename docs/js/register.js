document.addEventListener('DOMContentLoaded', () => {
  // Kullanıcı kontrolü ve çıkış işlemi
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

  // Kayıt formunu dinle
  const registerForm = document.getElementById('registerForm');
  const registerStatus = document.getElementById('register-status');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const result = await res.json();
        registerStatus.innerText = result.message;

        if (res.ok) {
          // Başarıyla kayıt olduysa kullanıcıyı localStorage'a ekleyip index.html'e yönlendir
          localStorage.setItem('user', JSON.stringify({username}));
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1000);
        }
      } catch (err) {
        console.error('Kayıt hatası:', err);
        registerStatus.innerText = '❌ Bağlantı hatası!';
      }
    });
  }
});
