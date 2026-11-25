// Use the same preference and default as the website's pre-paint theme script.
(() => {
  let theme;
  try { theme = localStorage.getItem('theme'); } catch { /* storage can be unavailable */ }
  document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
})();
