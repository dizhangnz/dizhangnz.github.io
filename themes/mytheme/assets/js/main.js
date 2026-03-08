document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.querySelector('.theme-toggle');
  
  if (toggle) {
    toggle.addEventListener('click', function() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }
});
