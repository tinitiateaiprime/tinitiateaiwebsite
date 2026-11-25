// Standalone counterpart of SiteHeader, SiteFooter, Logo and ThemeToggle.
// Keep these links and labels aligned when the React website navigation changes.
(() => {
  const request = '/request-callback';
  const email = 'contact@tinitiateai.com';
  const whatsapp = 'https://wa.me/916309123485';
  const phones = [
    ['India', '+91 6309123485', '+916309123485'],
    ['USA', '+1 (973) 653-6870', '+19736536870'],
    ['', '+1 (206) 802-4102', '+12068024102'],
  ];
  const navigation = [
    ['/courses', 'Live Courses'], ['/masterclasses', 'Free MasterClasses'],
    ['/about', 'About'], ['/contact', 'Contact'],
  ];
  const paths = [
    ['ai-engineer', 'AI Engineer', 'LLMs · RAG', 'python'],
    ['agentic-ai', 'Agentic AI Developer', 'Agents · MCP', 'langgraph'],
    ['cloud-engineer', 'Cloud Engineer', 'AWS · Azure', 'aws'],
    ['data-engineer', 'Data Engineer', 'Pipelines · Governance', 'spark'],
    ['full-stack', 'Full Stack Developer', 'React · APIs', 'react'],
  ];
  const policies = [
    ['/privacy-policy', 'Privacy'], ['/terms', 'Terms'], ['/refund-policy', 'Refunds'],
    ['/cookie-policy', 'Cookies'], ['/pricing-policy', 'Pricing policy'],
  ];
  const socials = [
    ['https://www.linkedin.com/company/tinitiate-ai/', 'LinkedIn', 'linkedin'],
    ['https://www.youtube.com/channel/UCXVm8lbVkHOxEJ4XzggTeJw', 'YouTube', 'youtube'],
    ['https://x.com/TinitiateAI', 'X', 'x-twitter'],
    ['https://www.facebook.com/profile.php?id=61589182754060', 'Facebook', 'facebook'],
    ['https://www.instagram.com/tinitiate.ai/', 'Instagram', 'instagram'],
    ['https://www.reddit.com/user/tinitiate_ai/', 'Reddit', 'reddit'],
  ];
  const academy = [
    ['index.html', 'MasterClass Academy'],
    ['foundational/index.html', 'Computer Science Foundations'],
    ['foundational/python/index.html', 'Python Foundations'],
    ['foundational/sql/index.html', 'SQL Foundations'],
    ['automation-ml-ai-agentic/index.html', 'AI &amp; ML'],
    ['agentic-development/index.html', 'Agentic Development'],
    ['data-engineering/index.html', 'Data Engineering'],
    ['data-governence/index.html', 'Data Governance'],
    ['full-stack/index.html', 'Full Stack Architecture'],
  ];
  const icon = name => '<i data-lucide="' + name + '" aria-hidden="true"></i>';
  // The X and Reddit marks come from the website footer's Font Awesome icons.
  const brandPaths = {
    'x-twitter': 'M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z',
    reddit: 'M373 138.6c-25.2 0-46.3-17.5-51.9-41l0 0c-30.6 4.3-54.2 30.7-54.2 62.4l0 .2c47.4 1.8 90.6 15.1 124.9 36.3c12.6-9.7 28.4-15.5 45.5-15.5c41.3 0 74.7 33.4 74.7 74.7c0 29.8-17.4 55.5-42.7 67.5c-2.4 86.8-97 156.6-213.2 156.6S45.5 410.1 43 323.4C17.6 311.5 0 285.7 0 255.7c0-41.3 33.4-74.7 74.7-74.7c17.2 0 33 5.8 45.7 15.6c34-21.1 76.8-34.4 123.7-36.4l0-.3c0-44.3 33.7-80.9 76.8-85.5C325.8 50.2 347.2 32 373 32c29.4 0 53.3 23.9 53.3 53.3s-23.9 53.3-53.3 53.3zM157.5 255.3c-20.9 0-38.9 20.8-40.2 47.9s17.1 38.1 38 38.1s36.6-9.8 37.8-36.9s-14.7-49.1-35.7-49.1zM395 303.1c-1.2-27.1-19.2-47.9-40.2-47.9s-36.9 22-35.7 49.1c1.2 27.1 16.9 36.9 37.8 36.9s39.3-11 38-38.1zm-60.1 70.8c1.5-3.6-1-7.7-4.9-8.1c-23-2.3-47.9-3.6-73.8-3.6s-50.8 1.3-73.8 3.6c-3.9 .4-6.4 4.5-4.9 8.1c12.9 30.8 43.3 52.4 78.7 52.4s65.8-21.6 78.7-52.4z',
  };
  const socialIcon = name => brandPaths[name]
    ? '<svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true"><path d="' + brandPaths[name] + '"/></svg>'
    : icon(name);
  const list = links => links.map(([url, label]) => '<li><a href="' + url + '">' + label + '</a></li>').join('');
  const logo = '<a class="sql-logo" href="/" aria-label="Tinitiate AI homepage">' +
    '<img class="sql-logo-light" src="/tinitiate-logo-transparent.png" width="2001" height="269" alt="Tinitiate AI">' +
    '<img class="sql-logo-dark" src="/masterclasses/tinitiate_header-banner.png" width="1261" height="132" alt="Tinitiate AI"></a>';
  const book = '<a href="' + request + '" class="sql-book">Book 2 free sessions</a>';
  const phone = ([region, label, number]) => '<a href="tel:' + number + '">' + label + '</a>';
  const chat = '<a class="sql-chat" href="' + whatsapp + '" target="_blank" rel="noopener noreferrer">WhatsApp</a>';
  const pathsMenu = paths.map(([id, label, note, tech]) =>
    '<li><a href="/paths/' + id + '"><img src="/masterclasses/assets/icons/tech/' + tech + '.svg" alt="" width="22" height="22">' +
    '<span><strong>' + label + '</strong><small>' + note + '</small></span></a></li>').join('');
  const links = navigation.map(([url, label]) => '<li><a href="' + url + '"' +
    (url === '/masterclasses' ? ' class="sql-nav-current" aria-current="location"' : '') + '>' + label + '</a></li>').join('');

  document.getElementById('sql-site-header').innerHTML =
    '<div class="sql-contact-strip"><div class="sql-site-width">' +
    '<a href="' + request + '">' + icon('sparkles') + ' New weekday &amp; weekend batches open <strong>First 2 sessions free</strong></a>' +
    '<div>' + phones.slice(0, 2).map(number => icon('phone') + phone(number)).join('') +
    icon('mail') + '<a href="mailto:' + email + '">' + email + '</a>' + chat + '</div></div></div>' +
    '<header class="sql-header">' +
    '<a class="sql-skip" href="#main-content">Skip to content</a>' +
    '<div class="sql-header-row sql-site-width">' + logo +
    '<nav id="sql-main-nav" class="sql-header-nav" aria-label="Main navigation"><ul>' +
    '<li><details class="sql-dropdown sql-path-dropdown"><summary>Career paths ' + icon('chevron-down') + '</summary>' +
    '<div class="sql-dropdown-panel"><p class="sql-kicker">Choose the job you want</p><ul>' + pathsMenu +
    '<li><a class="sql-compare" href="/paths">Compare all paths ' + icon('arrow-right') + '</a></li></ul>' +
    '<p class="sql-path-help">Not sure? <a href="' + request + '?course=Not%20sure%20yet">A mentor will help you choose</a> on a free call.</p></div></details></li>' +
    links + '</ul><div class="sql-mobile-actions">' + book + chat + '</div></nav>' +
    '<div class="sql-header-actions">' +
    '<button class="sql-icon-button" id="sql-theme" type="button" aria-label="Switch theme">' +
    '<span class="sql-moon">' + icon('moon') + '</span><span class="sql-sun">' + icon('sun') + '</span></button>' +
    book +
    '<button class="sql-icon-button" id="sql-menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="sql-main-nav">' +
    '<span class="sql-open-icon">' + icon('menu') + '</span><span class="sql-close-icon">' + icon('x') + '</span></button></div></div></header>';

  const main = document.querySelector('.sql-main');
  const courseName = main.dataset.pyPage === 'home'
    ? '<span aria-current="page">SQL Foundations</span>' : '<a href="index.html">SQL Foundations</a>';
  document.getElementById('sql-academy-nav').innerHTML =
    '<div class="sql-academy-bar"><nav class="sql-breadcrumb" aria-label="Breadcrumb">' +
    '<a href="/masterclasses">MasterClasses</a><span aria-hidden="true">/</span>' + courseName + '</nav>' +
    '<details class="sql-dropdown sql-academy-dropdown"><summary>Academy courses ' + icon('chevron-down') + '</summary>' +
    '<div class="sql-dropdown-panel"><ul>' + list(academy.map(([url, label]) => ['/masterclasses/' + url, label])) + '</ul></div></details></div>';

  const socialLinks = socials.map(([url, label, symbol]) => '<li><a href="' + url +
    '" target="_blank" rel="noopener noreferrer" aria-label="Tinitiate AI Solutions on ' + label + '" title="' + label + '">' +
    socialIcon(symbol) + '</a></li>').join('');
  const office = '<address><strong>Corporate office</strong><br>3rd Floor, Prime Villa, 13-16, Road No. 1, Krishna Nagar, Dilsukhnagar, Hyderabad, Telangana 500060, India</address>' +
    '<address><strong>US office</strong><br>1420 Valley Trl, Irving, TX 75063, USA</address>';
  document.getElementById('sql-site-footer').innerHTML =
    '<footer class="sql-footer"><div class="sql-site-width sql-footer-grid">' +
    '<div class="sql-footer-brand">' + logo + '<p>Tinitiate AI Solutions empowers learners with industry-relevant skills through hands-on training and real-time project experience in AI, Data Engineering, and Cloud.</p>' +
    '<ul class="sql-socials" aria-label="Follow us">' + socialLinks + '</ul></div>' +
    '<nav aria-label="Explore"><h2>Explore</h2><ul>' + list([[request, 'Book 2 free sessions'], ['/paths', 'Compare career paths'], ...navigation]) + '</ul></nav>' +
    '<nav aria-label="Career paths"><h2>Career paths</h2><ul>' + list(paths.map(([key, label]) => ['/paths/' + key, label])) + '</ul></nav>' +
    '<div class="sql-footer-contact"><h2>Contact &amp; office</h2><ul>' +
    '<li>' + icon('mail') + '<a href="mailto:' + email + '">' + email + '</a></li>' +
    '<li>' + icon('phone') + '<div>' + phones.map(entry => '<div><strong>' + entry[0] + '</strong> ' + phone(entry) + '</div>').join('') + '</div></li>' +
    '<li>' + icon('map-pin') + '<div>' + office + '</div></li></ul></div></div>' +
    '<div class="sql-footer-base"><div class="sql-site-width"><p>© ' + new Date().getFullYear() + ' Tinitiate AI Solutions. All rights reserved.</p>' +
    '<nav aria-label="Policies"><ul>' + list(policies) + '</ul></nav></div></div></footer>';

  const theme = document.getElementById('sql-theme');
  const root = document.documentElement;
  const nextTheme = () => root.dataset.theme === 'dark' ? 'light' : 'dark';
  const labelTheme = () => {
    const label = 'Switch to ' + nextTheme() + ' mode';
    theme.setAttribute('aria-label', label);
    theme.title = label;
  };
  labelTheme();
  theme.addEventListener('click', () => {
    root.dataset.theme = nextTheme();
    try { localStorage.setItem('theme', root.dataset.theme); } catch { /* storage can be unavailable */ }
    labelTheme();
  });
  addEventListener('storage', event => {
    if (event.key === 'theme') {
      root.dataset.theme = event.newValue === 'dark' ? 'dark' : 'light';
      labelTheme();
    }
  });

  const header = document.querySelector('.sql-header');
  const toggle = document.getElementById('sql-menu-toggle');
  const dropdowns = [...document.querySelectorAll('.sql-dropdown')];
  const setMenu = open => {
    header.classList.toggle('sql-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', (open ? 'Close' : 'Open') + ' navigation menu');
    if (!open) header.querySelector('.sql-dropdown').open = false;
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  header.querySelector('nav').addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('pointerdown', event => {
    if (!header.contains(event.target)) setMenu(false);
    dropdowns.forEach(menu => { if (!menu.contains(event.target)) menu.open = false; });
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const activeMenu = dropdowns.find(menu => menu.open);
    if (activeMenu) {
      activeMenu.open = false;
      activeMenu.querySelector('summary').focus();
    } else if (header.classList.contains('sql-menu-open')) {
      setMenu(false);
      toggle.focus();
    }
  });
  matchMedia('(min-width: 1024px)').addEventListener('change', () => setMenu(false));
  addEventListener('pageshow', () => {
    setMenu(false);
    dropdowns.forEach(menu => { menu.open = false; });
  });
  window.lucide?.createIcons();
})();
