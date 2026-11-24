NDREXAN PORTFOLIO — EDITORIAL REBUILD

Isi ZIP ini adalah file project langsung (tanpa folder bersarang).
Upload semua isi ZIP ke root repository GitHub, timpa file lama.

Perubahan utama:
- Layout hero desktop dan mobile disusun ulang dengan foto sebagai bidang visual utama.
- About, skill, project, kontak, dan footer memakai sistem editorial yang konsisten.
- Galeri desain/fotografi menjadi mosaic grid responsif dengan komposisi bervariasi.
- Light/dark mode memakai token warna untuk seluruh section, tombol, galeri, dan footer.
- Admin mendapat tata letak CMS gelap yang lebih terstruktur dan responsif.

Yang dipertahankan:
- index.html, script.js, cms.js, login Supabase, konfigurasi Supabase, bucket Storage,
  form konten, upload foto, galeri tambahan, pengelolaan project website, lightbox,
  intro, audio, reset password, serta aset gambar/audio.

PENTING:
- Tidak perlu menjalankan SQL ulang hanya untuk perubahan desain ini.
- Jangan mengganti URL/key Supabase yang sudah benar.
- Setelah upload, lakukan hard refresh browser. Jika tema tersimpan lama, tekan tombol tema
  sekali atau bersihkan data situs untuk menghapus preferensi tema lama.
- Tes login dan upload foto di /admin setelah deploy.
