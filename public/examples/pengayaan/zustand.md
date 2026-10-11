# Lab setelah Modul 06: Zustand sebagai alternatif Context

Lab pilihan; tidak menjadi prasyarat modul berikutnya. Kerjakan pada salinan checkpoint agar jalur inti tetap tersedia.

### Alternatif: Store dengan Zustand

Zustand menyediakan tempat state dan tindakan, lalu komponen memilih nilai yang ingin diikuti melalui **selector**.

Jalankan di proyek Toko Belajar Antum:

```bash
npm install zustand
```

1. Buat fungsi pembuat store.
2. Simpan satu store untuk masing-masing instance provider.
3. Baca bagian state yang diperlukan dari komponen client.

Bagian berikut <strong>mengganti versi Context sebelumnya</strong>. Nama CartProvider tetap; hook useCart berubah menjadi menerima selector. Selesaikan seluruh langkah sebelum mencoba lagi.

### Zustand 1: Buat Fungsi Pembuat Store

Buat `src/stores/cart.ts`. Fungsi ini menghasilkan store baru setiap kali dipanggil.

```ts
import { createStore } from "zustand/vanilla";

export type CartState = {
  totalItems: number;
  addItems: (amount: number) => void;
  reset: () => void;
};

export function createCartStore() {
  return createStore<CartState>()((set) => ({
    totalItems: 0,
    addItems: (amount) => set((s) => ({ totalItems: s.totalItems + amount })),
    reset: () => set({ totalItems: 0 }),
  }));
}

export type CartStore = ReturnType<typeof createCartStore>;
```

File ini mengekspor <strong>fungsi pembuat</strong>, bukan satu instance bersama. Provider akan memanggilnya untuk membuat store miliknya.

### Zustand 2: Baca Store melalui Selector

Ganti seluruh isi `src/components/cart/cart-context.ts` dengan versi ini.

```ts
"use client";
import { createContext, useContext } from "react";
import { useStore } from "zustand";
import type { CartState, CartStore } from "@/stores/cart";

export const CartContext = createContext<CartStore | null>(null);

export function useCart<T>(selector: (state: CartState) => T) {
  const store = useContext(CartContext);
  if (store === null) throw new Error("CartProvider belum dipasang");
  return useStore(store, selector);
}
```

- Context sekarang membawa **instance store**.
- `useStore` membaca dan mengikuti hasil selector.
- `T` mewakili tipe hasil pilihan, misalnya angka atau fungsi.

### Zustand 3: Simpan Store pada Provider

Ganti seluruh isi `src/components/cart/CartProvider.tsx`. Posisi provider di layout tetap sama.

```tsx
"use client";
import { useState, type ReactNode } from "react";
import { createCartStore } from "@/stores/cart";
import { CartContext } from "./cart-context";

type Props = { children: ReactNode };

export default function CartProvider({ children }: Props) {
  const [store] = useState(() => createCartStore());

  return <CartContext value={store}>{children}</CartContext>;
}
```

- Inisialisasi lazy mempertahankan store selama instance provider hidup.
- Nilai awal `totalItems: 0` sama pada server dan render awal browser.
- Server Component menampilkan provider; komponen client yang membaca dan memperbarui store.

### Zustand 4: Pilih Nilai di Setiap Pemakai

Perbarui cara membaca state pada `CartLink.tsx`.

Sebelumnya, hook membaca seluruh value Context:

```tsx
"use client";
import Link from "next/link";
import { useCart } from "./cart-context";

export default function CartLink() {
  const { totalItems } = useCart();
  return <Link href="/cart">Keranjang ({totalItems})</Link>;
}
```

Sekarang, selector membaca `totalItems` dari store:

```tsx
"use client";
import Link from "next/link";
import { useCart } from "./cart-context";

export default function CartLink() {
  const totalItems = useCart((s) => s.totalItems);
  return <Link href="/cart">Keranjang ({totalItems})</Link>;
}
```

Ganti juga baris hook **di dalam fungsi** kedua komponen berikut:

| File              | Pembacaan baru                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| `AddToCart.tsx`   | `const addItems = useCart((s) => s.addItems);`                                                  |
| `CartSummary.tsx` | `const totalItems = useCart((s) => s.totalItems);`<br/>`const reset = useCart((s) => s.reset);` |

### Apa yang Berubah saat Nilai Diperbarui?

Keduanya bisa memenuhi latihan. Cara berlangganan nilainya berbeda.

#### Versi Context

- `useState` provider menyimpan total.
- `useCart()` membaca seluruh value Context.
- Value yang berubah memperbarui komponen pembacanya.
- Provider baru berarti state tersendiri.

#### Versi Zustand

- Store menyimpan total dan tindakan.
- Selector memilih nilai yang diikuti.
- Perubahan hasil selector memicu pembaruan langganan.
- Store dibuat terpisah per instance provider.

Selector tidak menjamin komponen hanya pernah render karena store. Props, state lokal, atau parent juga dapat menyebabkan render. Ukur dahulu sebelum menambah optimasi.

### Sumber dan Bacaan Lanjutan

Dokumentasi resmi yang diperiksa pada **8 Oktober 2026**.

#### Context dan Next.js

- [React: berbagi data dengan Context](https://react.dev/learn/passing-data-deeply-with-context)
- [React: createContext dan provider](https://react.dev/reference/react/createContext)
- [React: useContext dan pembaruan nilai](https://react.dev/reference/react/useContext)
- [Next.js: provider dalam App Router](https://nextjs.org/docs/app/getting-started/server-and-client-components#context-providers)
- [Next.js: layout dan navigasi](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

#### Zustand

- [Pengantar Zustand](https://zustand.docs.pmnd.rs/learn/getting-started/introduction)
- [Panduan penggunaan dengan Next.js](https://zustand.docs.pmnd.rs/learn/guides/nextjs)
- [createStore](https://zustand.docs.pmnd.rs/reference/apis/create-store)
- [useStore dan selector](https://zustand.docs.pmnd.rs/reference/hooks/use-store)
- [Inisialisasi store melalui provider](https://zustand.docs.pmnd.rs/learn/guides/initialize-state-with-props)
