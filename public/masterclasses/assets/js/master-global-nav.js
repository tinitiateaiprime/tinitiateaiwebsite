/* =============================================================================
   TINITIATE MASTERCLASS ACADEMY - UNIFIED GLOBAL INTERACTIVITY
   Subjects Dropdown, In-Page Scrollspy, and Theme Synchronization
   ============================================================================= */

(function() {
  let dropdownTimeout = null;   // pending close
  let openTimeout = null;       // pending hover-intent open
  let hoverOpenedAt = 0;        // when hover last opened the menu
  // Resolve site-root links from this script's own URL so they work at any folder depth
  const NAV_SCRIPT_SRC = document.currentScript && document.currentScript.src;

  // "Why TinitiateAI" call-to-action, added to every page's header after the Subjects menu
  function injectWhyButton() {
    const links = document.querySelector('.master-menu-links');
    if (!links || links.querySelector('.why-tinitiate-btn') || !NAV_SCRIPT_SRC) return;
    const href = new URL('../../why-tinitiate.html', NAV_SCRIPT_SRC).href;
    const a = document.createElement('a');
    a.className = 'master-nav-btn why-tinitiate-btn';
    a.href = href;
    a.title = 'Why learn with TinitiateAI';
    a.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 2l2.4 6.9L21 9.3l-5.2 4.4L17.5 21 12 17.3 6.5 21l1.7-7.3L3 9.3l6.6-.4z"/></svg><span>Why TinitiateAI</span>';
    if (location.href.split('#')[0] === href) a.classList.add('is-current');
    links.appendChild(a);
  }

  function adjustMegaMenuPosition() {
    const menu = document.querySelector('#subjectsDropdown .master-dropdown-menu');
    if (!menu) return;
    // Nudge with margin-left so the CSS centering transform stays intact
    menu.style.marginLeft = '';
    // 8px gutter: matches the 10px inset the CSS already uses on phones, so nothing shifts there
    const gutter = 8;
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth - gutter) {
      menu.style.marginLeft = `-${rect.right - (window.innerWidth - gutter)}px`;
    } else if (rect.left < gutter) {
      menu.style.marginLeft = `${gutter - rect.left}px`;
    }
  }

  // 1. Dropdown Toggle Function
  window.toggleSubjectsDropdown = function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const dd = document.getElementById('subjectsDropdown');
    if (dd) {
      clearTimeout(dropdownTimeout);
      clearTimeout(openTimeout);
      const isOpen = dd.classList.contains('open');
      // A click right after hover opened the menu means "keep it open", not "close it"
      if (isOpen && Date.now() - hoverOpenedAt < 800) return;
      dd.classList.toggle('open', !isOpen);
      const toggle = dd.querySelector('.master-dropdown-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', String(!isOpen));
      if (!isOpen) {
        requestAnimationFrame(adjustMegaMenuPosition);
      }
    }
  };

  function openDropdown(dd) {
    if (dd.classList.contains('open')) return;
    dd.classList.add('open');
    hoverOpenedAt = Date.now();
    const toggle = dd.querySelector('.master-dropdown-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(adjustMegaMenuPosition);
  }
  function closeDropdown(dd) {
    clearTimeout(openTimeout);
    dd.classList.remove('open');
    const toggle = dd.querySelector('.master-dropdown-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  // Setup hover and click listeners once DOM is ready
  function initSubjectsDropdown() {
    const dd = document.getElementById('subjectsDropdown');
    if (!dd) return;

    const toggle = dd.querySelector('.master-dropdown-toggle');
    if (!toggle) return;
    const canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (canHover) {
      // Hover intent: only open when the pointer rests on the Subjects button itself,
      // so passing across the header doesn't pop the menu open
      toggle.addEventListener('mouseenter', () => {
        clearTimeout(dropdownTimeout);
        clearTimeout(openTimeout);
        openTimeout = setTimeout(() => openDropdown(dd), 180);
      });
      toggle.addEventListener('mouseleave', () => clearTimeout(openTimeout));
    }

    // Moving between the button and the open menu keeps it open
    dd.addEventListener('mouseenter', () => clearTimeout(dropdownTimeout));
    dd.addEventListener('mouseleave', () => {
      clearTimeout(openTimeout);
      if (!dd.classList.contains('open')) return;
      dropdownTimeout = setTimeout(() => closeDropdown(dd), 350); // buffer so a brief slip doesn't collapse it
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && dd.classList.contains('open')) { closeDropdown(dd); toggle.focus(); }
    });
  }

  // Close dropdown on outside click
  document.addEventListener('click', function(e) {
    const dd = document.getElementById('subjectsDropdown');
    if (dd && !dd.contains(e.target) && dd.classList.contains('open')) {
      closeDropdown(dd);
    }
  });

  // 2. ROG Connection Mesh Background Animation
  function initRogCanvasAnimation() {
    let canvas = document.getElementById('rog-connection-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'rog-connection-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      if (document.body) {
        document.body.prepend(canvas);
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          if (!document.getElementById('rog-connection-canvas')) {
            document.body.prepend(canvas);
          }
        });
      }
    }
    if (!canvas || canvas.dataset.rogActive === 'true') return;
    canvas.dataset.rogActive = 'true';

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let lastTime = 0;
    let nodes = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const spacing = width < 640 ? 112 : 145;
      const cols = Math.max(4, Math.ceil(width / spacing) + 2);
      const rows = Math.max(4, Math.ceil(height / spacing) + 2);
      nodes = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const jitter = spacing * .27;
          nodes.push({
            x: col * spacing - spacing * .5 + (Math.random() - .5) * jitter,
            y: row * spacing - spacing * .5 + (Math.random() - .5) * jitter,
            phase: Math.random() * Math.PI * 2,
            speed: .35 + Math.random() * .7,
            size: .8 + Math.random() * 1.3
          });
        }
      }
    };

    const draw = (time) => {
      if (document.hidden) {
        frame = 0;
        return;
      }
      lastTime = time;
      ctx.clearRect(0, 0, width, height);

      const step = width < 640 ? 112 : 145;
      const drift = reduceMotion ? 0 : time * .008;

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const ax = a.x + Math.sin(time * .00018 * a.speed + a.phase) * 9;
        const ay = a.y + Math.cos(time * .00016 * a.speed + a.phase) * 8;

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const bx = b.x + Math.sin(time * .00018 * b.speed + b.phase) * 9;
          const by = b.y + Math.cos(time * .00016 * b.speed + b.phase) * 8;
          const dx = bx - ax;
          const dy = by - ay;
          const dist = Math.hypot(dx, dy);
          if (dist > step * 1.42) continue;

          const alpha = (1 - dist / (step * 1.42)) * .15;
          ctx.strokeStyle = `rgba(62, 190, 238, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(ax, ay);

          if (Math.abs(dx) > 20 && Math.abs(dy) > 20) {
            ctx.lineTo(ax + dx * .56, ay);
            ctx.lineTo(bx, by);
          } else {
            ctx.lineTo(bx, by);
          }
          ctx.stroke();
        }
      }

      if (!reduceMotion && nodes.length) {
        const pulseCount = Math.min(18, Math.floor(nodes.length / 8));
        for (let k = 0; k < pulseCount; k++) {
          const index = (k * 17 + Math.floor(drift / 2)) % nodes.length;
          const a = nodes[index];
          const next = nodes[(index + 1 + (k % 3)) % nodes.length];
          const progress = ((time * (.00012 + (k % 4) * .000025) + k * .173) % 1);
          const x = a.x + (next.x - a.x) * progress;
          const y = a.y + (next.y - a.y) * progress;
          const glow = ctx.createRadialGradient(x, y, 0, x, y, 13);
          glow.addColorStop(0, 'rgba(123, 230, 255, .72)');
          glow.addColorStop(1, 'rgba(35, 158, 255, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, 13, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        const pulse = reduceMotion ? .6 : .38 + (Math.sin(time * .001 * p.speed + p.phase) + 1) * .24;
        const x = p.x + Math.sin(time * .00018 * p.speed + p.phase) * 9;
        const y = p.y + Math.cos(time * .00016 * p.speed + p.phase) * 8;
        ctx.fillStyle = `rgba(105, 220, 255, ${pulse})`;
        ctx.beginPath();
        ctx.arc(x, y, p.size * (i % 13 === 0 ? 1.8 : 1), 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion) {
        const beamY = (time * .018) % (height + 180) - 90;
        const beam = ctx.createLinearGradient(0, beamY - 34, 0, beamY + 34);
        beam.addColorStop(0, 'rgba(39, 176, 235, 0)');
        beam.addColorStop(.5, 'rgba(39, 176, 235, .035)');
        beam.addColorStop(1, 'rgba(39, 176, 235, 0)');
        ctx.fillStyle = beam;
        ctx.fillRect(0, beamY - 34, width, 68);
      }

      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.hidden && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!document.hidden && !frame && !reduceMotion) {
        lastTime = 0;
        frame = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    if (reduceMotion) draw(0);
    else frame = requestAnimationFrame(draw);
  }

  // 3. In-Page Scrollspy for Right Sidebar Navigation
  document.addEventListener('DOMContentLoaded', function() {
    initSubjectsDropdown();
    injectWhyButton();
    initRogCanvasAnimation();

    const inpageLinks = document.querySelectorAll('.sidebar-inpage-nav .inpage-link');
    if (inpageLinks.length === 0) return;

    const sections = [];
    inpageLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.getElementById(href.substring(1));
        if (target) {
          sections.push({ id: href.substring(1), elem: target, link: link });
        }
      }
    });

    if (sections.length === 0) return;

    function onScrollSpy() {
      const scrollPos = window.scrollY + 120;
      let activeIndex = 0;
      for (let i = 0; i < sections.length; i++) {
        const top = sections[i].elem.getBoundingClientRect().top + window.scrollY;
        if (scrollPos >= top - 20) {
          activeIndex = i;
        }
      }

      sections.forEach((sec, idx) => {
        if (idx === activeIndex) {
          sec.link.classList.add('active');
        } else {
          sec.link.classList.remove('active');
        }
      });
    }

    window.addEventListener('scroll', onScrollSpy, { passive: true });
    onScrollSpy();

    // Re-init lucide icons if available
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  });

  // Run canvas initialization immediately if body is already available
  if (document.body) {
    initRogCanvasAnimation();
  }
})();
