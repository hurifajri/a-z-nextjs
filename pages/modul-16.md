---
layout: intro
badge: "MODUL 16"
badgeColor: "purple"
level: 1
---

## 16. Merilis dan Memantau Toko Belajar

Membawa aplikasi yang sudah diuji ke hosting, menjaga usulan buku tetap tersimpan, dan membaca tanda masalah setelah aplikasi online.

<!--
Prasyarat: Toko Belajar sampai Modul 15. Stack tetap Next.js 16, Node 24 LTS, better-sqlite3, Drizzle, dan sesi database Better Auth.
Jalur utama latihan: satu Node service dengan volume persisten, dicontohkan menggunakan Railway. Pilihan ini menjaga kesinambungan SQLite lokal; Vercel dibahas sebagai alternatif yang memerlukan penyesuaian penyimpanan.
Audit sumber: 10 Oktober 2026. Langkah dashboard dapat berubah; yang harus cocok adalah runtime, mount path, environment variable, dan perintah proses.
Ini materi deployment aplikasi latihan. Tidak ada instruksi melakukan deployment repository Slidev ini.
-->

---
class: module-content
---

### Dari Test yang Lulus ke Aplikasi yang Bisa Dipakai

Modul 15 sudah memeriksa form, kontrak API, dan akses pemilik usulan.

<v-clicks>

- Sekarang aplikasi harus berjalan di **komputer hosting** dengan konfigurasi sendiri.
- Akun, sesi, dan usulan buku harus tetap ada saat proses aplikasi diganti.
- URL online perlu diperiksa: login, tambah, edit, hapus, dan pembatasan akun.
- Setelah rilis, kita memantau kegagalan dan pengalaman pengguna.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Hasil akhir: URL latihan yang bisa dicoba, bukti data tetap tersimpan, serta catatan cara memeriksa dan memulihkan rilis.
</BrutalCard>

---
class: module-content
---

### Bedakan Build, Deploy, dan Monitoring

Tiga kegiatan ini saling melengkapi.

<div class="grid grid-cols-3 gap-4 mt-6">
  <BrutalCard v-click>
    <strong>1. Build</strong>
    <p class="text-sm">Menghasilkan versi aplikasi untuk produksi dan menemukan masalah kompilasi.</p>
  </BrutalCard>
  <BrutalCard v-click>
    <strong>2. Deploy</strong>
    <p class="text-sm">Menjalankan versi tersebut di hosting dengan domain, konfigurasi, dan penyimpanan.</p>
  </BrutalCard>
  <BrutalCard v-click>
    <strong>3. Monitoring</strong>
    <p class="text-sm">Mengamati ketersediaan, error, penggunaan sumber daya, dan performa setelah rilis.</p>
  </BrutalCard>
</div>

<BrutalCard v-click class="mt-5 text-sm">
  Build berhasil membuktikan aplikasi bisa dibangun. Login dan penyimpanan di hosting tetap perlu dicoba.
</BrutalCard>

<!--
next build dan next start menjalankan peran berbeda; server production memakai hasil build.
Sumber: https://nextjs.org/docs/app/api-reference/cli/next
-->

---
class: module-content
---

### 1. Pilih Hosting yang Cocok dengan Database Kita

Toko Belajar menyimpan usulan **dan data auth** di file SQLite yang sama.

| Target                          | Kesesuaian dengan latihan saat ini                          |
| ------------------------------- | ----------------------------------------------------------- |
| Node service + volume persisten | Dapat memakai `better-sqlite3` dan schema yang sudah dibuat |
| Vercel Functions                | Memerlukan penyimpanan eksternal serta driver yang sesuai   |
| Hosting file statis             | Tidak menjalankan Route Handler dan pembacaan sesi server   |

<v-clicks>

- Jalur praktik: **Railway, satu service Node, satu volume persisten**.
- Periksa dukungan volume dan biaya paket sebelum membuat layanan.
- Satu service dengan volume ini mempunyai jeda saat redeploy; rencanakan waktu pengujian.

</v-clicks>

<!--
Pilihan Railway adalah keputusan pengajaran untuk meneruskan SQLite; bukan klaim bahwa satu platform selalu terbaik atau gratis.
Vercel Functions tidak menyediakan shared persistent filesystem untuk write SQLite lokal. Mengganti DATABASE_PATH dengan URL PostgreSQL saja tidak mengganti driver, schema, atau adapter.
Railway saat audit tidak mendukung replicas pada service dengan volume, dan ada sedikit downtime saat redeploy volume service.
Sumber: https://vercel.com/kb/guide/is-sqlite-supported-in-vercel
Sumber: https://docs.railway.com/volumes/reference
Sumber: https://nextjs.org/docs/app/guides/static-exports
-->

---
class: module-content
layout: two-cols
---

### 2. Siapkan Repository Aplikasi

Hosting akan membangun aplikasi dari source dan lockfile yang dikirim.

::left::

#### Sertakan dalam Git

- Source aplikasi dan konfigurasi Next.js.
- `package.json` dan `package-lock.json`.
- Schema Drizzle, termasuk `auth-schema.ts`.
- Seluruh folder `drizzle/` berisi migrasi dan metadata.
- Script rilis yang dibuat pada modul ini.

::right::

#### Abaikan Berkas Lokal

Tambahkan bila belum ada di `.gitignore`:

```text
.env*
!.env.example
*.db*
.e2e/
.next/
node_modules/
```

`.env.example` berisi nama variabel dan placeholder.

<!--
Periksa git status/diff sebelum commit; menambahkan pola gitignore tidak menghapus file yang telanjur tracked. Jika secret pernah terpublikasi, cabut/ganti secret tersebut.
Database lokal peserta bukan bahan seed production. Akun latihan online dibuat melalui aplikasi setelah migrasi.
Pertahankan ignore test-results dan playwright-report dari Modul 15. Folder drizzle wajib disertakan; file metadata bukan data pengguna.
-->

---
class: module-content
---

### 3. Jalankan Pemeriksaan dari Modul 15

Di root aplikasi Next.js, jalankan berurutan dan selesaikan kegagalan sebelum melanjutkan.

```bash
npm ci
npx eslint .
npx next typegen
npx tsc --noEmit
npm run test:run
npx playwright test
```

<v-clicks>

- `npm ci` mengikuti lockfile; pastikan dependensi dan konfigurasi ESLint tersedia.
- Target latihan sebelumnya: **12 test Vitest** dan **2 test Playwright**.
- Config Playwright modul 15 sudah menjalankan build dan server dengan database test.
- Catat commit yang lulus agar jelas versi mana yang akan dirilis.

</v-clicks>

<!--
Jika bagian lanjutan Playwright Modul 15 belum dikerjakan, selesaikan setup-nya terlebih dahulu untuk mengikuti jalur rilis ini.
next build bukan pengganti pemeriksaan lint atau seluruh test. Next.js 16 tidak lagi menjalankan lint otomatis saat build.
CI dapat mengotomasi rangkaian ini. Pengaturan Git hosting tetap perlu memastikan hanya versi yang sudah diperiksa yang dipromosikan.
Sumber: https://nextjs.org/docs/app/guides/upgrading/version-16
Sumber: https://playwright.dev/docs/test-webserver
-->

---
class: module-content
---

### Baca Hasil Build tanpa Menebak Kecepatan

Untuk memeriksa mode produksi lokal dengan konfigurasi lokal yang sudah tersedia:

```bash
npm run build
npm run start
```

Contoh **sebagian** route Toko Belajar, saat Cache Components tidak diaktifkan:

```text
○ /login
ƒ /suggestions
ƒ /api/suggestions
ƒ /api/suggestions/[id]
ƒ /api/auth/[...all]
```

<v-clicks>

- **○**: halaman dapat diprerender. **ƒ**: respons dirender saat request datang.
- `/suggestions` membaca sesi dan usulan akun aktif; rendering dinamis sesuai kebutuhannya.
- Simbol build tidak mengukur LCP, respons tombol, atau kestabilan layout.

</v-clicks>

<!--
Turbopack adalah bundler default Next.js 16. Hindari klaim semua build selalu cepat atau semua route dinamis lambat.
Daftar di atas ilustrasi subset, bukan salinan output yang wajib sama. Route katalog dari modul sebelumnya tetap ada.
Hentikan dev server yang memakai port yang sama sebelum mencoba next start. Jangan memakai next dev sebagai start command production.
Sumber: https://nextjs.org/docs/app/api-reference/cli/next
-->

---
class: module-content
---

### 4. Gunakan Konfigurasi yang Memang Dibaca Aplikasi

Isi variabel berikut pada **service hosting**. URL dan secret di bawah adalah placeholder.

```dotenv {1|2-3|4|all}
DATABASE_PATH=/data/toko-belajar.db
BETTER_AUTH_URL=https://DOMAIN-APLIKASI-ANTUM
BETTER_AUTH_SECRET=GANTI_DENGAN_SECRET_ACAK_KHUSUS_RILIS
PORT=3000
```

<v-clicks>

- `DATABASE_PATH`: lokasi file pada volume yang akan dipasang di `/data`.
- `BETTER_AUTH_URL`: origin HTTPS sebenarnya, **tanpa slash penutup**.
- Buat secret melalui `npx auth secret`; simpan di pengelola variabel hosting.
- Pertahankan secret yang sama saat restart/redeploy biasa.

</v-clicks>

<!--
Nama variabel mengikuti modul 14–15. Tidak ada JWT_SECRET atau SESSION_SECRET yang dibaca oleh konfigurasi kita.
PORT=3000 dipilih eksplisit untuk latihan; target port domain/healthcheck harus sama. PORT diberikan melalui environment proses, bukan hanya file .env.
Secret rilis berbeda dari secret development dan test. Rotasi secret memerlukan rencana karena dapat membatalkan sesi; jangan membuat secret baru pada setiap start.
Sumber: https://better-auth.com/docs/installation
Sumber: https://better-auth.com/docs/concepts/cli
Sumber: https://nextjs.org/docs/app/api-reference/cli/next
-->

---
class: module-content
layout: two-cols
---

### Bedakan Konfigurasi Server dan Browser

Tempat membaca variabel menentukan kapan perubahan nilainya berlaku.

::left::

#### Tetap di Server

- `DATABASE_PATH`
- `BETTER_AUTH_URL`
- `BETTER_AUTH_SECRET`

Nilai dibaca kode server. Terapkan perubahan dengan proses deployment/restart yang sesuai.

::right::

#### Dikirim ke Browser

Variabel berawalan `NEXT_PUBLIC_` yang direferensikan kode client dimasukkan ke bundle saat build.

- Nilainya dapat dibaca pengguna.
- Perubahan memerlukan build baru.
- Gunakan hanya untuk konfigurasi publik.

::bottom::

<BrutalCard v-click class="text-sm">
  Pisahkan konfigurasi dan database development, test, preview, serta rilis. Cookie sesi Toko Belajar tetap dikelola Better Auth.
</BrutalCard>

<!--
Jangan memindahkan secret ke NEXT_PUBLIC_ atau ke next.config.env. .env.local pada laptop tidak otomatis menjadi variabel di hosting.
Contoh aplikasi memakai pembacaan process.env pada modul server; proses baru diperlukan agar modul mengevaluasi konfigurasi baru.
Sumber: https://nextjs.org/docs/app/guides/environment-variables
Sumber: https://better-auth.com/docs/concepts/cookies
-->

---
class: module-content
---

### 5. Pastikan Lokasi Database Bisa Dikonfigurasi

Pakai perubahan dari modul 15. Pada **`src/db/index.ts`**:

```ts
const sqlite = new Database(process.env.DATABASE_PATH ?? "./local.db");
```

Pada **`drizzle.config.ts`**, di dalam objek konfigurasi:

```ts
dbCredentials: { url: process.env.DATABASE_PATH ?? "./local.db" },
```

<v-clicks>

- Koneksi runtime dan alat migrasi harus menunjuk file yang dimaksud.
- Saat deploy, variabel service menunjuk **`/data/toko-belajar.db`**.
- Mount volume pada `/data`; file dalam folder aplikasi biasa dapat hilang saat deployment diganti.

</v-clicks>

<!--
Jangan mengganti isi kedua file seluruhnya dengan fragment di atas. Pertahankan schema suggestions dan auth, import server-only, serta out: ./drizzle.
Path SQLite berbeda dari URL koneksi database terkelola. Fallback local.db hanya untuk pengembangan lokal tanpa variabel tersebut.
Sumber: https://docs.railway.com/volumes
-->

---
class: module-content
---

### Build dan Runtime Memakai Penyimpanan Berbeda

Di Railway, volume tersedia saat **service berjalan**; tahap build dan pre-deploy belum memasangnya.

| Tahap   | Lokasi file             | Tujuan                                                |
| ------- | ----------------------- | ----------------------------------------------------- |
| Build   | `./.build-only.db`      | File sementara agar import koneksi lokal dapat dibuka |
| Runtime | `/data/toko-belajar.db` | Akun, sesi, dan usulan yang harus dipertahankan       |

Build command untuk lingkungan Linux hosting:

```bash
DATABASE_PATH=./.build-only.db npm run build
```

<BrutalCard v-click class="mt-3 text-sm">
  Override di atas berlaku hanya untuk perintah build. Variabel service tetap menunjuk volume saat server dijalankan.
</BrutalCard>

<!--
Koneksi Modul 11 dibuat pada module scope dan dapat diimpor saat Next.js mengumpulkan route. Langsung memakai /data/... saat build berisiko gagal karena mount belum tersedia.
File build ini tidak berisi data akun dan tidak perlu dipindahkan ke volume. Halaman suggestions memakai connection() dan sesi, sehingga query data pengguna tidak diprerender saat build.
Ini penyesuaian untuk struktur aplikasi latihan, bukan pola untuk mengisi database production saat build. Jika route baru sengaja membaca DB ketika prerender, tinjau kebutuhan data build-nya lagi.
Sumber: https://docs.railway.com/volumes#volume-availability
Sumber: https://nextjs.org/docs/app/guides/self-hosting
-->

---
class: module-content
---

### 6. Terapkan Migrasi sebelum Server Menerima Request

Buat **`scripts/migrate.mjs`**. File utuh tersedia pada [berkas pendamping](/examples/modul-16/scripts/migrate.mjs).

```js
import { isAbsolute } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const databasePath = process.env.DATABASE_PATH;
if (!databasePath || !isAbsolute(databasePath)) {
  throw new Error("DATABASE_PATH rilis harus berupa path absolut.");
}
const sqlite = new Database(databasePath);
try {
  migrate(drizzle(sqlite), { migrationsFolder: "./drizzle" });
  console.log("Migrasi database selesai.");
} finally {
  sqlite.close();
}
```

Script menerapkan migrasi yang belum tercatat dari modul 11–14. Kegagalan membuat proses berhenti.

<!--
Jalankan dari root aplikasi agar ./drizzle ditemukan. Script mandiri memakai dependency runtime yang sudah dipasang; tidak mengimpor penanda server-only melalui src/db/index.ts.
Di jalur satu service SQLite ini, migrasi dijalankan saat start setelah volume dipasang, sebelum next start. Ini bukan handler request dan bukan perintah pre-deploy Railway.
Review SQL dan siapkan backup sebelum perubahan schema. File migrasi lama yang sudah diterapkan tidak diedit ulang.
Sumber: https://orm.drizzle.team/docs/migrations
-->

---
class: module-content
---

### 7. Tambahkan Perintah Rilis

Tambahkan ke `scripts` dalam **`package.json`**, bersama script yang sudah ada:

```json
"db:migrate:deploy": "node scripts/migrate.mjs",
"start:deploy": "npm run db:migrate:deploy && npm run start -- --hostname 0.0.0.0"
```

Tambahkan `engines` pada root objek `package.json`:

```json
"engines": { "node": "24.x" }
```

<v-clicks>

- `&&` menjalankan server hanya jika migrasi berhasil.
- `start` tetap menjalankan `next start`; port dibaca dari `PORT`.
- `0.0.0.0` membuat server menerima koneksi dari jaringan hosting.
- `drizzle-orm` dan `better-sqlite3` tetap berada dalam `dependencies`.

</v-clicks>

<!--
Kedua blok adalah fragment JSON; jangan menghapus script build, dev, start, test, dan test:run. Start normal tetap dipakai konfigurasi Playwright Modul 15.
Node 24.x menjaga major version; simpan lockfile dan periksa hasil pemilihan versi di build log. Railpack dapat menerima override versi lain yang harus diselaraskan bila sudah disetel.
Untuk banyak instance/server, koordinasi migrasi perlu dirancang ulang. Contoh ini sengaja memakai satu service dengan satu volume.
Sumber: https://railpack.com/languages/node/
Sumber: https://nextjs.org/docs/app/api-reference/cli/next
-->

---
class: module-content
---

### 8. Siapkan Service, Volume, dan Domain

Gunakan repository **aplikasi Toko Belajar** yang sudah diperiksa.

<v-clicks>

1. Buat project/service di Railway; hubungkan repository dan branch yang dipakai untuk rilis.
2. Pilih root aplikasi yang berisi `package.json`; gunakan builder Node/Railpack.
3. Tambahkan volume ke service tersebut dengan mount path **`/data`**.
4. Pada networking, buat domain HTTPS dan arahkan ke port **3000**.
5. Isi empat variabel service pada slide konfigurasi; URL auth memakai domain tadi.
6. Lengkapi build/start command pada slide berikut, lalu deploy versi yang dimaksud.

</v-clicks>

<!--
Import repository dapat memulai deployment otomatis. Lengkapi konfigurasi, lalu deploy ulang jika percobaan awal berjalan sebelum semua pengaturan tersedia.
Auto-deploy mengikuti branch dan pengaturan service, tidak selalu main. Sinkronkan dengan hasil CI bila CI telah dipasang.
Nama panel bisa berubah; periksa docs Railway bila letak tombol berbeda. Tidak perlu membuat layanan PostgreSQL tambahan untuk jalur SQLite ini.
Sumber: https://docs.railway.com/guides/nextjs
Sumber: https://docs.railway.com/networking/public-networking
Sumber: https://docs.railway.com/deployments/github-autodeploys
-->

---
class: module-content
---

### Cocokkan Pengaturan sebelum Menekan Deploy

| Pengaturan service            | Nilai latihan                                       |
| ----------------------------- | --------------------------------------------------- |
| Build command                 | `DATABASE_PATH=./.build-only.db npm run build`      |
| Start command                 | `npm run start:deploy`                              |
| Pre-deploy command            | Kosong; migrasi SQLite volume dijalankan saat start |
| Volume mount                  | `/data`                                             |
| `DATABASE_PATH`               | `/data/toko-belajar.db`                             |
| `PORT` dan target port domain | `3000`                                              |
| Healthcheck path              | `/login`                                            |

<BrutalCard v-click class="mt-3 text-sm">
  Respons 200 dari <code>/login</code> memeriksa bahwa server dapat melayani halaman. Login, database, dan hak akses dibuktikan melalui alur berikutnya.
</BrutalCard>

<!--
Railway menunggu respons 2xx dari healthcheck ketika mengaktifkan deployment. Healthcheck bawaan ini tidak terus memonitor setelah rilis aktif.
Login merupakan route publik pada aplikasi latihan; matcher Proxy opsional dari Modul 14 hanya mencakup /suggestions. Jika kebijakan route berubah, sesuaikan endpoint healthcheck.
Sumber: https://docs.railway.com/builds/build-and-start-commands
Sumber: https://docs.railway.com/deployments/healthchecks
Petunjuk lengkap juga ada pada /examples/modul-16/README.md.
-->

---
class: module-content
---

### 9. Lakukan Smoke Test pada URL Online

**Smoke test** adalah pemeriksaan singkat bahwa alur utama bekerja setelah deployment.

| Percobaan dengan akun contoh            | Hasil yang diharapkan                     |
| --------------------------------------- | ----------------------------------------- |
| Buka `/suggestions` tanpa sesi          | Berpindah ke `/login`                     |
| Daftar/login sebagai Aisyah             | Masuk ke daftar usulan miliknya           |
| Tambah lalu edit usulan                 | Judul dan alasan yang tersimpan sesuai    |
| Reload halaman                          | Usulan tetap ada                          |
| Hasan membaca/mengubah ID usulan Aisyah | Daftar terpisah; PATCH/DELETE `404`       |
| Aisyah menghapus usulan lalu logout     | Usulan hilang; akses API tanpa sesi `401` |

<!--
Gunakan dua profil browser atau context terpisah seperti Modul 14–15. Untuk API mutasi dari REST client, kirim Origin yang sesuai BETTER_AUTH_URL serta body valid agar mencapai pemeriksaan kepemilikan.
Periksa juga katalog Open Library dan tautan halaman yang sudah dibuat pada modul awal. Uji UI pada ukuran layar kecil, keyboard, loading, dan kegagalan request.
Jangan mengarahkan suite Playwright yang membuat/menghapus fixture ke database berisi data pengguna nyata tanpa menyiapkan lingkungan uji.
-->

---
class: module-content
---

### 10. Buktikan Data Bertahan saat Proses Diganti

Reload browser pada modul 15 belum menguji penggantian proses di hosting.

<v-clicks>

1. Buat usulan baru berjudul **“Bukti persistensi Toko Belajar”**; catat akun pemilik dan ID-nya.
2. Restart service melalui hosting, dengan volume dan konfigurasi yang sama.
3. Buka kembali aplikasi; masuk lagi bila diperlukan, lalu periksa judul dan alasan.
4. Redeploy commit yang sama tanpa mengganti volume; ulangi pemeriksaan.
5. Periksa bahwa akun lain tetap tidak dapat membaca atau mengubah usulan tersebut.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Jika data hilang, cocokkan mount volume dan <code>DATABASE_PATH</code> yang dipakai runtime. Hentikan perubahan lain sampai lokasi data jelas.
</BrutalCard>

<!--
Path pada konfigurasi saja tidak membuktikan volume terpasang. Uji ini harus dilakukan pada provider setelah deployment; simulasi lokal tidak menggantikan pemeriksaan volume provider.
Akun, sesi, dan usulan berada pada SQLite yang sama. Pertahankan secret agar restart biasa tidak sengaja mengganti kunci auth.
Restart/redeploy volume service dapat menimbulkan jeda akses singkat. Data dapat bertahan meskipun prosesnya berganti.
-->

---
class: module-content
---

### Cek Pemahaman: Data Hilang setelah Redeploy

<LearningCheck
  question="Build berhasil dan usulan muncul saat dibuat, tetapi hilang setelah redeploy. Apa yang diperiksa lebih dahulu?"
  :options="[
    'Animasi tombol Simpan dan warna kartu.',
    'Mount volume serta path database yang benar-benar dipakai runtime.',
    'Mengulang build sampai usulan muncul kembali.',
  ]"
  :answer="1"
  explanation="Build dan reload browser belum membuktikan penyimpanan persisten. Pastikan proses baru membuka file database pada volume yang sama."
/>

<!--
Minta peserta menunjukkan nilai DATABASE_PATH, mount path, dan langkah uji yang mendukung jawabannya. Jangan meminta peserta menampilkan secret di layar bersama.
-->

---
class: module-content
layout: two-cols
---

### 11. Siapkan Pemulihan Kode dan Data

Dua jenis pemulihan ini mempunyai dampak yang berbeda.

::left::

#### Rollback Aplikasi

- Catat commit/deployment terakhir yang bekerja.
- Jalankan kembali versi tersebut bila rilis baru bermasalah.
- Periksa bahwa kode lama masih cocok dengan schema database saat ini.

::right::

#### Restore Database

- Buat backup volume sebelum perubahan schema.
- Jadwalkan backup sesuai kebutuhan data.
- Latih restore pada lingkungan latihan, lalu uji akun dan usulan.
- Perubahan setelah waktu backup dapat hilang saat restore.

::bottom::

<BrutalCard v-click class="text-sm">
  Rollback kode tidak otomatis membatalkan migrasi. Tentukan langkah pemulihan sebelum menjalankan perubahan data.
</BrutalCard>

<!--
Railway menyediakan backup manual/terjadwal dan restore volume. Ikuti alur konfirmasi restore provider; catat waktu backup, data yang diharapkan, dan hasil pemeriksaan setelah restore.
Jangan menganggap menyalin file .db yang sedang aktif selalu menghasilkan backup konsisten, terutama bila journal/WAL terlibat. Gunakan fasilitas backup yang sesuai lalu buktikan restore-nya.
Sumber: https://docs.railway.com/volumes/backups
Sumber: https://sqlite.org/backup.html
-->

---
class: module-content
---

### 12. Pantau Hal yang Mewakili Pengalaman Pengguna

Mulai dari beberapa sinyal yang dapat ditindaklanjuti.

| Pertanyaan                           | Bukti yang diperiksa                                    |
| ------------------------------------ | ------------------------------------------------------- |
| Apakah aplikasi dapat diakses?       | Pemeriksaan berkala URL publik dan notifikasi kegagalan |
| Apakah simpan/login sering gagal?    | Status HTTP, log error, route, dan waktu kejadian       |
| Apakah server kehabisan sumber daya? | CPU, memori, pemakaian volume, serta biaya              |
| Apakah halaman nyaman dipakai?       | Core Web Vitals dan pengamatan interaksi pengguna       |

<v-clicks>

- Tentukan siapa yang menerima notifikasi dan apa tindakan pertamanya.
- Pisahkan kunjungan/page view dari keberhasilan menyimpan usulan.
- Healthcheck saat deploy perlu dilengkapi pemeriksaan berkala setelah online.

</v-clicks>

<!--
Gunakan dashboard host untuk resource/log, uptime monitor untuk pemeriksaan berkala, dan RUM atau alat browser untuk pengalaman pengguna. Ketersediaan satu URL tidak membuktikan semua fitur berjalan.
Sumber: https://docs.railway.com/observability/metrics
Sumber: https://docs.railway.com/deployments/healthchecks
Sumber: https://web.dev/articles/vitals
-->

---
class: module-content
---

### Praktik: Temukan Log untuk Satu Kejadian

Di deployment latihan, pilih waktu dan aksi yang ingin diperiksa.

<v-clicks>

1. Buka Network di browser, lalu kirim satu usulan buku.
2. Catat waktu, metode, path, dan status respons: misalnya `POST /api/suggestions → 201`.
3. Buka panel deployment/observability hosting pada rentang waktu yang sama.
4. Bedakan **build log**, **runtime log**, dan **HTTP log** bila tersedia.
5. Jika gagal, cocokkan route dan waktu sebelum mengubah kode.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Log cukup memuat konteks diagnostik. Hindari mencatat password, cookie sesi, secret, atau seluruh body usulan pengguna.
</BrutalCard>

<!--
Railway menangkap stdout/stderr aplikasi. Aplikasi tidak otomatis mencatat setiap operasi database; gunakan HTTP log yang tersedia atau tambahkan pencatatan terukur bila diperlukan.
Jangan menyimpulkan penyebab 500 hanya dari statusnya. Periksa stack/error server pada waktu yang sesuai tanpa menampilkan nilai sensitif.
Sumber: https://docs.railway.com/observability/logs
-->

---
class: module-content
---

### Core Web Vitals: Tiga Sisi Performa Halaman

Nilai “baik” berikut mengukur pengalaman di browser.

| Metrik  | Makna sederhana                                                  | Target baik |
| ------- | ---------------------------------------------------------------- | ----------- |
| **LCP** | Kapan konten utama terbesar terlihat?                            | ≤ 2,5 detik |
| **INP** | Seberapa cepat halaman memberi respons visual setelah interaksi? | ≤ 200 ms    |
| **CLS** | Seberapa besar layout bergeser secara tak terduga?               | ≤ 0,1       |

<v-clicks>

- Evaluasi ketiganya pada **persentil ke-75**, terpisah untuk mobile dan desktop.
- p75 berarti sekitar 75% pengamatan berada pada atau di bawah nilai itu.
- INP berbeda dari durasi penyimpanan API; keduanya perlu dibaca sesuai konteks.

</v-clicks>

<!--
LCP mengukur konten terbesar yang memenuhi kriteria metrik, bukan semua resource selesai dimuat. INP mengukur latensi interaksi, bukan seluruh perjalanan request jaringan. CLS tidak bersatuan waktu.
Ambang dan cara agregasi mengikuti web.dev pada audit 10 Oktober 2026. Angka ini bukan jaminan semua pengguna mengalami waktu yang sama.
Sumber: https://web.dev/articles/vitals
-->

---
class: module-content
layout: two-cols
---

### Ukur, Temukan Penyebab, Lalu Ulangi

Mulai dari halaman katalog atau alur usulan yang sudah dikenal.

::left::

#### Lab: Percobaan Terkendali

- Buka URL dengan Lighthouse/DevTools.
- Catat perangkat, jaringan, dan kondisi login.
- Periksa gambar utama, JavaScript, request, dan pergeseran layout.
- Bandingkan sebelum/sesudah satu perubahan.

::right::

#### Field: Pengguna Nyata

- Kumpulkan metrik melalui RUM yang dipilih.
- Lihat per route dan jenis perangkat.
- Aplikasi baru atau halaman privat mungkin belum memiliki data publik di PageSpeed Insights.
- Gunakan rentang waktu serta jumlah data yang cukup.

::bottom::

<BrutalCard v-click class="text-sm">
  Satu skor Lighthouse memberi petunjuk perbaikan. Kesimpulan pengalaman pengguna nyata membutuhkan data lapangan.
</BrutalCard>

<!--
RUM = Real User Monitoring. Lighthouse tidak mengukur INP pengguna nyata; TBT pada lab dapat membantu diagnosis tetapi bukan metrik yang sama.
PageSpeed Insights dapat menampilkan field data CrUX bila memenuhi syarat dan tersedia. Tidak adanya field data bukan bukti halaman sudah cepat atau lambat.
Terapkan optimasi sesuai temuan; data usulan pribadi harus tetap terisolasi per akun saat meninjau cache.
Sumber: https://web.dev/articles/lab-and-field-data-differences
Sumber: https://developer.chrome.com/docs/crux/methodology
-->

---
class: module-content
---

### Troubleshooting: Mulai dari Bukti yang Dekat

| Gejala                                    | Pemeriksaan pertama                                         |
| ----------------------------------------- | ----------------------------------------------------------- |
| Build gagal membuka `/data/...`           | Build command sudah memakai file sementara?                 |
| Start gagal: `no such table`              | Folder `drizzle/` tersedia dan migrasi menunjuk DB runtime? |
| Login atau mutasi mendapat `403`          | Domain HTTPS dan Origin sama dengan `BETTER_AUTH_URL`?      |
| Respons `500`                             | Error runtime pada waktu dan route yang sesuai?             |
| Usulan hilang setelah redeploy            | Volume terpasang dan path runtime konsisten?                |
| API lambat                                | Durasi request, query, disk, serta resource server?         |
| Halaman bergeser atau interaksi tersendat | Temuan Performance panel dan metrik browser?                |

<!--
Tabel berisi titik awal diagnosis, bukan daftar penyebab tunggal. Contoh no such table bisa juga berasal dari riwayat migrasi yang tidak lengkap.
Perubahan cache harus mempertahankan sesi dan isolasi akun. Cache Components bukan syarat deploy dan tidak diaktifkan hanya untuk mencoba menghilangkan gejala lambat.
Jika native addon better-sqlite3 gagal dimuat, periksa major Node serta hasil install/build di platform tujuan; jangan mengunggah node_modules dari OS laptop.
-->

---
class: module-content
---

### Jika Memilih Vercel

Alur Next.js di Vercel dapat dipakai setelah lapisan penyimpanan disesuaikan.

<v-clicks>

1. Pilih database eksternal yang sesuai dengan runtime dan kebutuhan aplikasi.
2. Sesuaikan driver Drizzle, schema/migrasi, dan adapter Better Auth; uji ulang modul 15.
3. Import repository, pilih branch rilis, lalu isi variabel untuk lingkungan yang dimaksud.
4. Pisahkan database preview dan production; periksa domain auth serta cookie HTTPS.
5. Deploy, jalankan smoke test, lalu pantau log dan metrik pada layanan yang dipilih.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  File SQLite lokal pada Vercel Functions tidak menyediakan penyimpanan permanen bersama yang dibutuhkan latihan ini. Penyesuaian database menjadi pekerjaan tersendiri.
</BrutalCard>

<!--
Bagian ini pengayaan pilihan hosting, bukan migrasi database tersembunyi di tengah langkah utama. Tidak menyatakan database eksternal selalu harus PostgreSQL; pilih driver/dialek sesuai layanan.
Vercel production deployment mengikuti production branch yang dikonfigurasi, umumnya main. Perubahan environment variable perlu deployment baru. Preview bukan otomatis database terpisah bila kredensial yang dipakai masih sama.
Sumber: https://vercel.com/kb/guide/is-sqlite-supported-in-vercel
Sumber: https://vercel.com/docs/deployments/environments
-->

---
class: module-content
---

### Checkpoint Akhir: Catat Bukti Rilis

Simpan catatan singkat bersama proyek, tanpa nilai secret.

<v-clicks>

- **Versi:** commit, versi Node/dependensi, dan hasil test/build.
- **Akses:** URL HTTPS serta hasil login, CRUD, logout, dan uji lintas akun.
- **Data:** mount/path database dan hasil pemeriksaan setelah restart/redeploy.
- **Pemulihan:** backup yang bisa dipulihkan serta versi aplikasi sebelumnya.
- **Pemantauan:** lokasi log, metrik awal, dan penerima notifikasi.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Sebelum melayani pengguna nyata, lengkapi kebutuhan auth dari modul 14 dan periksa advisory dependensi. Setelah perubahan versi, jalankan kembali pemeriksaan yang relevan.
</BrutalCard>

<!--
Hapus ramalan tanggal rilis patch dari materi lama. Versi pada lockfile dapat menua; peserta perlu memeriksa jalur dukungan dan advisory resmi pada waktu rilis.
Untuk latihan gunakan akun/data contoh. Kebutuhan verifikasi email, pemulihan akun, pembatasan penyalahgunaan, dan kebijakan akses mengikuti konteks aplikasi sebagaimana dibatasi pada Modul 14.
Sumber: https://nextjs.org/docs/app/guides/production
Sumber advisory Next.js: https://github.com/vercel/next.js/security/advisories
-->

---
class: module-content
---

### Berkas Latihan dan Rujukan

Diperiksa **10 Oktober 2026**.

- [Petunjuk deployment Toko Belajar](/examples/modul-16/README.md) dan [script migrasi](/examples/modul-16/scripts/migrate.mjs).
- [Next.js: self-hosting](https://nextjs.org/docs/app/guides/self-hosting) dan [environment variables](https://nextjs.org/docs/app/guides/environment-variables).
- [Railway: volume](https://docs.railway.com/volumes), [healthcheck](https://docs.railway.com/deployments/healthchecks), serta [backup](https://docs.railway.com/volumes/backups).
- [Railway: log aplikasi](https://docs.railway.com/observability/logs).
- [Vercel: batas SQLite lokal](https://vercel.com/kb/guide/is-sqlite-supported-in-vercel).
- [web.dev: Core Web Vitals](https://web.dev/articles/vitals) dan [data lab/field](https://web.dev/articles/lab-and-field-data-differences).

<!--
Berkas pendamping disalin ke proyek Next.js peserta, bukan dipasang sebagai backend slide. Harga/kuota platform tidak dibakukan di materi; periksa halaman paket sebelum membuat layanan.
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: fade
---

## 4 Hal Penting dari Modul 16

1. **Cocokkan hosting dengan aplikasi**: SQLite Toko Belajar memerlukan penyimpanan persisten.
2. **Rilis melalui langkah yang bisa diperiksa**: test, build, konfigurasi, migrasi, lalu smoke test.
3. **Buktikan data dan akses tetap benar**: periksa restart/redeploy, pemilik usulan, backup, dan pemulihan.
4. **Pantau setelah online**: baca log, ketersediaan, resource, dan pengalaman pengguna.

Toko Belajar sudah menjadi rangkaian latihan utuh: **membangun, menyimpan, melindungi, menguji, dan merilis aplikasi**.
