/* Keep the site's exits explicit without changing course-internal navigation. */
document.addEventListener('DOMContentLoaded', function () {
  var strip = document.getElementById('tinitiate-static-nav');
  if (strip) {
    strip.setAttribute('role', 'navigation'); strip.setAttribute('aria-label', 'Website navigation');
    if (!strip.querySelector('[data-site-home]')) {
      var home = document.createElement('a'); home.href = '/'; home.textContent = 'Tinitiate AI Home'; home.dataset.siteHome = 'true'; home.style.cssText = 'color:#fff;text-decoration:none'; strip.prepend(home);
    }
  }
  document.querySelectorAll('.master-brand-wrap').forEach(function (link) { link.href = '/'; link.setAttribute('aria-label', 'Tinitiate AI homepage'); });
  document.querySelectorAll('.master-menu-links > a').forEach(function (link) { if (link.textContent.trim() === 'Home') { link.href = '/'; link.title = 'Main website home'; } });
  // Domain demos are tab panels: reveal the destination before following its link.
  function revealPanel(hash) {
    if (hash.indexOf('#pane-') !== 0) return;
    var tab = document.getElementById('tab-' + hash.slice(6));
    if (tab) tab.click();
  }
  document.querySelectorAll('a[href^="#pane-"]').forEach(function (link) {
    link.addEventListener('click', function () { revealPanel(link.hash); });
  });
  window.addEventListener('hashchange', function () { revealPanel(location.hash); });
  setTimeout(function () { revealPanel(location.hash); }, 0);
});
