/* certificates.js — daftar sertifikat yang tampil di sertifikat.html
 *
 * Cara menambah: salin satu blok { ... }, tempel di bawahnya (jangan lupa koma), lalu isi.
 *
 *  title    : nama sertifikat
 *  issuer   : penerbit / lembaga       (kosongkan "" bila belum diisi — tidak akan ditampilkan)
 *  date     : tanggal terbit, mis. "Maret 2025"   (kosongkan "" bila belum diisi)
 *  category : kategori untuk tombol filter (tulis persis sama agar dikelompokkan)
 *  id       : nomor sertifikat (opsional)
 *  image    : path gambar di folder sertifikat/ (nama file harus persis, termasuk huruf besar/kecil)
 *  link     : URL verifikasi berawalan https:// (opsional)
 */
window.CERTIFICATES = [
  {
    title: "Pelatihan Dasar GIS Geospasial",
    issuer: "",
    date: "",
    category: "GIS & Pemetaan",
    id: "",
    image: "sertifikat/Sertifikat Pelatihan Dasar GIS Geospasial.png",
    link: ""
  },
  {
    title: "Laravel Web Development",
    issuer: "",
    date: "",
    category: "Pemrograman",
    id: "",
    image: "sertifikat/Neon Laravel Web Development Certificate.png",
    link: ""
  },
  {
    title: "Cybersecurity — Certificate of Completion",
    issuer: "",
    date: "",
    category: "Keamanan Siber",
    id: "",
    image: "sertifikat/Cybersecurity Certificate of Completion.png",
    link: ""
  },
  {
    title: "Sertifikat Partisipasi",
    issuer: "",
    date: "",
    category: "Partisipasi",
    id: "",
    image: "sertifikat/Green Nature-Themed Participation Certificate.png",
    link: ""
  }
];