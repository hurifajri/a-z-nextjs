# Modul 16 — Merilis Toko Belajar

Salin berkas pendamping ini ke **proyek Next.js Toko Belajar** yang sudah menyelesaikan modul 11–15. Repository Slidev hanya menyajikan materi.

Latihan meneruskan SQLite, Drizzle, dan Better Auth yang sudah dipakai. Targetnya satu service Node di Railway dengan satu volume persisten. Periksa biaya dan dukungan volume pada paket yang akan digunakan sebelum membuat layanan.

## 1. Siapkan versi yang akan dirilis

Jalankan dari root aplikasi, dengan konfigurasi development yang sudah bekerja:

```bash
npm ci
npx eslint .
npx next typegen
npx tsc --noEmit
npm run test:run
npx playwright test
```

Selesaikan setup Playwright pada berkas pendamping modul 15 terlebih dahulu. Target latihan: 12 test Vitest dan 2 test Playwright. Playwright tersebut membangun dan menjalankan aplikasi dengan database test tersendiri.

Sertakan source, konfigurasi, `package.json`, lockfile, schema Drizzle/auth, seluruh folder `drizzle/` beserta metadata, dan script di bawah dalam Git. Jangan menyertakan database pengguna, `.env.local`, atau hasil test. Catat commit yang lulus pemeriksaan.

## 2. Periksa koneksi database

Patch dari modul 15 tetap digunakan. Di `src/db/index.ts`:

```ts
const sqlite = new Database(process.env.DATABASE_PATH ?? "./local.db");
```

Di dalam objek konfigurasi `drizzle.config.ts`:

```ts
dbCredentials: { url: process.env.DATABASE_PATH ?? "./local.db" },
```

Keduanya hanya potongan perubahan. Pertahankan import, schema usulan/auth, dan konfigurasi lain yang sudah ada.

## 3. Pasang script migrasi dan perintah rilis

Salin [scripts/migrate.mjs](./scripts/migrate.mjs) ke `scripts/migrate.mjs` pada root aplikasi. Script memakai `drizzle-orm` dan `better-sqlite3` dari `dependencies` aplikasi.

Tambahkan dua entri pada `scripts` di `package.json`, bersama script yang sudah ada:

```json
"db:migrate:deploy": "node scripts/migrate.mjs",
"start:deploy": "npm run db:migrate:deploy && npm run start -- --hostname 0.0.0.0"
```

Pastikan `start` tetap bernilai `next start`. Tambahkan pula pada root objek `package.json`:

```json
"engines": { "node": "24.x" }
```

Ini fragment JSON; sesuaikan koma dengan entri di sekitarnya. Pertahankan script development dan test.

Migrasi harus dijalankan dari root aplikasi. Script memerlukan `DATABASE_PATH` absolut dan direktori tujuan yang sudah tersedia. Jika migrasi gagal, `&&` mencegah server dimulai. Jangan mengedit ulang SQL migrasi yang sudah diterapkan; buat migrasi baru untuk perubahan berikutnya.

## 4. Konfigurasikan service Railway

1. Hubungkan repository aplikasi dan branch rilis ke service baru.
2. Pilih root aplikasi yang berisi `package.json` dan builder Railpack.
3. Pasang volume pada **`/data`**.
4. Buat domain HTTPS dengan target port **3000**.
5. Isi variabel service berikut. Ganti URL dan secret dengan nilai sebenarnya.

```dotenv
DATABASE_PATH=/data/toko-belajar.db
BETTER_AUTH_URL=https://DOMAIN-APLIKASI-ANTUM
BETTER_AUTH_SECRET=GANTI_DENGAN_SECRET_ACAK_KHUSUS_RILIS
PORT=3000
```

Buat secret dengan `npx auth secret`. Simpan nilainya di pengelola variabel hosting, tanpa awalan `NEXT_PUBLIC_`. Gunakan origin HTTPS tanpa slash penutup untuk `BETTER_AUTH_URL`. Pertahankan secret saat restart/redeploy biasa; bedakan dari secret development dan test.

Lengkapi pengaturan deployment:

| Pengaturan         | Nilai                                          |
| ------------------ | ---------------------------------------------- |
| Build command      | `DATABASE_PATH=./.build-only.db npm run build` |
| Start command      | `npm run start:deploy`                         |
| Pre-deploy command | Kosong                                         |
| Healthcheck path   | `/login`                                       |

Volume Railway baru dipasang **saat runtime**. Koneksi SQLite pada modul sebelumnya dapat diimpor saat build, sehingga build memakai file sementara di direktori aplikasi. Override pada build command hanya berlaku untuk perintah itu; proses runtime tetap membuka `/data/toko-belajar.db`.

Halaman usulan membaca sesi/data saat request. File build tidak perlu diisi atau disalin ke volume. Jika menambah route yang membaca database saat prerender, tinjau kembali kebutuhan build route tersebut.

Jalankan migrasi melalui start command setelah volume tersedia. Jangan memakai pre-deploy command Railway untuk migrasi yang membutuhkan volume ini. Pastikan file migrasi sudah dibuat, diperiksa, dan ikut repository sebelum deployment.

Import repository dapat memulai deployment awal sebelum semua pengaturan terisi. Setelah konfigurasi lengkap, deploy ulang commit yang sudah diperiksa. Baca log build dan start; cari keberhasilan migrasi, lalu server yang siap menerima request.

## 5. Periksa hasil deployment

Pada URL HTTPS aplikasi, gunakan dua akun contoh dengan profil browser terpisah:

- Tanpa login, `/suggestions` mengarah ke `/login` dan `GET /api/suggestions` memberi `401`.
- Aisyah dapat mendaftar/login, menambah usulan, mengedit judul/alasan, dan melihatnya setelah reload.
- Hasan hanya melihat daftar miliknya. PATCH/DELETE terhadap ID usulan Aisyah menghasilkan `404`; data Aisyah tidak berubah.
- Aisyah dapat menghapus usulannya lalu logout.
- Katalog buku, tautan, keyboard, tampilan layar kecil, dan status loading/error tetap berfungsi.

Untuk pemeriksaan API mutasi dari REST client, sertakan cookie akun terkait dan header `Origin` yang sama dengan `BETTER_AUTH_URL`. Kirim body PATCH yang valid agar request benar-benar mencapai pemeriksaan kepemilikan.

Healthcheck `/login` hanya membuktikan server bisa melayani halaman tersebut. Gunakan langkah di atas untuk memeriksa database, auth, dan CRUD.

## 6. Buktikan persistensi dan siapkan pemulihan

1. Buat usulan berjudul **Bukti persistensi Toko Belajar**. Catat akun pemilik, ID, judul, dan alasan.
2. Restart service dengan volume, path database, dan secret yang sama. Periksa akun dan usulan kembali.
3. Redeploy commit yang sama, lalu ulangi pemeriksaan. Data harus tetap ada dan terisolasi per akun.
4. Buat backup volume dan jadwalkan backup sesuai kebutuhan. Sebelum mengubah schema, siapkan backup dan periksa SQL.
5. Pada lingkungan latihan dengan data contoh, coba restore sesuai prosedur provider. Periksa isi snapshot, login, usulan, dan hak akses setelah restore.

Restart/redeploy service dengan volume dapat menimbulkan jeda akses. Simulasi proses lokal belum membuktikan pemasangan volume di hosting; langkah persistensi tetap harus dicoba pada deployment.

Rollback aplikasi menjalankan kode versi sebelumnya, sedangkan restore database mengembalikan snapshot data. Kode lama harus cocok dengan schema saat ini. Perubahan data setelah waktu backup dapat hilang saat restore; catat dampaknya sebelum menjalankan pemulihan.

## 7. Simpan catatan operasional sederhana

Catat URL, commit, hasil test, lokasi log, mount/path database, waktu backup, hasil restore, dan penerima notifikasi. Jangan mencantumkan secret atau cookie.

- Cocokkan waktu, metode, path, dan status request browser dengan log hosting.
- Pantau CPU, memori, volume, serta biaya pada dashboard yang sesuai.
- Siapkan pemeriksaan URL berkala dan notifikasi. Healthcheck deployment bukan pemantauan terus-menerus.
- Gunakan Lighthouse/DevTools untuk diagnosis terkontrol. Data pengguna nyata memerlukan RUM atau field data yang tersedia; aplikasi baru belum tentu memiliki data CrUX.

## Pilihan lain: Vercel

Vercel Functions tidak menyediakan penyimpanan file SQLite permanen bersama. Sebelum memakai jalur ini, pilih database eksternal dan sesuaikan driver, schema/migrasi, serta adapter Better Auth. Jalankan ulang test modul 15, pisahkan database preview/production, lalu lakukan smoke test pada deployment baru.

## Rujukan

Diperiksa **10 Oktober 2026**. Simpan lockfile dan periksa dukungan versi/advisory sebelum rilis berikutnya.

- [Next.js: self-hosting](https://nextjs.org/docs/app/guides/self-hosting)
- [Next.js: environment variables](https://nextjs.org/docs/app/guides/environment-variables)
- [Drizzle: migrasi](https://orm.drizzle.team/docs/migrations)
- [Railway: volume](https://docs.railway.com/volumes) dan [batasannya](https://docs.railway.com/volumes/reference)
- [Railway: build/start command](https://docs.railway.com/builds/build-and-start-commands) dan [healthcheck](https://docs.railway.com/deployments/healthchecks)
- [Railway: backup/restore volume](https://docs.railway.com/volumes/backups)
- [Railway: log](https://docs.railway.com/observability/logs) dan [metrik](https://docs.railway.com/observability/metrics)
- [Railpack: pemilihan versi Node](https://railpack.com/languages/node/)
- [Better Auth: konfigurasi dasar](https://better-auth.com/docs/installation)
- [Vercel: SQLite](https://vercel.com/kb/guide/is-sqlite-supported-in-vercel)
- [web.dev: Core Web Vitals](https://web.dev/articles/vitals)
