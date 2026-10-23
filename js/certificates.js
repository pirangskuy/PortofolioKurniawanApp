/* certificates.js — EDIT FILE INI untuk menambah/mengubah sertifikat.
 *
 * Field:
 *  title    : nama sertifikat
 *  issuer   : penerbit / lembaga
 *  date     : tanggal terbit (teks bebas, mis. "Maret 2025")
 *  category : salah satu kategori bebas (dipakai untuk filter), mis. "GIS & Pemetaan"
 *  id       : nomor sertifikat (opsional)
 *  image    : path gambar sertifikat, mis. "sertifikat/gis-dasar.jpg" (opsional)
 *  link     : URL verifikasi (opsional)
 *
 * CATATAN: entri di bawah ini hanyalah CONTOH. Ganti dengan sertifikat asli Anda.
 */
window.CERTIFICATES = [
  {
    title: "Contoh — Dasar GIS & Pemetaan Digital",
    issuer: "Nama Lembaga Pelatihan",
    date: "Januari 2025",
    category: "GIS & Pemetaan",
    id: "",
    image: "sertifikat/contoh-gis.jpg",
    link: ""
  },
  {
    title: "Contoh — Survei Nilai Konservasi Tinggi (NKT/HCV)",
    issuer: "Nama Lembaga / NGO",
    date: "Juni 2025",
    category: "Konservasi",
    id: "",
    image: "sertifikat/contoh-nkt.jpg",
    link: ""
  },
  {
    title: "Contoh — Pengembangan Web dengan Laravel",
    issuer: "Nama Platform Belajar",
    date: "Agustus 2025",
    category: "Pemrograman",
    id: "",
    image: "sertifikat/contoh-laravel.jpg",
    link: ""
  },
  {
    title: "Contoh — Organisasi & Kepemimpinan Mahasiswa",
    issuer: "Universitas Muhammadiyah Pontianak",
    date: "2024",
    category: "Organisasi",
    id: "",
    image: "",
    link: ""
  }
];
