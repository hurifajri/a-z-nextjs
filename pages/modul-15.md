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
// ❌ FUNCTION WITHOUT TESTING: Looks harmless at first glance...
export function calculateTotal(price: number, discountPercentage: number) {
  // Developer mistypes operator or precedence!
  return price - price * discountPercentage; // If discount is 20%, assumes discountPercentage = 20 (not 0.2)!
}

// When invoked: calculateTotal(100, 20)
// Result: 100 - 2,000 = -1,900 (Customer gets credited money!) 😱
```

```tsx
// ✅ WITH AUTOMATED TESTING: Caught in milliseconds before deployment!
import { describe, it, expect } from "vitest";
import { calculateTotal } from "./transactions";

describe("calculateTotal", () => {
  it("correctly calculates a 20% discount", () => {
    const total = calculateTotal(100, 0.2);
    // Any regression fails immediately before releasing to production!
    expect(total).toBe(80);
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
  <div class="p-2 border-2 border-brutal-black rounded bg-brutal-white">
    <strong>1. Static Analysis</strong>: Menangkap salah ketik & tipe data via TypeScript.
  </div>
  <div class="p-2 border-2 border-brutal-black rounded bg-brutal-white">
    <strong>2. Unit Tests</strong>: Menguji fungsi murni / kalkulasi matematika terisolasi.
  </div>
  <div class="p-2 border-2 border-brutal-black rounded bg-yellow-100 font-bold shadow-brutal-sm">
    <strong>3. Integration Tests</strong>: Menguji beberapa komponen bekerja sama (Form + Tombol + Validasi + Tampilan).
  </div>
  <div class="p-2 border-2 border-brutal-black rounded bg-brutal-white">
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
  it("increments count when button is clicked", async () => {
    // 1. ARRANGE: Render component to virtual DOM
    const user = userEvent.setup();
    render(<Counter />);

    // 2. ACT: Perform interaction like a real user
    const button = screen.getByRole("button", { name: /increment/i });
    await user.click(button);

    // 3. ASSERT: Verify outcome matches expectations
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
import { formatCurrency } from "./format";

test("formatCurrency formats number correctly", () => {
  expect(formatCurrency(50000)).toBe("$50.00");
});
```

- Cepat dieksekusi
- Bagus untuk kalkulasi matematika & regex

::right::

#### 🧩 Integration Test (Bekerja Sama)

Menguji alur interaksi pengguna yang utuh:

```tsx
test("User completes registration form and sees success message", async () => {
  const user = userEvent.setup();
  render(<RegistrationForm />);

  await user.type(screen.getByLabelText("Full Name"), "John Doe");
  await user.type(screen.getByLabelText("Email"), "john@example.com");
  await user.click(screen.getByRole("button", { name: /register/i }));

  expect(
    await screen.findByText("Registration Successful!"),
  ).toBeInTheDocument();
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
// 1. Define Mock Handlers with MSW
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://api.example.com/products", () => {
    return HttpResponse.json([{ id: 1, name: "Next.js Handbook", price: 39 }]);
  }),
];
```

```tsx
// 2. Start Mock Server in Test Environment
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

// In vitest.setup.ts:
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

```tsx
// 3. Components are tested without knowing the API is mocked!
test("Renders product list from backend", async () => {
  render(<ProductList />);

  // Data from MSW mock automatically renders in the interface!
  expect(await screen.findByText("Next.js Handbook")).toBeInTheDocument();
});
```
````

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 15

1. **Testing Mencegah Kerugian Nyata**: Pengujian otomatis menangkap regresi dan bug logika fatal sebelum kode sampai ke tangan pengguna.
2. **Fokus pada Integration Test (Testing Trophy)**: Uji bagaimana komponen saling berinteraksi selayaknya pengguna nyata menggunakan aplikasi Antum.
3. **MSW untuk Pengujian API Realistis**: Menggunakan Mock Service Worker mencegat lalu lintas jaringan di layer network asli tanpa merusak kode internal aplikasi.
