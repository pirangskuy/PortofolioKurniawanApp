/* store.js — penyimpanan pemain & skor.
 * Mode "api"   : skor global di server (api/index.php, SQLite) → semua pengunjung berbagi papan skor.
 * Mode "local" : cadangan otomatis memakai localStorage browser (hanya terlihat di perangkat itu).
 */
const Store = (() => {
  const API = 'api/index.php';
  const K = { session: 'pf_session', players: 'pf_players', scores: 'pf_scores' };
  const GAMES = ['survei', 'memori', 'jalur', 'kuis'];
  let mode = 'local';

  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  async function call(action, params = {}, body = null) {
    const qs = new URLSearchParams({ action, ...params }).toString();
    const res = await fetch(API + '?' + qs, body ? {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    } : {});
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch (e) { throw new Error('bad-json'); }
    return json;
  }

  async function init() {
    try {
      const r = await Promise.race([
        call('ping'),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 2500))
      ]);
      mode = r && r.ok ? 'api' : 'local';
    } catch (e) { mode = 'local'; }
    return mode;
  }

  const getMode = () => mode;
  const getSession = () => read(K.session, null);

  function validName(n) {
    return /^[A-Za-z0-9_]{3,16}$/.test(n);
  }

  async function register(username) {
    username = (username || '').trim();
    if (!validName(username)) return { ok: false, error: 'Username 3–16 karakter: huruf, angka, atau garis bawah (_).' };
    if (mode === 'api') {
      try {
        const r = await call('register', {}, { username });
        if (r.ok) write(K.session, { username: r.username, token: r.token });
        return r;
      } catch (e) { return { ok: false, error: 'Server tidak dapat dihubungi. Coba lagi.' }; }
    }
    const players = read(K.players, {});
    const key = username.toLowerCase();
    if (players[key]) return { ok: false, error: 'Username sudah dipakai. Pilih yang lain.' };
    players[key] = { username, created: Date.now() };
    write(K.players, players);
    write(K.session, { username, token: 'local' });
    return { ok: true, username };
  }

  function logout() { try { localStorage.removeItem(K.session); } catch (e) {} }

  async function submit(game, score) {
    const s = getSession();
    if (!s) return { ok: false, error: 'Belum login.' };
    score = Math.max(0, Math.floor(score));
    if (mode === 'api') {
      try { return await call('submit', {}, { token: s.token, game, score }); }
      catch (e) { return { ok: false, error: 'Gagal mengirim skor.' }; }
    }
    const all = read(K.scores, []);
    all.push({ u: s.username, game, score, t: Date.now() });
    write(K.scores, all.slice(-500));
    const best = Math.max(...all.filter(x => x.u === s.username && x.game === game).map(x => x.score));
    return { ok: true, best, newBest: score >= best };
  }

  function localAgg() {
    const all = read(K.scores, []);
    const map = {};
    all.forEach(x => {
      const p = map[x.u] || (map[x.u] = { username: x.u, best: {}, plays: 0, last: 0 });
      p.best[x.game] = Math.max(p.best[x.game] || 0, x.score);
      p.plays++; p.last = Math.max(p.last, x.t);
    });
    return Object.values(map);
  }

  async function leaderboard(game) {
    if (mode === 'api') {
      try { const r = await call('leaderboard', { game }); return r.rows || []; } catch (e) { return []; }
    }
    const agg = localAgg();
    return agg.map(p => ({
      username: p.username,
      score: game === 'total' ? GAMES.reduce((a, g) => a + (p.best[g] || 0), 0) : (p.best[game] || 0)
    })).filter(r => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 10);
  }

  async function visitors() {
    if (mode === 'api') {
      try { const r = await call('visitors'); return r.rows || []; } catch (e) { return []; }
    }
    return localAgg().map(p => ({
      username: p.username,
      total: GAMES.reduce((a, g) => a + (p.best[g] || 0), 0),
      games: GAMES.filter(g => p.best[g]).length,
      plays: p.plays,
      last: Math.floor(p.last / 1000)
    })).sort((a, b) => b.last - a.last).slice(0, 50);
  }

  return { init, getMode, getSession, register, logout, submit, leaderboard, visitors, validName, GAMES };
})();
