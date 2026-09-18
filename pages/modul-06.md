---
layout: intro
badge: "MODUL 06"
badgeColor: "purple"
level: 1
---

## 06. State Management Lanjutan: Context & Zustand

Mengatasi Prop Drilling & Callback Hell, Mengenal Context API, Evolusi State (Redux → Context → Zustand), serta Pola Pikir Engineer: Reinventing the Wheel vs Cargo-Culting.

---

### Dua Masalah Klasik: Prop Drilling & Callback Hell

Ketika Aplikasi Membesar dan Komponen Semakin Bersarang

<div class="grid grid-cols-2 gap-4 mt-2">
  <BrutalCard class="text-xs" v-click>
    <div class="font-black text-sm mb-1 text-red-600">📉 Prop Drilling</div>
    <p class="text-gray-600 mb-2">Melempar data melewati banyak level komponen yang sebenarnya tidak membutuhkannya.</p>
    <div class="bg-gray-100 p-1.5 rounded font-mono text-xs leading-relaxed">
      App (punya data user)<br/>
      └─ Header (cuma numpang lewat)<br/>
      &nbsp;&nbsp;&nbsp;└─ Nav (masih numpang)<br/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─ UserAvatar (akhirnya dipakai!)
    </div>
  </BrutalCard>

  <BrutalCard class="text-xs" v-click>
    <div class="font-black text-sm mb-1 text-red-600">🌪️ Callback Hell</div>
    <p class="text-gray-600 mb-2">Melempar fungsi update/setter dari komponen terbawah kembali ke atas melalui banyak tingkatan.</p>
    <div class="bg-gray-100 p-1.5 rounded font-mono text-xs leading-relaxed">
      &lt;Page onUpdate={...}&gt;<br/>
      &nbsp;&nbsp;&lt;Table onUpdate={onUpdate}&gt;<br/>
      &nbsp;&nbsp;&nbsp;&nbsp;&lt;Row onUpdate={onUpdate}&gt;<br/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;Button onClick={onUpdate} /&gt;
    </div>
  </BrutalCard>
</div>

<BrutalCard v-click class="mt-3 bg-yellow-100 text-xs text-center">
  😵 Jika salah satu nama props diubah di tengah jalan, seluruh rantai komponen akan patah dan error!
</BrutalCard>

---

### Solusi Bawaan: React Context API

Jalan Pintas Berbagi Data ke Seluruh Komponen Tanpa Prop Drilling

<v-clicks>

- **`createContext`** — Membuat "gudang data" global.
- **`Provider`** — Komponen pembungkus yang memancarkan data ke seluruh anak di bawahnya.
- **`useContext`** — Hook untuk mengambil data langsung dari gudang di komponen manapun!

</v-clicks>

```tsx {1,3|5-11|13-14|all}
"use client";
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext<"light" | "dark">("light");

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Developer-friendly custom hook
export const useTheme = () => useContext(ThemeContext);
```

---

### Dari Prop Drilling ke Context

Lihat Bagaimana Kode Menjadi Jauh Lebih Rapi dan Terpelihara!

````md magic-move
```tsx
// ❌ BEFORE: Prop Drilling — user prop travels down 4 levels
function App() {
  const [user] = useState({ name: "John Doe" });
  return <Header user={user} />;
}
function Header({ user }: { user: { name: string } }) {
  return <Nav user={user} />;
}
function Nav({ user }: { user: { name: string } }) {
  return <Profile user={user} />;
}
function Profile({ user }: { user: { name: string } }) {
  return <div>Hello, {user.name}</div>;
}
```

```tsx
// ✅ AFTER: Context — consume directly where needed!
function App() {
  return (
    <AuthProvider>
      <Header />
    </AuthProvider>
  );
}
function Header() {
  return <Nav />; /* No props passed! */
}
function Nav() {
  return <Profile />; /* No props passed! */
}
function Profile() {
  const { user } = useAuth(); /* Consume directly from store! */
  return <div>Hello, {user.name}</div>;
}
```
````

---
layout: two-cols
---

### Evolusi State Management di Dunia React

Bagaimana Komunitas Menemukan Cara Terbaik Mengelola State

::left::

#### 📜 1. Era Redux (Masa Lalu)

- Pernah menjadi standar wajib di industri
- **Masalah**: _Boilerplate_ raksasa! Untuk satu toggle boolean sederhana butuh _Action Types, Action Creators, Reducers, Dispatchers, dan Store config_.
- Terlalu berat dan melelahkan untuk proyek modern.

#### 📦 2. Era React Context (Solusi Bawaan)

- Tidak perlu install library eksternal
- **Kelemahan**: Masalah performa re-render. Jika ada 1 data di context berubah, **semua komponen konsumen ikut re-render**.

::right::

#### ⚡ 3. Era Zustand (Standar Modern)

- 🪶 Super ringan (< 1 kB)
- 🚀 **Tanpa Provider**: Tidak perlu membungkus `<App>` dengan berlapis-lapis `<Provider>`.
- 🎯 **Selector-Based**: Hanya me-re-render komponen yang benar-benar menggunakan field tersebut!
- 🔌 Bisa diakses di luar komponen React (di helper utility atau API interceptor).

<BrutalCard v-click class="mt-2 text-xs">
  💡 Pilihan lain di ekosistem: <strong>Jotai / Recoil</strong> (berbasis <em>Atomic state</em>).
</BrutalCard>

---

### Berkenalan dengan Zustand

State Management Modern dengan Nol Boilerplate

```bash
npm install zustand
```

````md magic-move
```tsx
// 1. Create a centralized store (under 10 lines!)
import { create } from "zustand";

interface CartStore {
  totalItems: number;
  addItem: () => void;
  resetCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  totalItems: 0,
  addItem: () => set((state) => ({ totalItems: state.totalItems + 1 })),
  resetCart: () => set({ totalItems: 0 }),
}));
```

```tsx
// 2. Use in any component — NO PROVIDER NEEDED!
"use client";
import { useCartStore } from "@/stores/cart";

export default function BuyButton() {
  // This component ONLY re-renders when totalItems changes
  const totalItems = useCartStore((state) => state.totalItems);
  const addItem = useCartStore((state) => state.addItem);

  return <button onClick={addItem}>Cart: {totalItems} items</button>;
}
```
````

---
layout: two-cols
---

### Pola Pikir: Reinventing the Wheel vs Cargo-Culting

Keseimbangan Bijak Seorang Software Engineer

::left::

#### 🚫 Reinventing the Wheel

_Membuat roda dari awal lagi padahal roda bundar sudah tersedia._

- **Gejala**: Memaksa membuat sistem global state rumit atau event bus manual dengan 500 baris kode sendiri.
- **Dampak**: Penuh bug tersembunyi, boros waktu, dan sulit dipahami oleh programmer lain di tim.
- **Prinsip**: Jika masalah umum sudah diselesaikan dengan matang oleh komunitas (misal: Zustand), **manfaatkanlah**.

::right::

#### 🚫 Cargo-Culting

_Meniru kebiasaan tanpa memahami alasan sebenarnya._

- **Gejala**: Aplikasi baru punya 2 halaman form, tapi langsung install Redux Toolkit, Redux Saga, dan puluhan library lain "karena tutorial bilang begitu".
- **Dampak**: Proyek jadi lambat, bundle membengkak, dan kompleksitas kode meledak tanpa alasan.
- **Prinsip**: Mulailah dari yang paling sederhana (`useState`). Tambahkan library **hanya ketika Antum benar-benar merasakan masalahnya**.

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 06

1. **Context Mengatasi Prop Drilling**: Gunakan Context API untuk data global yang jarang berubah seperti tema, data profil user, dan bahasa.
2. **Zustand untuk State Reaktif**: Saat aplikasi membutuhkan global state dengan pembaruan frekuensi tinggi, Zustand adalah standar modern yang ringan, cepat, dan minim boilerplate.
3. **Pahami Masalah Sebelum Memilih Tools**: Hindari _Reinventing the Wheel_ dengan memanfaatkan karya open source, namun jauhi _Cargo-Culting_ dengan tidak memasang library tanpa alasan yang jelas.
