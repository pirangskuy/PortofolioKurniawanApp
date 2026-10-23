/* games.js — manajer game, 4 mini game, papan skor & daftar pengunjung */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const rand = (a, b) => Math.random() * (b - a) + a;
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function mk(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  const arena = $('#arena'), hudEl = $('#hud'), howEl = $('#how'), tabsEl = $('#gameTabs'), dpad = $('#dpad');
  const CAP = { survei: 3000, memori: 3000, jalur: 3000, kuis: 2000 };

  function setHud(items) {
    hudEl.innerHTML = '';
    (items || []).forEach(([k, v]) => {
      const s = mk('span', null, k + ': ');
      s.appendChild(mk('b', null, String(v)));
      hudEl.appendChild(s);
    });
  }

  /* ================= GAME 1: SURVEI TITIK ================= */
  function startSurvei({ arena, finish }) {
    arena.classList.add('aim');
    let score = 0, combo = 0, time = 30, alive = true, spawnT = null, tick = null;
    const t0 = Date.now();
    const mult = () => Math.min(5, 1 + Math.floor(combo / 5));
    const upd = () => setHud([['Skor', score], ['Kombo', '×' + mult() + ' (' + combo + ')'], ['Waktu', time + 's']]);
    function pop(x, y, txt, color) {
      const f = mk('div', 'float', txt); f.style.left = x + 'px'; f.style.top = y + 'px'; f.style.color = color;
      arena.appendChild(f); setTimeout(() => f.remove(), 800);
    }
    function miss() { combo = 0; upd(); }
    function spawn() {
      if (!alive) return;
      const el = (Date.now() - t0) / 1000;
      const r = Math.random();
      const type = r < 0.14 ? 'gold' : r < 0.30 ? 'bomb' : 'normal';
      const size = type === 'gold' ? 34 : type === 'bomb' ? 40 : Math.max(30, 46 - el * 0.5);
      const life = type === 'gold' ? 850 : type === 'bomb' ? 1500 : Math.max(900, 1700 - el * 25);
      const w = arena.clientWidth, h = arena.clientHeight;
      const x = rand(size, w - size), y = rand(size, h - size);
      const t = mk('div', 'tgt ' + type, type === 'gold' ? '★' : type === 'bomb' ? '✕' : '');
      t.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;color:#fff`;
      t.addEventListener('pointerdown', e => {
        e.stopPropagation(); e.preventDefault();
        if (!t.isConnected || !alive) return;
        t.remove();
        if (type === 'bomb') {
          score = Math.max(0, score - 20); combo = 0;
          pop(x, y, '-20', 'var(--danger)');
          arena.classList.add('shake'); setTimeout(() => arena.classList.remove('shake'), 250);
        } else {
          const base = type === 'gold' ? 30 : 10;
          const gain = base * mult();
          combo++; score += gain;
          pop(x, y, '+' + gain, type === 'gold' ? 'var(--gold)' : 'var(--accent)');
        }
        upd();
      });
      arena.appendChild(t);
      setTimeout(() => { if (t.isConnected) { t.remove(); if (type === 'normal') miss(); } }, life);
      spawnT = setTimeout(spawn, Math.max(320, 850 - el * 16) * rand(0.8, 1.2));
    }
    const bg = e => { if (e.target === arena && alive) miss(); };
    arena.addEventListener('pointerdown', bg);
    upd(); spawn();
    tick = setInterval(() => { time--; upd(); if (time <= 0) finish(score, 'Kombo beruntun bikin skor melonjak!'); }, 1000);
    return () => { alive = false; clearTimeout(spawnT); clearInterval(tick); arena.removeEventListener('pointerdown', bg); arena.classList.remove('aim'); };
  }

  /* ================= GAME 2: MEMORI PEMETAAN ================= */
  function startMemori({ arena, finish }) {
    const EMO = ['🗺️', '🌲', '🛰️', '📍', '💻', '🦎', '🐒', '🌿', '🧭', '🔬'];
    const LV = [{ pairs: 6, cols: 4 }, { pairs: 8, cols: 4 }, { pairs: 10, cols: 5 }];
    let lv = 0, total = 0, moves = 0, wrong = 0, sec = 0, matched = 0, first = null, lock = false, alive = true;
    let timer = null, t2 = null, t3 = null;
    const hudUpd = () => setHud([['Level', (lv + 1) + '/3'], ['Langkah', moves], ['Waktu', sec + 's'], ['Skor', total]]);

    function build() {
      arena.innerHTML = '';
      const { pairs, cols } = LV[lv];
      const rows = Math.ceil(pairs * 2 / cols);
      const board = mk('div', 'memory-board');
      board.style.gridTemplateColumns = `repeat(${cols},1fr)`;
      board.style.gridTemplateRows = `repeat(${rows},1fr)`;
      shuffle(EMO.slice(0, pairs).flatMap(e => [e, e])).forEach(e => {
        const c = mk('button', 'memory-card'); c.type = 'button'; c.dataset.icon = e;
        c.appendChild(mk('span', null, e));
        c.addEventListener('click', () => flip(c));
        board.appendChild(c);
      });
      arena.appendChild(board);
      moves = 0; wrong = 0; sec = 0; matched = 0; first = null; lock = false;
      clearInterval(timer); timer = setInterval(() => { sec++; hudUpd(); }, 1000);
      hudUpd();
    }
    function flip(c) {
      if (!alive || lock || c === first || c.classList.contains('matched') || c.classList.contains('flipped')) return;
      c.classList.add('flipped');
      if (!first) { first = c; return; }
      const a = first, b = c; first = null; moves++; lock = true;
      if (a.dataset.icon === b.dataset.icon) {
        a.classList.remove('flipped'); b.classList.remove('flipped');
        a.classList.add('matched'); b.classList.add('matched');
        matched++; lock = false; hudUpd();
        if (matched === LV[lv].pairs) levelDone();
      } else {
        wrong++;
        t2 = setTimeout(() => { a.classList.remove('flipped'); b.classList.remove('flipped'); lock = false; hudUpd(); }, 700);
      }
    }
    function levelDone() {
      clearInterval(timer);
      const pairs = LV[lv].pairs;
      const pts = Math.max(40, pairs * 50 + Math.max(0, pairs * 5 - sec) * 6 - wrong * 10) + (wrong === 0 ? 100 : 0);
      total += pts; hudUpd();
      if (lv >= LV.length - 1) { t3 = setTimeout(() => finish(total, 'Semua level selesai!'), 600); return; }
      const ov = mk('div', 'overlay');
      ov.appendChild(mk('h4', null, 'Level ' + (lv + 1) + ' selesai! +' + pts));
      ov.appendChild(mk('p', null, wrong === 0 ? 'Sempurna tanpa salah — bonus +100!' : 'Salah tebak: ' + wrong + ' kali.'));
      arena.appendChild(ov);
      t3 = setTimeout(() => { if (!alive) return; lv++; build(); }, 1500);
    }
    build();
    return () => { alive = false; clearInterval(timer); clearTimeout(t2); clearTimeout(t3); };
  }

  /* ================= GAME 3: JALUR SURVEI (SNAKE) ================= */
  function startJalur({ arena, finish, setDirHandler }) {
    const css = getComputedStyle(document.documentElement);
    const col = n => css.getPropertyValue(n).trim();
    const cAcc = col('--accent') || '#0f766e', cAcc2 = col('--accent-2') || '#14b8a6', cLine = col('--line') || '#ccc';
    const W = arena.clientWidth, H = arena.clientHeight, C = 20;
    const cols = Math.floor(W / C), rows = Math.floor(H / C);
    const cv = mk('canvas', 'snake'); cv.width = cols * C; cv.height = rows * C;
    cv.style.cssText = `position:absolute;width:${cols * C}px;height:${rows * C}px;left:${(W - cols * C) / 2}px;top:${(H - rows * C) / 2}px`;
    arena.appendChild(cv);
    const g = cv.getContext('2d');

    let snake = [{ x: 7, y: Math.floor(rows / 2) }, { x: 6, y: Math.floor(rows / 2) }, { x: 5, y: Math.floor(rows / 2) }];
    let dir = { x: 1, y: 0 }, queue = [], rocks = [], food = null, gold = null;
    let score = 0, eaten = 0, speed = 130, alive = true, timer = null;

    const occupied = (x, y) => snake.some(s => s.x === x && s.y === y) || rocks.some(r => r.x === x && r.y === y) ||
      (food && food.x === x && food.y === y) || (gold && gold.x === x && gold.y === y);
    function place(minDist) {
      for (let n = 0; n < 300; n++) {
        const x = Math.floor(rand(0, cols)), y = Math.floor(rand(0, rows));
        if (occupied(x, y)) continue;
        if (minDist && Math.abs(x - snake[0].x) + Math.abs(y - snake[0].y) < minDist) continue;
        return { x, y };
      }
      return null;
    }
    food = place();

    function setDir(d) {
      if (!alive) return;
      const last = queue.length ? queue[queue.length - 1] : dir;
      if (d.x === -last.x && d.y === -last.y) return;
      if (d.x === last.x && d.y === last.y) return;
      if (queue.length < 2) queue.push(d);
    }
    const KEYS = { ArrowUp: [0, -1], w: [0, -1], W: [0, -1], ArrowDown: [0, 1], s: [0, 1], S: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0], ArrowRight: [1, 0], d: [1, 0], D: [1, 0] };
    const onKey = e => {
      const k = KEYS[e.key];
      if (!k) return;
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      e.preventDefault(); setDir({ x: k[0], y: k[1] });
    };
    document.addEventListener('keydown', onKey);
    let sx = 0, sy = 0;
    const onDown = e => { sx = e.clientX; sy = e.clientY; };
    const onUp = e => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
      if (Math.abs(dx) > Math.abs(dy)) setDir({ x: dx > 0 ? 1 : -1, y: 0 }); else setDir({ x: 0, y: dy > 0 ? 1 : -1 });
    };
    arena.addEventListener('pointerdown', onDown); arena.addEventListener('pointerup', onUp);
    arena.style.touchAction = 'none';
    setDirHandler(setDir);

    function hudUpd() { setHud([['Skor', score], ['Panjang', snake.length], ['Kecepatan', Math.round((130 - speed) / 4 + 1)]]); }
    function rr(x, y, w, h, r, fill) {
      g.fillStyle = fill; g.beginPath();
      if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h);
      g.fill();
    }
    function draw() {
      g.clearRect(0, 0, cv.width, cv.height);
      g.fillStyle = cLine;
      for (let x = 0; x < cols; x++) for (let y = 0; y < rows; y++) g.fillRect(x * C + C / 2 - 1, y * C + C / 2 - 1, 2, 2);
      g.font = (C - 4) + 'px serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      rocks.forEach(r => g.fillText('🪨', r.x * C + C / 2, r.y * C + C / 2 + 1));
      if (food) g.fillText('📍', food.x * C + C / 2, food.y * C + C / 2 + 1);
      if (gold) {
        const left = gold.exp - Date.now();
        if (left > 2000 || Math.floor(left / 200) % 2) g.fillText('⭐', gold.x * C + C / 2, gold.y * C + C / 2 + 1);
      }
      snake.forEach((s, i) => rr(s.x * C + 1, s.y * C + 1, C - 2, C - 2, i === 0 ? 7 : 5, i === 0 ? cAcc2 : cAcc));
      const h = snake[0];
      g.fillStyle = '#04201b';
      // dua mata di sisi depan kepala
      const ox = dir.x > 0 ? 12 : dir.x < 0 ? 4 : 0, oy = dir.y > 0 ? 12 : dir.y < 0 ? 4 : 0;
      const e1 = dir.x !== 0 ? [ox, 5] : [5, oy], e2 = dir.x !== 0 ? [ox, 12] : [12, oy];
      g.fillRect(h.x * C + e1[0], h.y * C + e1[1], 3, 3);
      g.fillRect(h.x * C + e2[0], h.y * C + e2[1], 3, 3);
    }
    function die() { alive = false; draw(); setTimeout(() => finish(score, 'Panjang jalur: ' + snake.length), 350); }
    function step() {
      if (!alive) return;
      if (queue.length) dir = queue.shift();
      const nh = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (nh.x < 0 || nh.y < 0 || nh.x >= cols || nh.y >= rows) return die();
      if (snake.slice(0, -1).some(s => s.x === nh.x && s.y === nh.y) || rocks.some(r => r.x === nh.x && r.y === nh.y)) return die();
      snake.unshift(nh);
      let grow = false;
      if (food && nh.x === food.x && nh.y === food.y) {
        grow = true; score += 10; eaten++; speed = Math.max(65, speed - 4); food = place();
        if (eaten % 4 === 0 && rocks.length < 12) { const r = place(4); if (r) rocks.push(r); }
        if (eaten % 5 === 0) { const p = place(); if (p) gold = { x: p.x, y: p.y, exp: Date.now() + 8000 }; }
      } else if (gold && nh.x === gold.x && nh.y === gold.y) {
        grow = true; score += 40; gold = null;
      }
      if (!grow) snake.pop();
      if (gold && Date.now() > gold.exp) gold = null;
      hudUpd(); draw();
      timer = setTimeout(step, speed);
    }
    hudUpd(); draw();
    timer = setTimeout(step, 600);
    return () => {
      alive = false; clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      arena.removeEventListener('pointerdown', onDown); arena.removeEventListener('pointerup', onUp);
      arena.style.touchAction = ''; setDirHandler(null);
    };
  }

  /* ================= GAME 4: KUIS KONSERVASI & GIS ================= */
  // Format: [pertanyaan, jawaban benar, salah1, salah2, salah3]
  const BANK = [
    ['NKT dalam konservasi hutan adalah singkatan dari…', 'Nilai Konservasi Tinggi', 'Nilai Karbon Tropis', 'Nomor Koordinat Terpadu', 'Navigasi Kawasan Terpadu'],
    ['SKT / HCS (High Carbon Stock) berkaitan dengan…', 'Hutan dan vegetasi yang menyimpan karbon tinggi', 'Sistem koordinat tetap', 'Survei kawasan terbatas', 'Standar kualitas tanah'],
    ['Lanthanotus borneensis dikenal dengan nama…', 'Biawak tanpa telinga', 'Orangutan Kalimantan', 'Kura-kura moncong babi', 'Enggang gading'],
    ['Format data vektor populer dari Esri adalah…', 'Shapefile (.shp)', 'JPEG (.jpg)', 'MP3 (.mp3)', 'Word (.docx)'],
    ['GeoJSON dibangun di atas format…', 'JSON', 'PDF', 'CSV biner', 'Gambar PNG'],
    ['GPS membutuhkan minimal berapa satelit untuk posisi 3D?', '4', '1', '2', '12'],
    ['Kota di Kalimantan Barat yang dilalui garis khatulistiwa adalah…', 'Pontianak', 'Singkawang', 'Sintang', 'Ketapang'],
    ['Primata berhidung panjang yang endemik Pulau Borneo adalah…', 'Bekantan', 'Siamang', 'Tarsius', 'Lutung Jawa'],
    ['Kode EPSG:4326 merujuk ke sistem koordinat…', 'WGS 84 (lintang-bujur)', 'UTM zona 49S', 'Web Mercator', 'Bessel 1841'],
    ['Laravel adalah framework untuk bahasa pemrograman…', 'PHP', 'Python', 'Java', 'Ruby'],
    ['Data raster tersusun dari…', 'Grid piksel', 'Titik, garis, dan poligon', 'Tabel relasi', 'Teks mentah'],
    ['Sungai pada peta umumnya direpresentasikan sebagai geometri…', 'Garis (line)', 'Titik (point)', 'Poligon penuh', 'Piksel tunggal'],
    ['Heart of Borneo adalah kerja sama konservasi Indonesia, Brunei, dan…', 'Malaysia', 'Filipina', 'Thailand', 'Papua Nugini'],
    ['Hutan gambut penting bagi iklim karena…', 'Menyimpan karbon dalam jumlah sangat besar', 'Tidak menyerap air', 'Tidak mengandung karbon', 'Hanya tumbuh di gurun'],
    ['FPIC dalam proyek bersama masyarakat berarti…', 'Persetujuan atas dasar informasi di awal tanpa paksaan', 'Format file peta digital', 'Izin ekspor kayu', 'Alat ukur GPS'],
    ['Leaflet adalah pustaka JavaScript untuk…', 'Peta web interaktif', 'Basis data', 'Mengirim email', 'Mengompres video'],
    ['Index pada database MySQL berfungsi untuk…', 'Mempercepat pencarian data', 'Mengenkripsi seluruh tabel', 'Menghapus duplikat otomatis', 'Memperbesar ukuran tabel'],
    ['Satuan koordinat geografis lintang/bujur adalah…', 'Derajat', 'Kilogram', 'Hektare', 'Piksel'],
    ['Poligon dalam pemetaan umum dipakai untuk…', 'Batas area atau tutupan lahan', 'Menandai satu titik GPS', 'Menyimpan kata sandi', 'Mengukur suhu udara'],
    ['Sungai terpanjang di Indonesia yang mengalir di Kalimantan Barat adalah…', 'Sungai Kapuas', 'Sungai Mahakam', 'Sungai Barito', 'Sungai Musi']
  ];

  function startKuis({ arena, finish }) {
    const qs = shuffle(BANK).slice(0, 10).map(b => ({ q: b[0], opts: shuffle(b.slice(1).map((t, i) => ({ t, ok: i === 0 }))) }));
    let i = 0, score = 0, streak = 0, correct = 0, left = 15, locked = false, timer = null, t2 = null, alive = true;
    const upd = () => setHud([['Soal', (i + 1) + '/' + qs.length], ['Skor', score], ['Streak', streak]]);

    function show() {
      locked = false; left = 15; upd();
      arena.innerHTML = '';
      const box = mk('div', 'quiz');
      const bar = mk('div', 'bar'), fill = mk('i'); bar.appendChild(fill);
      box.appendChild(bar);
      box.appendChild(mk('div', 'q', qs[i].q));
      const wrap = mk('div', 'opts');
      const btns = qs[i].opts.map(o => {
        const b = mk('button', 'opt', o.t); b.type = 'button'; b.dataset.ok = o.ok ? '1' : '';
        b.addEventListener('click', () => answer(o, b, btns));
        wrap.appendChild(b); return b;
      });
      box.appendChild(wrap); arena.appendChild(box);
      clearInterval(timer);
      timer = setInterval(() => {
        left -= 0.1; fill.style.transform = 'scaleX(' + Math.max(0, left / 15) + ')';
        if (left <= 0) answer(null, null, btns);
      }, 100);
    }
    function answer(o, btn, btns) {
      if (locked || !alive) return;
      locked = true; clearInterval(timer);
      if (o && o.ok) {
        streak++; correct++;
        score += 60 + Math.ceil(left) * 4 + Math.min(streak - 1, 5) * 8;
        btn.classList.add('ok');
      } else {
        streak = 0;
        if (btn) btn.classList.add('no');
        btns.forEach(b => { if (b.dataset.ok) b.classList.add('ok'); });
      }
      upd();
      t2 = setTimeout(() => {
        if (!alive) return;
        i++;
        if (i >= qs.length) finish(score, correct + ' dari ' + qs.length + ' jawaban benar');
        else show();
      }, 1100);
    }
    show();
    return () => { alive = false; clearInterval(timer); clearTimeout(t2); };
  }

  /* ================= MANAJER GAME ================= */
  const GAMES = [
    { id: 'survei', icon: '📍', name: 'Survei Titik', start: startSurvei,
      desc: 'Tangkap titik koordinat dalam 30 detik. Titik emas ★ bernilai besar, hindari titik palsu ✕!',
      how: 'Klik/ketuk titik hijau (+10) dan emas (+30). Setiap 5 tangkapan beruntun menaikkan pengali hingga ×5. Titik merah ✕ mengurangi 20 poin dan memutus kombo; titik hijau yang terlewat atau klik meleset juga memutus kombo.' },
    { id: 'memori', icon: '🧠', name: 'Memori Pemetaan', start: startMemori,
      desc: 'Cocokkan pasangan ikon GIS di 3 level yang makin sulit. Cepat & minim salah = skor tinggi.',
      how: '3 level: 6, 8, lalu 10 pasang kartu. Skor level dari jumlah pasangan + bonus kecepatan − penalti salah tebak. Tanpa salah di satu level = bonus +100.' },
    { id: 'jalur', icon: '🐍', name: 'Jalur Survei', start: startJalur,
      desc: 'Pandu surveyor menyusuri hutan, kumpulkan titik 📍 dan bintang ⭐, hindari batu 🪨 dan tubuh sendiri.',
      how: 'Panah / WASD (atau geser jari / tombol panah di layar). 📍 = +10, ⭐ = +40 (hilang dalam 8 detik). Makin banyak titik, makin cepat dan makin banyak batu.' },
    { id: 'kuis', icon: '❓', name: 'Kuis Konservasi & GIS', start: startKuis,
      desc: '10 soal acak seputar GIS, konservasi Kalimantan, dan pemrograman. 15 detik tiap soal.',
      how: 'Skor tiap jawaban benar = 60 + bonus sisa waktu + bonus streak (hingga +40). Jawab cepat dan beruntun untuk skor maksimal.' }
  ];

  let current = GAMES[0], stopFn = null, running = false, dirHandler = null, lbTab = 'total', pendingFinish = false;

  function stopCurrent() {
    running = false;
    if (stopFn) { try { stopFn(); } catch (e) {} stopFn = null; }
  }
  function overlay(children) {
    const ov = mk('div', 'overlay');
    children.forEach(c => ov.appendChild(c));
    arena.appendChild(ov);
    return ov;
  }
  function select(id) {
    stopCurrent();
    current = GAMES.find(g => g.id === id) || GAMES[0];
    [...tabsEl.children].forEach(b => b.classList.toggle('on', b.dataset.id === current.id));
    arena.innerHTML = ''; arena.className = 'arena';
    dpad.classList.toggle('on', current.id === 'jalur');
    howEl.textContent = current.how;
    setHud([]);
    const sess = Store.getSession();
    const btn = mk('button', 'btn btn-primary', sess ? '▶ Mulai' : '✍️ Daftar & Mulai');
    btn.addEventListener('click', startGame);
    overlay([mk('h4', null, current.icon + ' ' + current.name), mk('p', null, current.desc), btn]);
  }
  function startGame() {
    if (!Store.getSession()) { openModal(startGame); return; }
    stopCurrent();
    arena.innerHTML = ''; arena.className = 'arena';
    running = true;
    stopFn = current.start({ arena, finish, setDirHandler: fn => { dirHandler = fn; } });
  }
  async function finish(rawScore, note) {
    if (!running) return;
    const id = current.id;
    stopCurrent();
    const score = Math.max(0, Math.min(CAP[id], Math.round(rawScore)));
    arena.innerHTML = ''; arena.className = 'arena';
    const status = mk('p', null, 'Menyimpan skor…');
    const again = mk('button', 'btn btn-primary', '↻ Main lagi');
    again.addEventListener('click', startGame);
    const others = mk('button', 'btn btn-ghost btn-sm', 'Pilih game lain');
    others.addEventListener('click', () => select(id));
    overlay([mk('h4', null, '🏁 Selesai! Skor ' + score), mk('p', null, note || ''), status, again, others]);
    const r = await Store.submit(id, score);
    if (r.ok) {
      status.textContent = r.newBest ? '🎉 Rekor pribadi baru: ' + r.best + '! Skor tersimpan di papan.' : 'Skor tersimpan. Rekor pribadimu: ' + r.best + '.';
    } else {
      status.textContent = 'Skor belum tersimpan: ' + (r.error || 'terjadi kesalahan.');
    }
    refreshBoards();
  }

  GAMES.forEach(g => {
    const b = mk('button', 'chip', g.icon + ' ' + g.name);
    b.type = 'button'; b.dataset.id = g.id;
    b.addEventListener('click', () => select(g.id));
    tabsEl.appendChild(b);
  });
  dpad.addEventListener('click', e => {
    const b = e.target.closest('button[data-d]');
    if (!b || !dirHandler) return;
    const m = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] }[b.dataset.d];
    dirHandler({ x: m[0], y: m[1] });
  });

  /* ================= PLAYER & MODAL ================= */
  const bar = $('#playerBar'), modal = $('#regModal'), form = $('#regForm'), input = $('#regInput'), err = $('#regErr');
  let afterReg = null;

  function renderPlayer() {
    bar.innerHTML = '';
    const s = Store.getSession();
    const left = mk('div', 'who');
    if (s) {
      left.appendChild(mk('div', 'avatar', s.username[0].toUpperCase()));
      const t = mk('div');
      t.appendChild(mk('div', null, 'Pemain: ' + s.username));
      const pill = mk('span', 'pill', Store.getMode() === 'api' ? 'Papan skor global' : 'Mode lokal');
      t.appendChild(pill); left.appendChild(t);
      const btn = mk('button', 'btn btn-ghost btn-sm', 'Ganti pemain');
      btn.addEventListener('click', () => {
        if (!confirm('Ganti pemain? Perangkat ini akan dilepas dari username "' + s.username + '".')) return;
        stopCurrent(); Store.logout(); renderPlayer(); select(current.id); refreshBoards();
      });
      bar.appendChild(left); bar.appendChild(btn);
    } else {
      left.appendChild(mk('div', 'avatar', '?'));
      left.appendChild(mk('div', null, 'Belum terdaftar — buat username untuk mulai bermain.'));
      const btn = mk('button', 'btn btn-primary btn-sm', 'Daftar username');
      btn.addEventListener('click', () => openModal(null));
      bar.appendChild(left); bar.appendChild(btn);
    }
  }
  function openModal(cb) {
    afterReg = cb; err.textContent = ''; input.value = '';
    modal.classList.add('open'); setTimeout(() => input.focus(), 50);
  }
  function closeModal() { modal.classList.remove('open'); }
  $('#regCancel').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = $('#regSubmit'); btn.disabled = true; err.textContent = '';
    const r = await Store.register(input.value);
    btn.disabled = false;
    if (!r.ok) { err.textContent = r.error || 'Gagal mendaftar.'; return; }
    closeModal(); renderPlayer(); select(current.id); toast('Selamat datang, ' + r.username + '! 🎉');
    const cb = afterReg; afterReg = null; if (cb) cb();
  });

  /* ================= PAPAN SKOR & PENGUNJUNG ================= */
  const lbBody = $('#lbBody'), lbTabs = $('#lbTabs'), visBody = $('#visBody'), modeNote = $('#modeNote');
  const LB = [{ id: 'total', name: '🏆 Total' }].concat(GAMES.map(g => ({ id: g.id, name: g.icon + ' ' + g.name })));
  LB.forEach(t => {
    const b = mk('button', 'chip' + (t.id === lbTab ? ' on' : ''), t.name); b.type = 'button'; b.dataset.id = t.id;
    b.addEventListener('click', () => { lbTab = t.id; [...lbTabs.children].forEach(x => x.classList.toggle('on', x.dataset.id === lbTab)); refreshLB(); });
    lbTabs.appendChild(b);
  });

  function table(headers, rows, meIdx) {
    const t = mk('table', 'tbl');
    const thead = mk('thead'), hr = mk('tr');
    headers.forEach(h => { const th = mk('th', h.num ? 'num' : '', h.t); hr.appendChild(th); });
    thead.appendChild(hr); t.appendChild(thead);
    const tb = mk('tbody');
    rows.forEach((r, i) => {
      const tr = mk('tr', i === meIdx ? 'me' : '');
      r.forEach((c, j) => tr.appendChild(mk('td', headers[j].num ? 'num' : (j === 0 ? 'rank' : ''), String(c))));
      tb.appendChild(tr);
    });
    t.appendChild(tb); return t;
  }
  async function refreshLB() {
    const rows = await Store.leaderboard(lbTab);
    lbBody.innerHTML = '';
    if (!rows.length) { lbBody.appendChild(mk('p', 'empty', 'Belum ada skor. Jadilah yang pertama! 🚀')); return; }
    const me = (Store.getSession() || {}).username;
    const medals = ['🥇', '🥈', '🥉'];
    const idx = rows.findIndex(r => me && r.username.toLowerCase() === me.toLowerCase());
    lbBody.appendChild(table([{ t: '#' }, { t: 'Pemain' }, { t: 'Skor', num: true }],
      rows.map((r, i) => [medals[i] || (i + 1), r.username, r.score]), idx));
  }
  async function refreshVisitors() {
    const rows = await Store.visitors();
    visBody.innerHTML = '';
    if (!rows.length) { visBody.appendChild(mk('p', 'empty', 'Belum ada pengunjung yang bermain.')); return; }
    const fmt = ts => new Date(ts * 1000).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    const me = (Store.getSession() || {}).username;
    const idx = rows.findIndex(r => me && r.username.toLowerCase() === me.toLowerCase());
    const wrap = mk('div', 'scroll-x');
    wrap.appendChild(table(
      [{ t: 'Pengunjung' }, { t: 'Total skor', num: true }, { t: 'Game', num: true }, { t: 'Main', num: true }, { t: 'Terakhir', num: true }],
      rows.map(r => [r.username, r.total, r.games + '/4', r.plays, fmt(r.last)]), idx));
    visBody.appendChild(wrap);
  }
  function refreshBoards() { refreshLB(); refreshVisitors(); }

  /* ================= INIT ================= */
  (async function init() {
    await Store.init();
    modeNote.textContent = Store.getMode() === 'api'
      ? 'Skor tersimpan di server dan terlihat oleh semua pengunjung.'
      : 'Berisi Papan peringkat.';
    renderPlayer(); select('survei'); refreshBoards();
  })();
})();
