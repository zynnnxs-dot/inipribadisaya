NDREXAN CMS ADMIN

Isi ZIP ini adalah website asli + file CMS tambahan:
- admin.html: panel login dan edit teks.
- cms.js: mengambil konten dari Supabase sambil mempertahankan script.js asli.
- supabase-admin-setup.sql: tabel dan kebijakan keamanan database.

CARA PASANG
1. Ekstrak ZIP ini.
2. Upload SEMUA file di dalam ZIP ke ROOT repository GitHub yang dipakai Vercel, menimpa file lama bila diminta. Jangan taruh dalam subfolder: index.html harus di root repo.
3. Supabase > SQL Editor > New query: tempel seluruh isi supabase-admin-setup.sql, lalu Run.
4. Supabase > Authentication > Users: pastikan user andrearshavinkece73@gmail.com sudah dibuat dan email terkonfirmasi.
5. Tunggu deploy Vercel selesai.
6. Buka https://ndrexan.my.id/admin.html dan login memakai email/password Supabase.
7. Ubah konten lalu Simpan perubahan. Refresh website utama.

Penting:
- URL dan publishable key disematkan di file frontend berdasarkan nilai yang diberikan. Publishable key memang boleh digunakan di frontend.
- Jangan pernah masukkan secret/service_role key ke file website.
- RLS membatasi penulisan berdasarkan email admin. Pastikan email di akun Supabase cocok persis.
- Panel ini mengubah teks hero, tentang saya, deskripsi kontak, dan email. Foto, galeri, animasi, dan CSS asli dipertahankan.
- Jika repo GitHub yang terhubung ke Vercel berbeda, upload ke repo yang benar.
