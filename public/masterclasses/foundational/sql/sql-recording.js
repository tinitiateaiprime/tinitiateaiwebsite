// Optional display-only recording mode. The actual Dashboard Tutor records separately.
(() => {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('record') === '1') {
      document.documentElement.classList.add('sql-record-mode');
      document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('sql-record-mode');
        const el = document.querySelector('#player');
        if (el && !location.hash) el.scrollIntoView({block:'start'});
      });
    }
  } catch (e) { /* reading URL query failed; default layout still works */ }
})();
