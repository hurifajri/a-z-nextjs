---
layout: intro
badge: "MODUL 06"
badgeColor: "purple"
level: 1
---

## 06. State Bersama dengan Context

Lanjutkan Toko Belajar: masukkan jumlah pilihan ke keranjang, tampilkan total di header, lalu baca total yang sama di halaman keranjang.

<!--
Bekal: BookQuantity menyimpan quantity lokal; BookControls dan BookSummary menerima props dari Modul 05. Navbar dan Link berasal dari Modul 04.
Target akhir: peserta menentukan cakupan state, memasang satu provider bersama, membaca serta memperbarui state lewat Context, serta menjelaskan umur state saat navigasi dan reload.
Durasi target 55–70 menit: Context dan praktik 40–55 menit, verifikasi serta diskusi 10–15 menit. Zustand tersedia sebagai lab terpisah.
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
children membawa tampilan dari pemanggil, sesuai composition Modul 03. Membungkus children dengan provider client tidak mengubah kode page server menjadi client.
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
- Pertahankan `usePathname` serta penanda menu aktif dari Modul 04.
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
Jalankan npm run build pada proyek Next.js kelas. Pencarian URL baru dipasang di Modul 08.
Zustand tersedia sebagai lampiran terpisah, bukan kelanjutan wajib.
Sumber: https://nextjs.org/docs/app/getting-started/layouts-and-pages#creating-a-layout
Sumber: https://react.dev/learn/preserving-and-resetting-state
-->

---
class: module-content
---

### Tentukan Tempat State Sebelum Memilih Library

Mulai dari siapa yang membaca data dan berapa lama data perlu bertahan.

| Kebutuhan                                                  | Pilihan awal yang masuk akal        |
| ---------------------------------------------------------- | ----------------------------------- |
| Jumlah pilihan untuk satu buku                             | `useState` lokal                    |
| Tombol dan ringkasan yang berdekatan                       | State parent + props                |
| Nilai bersama untuk banyak komponen di bawah satu provider | Context                             |
| Pencarian yang perlu dibagikan lewat URL                   | Query URL, dipraktikkan di Modul 08 |
| Store bersama dengan langganan ke bagian state tertentu    | Pertimbangkan Zustand               |

<v-clicks>

- Gunakan pola yang sudah dipahami selama memenuhi kebutuhan.
- Tambahkan library untuk kebutuhan yang jelas.
- Nilai dari server, seperti judul buku, dibahas mulai Modul 07.

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

### Checkpoint dan Pilihan Pengayaan

**Jalur inti selesai dengan Context.** Gunakan versi ini untuk modul berikutnya.

<v-clicks>

1. Cocokkan [checkpoint Modul 06](/examples/checkpoints/modul-06.zip) bila hasil Antum berbeda.
2. Pastikan satu total terlihat di Navbar dan `/cart`.
3. Jelaskan mengapa total bertahan saat navigasi, tetapi kembali nol setelah reload.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  [Lab Zustand](/examples/pengayaan/zustand.md) membandingkan selector dan store per provider. Kerjakan pada salinan proyek setelah Context dipahami; jangan mencampur kedua versi hook.
</BrutalCard>

---
class: module-content
---

### Jika Nilainya Tidak Sama

Periksa pemilik, provider, dan versi hook yang sedang digunakan.

| Gejala                                   | Periksa dan perbaiki                                         |
| ---------------------------------------- | ------------------------------------------------------------ |
| `CartProvider belum dipasang`            | Provider harus menaungi komponen pembaca                     |
| Header dan keranjang punya total berbeda | Gunakan satu instance provider bersama                       |
| Total hilang saat berpindah lewat Link   | Periksa provider yang dipasang di page atau key yang berubah |
| Total kembali 0 setelah reload penuh     | Sesuai latihan; state belum disimpan permanen                |
| Ingin membaca `useCart` di page server   | Tampilkan komponen client seperti `CartSummary` di page itu  |

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
3. **Periksa Umur State**: Navigasi lewat Link mempertahankan provider; reload penuh mengembalikan state latihan ke nilai awal.

</v-clicks>

<BrutalCard v-click class="mt-4 bg-brutal-yellow/10">
  🚀 <strong>Selanjutnya di Modul 07:</strong> Dari mana judul buku diperoleh? Kita mulai mengambil data dan mempelajari kapan halaman dirender serta datanya disimpan dalam cache.
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
