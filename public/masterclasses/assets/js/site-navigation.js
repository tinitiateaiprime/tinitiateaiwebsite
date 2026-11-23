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
  addBookingPrompt();
});

/* Free MasterClass readers are the warmest visitors: give them one tap to book live sessions. */
function addBookingPrompt() {
  var KEY = 'tinitiate-book-dismissed';
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) { /* storage blocked: still show */ }
  if (document.getElementById('tinitiate-book')) return;
  var topic = (document.title || 'MasterClass').split(/[|–—]/)[0].trim().slice(0, 100) || 'MasterClass';
  var box = document.createElement('div');
  box.id = 'tinitiate-book';
  box.setAttribute('role', 'complementary');
  box.setAttribute('aria-label', 'Book free live sessions');
  box.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2147483000;display:flex;align-items:center;gap:4px;padding:6px 6px 6px 18px;border-radius:999px;background:#0a0a0b;color:#fff;font:600 14px/1.2 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 14px 34px -12px rgba(10,10,11,.55);max-width:calc(100vw - 32px)';
  var link = document.createElement('a');
  link.href = '/request-callback?course=' + encodeURIComponent(topic + ' (live)');
  link.textContent = 'Learn this live · 2 free sessions →';
  link.style.cssText = 'color:#fff;text-decoration:none;padding:8px 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
  var close = document.createElement('button');
  close.type = 'button';
  close.setAttribute('aria-label', 'Dismiss');
  close.textContent = '×';
  close.style.cssText = 'flex:none;width:30px;height:30px;border:0;border-radius:999px;background:rgba(255,255,255,.12);color:#fff;font-size:18px;line-height:1;cursor:pointer';
  close.addEventListener('click', function () {
    box.remove();
    try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* ignore */ }
  });
  box.appendChild(link); box.appendChild(close);
  document.body.appendChild(box);
}
