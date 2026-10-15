NDREXAN CMS ADMIN

Isi ZIP ini adalah website asli + file CMS tambahan:
- admin.html: panel login, edit teks, dan upload foto.
- cms.js: mengambil konten dari Supabase sambil mempertahankan script.js asli.
- supabase-admin-setup.sql: tabel dan kebijakan keamanan database.

CARA PASANG
1. Ekstrak ZIP ini.
2. Upload SEMUA file di dalam ZIP ke ROOT repository GitHub yang dipakai Vercel, menimpa file lama bila diminta. Jangan taruh dalam subfolder: index.html harus di root repo.
3. Supabase > SQL Editor > New query: tempel seluruh isi supabase-admin-setup.sql, lalu Run.
4. Supabase > Authentication > Users: pastikan user andrearshavinkece73@gmail.com sudah dibuat dan email terkonfirmasi.
5. Tunggu deploy Vercel selesai.
6. Buka https://ndrexan.my.id/admin.html dan login memakai email/password Supabase.
7. Ubah konten lalu Simpan perubahan. Untuk foto, pilih gambar pada bagian Kelola foto lalu tekan Upload foto. Refresh website utama setelah upload.

Penting:
- URL dan publishable key disematkan di file frontend berdasarkan nilai yang diberikan. Publishable key memang boleh digunakan di frontend.
- Jangan pernah masukkan secret/service_role key ke file website.
- RLS membatasi penulisan berdasarkan email admin. Pastikan email di akun Supabase cocok persis.
- Panel ini mengubah teks hero, tentang saya, deskripsi kontak, email, serta foto Hero, 4 foto Desain, 4 foto Fotografi, dan 2 foto The Motivator. Foto diunggah ke Supabase Storage.
- Jika repo GitHub yang terhubung ke Vercel berbeda, upload ke repo yang benar.
