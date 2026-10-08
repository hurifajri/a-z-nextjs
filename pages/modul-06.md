---
layout: intro
badge: "MODUL 06"
badgeColor: "purple"
level: 1
---

## 06. State Bersama: Context & Zustand

Lanjutkan Toko Belajar: masukkan jumlah pilihan ke keranjang, tampilkan total di header, lalu baca total yang sama di halaman keranjang.

<!--
Bekal: BookQuantity menyimpan quantity lokal; BookControls dan BookSummary menerima props dari Modul 05. Navbar dan Link berasal dari Modul 03.
Target akhir: peserta menentukan cakupan state, memasang satu provider bersama, membaca serta memperbarui state lewat Context, lalu mengenali alternatif Zustand dengan selector.
Durasi target 75–100 menit: Context dan praktik 40–55 menit, alternatif Zustand 25–30 menit, verifikasi serta diskusi 10–15 menit. Bagian Zustand dapat menjadi demonstrasi pengajar setelah latihan Context berjalan.
Keranjang latihan hanya menyimpan total eksemplar. Belum ada rincian per ID, validasi stok/harga, penyimpanan permanen, atau transaksi.
Contoh mengikuti React 19 pada Next.js 16 acuan kelas Modul 01. Zustand memakai API v5 yang didokumentasikan saat audit; perintah instalasi dijalankan di proyek Next.js peserta.
Path memakai src/ dan alias @/* → src/*. Bila products berada dalam route group, sesuaikan lokasi BookQuantity; komponen bersama tetap di src/components/cart/.
Versi Context menjadi latihan utama. Versi Zustand mengganti beberapa file yang sama; jangan memasang dua implementasi sekaligus.
Berhenti pada state UI bersama. Fetch data, strategi rendering, cache, loading, dan error dimulai di Modul 07.
Audit sumber daring: 8 Oktober 2026.
-->

---
class: module-content
layout: two-cols
---

### Dari Dua Anak ke Beberapa Bagian Aplikasi

Di Modul 05, tombol dan ringkasan memiliki parent dekat. Sekarang header juga memerlukan total keranjang.

::left::

#### Props Masih Cocok

<v-clicks>

- `BookQuantity` memiliki pilihan jumlah.
- `BookControls` menerima jumlah dan `onAdd`.
- `BookSummary` menerima jumlah untuk menghitung total.
- Nilai dan handler mengalir melalui hubungan yang jelas.

</v-clicks>

::right::

#### Kebutuhan Baru

<v-clicks>

- Tombol di detail menambah buku ke keranjang.
- Header menampilkan total keranjang.
- Halaman `/cart` membaca total yang sama.
- Banyak komponen perantara mungkin hanya meneruskan props.

</v-clicks>

::bottom::

<BrutalCard v-click class="text-sm">
  Meneruskan props melalui banyak lapisan disebut <strong>prop drilling</strong>. Callback props tetap pola yang sah; Context membantu ketika jalur perantara mulai merepotkan.
</BrutalCard>

<!--
Jangan menyebut callback props sebagai callback hell atau mengatakan semua props perlu diganti Context.
Pilihan quantity tetap lokal sampai pengguna menekan Tambah ke keranjang. totalItems adalah jumlah yang sudah dimasukkan ke keranjang bersama.
Jika props masih mudah diikuti, tidak ada kewajiban menambahkan Context. Composition melalui children juga dapat mengurangi komponen perantara.
Sumber: https://react.dev/learn/passing-data-deeply-with-context#before-you-use-context
Sumber: https://react.dev/learn/sharing-state-between-components
-->

---
class: module-content
---

### Context: Sediakan Nilai, Lalu Baca di Bawahnya

Context menghubungkan komponen dengan **provider terdekat di atasnya**.

```text {1-2|3-5|all}
Root layout                       Server Component
└── CartProvider                  Client; menyimpan totalItems
    ├── Navbar → CartLink         Membaca total
    ├── Detail → AddToCart        Menambah jumlah pilihan
    └── /cart → CartSummary       Membaca total dan mengosongkan
```

<v-clicks>

1. **createContext** membuat konteks yang akan dipakai bersama.
2. **Provider** menyediakan nilai untuk komponen di bawahnya.
3. **useContext** membaca nilai tersebut dari komponen client.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Context menyalurkan nilai. Pada versi pertama, <strong>useState di CartProvider</strong> tetap menjadi tempat penyimpanan state.
</BrutalCard>

<!--
Diagram menunjukkan pohon tampilan, bukan hubungan import semua file.
Context bukan penyimpanan global yang otomatis tersedia di semua tempat. Dua provider dapat memiliki nilai yang berbeda.
Provider harus berada di atas komponen yang membaca Context; provider yang baru dikembalikan komponen tidak menaungi pemanggilan hook dalam komponen itu sendiri.
Sumber: https://react.dev/reference/react/createContext
Sumber: https://react.dev/reference/react/useContext
-->

---
class: module-content
---

### Praktik: Buat Konteks dan Hook Pembaca

Buat `src/components/cart/cart-context.ts`.

```ts {4-8|10|12-16|all}
"use client";
import { createContext, useContext } from "react";

export type CartValue = {
  totalItems: number;
  addItems: (amount: number) => void;
  reset: () => void;
};

export const CartContext = createContext<CartValue | null>(null);

export function useCart() {
  const value = useContext(CartContext);
  if (value === null) throw new Error("CartProvider belum dipasang");
  return value;
}
```

<BrutalCard v-click class="mt-3 text-sm">
  <code>useCart</code> adalah hook buatan kita. Panggil di awal fungsi komponen client, seperti hook yang sudah dipelajari.
</BrutalCard>

<!--
CartValue menjelaskan nilai dan dua tindakan yang tersedia. amount adalah jumlah buku yang akan ditambahkan; reset mengosongkan total.
createContext dipanggil di luar komponen untuk membuat satu objek konteks. useContext dipanggil di dalam custom hook, bukan di module scope.
null adalah fallback bila tidak ada provider. Pengecekan memberi pesan jelas bila peserta lupa memasang provider.
File .ts cukup karena tidak memiliki JSX. Jangan mengubah error menjadi nilai palsu 0 karena itu dapat menyembunyikan provider yang hilang.
Sumber: https://react.dev/reference/react/createContext
Sumber: https://react.dev/reference/react/useContext
-->

---
class: module-content
---

### Praktik: Simpan State di Provider

Buat `src/components/cart/CartProvider.tsx`.

```tsx {1-5|8-12|14-18|all}
"use client";
import { useState, type ReactNode } from "react";
import { CartContext } from "./cart-context";

type Props = { children: ReactNode };

export default function CartProvider({ children }: Props) {
  const [totalItems, setTotalItems] = useState(0);
  function addItems(amount: number) {
    setTotalItems((n) => n + amount);
  }
  const reset = () => setTotalItems(0);

  return (
    <CartContext value={{ totalItems, addItems, reset }}>
      {children}
    </CartContext>
  );
}
```

<!--
Setiap instance CartProvider memiliki useState sendiri. Kita akan memasang satu instance yang menaungi ketiga pemakai.
React 19 mendukung <CartContext value={...}> sebagai provider. Bentuk <CartContext.Provider> pada contoh lama juga masih didukung.
children membawa tampilan dari pemanggil, sesuai composition Modul 04. Membungkus children dengan provider client tidak mengubah kode page server menjadi client.
Nilai awal 0 sama untuk render server dan render pertama browser.
Sumber: https://react.dev/reference/react/createContext#somecontext-provider
Sumber: https://react.dev/reference/react/useState
-->

---
class: module-content
---

### Praktik: Pasang Provider Sekali di Layout

Di `src/app/layout.tsx`, tambahkan import:

```tsx
import CartProvider from "@/components/cart/CartProvider";
```

Di dalam `body`, bungkus header dan `children` yang sudah ada:

```tsx {1|2-6|7|all}
<CartProvider>
  <header className="border-b p-4">
    <p>Toko Belajar</p>
    <Navbar />
  </header>
  {children}
</CartProvider>
```

<v-clicks>

- Letakkan footer yang sudah ada setelah penutup `CartProvider`.
- Root layout tetap server; provider menjadi komponen client di dalamnya.
- Header dan halaman sekarang berada di bawah provider yang sama.

</v-clicks>

<!--
Dua potongan adalah perubahan pada layout yang sudah ada, bukan pengganti seluruh file.
Pertahankan html lang=id, body beserta atribut/font, metadata, import globals.css, import Navbar, dan footer.
Jangan memasang provider terpisah pada Navbar dan setiap page. Jangan memberi key yang berubah mengikuti path pada provider bersama ini.
Layout yang sama dipertahankan selama navigasi client melalui Link; state provider tetap tersedia selama instance tersebut bertahan.
Sumber: https://nextjs.org/docs/app/getting-started/server-and-client-components#context-providers
Sumber: https://nextjs.org/docs/app/getting-started/layouts-and-pages#creating-a-layout
-->

---
class: module-content
---

### Praktik: Baca Total melalui Context

Buat `src/components/cart/CartLink.tsx`. Bandingkan props dengan Context; gunakan versi akhir.

````md magic-move
```tsx
import Link from "next/link";
type Props = { totalItems: number };

export default function CartLink(props: Props) {
  return <Link href="/cart">Keranjang ({props.totalItems})</Link>;
}
```

```tsx
"use client";
import Link from "next/link";
import { useCart } from "./cart-context";

export default function CartLink() {
  const { totalItems } = useCart();
  return <Link href="/cart">Keranjang ({totalItems})</Link>;
}
```
````

<BrutalCard v-click class="mt-4 text-sm">
  Versi Context membaca nilai dari provider. Navbar tidak perlu menerima lalu meneruskan prop <code>totalItems</code>.
</BrutalCard>

<!--
Versi props tetap valid bila pemanggil menyediakan nilai. Perubahan ini menyesuaikan kebutuhan membaca state bersama dari beberapa lokasi.
Consumer adalah istilah untuk komponen yang membaca Context, seperti CartLink. Tidak perlu memakai komponen lama Context.Consumer.
Ketika value Context berubah, React memperbarui komponen yang membacanya.
Sumber: https://react.dev/learn/passing-data-deeply-with-context
-->

---
class: module-content
---

### Praktik: Hubungkan ke Navbar

Di `src/components/Navbar.tsx`, tambahkan import ini:

```tsx
import CartLink from "@/components/cart/CartLink";
```

Ganti tautan keranjang lama dengan `CartLink`:

````md magic-move
```tsx
<Link href="/cart">Keranjang</Link>
```

```tsx
<CartLink />
```
````

<v-clicks>

- Tetap gunakan `Link` untuk Beranda dan Katalog.
- Pertahankan `usePathname` serta penanda menu aktif dari Modul 03.
- Header kini menampilkan **Keranjang (0)** dan tetap menuju `/cart`.

</v-clicks>

<!--
Snippet JSX berada di dalam nav yang sudah ada. Jangan menghapus seluruh Navbar atau directive use client miliknya.
CartLink memiliki Link sendiri sehingga tidak dibungkus Link kedua.
Jika hook melaporkan provider belum dipasang, periksa posisi CartProvider di atas header pada slide sebelumnya.
Sumber: https://nextjs.org/docs/app/api-reference/components/link
-->

---
class: module-content
layout: two-cols
---

### Praktik: Masukkan Jumlah Pilihan

Jumlah lokal dari Modul 05 ditambahkan ke total bersama ketika tombol diklik.

::left::

#### Buat `AddToCart.tsx`

Lokasi: `src/components/cart/`.

```tsx {1-4|7-10|12-15|all}
"use client";
import { useCart } from "./cart-context";

type Props = { quantity: number };

export default function AddToCart(props: Props) {
  const { addItems } = useCart();
  function add() {
    addItems(props.quantity);
  }
  return (
    <button type="button" onClick={add}>
      Tambah ke keranjang
    </button>
  );
}
```

::right::

#### Edit `BookQuantity.tsx`

Lokasi: `src/app/products/[id]/`.

Tambahkan import:

```tsx
import AddToCart from "@/components/cart/AddToCart";
```

Di dalam `section`, setelah `BookSummary`, tambahkan:

```tsx
<AddToCart quantity={quantity} />
```

<v-clicks>

- `+1` mengubah **pilihan lokal**.
- Tombol baru menambah pilihan itu ke **total keranjang**.
- Menambah lagi akan menambah total lagi.

</v-clicks>

<!--
File BookQuantity tetap menyimpan quantity; BookControls dan BookSummary dari Modul 05 masih dipakai.
Pola onClick berupa fungsi dipertahankan agar addItems baru dipanggil saat klik. Hook useCart dipanggil di awal fungsi AddToCart.
Contoh mengandalkan quantity positif dari kontrol latihan. Validasi data dan aturan transaksi bukan tanggung jawab counter latihan ini.
Saat total awal 0 dan pilihan 2, satu klik menghasilkan total 2. Klik kedua menghasilkan 4; pilihan lokal masih 2.
Sumber: https://react.dev/reference/react/useContext#updating-data-passed-via-context
-->

---
class: module-content
layout: two-cols
---

### Praktik: Baca Total di Halaman Keranjang

Ganti isi halaman `/cart` dari Modul 02 dengan ringkasan state bersama.

::left::

#### `CartSummary.tsx`

Buat di `src/components/cart/`.

```tsx
"use client";
import { useCart } from "./cart-context";

export default function CartSummary() {
  const { totalItems, reset } = useCart();
  return (
    <section className="space-y-3">
      <p>Total buku: {totalItems}</p>
      <button type="button" onClick={reset}>
        Kosongkan keranjang
      </button>
    </section>
  );
}
```

::right::

#### `src/app/cart/page.tsx`

```tsx
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl">Keranjang</h1>
      <CartSummary />
    </main>
  );
}
```

Page tetap server. `CartSummary` membaca state di sisi client.

<!--
Keranjang latihan menampilkan total eksemplar saja, bukan daftar buku per ID atau harga pembayaran.
Reset mengubah totalItems pada provider menjadi 0 sehingga header dan halaman membaca nilai baru yang sama.
Tidak perlu useEffect untuk menyinkronkan dua tampilan. Keduanya mengambil nilai dari sumber yang sama.
Jika peserta menempatkan cart dalam route group pada proyeknya, sesuaikan path fisik page; URL tetap /cart.
Sumber: https://react.dev/reference/react/useContext
-->

---
class: module-content
---

### Checkpoint: Satu Total di Beberapa Halaman

Mulai dari reload penuh sehingga total keranjang **0**. Lalu jalankan urutan ini.

| Langkah                                  | Hasil yang diharapkan          |
| ---------------------------------------- | ------------------------------ |
| Buka detail buku; ubah pilihan menjadi 2 | Header masih `Keranjang (0)`   |
| Klik Tambah ke keranjang sekali          | Header menjadi `Keranjang (2)` |
| Klik tautan Keranjang                    | Halaman menampilkan total 2    |
| Klik Kosongkan keranjang                 | Header dan ringkasan menjadi 0 |
| Tambahkan lagi, lalu reload penuh        | Total kembali ke 0             |

<BrutalCard v-click class="mt-4">
  State bertahan selama provider yang sama tetap terpasang. Penyimpanan lintas reload perlu dirancang secara terpisah.
</BrutalCard>

<!--
Gunakan Link di dalam aplikasi untuk menguji navigasi client. Mengetik URL lalu memuat dokumen baru berbeda dari navigasi yang mempertahankan layout.
Satu provider tidak menyinkronkan tab browser atau perangkat yang berbeda.
Reset lokal BookQuantity dari Modul 05 mengatur pilihan menjadi 1; Kosongkan keranjang mengatur total bersama menjadi 0. Keduanya mempunyai pemilik dan tujuan berbeda.
Jalankan npm run build pada proyek Next.js kelas. Suspense untuk QueryLabel dari Modul 03 tetap diperlukan.
Lanjutkan alternatif Zustand setelah checkpoint Context ini berhasil.
Sumber: https://nextjs.org/docs/app/getting-started/layouts-and-pages#creating-a-layout
Sumber: https://react.dev/learn/preserving-and-resetting-state
-->

---
class: module-content
---

### Tentukan Tempat State Sebelum Memilih Library

Mulai dari siapa yang membaca data dan berapa lama data perlu bertahan.

| Kebutuhan                                                  | Pilihan awal yang masuk akal |
| ---------------------------------------------------------- | ---------------------------- |
| Jumlah pilihan untuk satu buku                             | `useState` lokal             |
| Tombol dan ringkasan yang berdekatan                       | State parent + props         |
| Nilai bersama untuk banyak komponen di bawah satu provider | Context                      |
| Pencarian yang perlu dibagikan lewat URL                   | Query URL, seperti Modul 03  |
| Store bersama dengan langganan ke bagian state tertentu    | Pertimbangkan Zustand        |

<v-clicks>

- Gunakan pola yang sudah dipahami selama memenuhi kebutuhan.
- Tambahkan library untuk kebutuhan yang jelas.
- Nilai dari server, seperti harga dan stok, dibahas mulai Modul 07.

</v-clicks>

<!--
Context tidak terbatas pada data yang jarang berubah; pola dan biaya render bergantung pemakaian. Zustand juga bukan jawaban otomatis hanya karena aplikasi membesar.
Bagian ini menggantikan perbandingan slogan dan daftar panjang library. Redux Toolkit, Jotai, atau solusi lain dapat menjadi bacaan terpisah sesuai kebutuhan tim.
Jangan membangun event bus global sendiri untuk latihan ini. Sebaliknya, jangan memasang library hanya karena populer.
Sumber: https://react.dev/learn/passing-data-deeply-with-context#before-you-use-context
Sumber: https://zustand.docs.pmnd.rs/learn/getting-started/introduction
-->

---
class: module-content
---

### Alternatif: Store dengan Zustand

Zustand menyediakan tempat state dan tindakan, lalu komponen memilih nilai yang ingin diikuti melalui **selector**.

Di proyek Next.js peserta:

```bash
npm install zustand
```

<v-clicks>

1. Buat fungsi pembuat store.
2. Simpan satu store untuk masing-masing instance provider.
3. Baca bagian state yang diperlukan dari komponen client.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Bagian berikut <strong>mengganti versi Context sebelumnya</strong>. Nama CartProvider tetap; hook useCart berubah menjadi menerima selector. Selesaikan seluruh langkah sebelum mencoba lagi.
</BrutalCard>

<!--
Context pertama adalah solusi lengkap untuk counter ini; peserta tidak wajib berpindah. Zustand dipelajari sebagai alternatif dan latihan selector.
API yang digunakan adalah Zustand v5. Catat versi yang terpasang di package lock proyek kelas; tidak ada klaim bahwa nomor patch tertentu adalah yang terbaru.
Next.js juga merender Client Components di server. Jangan membuat satu instance store mutable di module scope yang dipakai bersama lintas request.
Kita tetap memakai React Context untuk menyalurkan instance store. Nilai totalnya dikelola Zustand, bukan useState seperti pada implementasi pertama.
Panduan Next.js Zustand memiliki catatan akan diperbarui; ikuti API resmi dan periksa kembali bila pola framework berubah.
Sumber: https://zustand.docs.pmnd.rs/learn/guides/nextjs
Sumber: https://zustand.docs.pmnd.rs/learn/getting-started/introduction
-->

---
class: module-content
---

### Zustand 1: Buat Fungsi Pembuat Store

Buat `src/stores/cart.ts`. Fungsi ini menghasilkan store baru setiap kali dipanggil.

```ts {1-7|9-15|17|all}
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

<BrutalCard v-click class="mt-3 text-sm">
  File ini mengekspor <strong>fungsi pembuat</strong>, bukan satu instance bersama. Provider akan memanggilnya untuk membuat store miliknya.
</BrutalCard>

<!--
createStore membuat vanilla store, yaitu store yang dapat dipakai tanpa hook React. Integrasi React menggunakan useStore pada langkah berikutnya.
set dengan objek parsial menggabungkan perubahan satu tingkat secara default; memperbarui totalItems tidak menghapus fungsi addItems/reset.
s adalah state saat pembaruan diproses. Hitung nilai baru tanpa memutasi s, seperti prinsip Modul 05.
ReturnType mengambil tipe hasil fungsi createCartStore; peserta cukup mengenali bahwa CartStore adalah tipe instance yang diberikan kepada provider.
Jangan mengganti factory dengan export const cartStore = createCartStore() pada module scope untuk pola Next.js kelas ini.
Sumber: https://zustand.docs.pmnd.rs/reference/apis/create-store
Sumber: https://zustand.docs.pmnd.rs/learn/guides/nextjs
-->

---
class: module-content
---

### Zustand 2: Baca Store melalui Selector

Ganti seluruh isi `src/components/cart/cart-context.ts` dengan versi ini.

```ts {2-4|6|8-12|all}
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

<v-clicks>

- Context sekarang membawa **instance store**.
- `useStore` membaca dan mengikuti hasil selector.
- `T` mewakili tipe hasil pilihan, misalnya angka atau fungsi.

</v-clicks>

<!--
Hook useCart sekarang memerlukan satu argumen selector. Consumer lama yang masih memanggil useCart() perlu diperbarui pada langkah 4.
Hook tetap dipanggil di tingkat teratas fungsi komponen client. Selector adalah fungsi pemilih nilai; bukan tempat menjalankan tindakan atau mengubah store.
Guard null adalah pola untuk melaporkan provider yang tidak tersedia, bukan kondisi yang membuat hook dipanggil berbeda antar-render normal.
createContext yang dipakai berasal dari React. Jangan memakai API lama zustand/context yang sudah dihapus pada v5.
Sumber: https://zustand.docs.pmnd.rs/reference/hooks/use-store
Sumber: https://zustand.docs.pmnd.rs/learn/guides/initialize-state-with-props
-->

---
class: module-content
---

### Zustand 3: Simpan Store pada Provider

Ganti seluruh isi `src/components/cart/CartProvider.tsx`. Posisi provider di layout tetap sama.

```tsx {1-6|9|11|all}
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

<v-clicks>

- Inisialisasi lazy mempertahankan store selama instance provider hidup.
- Nilai awal `totalItems: 0` sama pada server dan render awal browser.
- Server Component menampilkan provider; komponen client yang membaca dan memperbarui store.

</v-clicks>

<!--
useState di sini memegang instance store yang stabil, bukan totalItems. Pembaruan total ditangani Zustand.
Initializer dapat dipanggil lagi oleh pemeriksaan Strict Mode development; factory ini murni dan tidak memulai subscription eksternal atau request jaringan.
Dua instance provider membuat dua store terpisah. Jangan memanggil createCartStore langsung pada setiap render tanpa mempertahankan hasilnya.
Jangan membaca/menulis store UI ini dari Server Component atau menjadikannya penyimpanan data bersama semua pengguna di server.
Persist ke localStorage belum digunakan. Persistence memerlukan keputusan umur data serta penanganan hydration; tidak ditambahkan sekadar agar reload lolos.
Sumber: https://zustand.docs.pmnd.rs/learn/guides/initialize-state-with-props
Sumber: https://zustand.docs.pmnd.rs/reference/hooks/use-store
Sumber: https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state
-->

---
class: module-content
---

### Zustand 4: Pilih Nilai di Setiap Pemakai

Perbarui cara membaca state pada `CartLink.tsx`.

````md magic-move
```tsx
"use client";
import Link from "next/link";
import { useCart } from "./cart-context";

export default function CartLink() {
  const { totalItems } = useCart();
  return <Link href="/cart">Keranjang ({totalItems})</Link>;
}
```

```tsx
"use client";
import Link from "next/link";
import { useCart } from "./cart-context";

export default function CartLink() {
  const totalItems = useCart((s) => s.totalItems);
  return <Link href="/cart">Keranjang ({totalItems})</Link>;
}
```
````

Ganti juga baris hook **di dalam fungsi** kedua komponen berikut:

| File              | Pembacaan baru                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| `AddToCart.tsx`   | `const addItems = useCart((s) => s.addItems);`                                                  |
| `CartSummary.tsx` | `const totalItems = useCart((s) => s.totalItems);`<br/>`const reset = useCart((s) => s.reset);` |

<!--
Import useCart dan JSX tombol tetap sama. Hapus baris destructuring useCart() lama, lalu ganti dengan baris selector pada tabel.
Di CartSummary, dua hook tetap dipanggil di awal fungsi sebelum return dan tanpa kondisi.
Semua pemakai sudah memakai API baru setelah langkah ini. Ulangi checkpoint navigasi, tambah, kosongkan, dan reload.
Sumber: https://zustand.docs.pmnd.rs/reference/hooks/use-store
-->

---
class: module-content
layout: two-cols
---

### Apa yang Berubah saat Nilai Diperbarui?

Keduanya bisa memenuhi latihan. Cara berlangganan nilainya berbeda.

::left::

#### Versi Context

<v-clicks>

- `useState` provider menyimpan total.
- `useCart()` membaca seluruh value Context.
- Value yang berubah memperbarui komponen pembacanya.
- Provider baru berarti state tersendiri.

</v-clicks>

::right::

#### Versi Zustand

<v-clicks>

- Store menyimpan total dan tindakan.
- Selector memilih nilai yang diikuti.
- Perubahan hasil selector memicu pembaruan langganan.
- Store dibuat terpisah per instance provider.

</v-clicks>

::bottom::

<BrutalCard v-click class="text-sm">
  Selector tidak menjamin komponen hanya pernah render karena store. Props, state lokal, atau parent juga dapat menyebabkan render. Ukur dahulu sebelum menambah optimasi.
</BrutalCard>

<!--
Context tidak otomatis merender semua elemen di bawah provider karena perubahan context; mekanisme langganan berlaku pada consumer. Render parent juga dapat memicu render anak melalui jalur biasa.
Versi Context mengirim objek value baru pada render provider. useMemo/useCallback dapat membantu pada kebutuhan tertentu, tetapi bukan prasyarat kebenaran contoh.
Selector contoh mengembalikan angka atau fungsi yang stabil. Pada Zustand v5, selector yang selalu menghasilkan objek/array baru perlu penanganan kestabilan, misalnya useShallow bila sesuai; lihat referensi sebelum memperluas contoh.
Jangan mengklaim Zustand selalu lebih cepat atau Context hanya boleh untuk data yang jarang berubah.
Sumber: https://react.dev/reference/react/useContext#optimizing-re-renders-when-passing-objects-and-functions
Sumber: https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v5#requiring-stable-selector-outputs
-->

---
class: module-content
---

### Jika Nilainya Tidak Sama

Periksa pemilik, provider, dan versi hook yang sedang digunakan.

| Gejala                                   | Periksa dan perbaiki                                               |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `CartProvider belum dipasang`            | Provider harus menaungi komponen pembaca                           |
| Header dan keranjang punya total berbeda | Gunakan satu instance provider bersama                             |
| Total hilang saat berpindah lewat Link   | Periksa provider yang dipasang di page atau key yang berubah       |
| Total kembali 0 setelah reload penuh     | Sesuai latihan; state belum disimpan permanen                      |
| Error setelah mencoba versi Zustand      | Ganti context, provider, dan semua pemanggilan hook secara lengkap |
| Ingin membaca `useCart` di page server   | Tampilkan komponen client seperti `CartSummary` di page itu        |

<!--
Gunakan struktur pohon komponen, bukan hanya folder, untuk menelusuri cakupan provider.
Jika ada provider bersarang, consumer membaca provider terdekat; nama komponen yang sama tidak menyatukan dua state.
Jangan memperbaiki hilangnya state dengan membuat singleton mutable di server.
Jika hydration mismatch terjadi, periksa kesamaan data awal server/browser. Hindari membaca localStorage secara langsung untuk menghasilkan HTML awal yang berbeda.
Sumber: https://react.dev/reference/react/useContext#troubleshooting
Sumber: https://zustand.docs.pmnd.rs/learn/guides/nextjs
-->

---
class: module-content
---

### Prediksi: Mengapa Dua Total Berbeda?

<LearningCheck
  question="Navbar dibungkus CartProvider A, sedangkan halaman detail dan cart dibungkus CartProvider B. Setelah menambah buku, total di navbar tetap 0. Perbaikan yang sesuai?"
  :options='["Salin total ke navbar melalui useEffect", "Pasang satu CartProvider bersama di atas header dan halaman", "Beri semua page use client"]'
  :answer="1"
  explanation="Setiap instance provider memiliki state atau store sendiri. Navbar dan halaman harus membaca instance bersama agar menampilkan total yang sama."
/>

<!--
Beri 30 detik untuk prediksi. Minta peserta menggambar posisi provider dan menunjukkan siapa membaca A atau B.
Jawaban berlaku untuk versi Context maupun Zustand yang dibuat melalui provider.
Gunakan Ulangi prediksi untuk kelompok berikutnya.
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 06

<v-clicks>

1. **Tentukan Pemilik State**: Simpan pilihan lokal di komponen; bagikan total melalui provider bersama.
2. **Context Menyalurkan Nilai**: Provider menyediakan nilai dan komponen client membacanya lewat hook.
3. **Zustand Menambah Pilihan Selector**: Buat store per provider dan jaga nilai awal server/browser tetap cocok.

</v-clicks>

<BrutalCard v-click class="mt-4 bg-brutal-yellow/10">
  🚀 <strong>Selanjutnya di Modul 07:</strong> Dari mana judul, harga, dan stok buku diperoleh? Kita mulai mengambil data dan mempelajari kapan halaman dirender serta datanya disimpan dalam cache.
</BrutalCard>

<!--
Peserta siap lanjut bila dapat menjelaskan perbedaan quantity lokal dan totalItems bersama, posisi provider, serta perilaku saat navigasi dan reload.
Versi Context cukup untuk memenuhi latihan utama. Selector dan factory store menjadi hasil belajar tambahan pada jalur Zustand.
Berhenti sebelum menambahkan fetch, strategi SSG/SSR/ISR, konfigurasi cache, loading, atau error boundary. Semuanya masuk Modul 07.
-->

---
class: module-content
layout: two-cols
hideInToc: true
---

### Sumber dan Bacaan Lanjutan

Dokumentasi resmi yang diperiksa pada **8 Oktober 2026**.

::left::

#### Context dan Next.js

- [React: berbagi data dengan Context](https://react.dev/learn/passing-data-deeply-with-context)
- [React: createContext dan provider](https://react.dev/reference/react/createContext)
- [React: useContext dan pembaruan nilai](https://react.dev/reference/react/useContext)
- [Next.js: provider dalam App Router](https://nextjs.org/docs/app/getting-started/server-and-client-components#context-providers)
- [Next.js: layout dan navigasi](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

::right::

#### Zustand

- [Pengantar Zustand](https://zustand.docs.pmnd.rs/learn/getting-started/introduction)
- [Panduan penggunaan dengan Next.js](https://zustand.docs.pmnd.rs/learn/guides/nextjs)
- [createStore](https://zustand.docs.pmnd.rs/reference/apis/create-store)
- [useStore dan selector](https://zustand.docs.pmnd.rs/reference/hooks/use-store)
- [Inisialisasi store melalui provider](https://zustand.docs.pmnd.rs/learn/guides/initialize-state-with-props)

<!--
Panduan migrasi v5 dan kestabilan hasil selector dirujuk pada catatan slide terkait.
Dokumentasi daring dapat berubah setelah audit. Periksa ulang API dan panduan framework ketika versi proyek diperbarui.
-->
