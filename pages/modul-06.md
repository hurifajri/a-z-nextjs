---
layout: intro
badge: "MODUL 06"
badgeColor: "purple"
level: 1
---

## 06. State Management Lanjutan: Context & Zustand

Mengatasi Prop Drilling & Callback Props, Mengenal Context API, Pilihan State (Context, Redux Toolkit, Zustand), serta Pola Pikir Engineer: Reinventing the Wheel vs Cargo-Culting.

<!--
Contoh bertanda fragment/sketsa memerlukan konteks komponen atau import. Hook dipanggil di dalam function component/custom hook; bukan pada module scope.
-->

---
class: module-content
---

### Dua Masalah Klasik: Prop Drilling & Callback Props

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
    <div class="font-black text-sm mb-1 text-red-600">🌪️ Callback Props</div>
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
class: module-content
---

### Solusi Bawaan: React Context API

Jalan Pintas Berbagi Data ke Seluruh Komponen Tanpa Prop Drilling

```tsx {1,3|5-11|13-14|all}
"use client";
import { createContext, useContext, useState } from "react";

type ThemeValue = { theme: "light" | "dark"; toggle: () => void };
const ThemeContext = createContext<ThemeValue | null>(null);

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
export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("Wrap with ThemeProvider");
  return value;
}
```

---
class: module-content
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
class: module-content
layout: two-cols
---

### Memilih State Management

::left::

#### Mulai dari Pemilik Data

- **useState / useReducer:** state lokal dan transisi yang saling terkait.
- **Context:** distribusi nilai ke subtree; state tetap dikelola provider.
- **URL:** filter/search yang perlu bookmark dan back/forward.
- **TanStack Query:** cache data server; lihat Modul 08.

::right::

#### Library Global State

- **Redux Toolkit:** pendekatan Redux yang direkomendasikan; tooling dan pola tim terstruktur.
- **Zustand:** API ringkas dengan subscription berbasis selector.
- **Jotai:** komposisi state berbasis atom.
- Pilih berdasarkan kompleksitas, integrasi SSR, dan kebutuhan debugging.

<!--
Sumber: https://redux.js.org/introduction/why-rtk-is-redux-today
Context consumers diperbarui ketika value berubah; bukan semua node di tree.
Callback props bukan callback hell async. Composition sering cukup sebelum global store.
-->

---
class: module-content
---

### Berkenalan dengan Zustand

State Management Modern dengan Nol Boilerplate

```bash
npm install zustand
```

````md magic-move
```tsx
// Contoh store state UI lokal; jangan baca/tulis singleton ini dari server
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
// Client UI dengan nilai awal deterministik; lihat catatan SSR di bawah
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
class: module-content
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
class: module-content
---

### Batas Store di Next.js

- Store yang berisi data request harus dibuat **per request/provider instance**, bukan singleton server.
- Server Component membaca database/session, bukan global store Zustand.
- Inisialisasi SSR dan render client pertama harus sama agar hydration cocok.
- `persist` ke localStorage memerlukan penanganan hydration; jangan simpan token sesi di sana.
- Selector membantu subscription; ukur render sebelum menambah memoization.

**Latihan:** tema memakai Context, modal memakai state lokal, filter memakai URL. Jelaskan pemilik masing-masing data.

<!--
Sumber: https://zustand.docs.pmnd.rs/learn/guides/nextjs
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 06

1. **Context Mengatasi Prop Drilling**: Gunakan Context API untuk data global yang jarang berubah seperti tema, data profil user, dan bahasa.
2. **Zustand untuk State Reaktif**: Saat aplikasi membutuhkan global state dengan pembaruan frekuensi tinggi, Zustand dapat menjadi pilihan dengan selector; Redux Toolkit juga tetap relevan.
3. **Pahami Masalah Sebelum Memilih Tools**: Hindari _Reinventing the Wheel_ dengan memanfaatkan karya open source, namun jauhi _Cargo-Culting_ dengan tidak memasang library tanpa alasan yang jelas.
