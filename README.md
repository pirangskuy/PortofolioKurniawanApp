# Portofolio Kurniawan A.P.P.

## Struktur
```
index.html          Beranda (profil, pengalaman, galeri, keahlian, pendidikan, kontak)
sertifikat.html     Halaman sertifikat (data di js/certificates.js)
game.html           4 mini game + registrasi username + papan skor + daftar pengunjung
css/style.css       Gaya bersama
js/main.js          Tema gelap, menu, animasi, lightbox, burung scroll-to-top
js/certificates.js  >>> EDIT DI SINI untuk menambah sertifikat <<<
js/cert-page.js     Render halaman sertifikat
js/store.js         Pemain & skor (API server, cadangan localStorage)
js/games.js         Logika game, papan skor
api/index.php       API skor (PHP + SQLite) — opsional tapi diperlukan untuk skor global
sertifikat/         (buat sendiri) taruh gambar sertifikat di sini
```
Gambar lama (PasFotoKurniawan.png, pemetaan.jpeg, dst.) tetap di folder yang sama dengan index.html.

## Menambah sertifikat
1. Simpan gambar di folder `sertifikat/` (mis. `sertifikat/gis-dasar.jpg`).
2. Buka `js/certificates.js`, salin satu blok `{ ... }`, isi judul, penerbit, tanggal, kategori, dan path gambar.
3. Entri "Contoh — ..." hanya placeholder: hapus/ganti.

## Papan skor global
Skor lintas pengunjung butuh server. Unggah seluruh folder ke hosting yang mendukung **PHP 7.4+ dengan pdo_sqlite**.
Folder `api/data/` dibuat otomatis (berisi database SQLite). Pastikan folder `api/` dapat ditulis server.
Jika `api/index.php` tidak ditemukan/tidak jalan (mis. GitHub Pages, atau membuka file langsung), game otomatis
beralih ke **mode lokal** (skor hanya di browser pemain).

Mencoba di komputer sendiri: `cd` ke folder ini lalu `php -S localhost:8000`, buka http://localhost:8000

## Catatan keamanan
- Skor dikirim dari browser, jadi tidak bisa dibuat 100% anti-curang. API membatasi skor maksimum per game,
  jeda antar kiriman, dan jumlah pendaftaran per IP, tapi pemain yang nekat tetap bisa memalsukan skor.
- Jangan menaruh data sensitif di folder `api/data/`.
