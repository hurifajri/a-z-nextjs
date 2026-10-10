# Modul 15 — Playwright untuk Toko Belajar

Berkas ini dipakai pada **aplikasi Next.js latihan sampai modul 14**, setelah latihan inti Vitest selesai. Salin struktur berikut ke root aplikasi:

```text
playwright.config.ts
e2e/
  prepare-db.mjs
  suggestions.spec.ts
```

## 1. Prasyarat

- Node 24 LTS dan aplikasi modul 14 yang berjalan: daftar/login, sesi Better Auth, CRUD usulan, serta pemeriksaan pemilik dan Origin.
- Migrasi Drizzle dari modul 11 dan 14 sudah tersimpan di `drizzle/`. Migrasi itu harus dapat membentuk tabel usulan dan auth dari database kosong.
- Script `build` menjalankan `next build`; `start` menjalankan `next start`.
- Root layout tetap memakai QueryProvider. Label dan tombol mengikuti modul 09–14.
- Port 3100 tersedia. Config menolak memakai server yang sudah berjalan di port itu.

## 2. Pilih database melalui environment variable

Di `src/db/index.ts`, ganti hanya baris pembuka koneksi:

```ts
const sqlite = new Database(process.env.DATABASE_PATH ?? "./local.db");
```

Di `drizzle.config.ts`, ganti hanya `dbCredentials` dan pertahankan konfigurasi schema serta folder migrasi:

```ts
dbCredentials: { url: process.env.DATABASE_PATH ?? "./local.db" },
```

Keduanya wajib membaca variabel yang sama. Config Playwright memberikan path SQLite baru `./.e2e/<uuid>.db` kepada proses migrasi, build, dan server. Tanpa variabel ini, pengembangan lokal tetap memakai `local.db`.

Tambahkan ke `.gitignore` aplikasi:

```gitignore
.e2e/
test-results/
playwright-report/
```

## 3. Pasang dan jalankan

```bash
npm install -D @playwright/test
npx playwright install chromium
npx playwright test
```

Playwright menjalankan persiapan database, build aplikasi, lalu server production lokal di `http://localhost:3100`. `BETTER_AUTH_URL` memakai origin tersebut; secret acak hanya dipakai selama run. Config tidak mengambil sesi login manual peserta.

Target: **2 test lulus**:

1. Browser: daftar akun, tambah usulan, reload, periksa kartu, hapus, dan reload lagi.
2. API asli: akses tanpa sesi ditolak; dua context mendapat cookie login masing-masing; Hasan tidak melihat atau mengubah usulan Aisyah; data Aisyah tetap utuh dan bisa dihapus Aisyah.

Test API memasang header `Origin` yang benar dan mengirim body PATCH valid agar benar-benar mencapai pemeriksaan pemilik. Keduanya memanggil aplikasi asli tanpa MSW.

## 4. Jika gagal

- **Migrasi/build gagal:** baca log tahap tersebut sebelum mengubah assertion. Periksa kedua patch `DATABASE_PATH`, schema auth, dan migrasi yang sudah dibuat di modul sebelumnya.
- **Connection refused atau port dipakai:** pastikan port 3100 tersedia. Jika mengganti port, ubah origin dan argumen `--port` bersama-sama.
- **403:** periksa origin request dan `BETTER_AUTH_URL`; host `localhost` berbeda dari `127.0.0.1`.
- **Tidak menemukan label/tombol:** cocokkan UI dengan modul 09–14. Jangan mengubah locator menjadi posisi elemen hanya untuk membuat test lewat.
- **401 saat API lintas akun:** pastikan signup berhasil serta masing-masing request memakai context yang sama setelah signup.
- Trace kegagalan disimpan di `test-results/`; buka dengan `npx playwright show-trace <path-ke-trace.zip>`.

Server dihentikan Playwright setelah run. Database test sengaja disimpan untuk membantu pemeriksaan kegagalan. Setelah proses selesai, hapus folder `.e2e/` bila ingin membersihkan seluruh akun, sesi, dan usulan test. Run berikutnya selalu mendapat file baru; `local.db` tidak dihapus.

## Rujukan

Diperiksa 10 Oktober 2026. Contoh diverifikasi dengan Playwright 1.64.0; simpan lockfile aplikasi.

- [Menjalankan web server dari Playwright](https://playwright.dev/docs/test-webserver)
- [Pengujian API dan cookie context](https://playwright.dev/docs/api-testing)
- [Locator elemen](https://playwright.dev/docs/locators)
- [Next.js dan Playwright](https://nextjs.org/docs/app/guides/testing/playwright)
