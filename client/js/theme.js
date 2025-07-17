document.addEventListener('DOMContentLoaded', () => {
  // Tema ayarını localStorage'dan yükle
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    document.body.classList.add('dark');
  }

  // Tema değiştirici buton
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
    });
  }
});

