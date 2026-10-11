# Checkpoint akhir Modul 08 — Toko Belajar

Pencarian URL, TanStack Query, detail server, dan fixture opsional.

Ini versi lengkap proyek yang sama pada akhir modul. Ekstrak ke folder terpisah; jangan menimpa pekerjaan Antum. Baseline kelas: Node 24 LTS, Next.js 16.3.7, React 19.3.0. Gunakan lockfile terlampir.

## Jalankan

```bash
npm ci
cp .env.example .env
```

```bash
npm run dev
```

Buka `http://localhost:3000`. Jika port terpakai, hentikan aplikasi lain milik Antum atau atur port dan origin auth secara konsisten.

## Buktikan hasilnya

- Klik Katalog → detail, pilih jumlah, tambah ke keranjang. Navbar dan `/cart` mengikuti total yang sama.
- Navigasi lewat Link mempertahankan total; reload penuh mengembalikannya ke nol. Keranjang masih simulasi jumlah, tanpa pembayaran atau stok nyata.
- Cari `react`; URL menjadi `?q=react`, hasil mengarah ke detail server. Back/Forward dan reload mengikuti URL.
- Untuk latihan tanpa API publik, set `BOOKS_SOURCE=fixture` dan `NEXT_PUBLIC_USE_BOOK_FIXTURES=true`, lalu restart. Dua buku fixture tersedia. `sessionStorage.setItem("book-search-scenario", "error")` di Console aplikasi membuat Muat ulang memakai Response 500 simulasi. Pilihan lain: success, empty, invalid, slow. Hapus flag dan build ulang untuk kembali ke API asli.

## Periksa sebelum lanjut

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

Untuk checkpoint yang memakai buku API, build membutuhkan akses Open Library kecuali BOOKS_SOURCE=fixture dipilih. Fixture tidak membuktikan perilaku cache sumber eksternal. Jalankan dev dan start bergantian, bukan pada port yang sama.

Berkas ini sengaja tidak membawa node_modules, database berisi data, .env dengan secret, atau .next. Lanjutkan modul berikutnya dari salinan yang sudah berhasil dijalankan. Pertahankan perubahan sendiri dan bandingkan file yang relevan saja.
