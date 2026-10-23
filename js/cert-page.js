(function () {
  const grid = document.getElementById('certGrid');
  const filters = document.getElementById('certFilters');
  const count = document.getElementById('certCount');
  const data = (window.CERTIFICATES || []);
  const ICON = { 'GIS & Pemetaan': '🗺️', 'Konservasi': '🌲', 'Pemrograman': '💻', 'Keamanan Siber': '🛡️', 'Organisasi': '🤝' };
  let active = 'Semua';

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function card(c) {
    const art = el('article', 'card hover cert reveal in');
    const thumb = el('button', 'cert-thumb');
    thumb.type = 'button';
    thumb.setAttribute('aria-label', 'Lihat ' + c.title);
    const ph = el('span', 'ph', ICON[c.category] || '🏅');
    thumb.appendChild(ph);
    if (c.image) {
      const img = new Image();
      img.alt = 'Sertifikat ' + c.title;
      img.decoding = 'async'; // (tanpa loading="lazy": gambar yang belum ada di halaman tidak akan pernah diunduh)
      img.onload = () => { ph.remove(); thumb.appendChild(img); thumb.dataset.lightbox = c.image; thumb.dataset.caption = c.title; };
      img.onerror = () => {
        // Tampilkan path yang gagal dimuat agar mudah dicek (hapus blok ini bila sudah beres)
        const note = el('small', null, 'Gambar tidak ditemukan: ' + c.image);
        note.style.cssText = 'position:absolute;left:8px;right:8px;bottom:6px;font-size:11px;color:var(--muted);text-align:center;word-break:break-all';
        thumb.appendChild(note);
        console.warn('Gagal memuat gambar sertifikat:', c.image);
      };
      img.src = c.image; // jika gagal dimuat, ikon pengganti tetap tampil
    }
    art.appendChild(thumb);

    const body = el('div', 'cert-body');
    body.appendChild(el('div', 'cert-cat', c.category || 'Sertifikat'));
    body.appendChild(el('h3', null, c.title));
    body.appendChild(el('div', 'cert-meta', [c.issuer, c.date].filter(Boolean).join(' · ')));
    if (c.id) body.appendChild(el('div', 'cert-meta', 'No. ' + c.id));
    if (c.desc) body.appendChild(el('p', 'cert-meta', c.desc));
    if (c.topics && c.topics.length) {
      const tg = el('div', 'tags');
      tg.style.marginTop = '8px';
      c.topics.forEach(t => tg.appendChild(el('span', null, t)));
      body.appendChild(tg);
    }
    const act = el('div', 'cert-actions');
    if (c.link && /^https?:\/\//i.test(c.link)) {
      const a = el('a', 'btn btn-ghost btn-sm', 'Verifikasi ↗');
      a.href = c.link; a.target = '_blank'; a.rel = 'noopener';
      act.appendChild(a);
    }
    body.appendChild(act);
    art.appendChild(body);
    return art;
  }

  function render() {
    grid.innerHTML = '';
    const list = data.filter(c => active === 'Semua' || c.category === active);
    if (!list.length) {
      grid.appendChild(el('p', 'empty', 'Belum ada sertifikat di kategori ini.'));
    } else list.forEach(c => grid.appendChild(card(c)));
    count.textContent = list.length + ' sertifikat';
  }

  function buildFilters() {
    const cats = ['Semua'].concat([...new Set(data.map(c => c.category).filter(Boolean))]);
    filters.innerHTML = '';
    cats.forEach(cat => {
      const b = el('button', 'chip' + (cat === active ? ' on' : ''), cat);
      b.type = 'button';
      b.addEventListener('click', () => { active = cat; buildFilters(); render(); });
      filters.appendChild(b);
    });
  }

  buildFilters();
  render();
})();