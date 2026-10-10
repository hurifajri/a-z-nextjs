---
layout: intro
badge: "MODUL 15"
badgeColor: "green"
level: 1
---

## 15. Menguji Fitur Usulan Buku

Mengubah pemeriksaan manual Toko Belajar menjadi pengujian otomatis: validasi, pengiriman form, respons API, dan akses pemilik usulan.

<!--
Prasyarat: proyek yang sama sampai Modul 14. SuggestionForm memakai RHF/Valibot dan TanStack Query, helper memanggil /api/suggestions, server memakai Drizzle dan sesi Better Auth.
Urutan: tentukan perilaku → unit test → integration test dengan MSW → pengenalan pengujian pada server asli. Deployment dan monitoring dilanjutkan di Modul 16.
Audit sumber: 10 Oktober 2026. Latihan memakai Node 24 LTS, Vitest 5, dan MSW 3; simpan lockfile hasil instalasi. Tidak perlu menaikkan versi Next.js proyek untuk mengikuti modul ini.
-->

---
class: module-content
---

### Dari “Sudah Dicoba” ke “Bisa Diperiksa Lagi”

Modul 14 sudah memeriksa login, sesi, dan kepemilikan usulan dengan dua akun.

<v-clicks>

- Setelah kode berubah, perilaku yang sebelumnya benar bisa rusak: ini **regresi**.
- Test menjalankan langkah tertentu lalu membandingkan hasil dengan harapan.
- Mulai dari risiko yang nyata: input hilang, status gagal dianggap sukses, atau data akun lain berubah.
- Test yang lulus memberi bukti untuk **skenario yang diperiksa**.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Target akhir: Antum dapat membaca test yang gagal, menemukan perilaku yang berubah, lalu memeriksa perbaikannya.
</BrutalCard>

<!--
Hindari janji bahwa testing menjamin aplikasi bebas bug. Diskusikan satu regresi pada fitur yang sudah dikenal peserta sebelum memperkenalkan nama alat.
-->

---
class: module-content
---

### Tentukan Perilaku sebelum Memilih Alat

Kontrak dari modul 09–14 menjadi acuan hasil yang benar.

| Perilaku Toko Belajar                              | Lingkup latihan                     |
| -------------------------------------------------- | ----------------------------------- |
| Judul di-trim; panjang judul dan alasan diperiksa  | Unit: schema Valibot                |
| Simpan berhasil → pesan tampil, form tambah kosong | Integration: form + helper + MSW    |
| API 500/401 → pesan sesuai, draf tetap ada         | Integration: respons simulasi       |
| DELETE 204 → selesai tanpa membaca JSON            | Unit helper dengan respons simulasi |
| Usulan tetap ada setelah reload; akun lain ditolak | Browser dan API pada server asli    |

<!--
POST/PATCH mengembalikan JSON id, title, reason. DELETE 204 tidak memiliki body. Setelah Modul 14, semua operasi membutuhkan sesi; mutasi juga memeriksa Origin.
Istilah unit/integration dapat berbeda antar tim. Jelaskan bagian apa yang nyata dan bagian apa yang disimulasikan, bukan memperdebatkan label.
-->

---
class: module-content
layout: two-cols
---

### Pilih Lingkup sesuai Risiko

Setiap lapisan memberikan bukti yang berbeda.

::left::

#### Pemeriksaan yang Cepat

- **TypeScript / ESLint:** tipe dan pola kode.
- **Unit test:** satu aturan atau helper kecil.
- **Integration test:** form, validasi, dan pengiriman bekerja bersama.

::right::

#### Pemeriksaan Alur Utuh

- **E2E:** interaksi di browser sampai ke server dan database.
- Membutuhkan aplikasi yang berjalan serta data test terpisah.
- Cocok untuk alur penting: masuk, simpan, dan baca ulang.

::bottom::

<BrutalCard v-click class="text-sm">
  Mulai dari aturan kecil, lalu tambah pengujian form. Gunakan server asli untuk membuktikan penyimpanan dan hak akses.
</BrutalCard>

<!--
Porsi test mengikuti risiko aplikasi. Tidak ada persentase unit/integration/E2E atau target coverage universal untuk latihan ini.
-->

---
class: module-content
---

### 1. Pasang Alat di Proyek Toko Belajar

Jalankan dari root **aplikasi Next.js latihan**. Gunakan Node 24 LTS yang sudah dipakai.

```bash
npm install -D vitest@5 @vitejs/plugin-react jsdom msw@3
npm install -D @testing-library/react @testing-library/dom
npm install -D @testing-library/jest-dom @testing-library/user-event
```

Tambahkan dua entri berikut ke `scripts` di `package.json`:

```json
"test": "vitest",
"test:run": "vitest run"
```

<v-clicks>

- **Vitest** menjalankan test; **jsdom** menyediakan lingkungan DOM di Node.
- **Testing Library** mencari elemen dan menjalankan interaksi pengguna.
- **MSW** menyediakan respons jaringan yang dapat kita kendalikan.

</v-clicks>

<!--
Potongan JSON adalah tambahan ke objek scripts yang sudah ada; pertahankan dev/build/start dan perhatikan koma.
Sumber: https://vitest.dev/guide/
Sumber: https://testing-library.com/docs/react-testing-library/intro/
Sumber: https://mswjs.io/docs/migrations/2.x-to-3.x
Vitest 5 memerlukan Node yang didukung; Node 24 LTS memenuhi persyaratan. Contoh import msw/http mengikuti MSW 3, berbeda dari contoh MSW 2 yang memakai root msw.
-->

---
class: module-content
---

### 2. Konfigurasi Vitest dan Alias Import

Buat **`vitest.config.mts`** di root aplikasi.

```ts {1-3|6-9|10-15|all}
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    environmentOptions: { jsdom: { url: "http://localhost:3000" } },
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
```

Alias `@/` mengikuti proyek sebelumnya. `include` menjaga test Playwright di folder `e2e/` dijalankan oleh alatnya sendiri.

<!--
URL jsdom menjadi acuan request relatif /api/suggestions ketika dicegat MSW. Ini bukan alamat server yang perlu dijalankan untuk Vitest.
Import API test ditulis eksplisit; globals tidak diaktifkan. File .mts memastikan konfigurasi dibaca sebagai ESM.
Sumber: https://nextjs.org/docs/app/guides/testing/vitest
Sumber: https://vitest.dev/config/environmentOptions
Sumber: https://vitest.dev/config/include
-->

---
class: module-content
---

### 3. Siapkan Matcher dan Pembersihan DOM

Buat **`vitest.setup.ts`**. MSW akan ditambahkan setelah unit test pertama berjalan.

```ts
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());
```

<v-clicks>

- Matcher adalah pemeriksaan seperti `toHaveValue` atau `toBeEnabled`.
- `cleanup` melepas komponen dari DOM setelah setiap test.
- Test berikutnya memulai dengan tampilan kosong.

</v-clicks>

<!--
Cleanup eksplisit karena globals Vitest tidak diaktifkan. Jangan mencampur setup Jest dan Vitest; gunakan entrypoint jest-dom/vitest.
Sumber: https://github.com/testing-library/jest-dom#with-vitest
Sumber: https://testing-library.com/docs/react-testing-library/api/#cleanup
-->

---
class: module-content
---

### 4. Unit Test Pertama: Input Dirapikan

Buat **`src/lib/book-suggestion-schema.test.ts`**. Pakai schema asli dari modul 09.

```ts {1-3|6-10|11-12|13-16|all}
import { expect, test } from "vitest";
import * as v from "valibot";
import { BookSuggestionSchema } from "./book-suggestion-schema";

test("merapikan judul dan alasan sebelum disimpan", () => {
  // Arrange: siapkan input.
  const input = {
    title: "  Belajar React  ",
    reason: "  Untuk latihan komponen.  ",
  };
  // Act: jalankan aturan aplikasi.
  const result = v.parse(BookSuggestionSchema, input);
  // Assert: periksa hasil yang diharapkan.
  expect(result).toEqual({
    title: "Belajar React",
    reason: "Untuk latihan komponen.",
  });
});
```

Jalankan **`npm run test:run`** → satu test lulus. Pola ini disebut **Arrange → Act → Assert**.

<!--
v.parse melempar error jika input tidak valid, sehingga test ikut gagal. Tidak perlu menyalin schema ke file test; kita ingin menguji aturan yang benar-benar dipakai aplikasi.
Sumber: https://valibot.dev/api/parse/
Sumber: https://vitest.dev/api/expect
-->

---
class: module-content
---

### Periksa Input Salah dan Nilai di Batas Aturan

**Tambahkan** ke file test schema yang sama. `test.each` menjalankan satu test per baris data.

```ts
test.each([
  ["judul kosong", { title: "   " }],
  ["judul pendek", { title: "ab" }],
  ["judul panjang", { title: "a".repeat(81) }],
  ["alasan pendek", { reason: "a".repeat(9) }],
  ["alasan panjang", { reason: "a".repeat(501) }],
])("menolak %s", (_name, invalid) => {
  const input = {
    title: "Belajar React",
    reason: "Untuk latihan.",
    ...invalid,
  };
  expect(v.safeParse(BookSuggestionSchema, input).success).toBe(false);
});

test.each([
  [3, 10],
  [80, 500],
])("menerima panjang %i dan %i", (title, reason) => {
  const input = { title: "a".repeat(title), reason: "a".repeat(reason) };
  expect(v.safeParse(BookSuggestionSchema, input).success).toBe(true);
});
```

Sekarang ada **8 test schema**. Batas valid ikut diuji agar aturan tidak menjadi terlalu ketat.

<!--
v.safeParse mengembalikan success untuk memeriksa penolakan tanpa try/catch. Spread invalid menimpa satu field pada contoh valid.
Sumber: https://valibot.dev/api/safeParse/
Sumber: https://vitest.dev/api/test#test-each
-->

---
class: module-content
---

### Red → Green: Pastikan Test Bisa Menangkap Regresi

Eksperimen sementara pada aturan `title` di schema aplikasi:

````md magic-move
```ts
// RED: hilangkan trim sementara; test input ber-spasi harus gagal.
title: v.pipe(
  v.string(),
  v.minLength(3, "Judul minimal 3 karakter."),
  v.maxLength(80, "Judul maksimal 80 karakter."),
),
```

```ts
// GREEN: pulihkan trim; jalankan kembali test yang sama.
title: v.pipe(
  v.string(),
  v.trim(),
  v.minLength(3, "Judul minimal 3 karakter."),
  v.maxLength(80, "Judul maksimal 80 karakter."),
),
```
````

<v-clicks>

- Baca nama test, nilai **expected**, dan nilai **received** pada kegagalan.
- Perbaiki implementasi berdasarkan kontrak yang disepakati.
- Akhiri eksperimen dengan schema dipulihkan dan seluruh test lulus.

</v-clicks>

<!--
Ini sengaja menyisipkan regresi pada latihan yang sebelumnya sudah benar. Tidak mengklaim keseluruhan proyek dibangun dengan TDD.
Tanpa trim, test normalisasi gagal dan judul tiga spasi salah diterima. Jangan mengubah expected untuk membenarkan regresi.
-->

---
class: module-content
---

### Lab: Prediksi Hasil Validasi Judul

Tekan **Run**, lalu perbaiki fungsi agar spasi tepi dibuang sebelum panjang diperiksa.

```ts {monaco-run} {autorun:false, height:'225px'}
const validTitle = (title: string) => title.length >= 3 && title.length <= 80;
const cases: [string, boolean][] = [
  ["   ", false],
  [" ab ", false],
  [" Buku ", true],
];
for (const [input, expected] of cases) {
  const actual = validTitle(input);
  console.log(
    `${JSON.stringify(input)}: ${actual === expected ? "PASS" : "FAIL"}`,
  );
}
```

**Awal:** FAIL, FAIL, PASS. **Target:** tiga PASS. Di proyek, aturan ini tetap memakai schema Valibot.

<!--
Durasi 3 menit. Lab memakai assertion JavaScript sederhana, bukan runner Vitest. Implementasi jawaban: ambil const length = title.trim().length; return length >= 3 && length <= 80.
Pertahankan input dan expected. Editor, tombol Run, dan output sengaja dipertahankan sebagai aktivitas interaktif.
-->

---
class: module-content
---

### 5. Kendalikan Respons API dengan MSW

Form tetap memakai hook dan helper aplikasi yang sudah ada.

<v-clicks>

1. Peserta mengisi **Judul buku** dan **Alasan usulan**.
2. Form memanggil `sendSuggestion` → `fetch("/api/suggestions")`.
3. MSW mencegat request dalam proses test dan memberikan respons yang kita tentukan.
4. Test memeriksa hasil yang terlihat di form.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Respons simulasi memudahkan kita mengulang kasus 201, 500, dan 401. Handler Next.js, sesi, dan database belum dijalankan dalam test ini.
</BrutalCard>

<!--
setupServer adalah interceptor pada proses Node, bukan server HTTP yang membuka port. Service worker hanya diperlukan untuk integrasi MSW di browser dengan setupWorker.
Untuk Vitest jsdom di modul ini tidak perlu msw init atau mockServiceWorker.js.
Sumber: https://mswjs.io/docs/quick-start
Sumber: https://vitest.dev/guide/mocking/requests
-->

---
class: module-content
---

### 6. Buat Respons Simulasi POST Usulan

Buat **`src/test/server.ts`**. Nama field dan status mengikuti kontrak modul 13–14.

```ts
import { http, HttpResponse } from "msw/http";
import { setupServer } from "msw/node";
import type { BookSuggestionValues } from "@/lib/book-suggestion-schema";

export const server = setupServer(
  http.post("http://localhost:3000/api/suggestions", async ({ request }) => {
    const body = (await request.json()) as BookSuggestionValues;
    return HttpResponse.json(
      { id: 1, title: body.title, reason: body.reason },
      { status: 201 },
    );
  }),
);
```

`id: 1` adalah data test. Handler ini mengembalikan isi request; ia tidak menyimpan data atau memeriksa login.

<!--
MSW 3 mengekspor http dan HttpResponse dari msw/http. Import setupServer tetap dari msw/node.
Type assertion untuk body hanya membantu TypeScript pada fixture. Ini bukan validasi runtime atau contoh handler production; endpoint asli tetap memakai Valibot.
URL handler sama dengan origin jsdom pada config. Hindari wildcard yang tanpa sengaja menangkap request ke layanan lain.
Sumber: https://mswjs.io/docs/migrations/2.x-to-3.x
-->

---
class: module-content
---

### 7. Nyalakan dan Bersihkan MSW

**Ganti isi `vitest.setup.ts`** dengan setup lengkap ini.

```ts {1-4|6|7-10|11|all}
import "@testing-library/jest-dom/vitest";
import { beforeAll, afterEach, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./src/test/server";

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
```

<v-clicks>

- Request tanpa handler ditolak agar test tidak diam-diam menghubungi layanan asli.
- `resetHandlers` membuang override kasus gagal setelah satu test selesai.
- Dengan demikian, respons 500 pada satu test tidak terbawa ke test berikutnya.

</v-clicks>

<!--
resetHandlers mengembalikan daftar handler awal; bukan pembersih database dan bukan reset semua state JavaScript milik fixture.
MSW 3 mengganti onUnhandledRequest menjadi onUnhandledFrame. Pilihan error juga mencakup koneksi jaringan tanpa handler; pada latihan ini yang dipakai adalah HTTP.
Sumber: https://mswjs.io/docs/migrations/2.x-to-3.x
Sumber: https://mswjs.io/docs/quick-start
-->

---
class: module-content
---

### 8. Siapkan Form beserta Provider-nya

Buat **`src/app/suggestions/SuggestionForm.test.tsx`** dengan import dan helper berikut.

```tsx
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw/http";
import { server } from "@/test/server";
import SuggestionForm from "./SuggestionForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

function setupForm() {
  const user = userEvent.setup();
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <SuggestionForm />
    </QueryClientProvider>,
  );
  return user;
}
```

<!--
Fresh QueryClient per test agar cache tidak bocor antar kasus. Modul 11 juga sudah mematikan retry mutasi pada hook; default test ini memperjelas maksud.
Mock next/navigation hanya menyediakan refresh yang dibutuhkan hook. Test ini tidak menjalankan refresh halaman server, dan tidak memeriksa jumlah panggilan hook.
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/testing
Sumber: https://vitest.dev/guide/mocking/modules
-->

---
class: module-content
---

### 9. Integration Test: Simpan Usulan Berhasil

**Tambahkan** di bawah `setupForm` pada file test form yang sama.

```tsx {2-4|5-7|9-13|all}
test("mengosongkan form tambah setelah berhasil", async () => {
  const user = setupForm();
  const title = screen.getByLabelText("Judul buku");
  const reason = screen.getByLabelText("Alasan usulan");
  await user.type(title, "Belajar React");
  await user.type(reason, "Untuk latihan komponen.");
  await user.click(screen.getByRole("button", { name: "Simpan usulan" }));

  expect(await screen.findByRole("status")).toHaveTextContent(
    "Usulan berhasil disimpan.",
  );
  expect(title).toHaveValue("");
  expect(reason).toHaveValue("");
  expect(screen.getByRole("button", { name: "Simpan usulan" })).toBeEnabled();
});
```

Form, field, schema, hook, dan helper memakai kode aplikasi. Respons HTTP berasal dari MSW.

<!--
Input diambil lewat label yang benar-benar terhubung ke kontrol dari Modul 09. Button tetap komponen shadcn Modul 12.
Status ditunggu karena validasi, fetch, dan pembaruan UI bersifat async. Daftar usulan server tidak dirender oleh test komponen ini.
Sumber: https://testing-library.com/docs/user-event/intro/
-->

---
class: module-content
---

### Pilih Cara Mencari Elemen yang Sesuai

Query membantu test membaca UI seperti pengguna.

| Query      | Kapan dipakai?                | Contoh                          |
| ---------- | ----------------------------- | ------------------------------- |
| `getBy…`   | Elemen harus ada sekarang     | Label input, tombol Simpan      |
| `findBy…`  | Tunggu elemen muncul          | Status setelah request selesai  |
| `queryBy…` | Periksa elemen yang tidak ada | Pesan sukses saat request gagal |

<v-clicks>

- Utamakan role dan nama yang terlihat, atau label field.
- Selalu `await` interaksi `userEvent` dan query `findBy…`.
- Tunggu kondisi yang diharapkan; jangan menambahkan jeda tetap agar test kebetulan lulus.

</v-clicks>

<!--
findBy mengulang pencarian sampai elemen ditemukan atau timeout. Untuk kondisi lain seperti input diaktifkan kembali, waitFor bisa dipakai jika memang belum selesai pada assertion sebelumnya.
Pada form ada beberapa role alert untuk field dan server. Gunakan findByText pesan spesifik agar tidak menganggap seluruh form hanya memiliki satu alert.
Sumber: https://testing-library.com/docs/queries/about/
-->

---
class: module-content
---

### 10. Saat API Gagal, Draf Harus Tetap Ada

**Tambahkan** ke file test form. Dua respons menghasilkan dua pesan yang berbeda.

```tsx
test.each([
  [500, "Penyimpanan belum terkonfirmasi. Input tetap ada."],
  [401, "Sesi berakhir. Masuk lagi di tab baru, lalu coba kembali."],
])("mempertahankan draf saat HTTP %i", async (status, message) => {
  server.use(
    http.post("http://localhost:3000/api/suggestions", () =>
      HttpResponse.json({ error: "Simulasi gagal" }, { status }),
    ),
  );
  const user = setupForm();
  await user.type(screen.getByLabelText("Judul buku"), "Belajar React");
  await user.type(screen.getByLabelText("Alasan usulan"), "Untuk latihan.");
  await user.click(screen.getByRole("button", { name: "Simpan usulan" }));

  expect(await screen.findByText(message)).toBeVisible();
  expect(screen.getByLabelText("Judul buku")).toHaveValue("Belajar React");
  expect(screen.getByLabelText("Alasan usulan")).toHaveValue("Untuk latihan.");
  expect(screen.getByRole("button", { name: "Simpan usulan" })).toBeEnabled();
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
```

<!--
server.use menimpa POST hanya selama test ini; setup mengembalikan handler awal setelah test selesai.
HTTP 500 berbeda dari kegagalan jaringan tanpa respons. Pengayaan: gunakan HttpResponse.error() dari msw/http untuk simulasi kegagalan jaringan dan periksa pesan umum serta draf yang tetap ada.
Test 401 membuktikan reaksi UI terhadap respons tersebut, bukan mekanisme validasi sesi Better Auth.
Sumber: https://mswjs.io/docs/quick-start
-->

---
class: module-content
---

### 11. DELETE 204 Tidak Memiliki JSON

Buat **`src/lib/suggestions.test.ts`** untuk menjaga kontrak helper hapus dari modul 11.

```ts
import { expect, test } from "vitest";
import { http, HttpResponse } from "msw/http";
import { server } from "@/test/server";
import { deleteSuggestion } from "./suggestions";

test("menghapus tanpa mencoba membaca body 204", async () => {
  server.use(
    http.delete(
      "http://localhost:3000/api/suggestions/1",
      () => new HttpResponse(null, { status: 204 }),
    ),
  );
  await expect(deleteSuggestion(1)).resolves.toBeUndefined();
});
```

<BrutalCard v-click class="mt-4 text-sm">
  Jika helper keliru memanggil <code>res.json()</code> setelah DELETE 204, test ini gagal meskipun penghapusan dianggap berhasil oleh HTTP.
</BrutalCard>

<!--
Helper asli mengembalikan Promise<void>; keberhasilan dibuktikan dengan resolves.toBeUndefined(). Tidak perlu membuat endpoint baru atau menyimpan data sungguhan untuk kasus kontrak respons ini.
Sumber: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/204
-->

---
class: module-content
---

### Checkpoint: Test Cepat Bisa Diulang

```bash
npm run test:run
```

| Berkas                           | Skenario                            | Jumlah |
| -------------------------------- | ----------------------------------- | ------ |
| `book-suggestion-schema.test.ts` | Normalisasi, penolakan, batas valid | 8      |
| `SuggestionForm.test.tsx`        | Simpan berhasil, 500, 401           | 3      |
| `suggestions.test.ts`            | DELETE 204 tanpa body               | 1      |

<v-clicks>

- Target latihan inti: **3 berkas, 12 test lulus**.
- `npm test` menjalankan mode watch saat Antum sedang mengubah kode.
- Jika gagal, mulai dari nama test dan pesan error; pastikan file aplikasi sudah sampai modul 14.

</v-clicks>

<!--
Angka di atas untuk contoh yang disalin persis, belum termasuk test tambahan peserta. Kegagalan resolusi alias atau import MSW adalah masalah setup; expected/received berbeda biasanya mengarah ke perilaku.
Tidak perlu next dev berjalan untuk suite Vitest ini. jsdom tidak membuktikan layout, tampilan responsif, atau perilaku browser secara penuh.
-->

---
class: module-content
---

### Cek Pemahaman: Apa yang Sudah Terbukti?

<LearningCheck
  question="Test form dengan respons MSW 201 sudah lulus. Apa kesimpulan yang tepat?"
  :options="[
    'Usulan pasti tersimpan di SQLite dan hanya dapat dibaca pemiliknya.',
    'Form bereaksi sesuai harapan terhadap respons 201 yang disimulasikan.',
    'Semua route aplikasi sudah aman dan siap dirilis.',
  ]"
  :answer="1"
  explanation="Handler API, database, dan sesi asli belum dijalankan. Penyimpanan dan pembatasan pemilik perlu diuji pada aplikasi yang berjalan."
/>

---
class: module-content
---

### Berikutnya: Uji Halaman dan Server Asli

`/suggestions` adalah **async Server Component** yang membaca sesi dan database.

<v-clicks>

- Vitest di latihan ini menguji schema, helper, dan Client Component.
- Gunakan **Playwright** untuk alur halaman server di browser asli.
- Uji akses lintas akun dengan request API ke server yang sama.
- Bagian berikut adalah latihan lanjutan setelah 12 test inti lulus.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Dua bukti berikutnya: usulan bertahan setelah reload, dan akun lain gagal mengubahnya meskipun mengetahui ID-nya.
</BrutalCard>

<!--
Per 10 Oktober 2026, panduan Next.js Vitest masih menyatakan async Server Components belum didukung dan menganjurkan E2E. Jangan mengimpor page.tsx async ke render RTL lalu menambahkan mock sampai semua dependensinya hilang.
Sumber: https://nextjs.org/docs/app/guides/testing/vitest
Sumber: https://nextjs.org/docs/app/guides/testing/playwright
-->

---
class: module-content
---

### 12. Pilih File Database untuk Proses Test

Pada **`src/db/index.ts`**, ganti baris pembuka database:

```ts
const sqlite = new Database(process.env.DATABASE_PATH ?? "./local.db");
```

Pada **`drizzle.config.ts`**, ganti nilai `dbCredentials.url`:

```ts
dbCredentials: { url: process.env.DATABASE_PATH ?? "./local.db" },
```

<v-clicks>

- Config Playwright memberikan `DATABASE_PATH` khusus ke migrasi dan server.
- Tanpa variabel tersebut, latihan lokal tetap memakai `./local.db`.
- Schema, folder migrasi `./drizzle`, dan pemeriksaan sesi tetap sama.
- Tambahkan `.e2e/`, `test-results/`, dan `playwright-report/` ke `.gitignore`.

</v-clicks>

<!--
Ini patch pada dua file dari Modul 11 dan 14. Pertahankan kedua schema Drizzle (suggestions dan auth-schema) dalam config yang sudah ada.
Jangan gunakan NEXT_PUBLIC_DATABASE_PATH. Tidak ada perintah menghapus local.db.
Migrasi yang sudah dihasilkan sampai Modul 14 harus ada dan dapat dijalankan dari database kosong. Jika migrasi gagal, perbaiki urutan SQL-nya; jangan mengabaikan kegagalan agar test berjalan.
-->

---
class: module-content
---

### 13. Jalankan Playwright dengan Konfigurasi Latihan

```bash
npm install -D @playwright/test
npx playwright install chromium
```

Salin berkas pendamping ke path yang sama di aplikasi:

| Berkas                                                                | Tugas                                           |
| --------------------------------------------------------------------- | ----------------------------------------------- |
| [playwright.config.ts](/examples/modul-15/playwright.config.ts)       | Port 3100, origin auth, database test, Chromium |
| [e2e/prepare-db.mjs](/examples/modul-15/e2e/prepare-db.mjs)           | Membuat folder test dan menjalankan migrasi     |
| [e2e/suggestions.spec.ts](/examples/modul-15/e2e/suggestions.spec.ts) | Dua test pada aplikasi asli                     |

Petunjuk lengkap: [README latihan Playwright](/examples/modul-15/README.md).

<!--
Berkas pendamping adalah konten latihan, bukan test untuk repository slide ini. Simpan isi file, bukan halaman HTML preview. Semua file ditempatkan relatif terhadap root aplikasi Next.js.
Konfigurasi memakai produksi lokal (build lalu start), port terpisah, reuseExistingServer false, dan database SQLite baru per run. Proses test tidak memakai server dev peserta yang sudah berjalan.
Sumber: https://playwright.dev/docs/test-webserver
-->

---
class: module-content
---

### Kenali Pengaturan Server Test

Cuplikan **`playwright.config.ts`** pendamping; unduh file utuh untuk menjalankannya.

```ts
const origin = "http://localhost:3100";
const databasePath = `./.e2e/${randomUUID()}.db`;

// Di dalam defineConfig:
webServer: {
  command: "node e2e/prepare-db.mjs && npm run build && npm run start -- --port 3100",
  url: `${origin}/login`,
  reuseExistingServer: false,
  timeout: 180_000,
  env: {
    DATABASE_PATH: databasePath,
    BETTER_AUTH_URL: origin,
    BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
  },
},
```

Origin request harus sama dengan `BETTER_AUTH_URL` agar mutasi lolos pemeriksaan modul 14.

<!--
Cuplikan config ini berisi bagian-bagian file, bukan modul TypeScript mandiri. File unduhan memuat import, use.baseURL, testDir, dan project Chromium.
webServer.env diwariskan oleh command beserta child process: migrate, build, start. Nama database unik menghasilkan database kosong setiap run tanpa menghapus data latihan local.db.
Port 3100 yang sudah dipakai membuat run berhenti; selesaikan proses yang memakai port tersebut sebelum mencoba lagi.
-->

---
class: module-content
---

### E2E: Usulan Tetap Ada setelah Reload

Bagian utama test browser pendamping, **setelah akun baru didaftarkan melalui UI**:

```ts
const title = `Belajar React ${randomUUID()}`;
await page.getByLabel("Judul buku", { exact: true }).fill(title);
await page.getByLabel("Alasan usulan", { exact: true }).fill("Untuk latihan.");
await page.getByRole("button", { name: "Simpan usulan", exact: true }).click();

const card = page.getByRole("listitem").filter({
  has: page.getByRole("heading", { name: title, exact: true }),
});
await expect(card).toBeVisible();
await page.reload();
await expect(card).toBeVisible();

await card.getByRole("button", { name: "Hapus", exact: true }).click();
await expect(card).toHaveCount(0);
await page.reload();
await expect(card).toHaveCount(0);
```

Form, HTTP, sesi, query database, dan refresh halaman berjalan tanpa MSW.

<!--
File lengkap memuat test(), import, dan helper pendaftaran melalui /login. Email unik membuat run tidak bergantung pada akun manual peserta.
Locator kartu dibatasi dengan judul unik, lalu tombol Hapus dicari di kartu itu. Jumlah seluruh usulan tidak diasumsikan selalu satu.
Reload memberi bukti pembacaan ulang dalam proses yang sama; ini belum membuktikan data bertahan saat instance deployment diganti. Topik penyimpanan deployment dibahas di Modul 16.
Sumber: https://playwright.dev/docs/locators
-->

---
class: module-content
---

### API Asli: Mengetahui ID Tidak Memberi Hak Akses

Test kedua memakai dua sesi terpisah: **Aisyah** sebagai pemilik dan **Hasan** sebagai akun lain.

| Langkah                           | Hasil yang diperiksa          |
| --------------------------------- | ----------------------------- |
| Request tanpa sesi membaca API    | `401`                         |
| Aisyah mengirim usulan yang valid | `201`; simpan ID dari respons |
| Hasan membaca daftar sendiri      | Usulan Aisyah tidak ada       |
| Hasan PATCH dan DELETE ID Aisyah  | Keduanya `404`                |
| Aisyah membaca kembali usulannya  | Judul dan alasan tetap sama   |
| Aisyah menghapus usulannya        | `204`; daftar kembali kosong  |

<BrutalCard v-click class="mt-3 text-sm">
  Kirim body PATCH yang valid dan Origin yang benar. Penolakan karena payload atau origin salah belum membuktikan pemeriksaan pemilik bekerja.
</BrutalCard>

<!--
Request context Playwright mempunyai cookie jar terpisah; Better Auth menerima signup lewat endpoint asli dan mengatur cookie melalui Set-Cookie.
APIRequestContext tidak otomatis menambahkan Origin seperti fetch browser. File pendamping memasangnya sesuai baseURL sehingga test mencapai pemeriksaan kepemilikan, bukan berhenti dengan 403.
Klasifikasi: ini integration test API pada server asli yang dijalankan Playwright; test sebelumnya adalah E2E browser. Keduanya melengkapi test komponen MSW.
Sumber: https://playwright.dev/docs/api-testing
Sumber: https://playwright.dev/docs/auth#testing-multiple-roles-together
-->

---
class: module-content
---

### Jalankan, Baca Hasil, Lalu Tambah Kasus

```bash
npm run test:run
npx playwright test
```

<v-clicks>

- Latihan inti: **12 test Vitest**. Berkas pendamping: **2 test Playwright**.
- Build, migrasi, atau login gagal → periksa log tahap itu dahulu.
- Selesai menjalankan Playwright: server otomatis berhenti; folder `.e2e/` boleh dibuang.
- Pengayaan: API menolak origin lain, sesi dicabut, edit usulan sendiri, atau form mengalami kegagalan jaringan.

</v-clicks>

<BrutalCard v-click class="mt-3 text-sm">
  Modul 16 melanjutkan aplikasi yang sudah diperiksa ini ke deployment dan pemantauan. Hasil test menjadi salah satu pemeriksaan sebelum rilis.
</BrutalCard>

<!--
Database, akun, dan sesi test seluruhnya berada di .e2e/*.db. Pertahankan folder bila perlu menyelidiki kegagalan; setelah proses berhenti, menghapus folder itu membersihkan fixture seluruh run.
Jangan menilai keberhasilan hanya dari exit code setup atau jumlah test yang ditemukan. Pastikan tidak ada test failed/skipped yang sengaja melewati skenario wajib.
-->

---
class: module-content
---

### Rujukan untuk Melanjutkan Latihan

Diperiksa **10 Oktober 2026**. Cocokkan contoh dengan versi paket pada lockfile proyek.

- [Next.js: Vitest dan batas async Server Components](https://nextjs.org/docs/app/guides/testing/vitest)
- [Vitest: menjalankan test dan mengatur proyek](https://vitest.dev/guide/)
- [MSW 3: perubahan import](https://mswjs.io/docs/migrations/2.x-to-3.x) dan [setup di Node](https://mswjs.io/docs/quick-start)
- [Testing Library: query elemen](https://testing-library.com/docs/queries/about/) dan [interaksi pengguna](https://testing-library.com/docs/user-event/intro/)
- [TanStack Query: isolasi client saat testing](https://tanstack.com/query/latest/docs/framework/react/guides/testing)
- [Playwright: server test](https://playwright.dev/docs/test-webserver) dan [pengujian API](https://playwright.dev/docs/api-testing)

<!--
Contoh menggunakan API publik. Sumber utama dipilih dari dokumentasi alat masing-masing; klaim ROI universal dan “testing menjamin bebas bug” tidak dijadikan materi.
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 4 Hal Penting dari Modul 15

1. **Mulai dari perilaku**: kontrak usulan buku menentukan expected hasil test.
2. **Uji kerja sama form**: label, validasi, pengiriman, pesan hasil, dan draf yang tetap ada.
3. **Kenali batas simulasi**: MSW mengendalikan respons; server asli membuktikan penyimpanan dan akses pemilik.
4. **Jaga kemandirian test**: bersihkan DOM dan handler, buat QueryClient serta data test terpisah.

Berikutnya: **menjalankan Toko Belajar di lingkungan deployment dan memantau perilakunya**.
