/* certificates.js — daftar sertifikat yang tampil di sertifikat.html
 *
 * Cara menambah: salin satu blok { ... }, tempel di bawahnya (jangan lupa koma), lalu isi.
 *
 *  title    : nama sertifikat
 *  issuer   : penerbit / lembaga       ("" = tidak ditampilkan)
 *  date     : tanggal terbit, mis. "Agustus 2025"   ("" = tidak ditampilkan)
 *  category : kategori untuk tombol filter (tulis persis sama agar dikelompokkan)
 *  id       : nomor sertifikat (opsional)
 *  desc     : penjelasan singkat (opsional)
 *  topics   : daftar materi/kompetensi, tampil sebagai label (opsional)
 *  image    : path gambar di folder sertifikat/ (nama file harus persis, huruf besar/kecil berpengaruh)
 *  link     : URL verifikasi berawalan https:// (opsional)
 */
window.CERTIFICATES = [
  {
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    date: "10 Agustus 2025",
    category: "Keamanan Siber",
    id: "CNA-2025-0810-7423",
    desc: "Dasar-dasar keamanan siber: ancaman dan kerentanan, perlindungan data dan privasi, serta keamanan jaringan.",
    topics: ["Cybersecurity Fundamentals", "Threats & Vulnerabilities", "Data Protection & Privacy", "Network Security"],
    image: "sertifikat/cybersecurity-cisco.png",
    link: ""
  },
  {
    title: "Dasar-Dasar Pengembangan Web dengan Laravel",
    issuer: "Web Development Bootcamp",
    date: "",
    category: "Pemrograman",
    id: "",
    desc: "Kelas penyelesaian tentang pengembangan web dengan Laravel, dari routing dan arsitektur MVC hingga pengelolaan data dengan Eloquent dan operasi CRUD.",
    topics: ["Routing", "MVC", "Eloquent", "CRUD"],
    image: "sertifikat/laravel-dasar.png",
    link: ""
  },
  {
    title: "Pengantar Penilaian Nilai Konservasi Tinggi (NKT/HCV)",
    issuer: "",
    date: "",
    category: "Konservasi",
    id: "",
    desc: "Sertifikat partisipasi pelatihan penilaian Nilai Konservasi Tinggi: prinsip HCV, identifikasi nilai konservasi, pengumpulan data lingkungan, serta pengelolaan dan pemantauan.",
    topics: ["Prinsip HCV", "Identifikasi Nilai Konservasi", "Data Lingkungan", "Pengelolaan & Pemantauan"],
    image: "sertifikat/nkt-hcv.png",
    link: ""
  },
  {
    title: "Dasar GIS dan Pemetaan Digital",
    issuer: "Pelatihan & Pengembangan Kompetensi",
    date: "",
    category: "GIS & Pemetaan",
    id: "",
    desc: "Sertifikat peserta pelatihan dasar sistem informasi geografis dan pemetaan digital.",
    topics: ["Pengenalan SIG", "Pengolahan Data Spasial", "Peta Tematik", "Analisis Geospasial"],
    image: "sertifikat/gis-dasar.png",
    link: ""
  }
];