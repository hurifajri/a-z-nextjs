---
layout: intro
badge: "MODUL 15"
badgeColor: "green"
level: 1
---

## 15. Testing: Unit & Integration Testing (MSW)

Menjamin Kualitas Kode dengan Testing Trophy, Menguji Komponen Klien, Menulis Integration Test yang Bernilai Tinggi, serta Mocking API dengan MSW.

---

### Kenapa Testing Sangat Penting?

Sebuah Contoh Bug Sederhana yang Bisa Merugikan Bisnis Jutaan Rupiah

````md magic-move
```tsx
// ❌ FUNGSI TANPA TESTING: Kelihatannya baik-baik saja...
export function hitungTotal(harga: number, diskonPersen: number) {
  // Developer salah ketik tanda kurung atau operator!
  return harga - harga * diskonPersen; // Jika diskon 20%, dikira diskonPersen = 20 (bukan 0.2)!
}

// Saat dipanggil: hitungTotal(100_000, 20)
// Hasilnya: 100.000 - 2.000.000 = -1.900.000 (Pelanggan malah dapat uang!) 😱
```

```tsx
// ✅ DENGAN TESTING OTOMATIS: Tertangkap dalam hitungan milidetik sebelum deploy!
import { describe, it, expect } from "vitest";
import { hitungTotal } from "./transaksi";

describe("hitungTotal", () => {
  it("menghitung diskon 20% dengan benar", () => {
    const total = hitungTotal(100_000, 20);
    // Test langsung GAGAL! Bug dicegah sebelum rilis ke pengguna nyata.
    expect(total).toBe(80_000);
  });
});
```
````

---
layout: two-cols
---

### Strategi Pengujian: The Testing Trophy

Pola Modern yang Direkomendasikan di Ekosistem React (Kent C. Dodds)

::left::

```text
       🏆 End-to-End (E2E)
      ████████ Integration (ROI Terbesar!)
     ████ Unit Tests
    ██ Static Analysis (TypeScript, ESLint)
```

<p class="text-xs text-gray-700 mt-2">
  Piramida lama terlalu fokus pada Unit Test mikro. <strong>Testing Trophy</strong> menekankan <strong>Integration Test</strong> karena paling mirip dengan cara pengguna memakai aplikasi!
</p>

::right::

<div class="space-y-2 text-xs">
  <div class="p-2 border-2 border-black rounded bg-white">
    <strong>1. Static Analysis</strong>: Menangkap salah ketik & tipe data via TypeScript.
  </div>
  <div class="p-2 border-2 border-black rounded bg-white">
    <strong>2. Unit Tests</strong>: Menguji fungsi murni / kalkulasi matematika terisolasi.
  </div>
  <div class="p-2 border-2 border-black rounded bg-yellow-100 font-bold shadow-[2px_2px_0px_#000]">
    <strong>3. Integration Tests</strong>: Menguji beberapa komponen bekerja sama (Form + Tombol + Validasi + Tampilan).
  </div>
  <div class="p-2 border-2 border-black rounded bg-white">
    <strong>4. E2E Tests</strong>: Simulasi alur penuh di browser asli (Playwright/Cypress).
  </div>
</div>

---

### Setup Tools: Vitest & React Testing Library

Tools Pengujian Standar Modern yang Cepat dan Ramah

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

```tsx
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
  },
});
```

```tsx
// vitest.setup.ts
import "@testing-library/jest-dom";
```

---

### Pola AAA: Arrange → Act → Assert

Struktur Universal dalam Menulis Setiap Skenario Pengujian

```tsx {1-4|6-7|9-10|12-13|all}
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counter from "./Counter";

describe("Counter", () => {
  it("menambah angka saat tombol diklik", async () => {
    // 1. ARRANGE: Siapkan komponen ke layar virtual
    const user = userEvent.setup();
    render(<Counter />);

    // 2. ACT: Lakukan interaksi selayaknya pengguna nyata
    const tombol = screen.getByRole("button", { name: /tambah/i });
    await user.click(tombol);

    // 3. ASSERT: Periksa apakah hasilnya sesuai harapan
    expect(screen.getByText("Total: 1")).toBeInTheDocument();
  });
});
```

---
layout: two-cols
---

### Unit Test vs Integration Test

Perbedaan Lingkup Pengujian dalam Praktik

::left::

#### 🔬 Unit Test (Terisolasi)

Menguji satu fungsi kecil tanpa melibatkan UI:

```tsx
import { formatRupiah } from "./format";

test("formatRupiah memformat angka dengan benar", () => {
  expect(formatRupiah(50000)).toBe("Rp 50.000");
});
```

- Cepat dieksekusi
- Bagus untuk kalkulasi matematika & regex

::right::

#### 🧩 Integration Test (Bekerja Sama)

Menguji alur interaksi pengguna yang utuh:

```tsx
test("Pengguna mengisi form dan melihat pesan sukses", async () => {
  const user = userEvent.setup();
  render(<FormPendaftaran />);

  await user.type(screen.getByLabelText("Nama"), "Ahmad");
  await user.type(screen.getByLabelText("Email"), "ahmad@mail.com");
  await user.click(screen.getByRole("button", { name: /daftar/i }));

  expect(await screen.findByText("Pendaftaran Berhasil!")).toBeInTheDocument();
});
```

---

### Mocking API Nyata dengan MSW (Mock Service Worker)

Jangan Mock Fungsi `fetch()` Secara Manual — Gunakan Mock di Network Layer!

```bash
npm install -D msw
```

````md magic-move
```tsx
// 1. Definisikan Mock Handler dengan MSW
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://api.example.com/products", () => {
    return HttpResponse.json([
      { id: 1, name: "Buku React Next.js", price: 120_000 },
    ]);
  }),
];
```

```tsx
// 2. Jalankan Server Mock di Lingkungan Test
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

// Di vitest.setup.ts:
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

```tsx
// 3. Komponen Antum di-test tanpa tahu kalau API sedang di-mock!
test("Menampilkan daftar produk dari backend", async () => {
  render(<ProductList />);

  // Data dari mock MSW akan otomatis muncul di antarmuka!
  expect(await screen.findByText("Buku React Next.js")).toBeInTheDocument();
});
```
````

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
---

## 3 Hal Penting dari Modul 15

1. **Testing Mencegah Kerugian Nyata**: Pengujian otomatis menangkap regresi dan bug logika fatal sebelum kode sampai ke tangan pengguna.
2. **Fokus pada Integration Test (Testing Trophy)**: Uji bagaimana komponen saling berinteraksi selayaknya pengguna nyata menggunakan aplikasi Antum.
3. **MSW untuk Pengujian API Realistis**: Menggunakan Mock Service Worker mencegat lalu lintas jaringan di layer network asli tanpa merusak kode internal aplikasi.
