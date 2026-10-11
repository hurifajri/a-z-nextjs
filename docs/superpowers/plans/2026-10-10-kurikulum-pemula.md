# Perbaikan kurikulum Next.js pemula

> Pelaksanaan berurutan dalam sesi ini, menggunakan writing-plans dan executing-plans. Persetujuan: “ok kerjakan semuanya berurutan”.

**Goal:** Menyediakan alur 16 modul yang dapat diikuti pemula Next.js dengan bekal JavaScript, React, dan TypeScript.

**Architecture:** Pertahankan satu proyek Toko Belajar, format Slidev, animasi, dan komponen interaktif. Pisahkan materi inti dari lab pengayaan; sediakan bahan latihan lengkap pada checkpoint utama.

**Tech Stack:** Slidev, Next.js 16.3.7 (baseline kelas), React 19, TypeScript, TanStack Query, Valibot, Drizzle/SQLite, Better Auth.

**Spec:** Audit kurikulum dan usulan urutan yang disetujui dalam percakapan 10 Oktober 2026.

## Batas dan pemeriksaan

- Bahasa terlihat berbicara kepada peserta; arahan presenter hanya dalam komentar.
- Context, fetch, Route Handlers, SQLite, dan sesi cookie menjadi jalur utama.
- Referensi nomor modul, path file, API, dan langkah latihan harus konsisten.
- Animasi, transisi, kuis, dan tata letak tetap berfungsi.
- Jangan mengklaim deployment layanan eksternal sudah diuji.

## Urutan pekerjaan

- [x] 1. Modul 01–04: prasyarat, orientasi, Server/Client sebelum navigasi; pindahkan pencarian URL ke 08. Periksa semua konsumen komponen yang berpindah.
- [x] 2. Modul 05–08: state bertahap, Context inti, Zustand/cache lanjutan sebagai lampiran; fallback API dan latihan respons gagal yang jelas.
- [x] 3. Modul 09–10: form ke API, kontrak HTTP dan Swagger ringkas; pindahkan teori database mendalam ke 11.
- [x] 4. Modul 11–13: checkpoint CRUD, UI terfokus, modul baru metadata/gambar/font, lab Server Action terpisah.
- [x] 5. Modul 14–16: tahap akun/sesi/otorisasi, E2E inti selaras dengan rilis, tugas mandiri dengan kriteria keberhasilan.
- [x] 6. Bahan pendamping: checkpoint lengkap 06/08/11/14, dependensi terkunci, petunjuk unduh/jalankan dan batas keamanan lab.
- [x] 7. Verifikasi: format/build Slidev, tautan dan urutan, typecheck/build bahan pendamping, pemeriksaan browser tata letak/animasi/kuis.

## Fokus review

1. Komponen tidak boleh digunakan sebelum file/prasyaratnya tersedia.
2. Jalur inti tidak bergantung pada lab pengayaan.
3. Fixture harus mempertahankan kontrak API dan bisa dimatikan.
4. Metadata dan font tidak menghilangkan provider/layout yang sudah dibangun.
5. Checkpoint berakun harus memeriksa pemilik pada server, bukan hanya menyembunyikan UI.

## Catatan pelaksanaan

Perubahan konten diverifikasi melalui parser, build, dan browser; tidak menambahkan tes yang sekadar menyalin teks slide. Implementasi tetap di workspace pengguna dan tidak melakukan commit/push. Lampiran tidak dimasukkan ke urutan presentasi utama.

## Hasil verifikasi — 11 Oktober 2026

- Slidev production build berhasil; format 260 file source/dokumen dan `git diff --check` lulus.
- Empat checkpoint lulus lint, TypeScript, dan production build. Lockfile dibuat untuk masing-masing manifest. Pengujian build menggunakan instalasi dependensi bersama dan fixture eksplisit untuk menghindari ketergantungan API publik.
- Migrasi 11→14 mempertahankan baris lama dengan `userId = null`.
- Dua belas test Vitest dari Modul 15 lulus. Plugin React test dipin 5.2.0 setelah instalasi versi 6 terbaru menghasilkan konflik Babel pada dependensi kelas.
- Dua alur Playwright Modul 15 lulus: CRUD persisten dan isolasi dua akun. Tiga alur tambahan lulus: pencarian/fixture/keranjang, metadata/gambar/font lokal, dan validasi Server Action. Locator alert pada test tambahan dipersempit ke main agar tidak mencocokkan announcer bawaan Next.js.
- Browser memeriksa 386 slide pada keadaan awal dan akhir reveal. Dua penanda yang terdeteksi di luar batas adalah teks `sr-only` tombol Run; konten terlihat tetap berada dalam slide.
- Enam belas kuis lulus untuk pilihan salah, benar, reset, dan batas tampilan setelah jawaban muncul. Contoh v-click, magic-move, v-switch, serta eksekusi editor Monaco berfungsi.
- Enam puluh empat tautan bahan lokal valid. Empat ZIP cocok dengan source, manifest dependensi, dan checksum; database, secret, dependensi terpasang, dan hasil build dikecualikan.
- Review terpisah tidak menemukan masalah kritis atau penting. Tiga rujukan lama pada Modul 11/12/14 telah diperbaiki.

Hosting eksternal tidak dideploy atau diuji. Batas akun untuk aplikasi latihan tetap dijelaskan pada Modul 14 dan README checkpoint.
