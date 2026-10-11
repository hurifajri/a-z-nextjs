# Lab pilihan setelah Modul 11: Server Action

Prasyarat: salinan checkpoint 11. CRUD utama tetap memakai Route Handlers. Form ini hanya memvalidasi input; tidak membaca atau menulis data akun.

Siapkan aplikasi dengan `npm ci`, salin `.env.example` menjadi `.env`, lalu jalankan `npm run db:migrate` dari folder checkpoint. [Panduan menjalankan lab](../README.md) menyediakan contoh perintah lengkap dari repository presentasi.

1. Buat folder `src/app/action-preview/` di salinan aplikasi.
2. Salin [actions.ts](./actions.ts), [preview-form.tsx](./preview-form.tsx), dan [page.tsx](./page.tsx) ke folder itu.
3. Jalankan `npm run dev` dari folder aplikasi, lalu buka `http://localhost:3000/action-preview`.
4. Coba judul kosong, alasan pendek, lalu input valid dengan spasi di tepi. Server menolak input salah dan memangkas input valid. Input dipertahankan agar mudah diperbaiki.
5. Di Network, gunakan throttling untuk mengamati pending dan tombol nonaktif. Jalankan build, lalu coba lagi pada `npm run start`.

`useActionState` memberi state hasil aksi, fungsi untuk form, dan status pending. Argumen pertama action adalah state sebelumnya; argumen kedua FormData. File `use server` mengekspor fungsi yang berjalan di server. Validasi tetap diperlukan karena request dapat dikirim langsung.

Preview publik ini tidak memerlukan sesi karena tidak mengakses data pribadi. Jika mengubahnya menjadi mutasi setelah Modul 14, periksa sesi terverifikasi dan pemilik di dalam action sebelum query; revalidasi hasil setelah perubahan. Jangan menganggap import action dari UI menyembunyikan endpoint. Hapus route lab sebelum merilis aplikasi.

Tidak perlu menyalin seluruh CRUD menjadi dua jalur. [Panduan form resmi](https://nextjs.org/docs/app/guides/forms) dan [Server Actions](https://nextjs.org/docs/app/getting-started/mutating-data) menjelaskan pola lanjutannya.
