/* main.js — perilaku bersama semua halaman: tema, menu, reveal, burung, lightbox */
(function () {
  const $ = (s, r = document) => r.querySelector(s);

  // Tema gelap/terang
  const root = document.documentElement;
  const themeBtn = $('#themeToggle');
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  const prefersDark = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  function applyTheme(dark) {
    root.classList.toggle('dark', dark);
    if (themeBtn) themeBtn.textContent = dark ? '☀️' : '🌙';
  }
  applyTheme(saved === 'dark' || (!saved && prefersDark));
  if (themeBtn) themeBtn.addEventListener('click', () => {
    const dark = !root.classList.contains('dark');
    applyTheme(dark);
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  });

  // Menu mobile
  const menuBtn = $('#menuBtn'), links = $('#links');
  if (menuBtn && links) {
    menuBtn.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
    });
    links.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Reveal saat scroll
  function initReveal(scope) {
    const els = (scope || document).querySelectorAll('.reveal:not(.in)');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      }), { threshold: .12 });
      els.forEach(el => io.observe(el));
    } else els.forEach(el => el.classList.add('in'));
  }
  window.initReveal = initReveal;
  initReveal();

  // Burung scroll-to-top
  const bird = $('#birdBtn');
  if (bird) {
    let flying = false;
    window.addEventListener('scroll', () => {
      if (!flying) bird.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    bird.addEventListener('click', () => {
      if (flying) return;
      flying = true;
      bird.classList.add('flying-up');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        bird.classList.remove('flying-up', 'show');
        flying = false;
      }, 1000);
    });
  }

  // Lightbox
  const lb = $('#lightbox');
  if (lb) {
    const img = $('#lightboxImg', lb), cap = $('#lightboxCaption', lb);
    window.openLightbox = function (src, caption, rotate) {
      img.src = src;
      img.alt = caption || '';
      cap.textContent = caption || '';
      img.classList.toggle('rotate-fix-lightbox', !!rotate);
      lb.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    window.closeLightbox = function () {
      lb.classList.remove('active');
      document.body.style.overflow = '';
    };
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    $('.lightbox-close', lb).addEventListener('click', closeLightbox);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
    // Galeri: item dengan data-src
    document.addEventListener('click', e => {
      const it = e.target.closest('[data-lightbox]');
      if (it) openLightbox(it.dataset.lightbox, it.dataset.caption, it.dataset.rotate === '1');
    });
  }

  // Toast
  window.toast = function (msg) {
    let t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('show'), 2800);
  };
})();
