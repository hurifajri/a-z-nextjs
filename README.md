# Next.js — Toko Belajar

Materi Slidev 16 modul untuk pemula Next.js yang sudah mengenal JavaScript, React, dan TypeScript dasar. Satu proyek berlanjut dari katalog ke usulan buku berakun.

## Jalankan presentasi

```bash
npm install
npm run dev
```

Buka `http://localhost:3030`. Urutan materi ada di [slides.md](./slides.md); isi modul di `pages/`. `npm run build` menghasilkan presentasi statis di `dist/`.

## Bahan peserta

[Indeks materi dan unduhan](./public/examples/README.md) mencakup checkpoint 06/08/11/14, fixture API, kontrak, aset Modul 13, dan lab pengayaan. Source checkpoint disimpan di [examples/checkpoints](./examples/checkpoints), terpisah dari aplikasi Slidev.

Di presentasi, bahan tersedia pada `/examples/README.md`. Pada GitHub, gunakan tautan relatif di dokumen ini; ZIP ada di `public/examples/checkpoints/`.

## Menjaga kesinambungan

- Bahasa terlihat berbicara langsung kepada peserta. Arahan presenter berada dalam komentar HTML.
- Inti: Context, fetch, Route Handlers, SQLite/Drizzle, dan sesi cookie. Alternatif ditempatkan pada pengayaan.
- Modul 03 membahas Server/Client sebelum navigasi Modul 04; pencarian URL berada di Modul 08.
- Modul 10 mengenalkan kontrak/Swagger ringkas; Modul 13 berfokus pada metadata, gambar, dan font.
- Perubahan contoh perlu dicocokkan dengan checkpoint, kontrak, serta modul yang menggunakannya.

Setelah memperbarui source checkpoint, jalankan `python3 scripts/package-checkpoints.py` untuk membentuk ZIP unduhan. Script hanya memasukkan source/config/aset; database, secret, build, dan node_modules dikecualikan.

Baseline contoh: Next.js 16.3.7, React 19.3.0, Node 24 LTS. Versi ini adalah acuan kelas, bukan klaim terbaru. Simpan lockfile dan periksa dukungan/advisory sebelum rilis untuk pengguna nyata.
