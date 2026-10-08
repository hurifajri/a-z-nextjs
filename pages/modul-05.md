---
layout: intro
badge: "MODUL 05"
badgeColor: "green"
level: 1
---

## 05. State Management Dasar

Lanjutkan Toko Belajar: ubah jumlah buku di layar, bagikan nilainya ke dua komponen, dan kelola timer dengan cleanup.

<!--
Bekal: page detail server dan BookNotice client dari Modul 04 sudah berjalan. Peserta mengenal props, event handler, dan batas use client.
Target akhir: peserta memakai useState untuk jumlah buku, menghitung total dari jumlah, membagikan state melalui props, serta menjelaskan kapan Effect diperlukan.
Durasi target 60–90 menit: state dan updater 20 menit, nilai turunan serta berbagi state 15–20 menit, objek/array 10–15 menit, Effect dan latihan 15–35 menit.
Semua path mengikuti src/app/products/[id]/. Jika memakai route group Modul 02, sesuaikan lokasi products; URL dan import relatif tetap sama.
Contoh mengikuti React yang dibawa Next.js 16 pada acuan kelas Modul 01. Tidak perlu memasang library state atau mengubah konfigurasi.
Jumlah buku hanya pilihan lokal di halaman. Harga 50000 adalah angka latihan; belum ada keranjang lintas halaman, penyimpanan permanen, atau transaksi.
BookQuantity, BookSummary, BookControls, dan StudyTimer menjadi praktik utama. GiftOptions dan BookList adalah contoh mandiri untuk dibaca; lab array dijalankan di slide.
Context, Zustand, dan berbagi state lintas bagian aplikasi dimulai di Modul 06. Pengambilan data jaringan mengikuti modul data.
Audit sumber daring: 8 Oktober 2026.
-->

---
class: module-content
---

### Dari Klik ke Tampilan yang Berubah

Buat `src/app/products/[id]/BookQuantity.tsx`. Bandingkan kedua versi; gunakan versi akhir.

````md magic-move
```tsx
"use client";

export default function BookQuantity() {
  let quantity = 1;

  function add() {
    quantity += 1;
  }

  return (
    <button type="button" onClick={add}>
      Jumlah: {quantity} (+1)
    </button>
  );
}
```

```tsx
"use client";
import { useState } from "react";

export default function BookQuantity() {
  const [quantity, setQuantity] = useState(1);

  function add() {
    setQuantity((q) => q + 1);
  }

  return (
    <button type="button" onClick={add}>
      Jumlah: {quantity} (+1)
    </button>
  );
}
```
````

<BrutalCard v-click class="mt-3 text-sm">
  Mengubah variabel biasa tidak meminta React memperbarui layar. <strong>State</strong> menyimpan nilai antar-render; setter meminta pembaruan dengan nilai berikutnya.
</BrutalCard>

<!--
Sambungkan dengan BookNotice: handler di Modul 04 sudah bisa berjalan, tetapi dialog tidak mengubah data yang ditampilkan komponen.
Pada versi awal, klik mengubah variabel lokal tanpa menjadwalkan render. Saat komponen dirender ulang, deklarasi let juga diulang.
Versi akhir menyimpan jumlah di React. Render berarti React menjalankan komponen untuk menghitung tampilan berikutnya, bukan memuat ulang halaman.
q adalah parameter fungsi updater yang menerima nilai sebelumnya dalam antrean pembaruan. Penjelasan lebih rinci menyusul.
Sumber: https://react.dev/learn/state-a-components-memory
-->

---
class: module-content
---

### Membaca Satu Baris `useState`

Cuplikan ini berada **di dalam fungsi BookQuantity**, sebelum `return`.

```tsx
const [quantity, setQuantity] = useState(1);
```

| Bagian           | Artinya                                     |
| ---------------- | ------------------------------------------- |
| `quantity`       | Nilai yang dipakai pada render saat ini     |
| `setQuantity`    | Fungsi untuk meminta nilai state berikutnya |
| `1`              | Nilai awal ketika state komponen dibuat     |
| `setQuantity(1)` | Contoh mengembalikan jumlah ke nilai 1      |

<v-clicks>

- Panggil `useState` di awal fungsi komponen; jangan di handler, kondisi, atau loop.
- Setiap instance komponen memiliki state sendiri.
- State lokal ini tidak disimpan otomatis; reload penuh memulai lagi dari nilai awal.

</v-clicks>

<!--
Destructuring mengambil dua anggota hasil useState. Nama setter mengikuti kebiasaan set + nama state.
Nilai awal tidak menimpa state pada setiap render; React mempertahankan nilai selama identitas komponen dipertahankan.
Aturan posisi hook di slide ini berlaku untuk useState dan useEffect yang dipelajari. Jangan memperluasnya tanpa pengecualian ke semua API berawalan use.
Setter dipanggil dari handler atau proses yang sesuai, bukan tanpa kondisi saat render.
Sumber: https://react.dev/reference/react/useState
Sumber: https://react.dev/reference/rules/rules-of-hooks
-->

---
class: module-content
---

### Praktik: Tampilkan Jumlah di Detail Buku

Perbarui `src/app/products/[id]/page.tsx`. Page tetap Server Component.

```tsx {1-2|15|all}
import BookNotice from "./BookNotice";
import BookQuantity from "./BookQuantity";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  return (
    <main className="p-8 space-y-3">
      <h1 className="text-3xl">Detail Buku</h1>
      <p>ID buku: {id}</p>
      <BookNotice id={id} />
      <BookQuantity key={id} />
    </main>
  );
}
```

<BrutalCard v-click class="mt-3 text-sm">
  Buka <code>/products/buku-react</code>. Klik jumlah dua kali: <strong>1 → 2 → 3</strong>. Reload penuh: kembali ke <strong>1</strong>.
</BrutalCard>

<!--
BookNotice tetap menampilkan dialog dari Modul 04; BookQuantity menambahkan contoh perubahan tampilan.
Peserta yang mencoba children pada Modul 04 boleh mempertahankan judul/ID di dalam BookNotice dan menambahkan BookQuantity setelahnya.
key={id} memberi identitas sesuai buku. Ketika React mengganti instance dengan key berbeda, state instance baru dimulai dari nilai awal.
key bukan props biasa dan tidak dibaca di dalam BookQuantity. Ini bukan mekanisme penyimpanan jumlah per buku.
Jangan menjanjikan semua navigasi selalu mereset state; React mempertahankan state sesuai posisi, tipe, dan key, sementara framework dapat mempertahankan subtree.
Sumber: https://react.dev/learn/preserving-and-resetting-state
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/page#params-optional
-->

---
class: module-content
---

### State pada Handler adalah Snapshot

Bandingkan dua versi handler di dalam `BookQuantity`. Misalkan jumlah saat ini **1**.

````md magic-move
```tsx
function addThree() {
  setQuantity(quantity + 1);
  setQuantity(quantity + 1);
  setQuantity(quantity + 1);
}
// Tiga permintaan memakai quantity yang sama: hasilnya 2.
```

```tsx
function addThree() {
  setQuantity((q) => q + 1);
  setQuantity((q) => q + 1);
  setQuantity((q) => q + 1);
}
// Updater diproses berurutan: 1 → 2 → 3 → 4.
```
````

<v-clicks>

- Setter meminta render berikutnya; variabel pada handler ini tetap memakai nilai dari render saat ini.
- Gunakan **updater** saat nilai baru bergantung pada nilai sebelumnya.
- Untuk satu pembaruan `+3`, cukup `setQuantity((q) => q + 3)`.

</v-clicks>

<!--
Ini cuplikan handler, bukan file mandiri. quantity dan setQuantity berasal dari useState di komponen yang membungkusnya.
Untuk mencoba, pasang onClick={addThree} dan ubah label tombol menjadi +3. Jangan mengubah hanya fungsi sementara label masih +1.
React mengantrekan pembaruan dari event; jangan menganggap tiga setter berarti tiga tampilan antara wajib terlihat.
Updater harus murni: hitung dan kembalikan nilai, tanpa mutasi, request jaringan, atau alert. Strict Mode dapat memanggil updater lagi di development untuk membantu mendeteksi ketidakmurnian.
console.log(quantity) tepat setelah setter pada handler yang sama tetap membaca snapshot lama. Setter bukan Promise untuk ditunggu dengan await.
Sumber: https://react.dev/learn/state-as-a-snapshot
Sumber: https://react.dev/learn/queueing-a-series-of-state-updates
-->

---
class: module-content
---

### Nilai Turunan: Hitung dari Data yang Ada

Buat `src/app/products/[id]/BookSummary.tsx`. Komponen ini akan menerima jumlah dari parent.

```tsx {1|4-5|all}
type Props = { quantity: number };

export default function BookSummary(props: Props) {
  const unitPrice = 50000;
  const total = props.quantity * unitPrice;

  return <p>Total latihan: {total} rupiah</p>;
}
```

<v-clicks>

- Yang berubah karena pilihan pengguna adalah `quantity`.
- `total` mengikuti rumus `quantity × unitPrice`.
- Cukup hitung ulang saat render; tidak perlu state tambahan untuk `total`.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Jika jumlah <strong>2</strong>, total latihan <strong>100000 rupiah</strong>. Satu nilai jumlah menjadi acuan perhitungan.
</BrutalCard>

<!--
Harga dibuat tetap agar latihan fokus pada alur data, bukan pemformatan uang atau pengambilan harga dari server.
BookSummary belum terpasang di page; ia dipakai oleh BookQuantity pada langkah berbagi state.
File ini tidak memerlukan directive sendiri ketika diimpor oleh BookQuantity yang sudah menjadi batas client. Tidak ada hook atau event di dalamnya.
Jangan menambahkan useMemo untuk perkalian sederhana ini. Optimasi mengikuti kebutuhan yang terukur, bukan jumlah baris.
Sumber: https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state
-->

---
class: module-content
---

### Satu Pemilik State untuk Dua Komponen

Tombol dan ringkasan perlu membaca jumlah yang sama.

```text {1|2-3|all}
BookQuantity                    Menyimpan quantity
├── BookControls                Menerima quantity dan fungsi onAdd
└── BookSummary                 Menerima quantity; menghitung total
```

<v-clicks>

1. Letakkan state di **parent terdekat yang dipakai bersama**.
2. Kirim nilai ke anak melalui props.
3. Kirim handler ke tombol agar anak dapat meminta pembaruan.

</v-clicks>

<BrutalCard v-click class="mt-4">
  Pola ini disebut <strong>lifting state up</strong>. Jika state hanya dipakai satu komponen, simpan dekat komponen itu; tidak perlu memindahkannya ke root layout.
</BrutalCard>

<!--
Jika tombol dan ringkasan masing-masing membuat useState(1), keduanya memiliki penyimpanan berbeda, meskipun nama variabelnya sama.
Dalam refactor ini state sudah berada di BookQuantity. Saat tombol dan ringkasan dipisah, kita mempertahankan satu pemilik di parent bersama.
Callback props adalah pola normal React. Masalah banyak lapisan perantara baru menjadi pertanyaan pengantar Modul 06.
Banyak state tidak otomatis membuat komponen lambat. Pilih pemilik berdasarkan bagian yang perlu berkoordinasi, lalu ukur bila ada masalah kinerja.
Sumber: https://react.dev/learn/sharing-state-between-components
-->

---
class: module-content
layout: two-cols
---

### Praktik: Hubungkan Tombol dan Ringkasan

Kedua file berada di `src/app/products/[id]/`; gunakan `BookSummary.tsx` yang sudah dibuat.

::left::

#### Buat `BookControls.tsx`

```tsx {1-4|8-9|all}
type Props = {
  quantity: number;
  onAdd: () => void;
};

export default function BookControls(props: Props) {
  return (
    <button type="button" onClick={props.onAdd}>
      Jumlah: {props.quantity} (+1)
    </button>
  );
}
```

::right::

#### Perbarui `BookQuantity.tsx`

```tsx {1-4|7-10|13-14|all}
"use client";
import { useState } from "react";
import BookControls from "./BookControls";
import BookSummary from "./BookSummary";

export default function BookQuantity() {
  const [quantity, setQuantity] = useState(1);
  function add() {
    setQuantity((q) => q + 1);
  }
  return (
    <section className="space-y-3">
      <BookControls quantity={quantity} onAdd={add} />
      <BookSummary quantity={quantity} />
    </section>
  );
}
```

<!--
BookControls dan BookSummary mengikuti import client dari BookQuantity, sehingga tidak perlu menambahkan directive pada kedua file itu.
onAdd berisi fungsi yang diteruskan di sisi client. Ini berbeda dari mengirim fungsi event biasa dari Server Component ke Client Component pada Modul 04.
BookControls tidak menyalin props.quantity ke state baru. Nilainya sepenuhnya mengikuti parent.
Klik tombol sekali: jumlah menjadi 2 dan total menjadi 100000 rupiah. Tombol tidak mengubah total secara terpisah.
Contoh tetap memakai +1 sebagai dasar. Handler +3 dari slide snapshot adalah eksperimen terpisah dan dipakai lagi saat latihan.
Sumber: https://react.dev/learn/sharing-state-between-components
Sumber: https://react.dev/reference/rsc/use-client
-->

---
class: module-content
---

### Objek: Ganti dengan Salinan yang Diperbarui

Contoh mandiri: ubah pilihan bungkus sambil mempertahankan catatan.

```tsx {5|7-9|all}
"use client";
import { useState } from "react";

export default function GiftOptions() {
  const [options, setOptions] = useState({
    wrap: false,
    note: "Untuk belajar",
  });

  function toggle() {
    setOptions((prev) => ({ ...prev, wrap: !prev.wrap }));
  }

  return (
    <section>
      <p>Catatan: {options.note}</p>
      <button type="button" onClick={toggle}>
        Bungkus: {options.wrap ? "Ya" : "Tidak"}
      </button>
    </section>
  );
}
```

<BrutalCard v-click class="mt-3 text-sm">
  <code>...prev</code> menyalin properti lama; <code>wrap</code> ditimpa dengan nilai baru. Jangan mengubah <code>options.wrap</code> langsung.
</BrutalCard>

<!--
GiftOptions adalah contoh mandiri untuk dibaca, tidak harus ditambahkan ke page detail.
Setter objek mengganti nilai state, tidak menggabungkan properti secara otomatis. Tanpa ...prev, properti lain dapat hilang.
Spread hanya membuat salinan dangkal. Untuk objek bersarang, salin juga objek pada jalur yang diubah; latihan ini sengaja memakai struktur datar.
Immutability berarti memperlakukan nilai state lama sebagai sesuatu yang tidak diubah.
Sumber: https://react.dev/learn/updating-objects-in-state
-->

---
class: module-content
---

### Array: Berikan Nilai Baru ke Setter

Contoh mandiri `BookList`: bandingkan mutasi array lama dengan penambahan melalui salinan.

````md magic-move
```tsx
"use client";
import { useState } from "react";

export default function BookList() {
  const [titles, setTitles] = useState(["Buku React"]);
  function add() {
    titles.push("Buku Next");
    setTitles(titles);
  }
  return (
    <button type="button" onClick={add}>
      Tambah Buku Next ({titles.length} buku)
    </button>
  );
}
```

```tsx
"use client";
import { useState } from "react";

export default function BookList() {
  const [titles, setTitles] = useState(["Buku React"]);
  function add() {
    setTitles((prev) => [...prev, "Buku Next"]);
  }
  return (
    <button type="button" onClick={add}>
      Tambah Buku Next ({titles.length} buku)
    </button>
  );
}
```
````

<BrutalCard v-click class="mt-3 text-sm">
  React membandingkan nilai state dengan <code>Object.is</code>. Array yang sama dapat membuat pembaruan dilewati; salinan memberi referensi baru.
</BrutalCard>

<!--
Versi awal adalah contoh kesalahan untuk dianalisis; gunakan versi akhir jika ingin mencoba di proyek.
Judul boleh berulang pada contoh ini: setiap klik menambah satu buku. Ini bukan implementasi keranjang atau daftar ID unik.
Untuk menghapus gunakan filter; untuk mengganti elemen gunakan map. Keduanya membuat array baru; objek yang ikut diubah di dalamnya juga perlu disalin.
React dapat melewatkan pembaruan ketika nilainya sama menurut Object.is. Hindari klaim bahwa setiap mutasi selalu langsung terlihat atau setiap referensi baru pasti mengubah seluruh DOM.
Sumber: https://react.dev/learn/updating-arrays-in-state
Sumber: https://react.dev/reference/react/useState#ive-updated-the-state-but-the-screen-doesnt-update
-->

---
class: module-content
---

### Lab: Referensi Lama atau Array Baru?

Prediksi output, lalu tekan **Run**. Ubah penambahan buku agar `original` tetap berisi dua item.

```ts {monaco-run} {autorun:false, height:'190px'}
const original = ["Buku React", "Buku Next"];
const changed = original;
changed.push("Buku TypeScript");
const copied = [...original, "Buku CSS"];
console.log("changed sama: " + Object.is(original, changed));
console.log("copied sama: " + Object.is(original, copied));
console.log("panjang original: " + original.length);
```

<p v-click class="mt-3">
  Hasil awal: <strong>true, false, 3</strong>. Target setelah perbaikan: <strong>false, false, 2</strong>.
</p>

Ini eksperimen JavaScript tentang referensi. Pada React, perubahan state tetap disampaikan melalui setter.

<!--
Durasi 3–5 menit. Ganti dua baris alias dan push dengan: const changed = [...original, "Buku TypeScript"].
Jalankan lagi dan bandingkan ketiga hasil. original tidak lagi ikut berubah; changed dan copied masing-masing memiliki referensi berbeda.
Playground ini tidak menjalankan React dan tidak membuktikan jumlah re-render komponen.
Sumber: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
-->

---
class: module-content
---

### Event, Perhitungan, atau Effect?

Pilih tempat kode berdasarkan apa yang membuatnya perlu dijalankan.

| Kebutuhan di Toko Belajar                 | Tempat yang sesuai                        |
| ----------------------------------------- | ----------------------------------------- |
| Klik tombol untuk menambah jumlah         | **Event handler** seperti `add`           |
| Menghitung total dari jumlah              | **Saat render**, seperti di `BookSummary` |
| Menyalakan timer selama komponen dipasang | **Effect**, dengan fungsi cleanup         |

<v-clicks>

- `useEffect` menyinkronkan komponen dengan sistem di luar React.
- Timer browser adalah contoh sistem tersebut.
- Perubahan state tidak otomatis berarti kita perlu Effect.

</v-clicks>

<!--
Hubungkan kembali SearchForm Modul 03: submit form diproses sebagai event, bukan lewat Effect yang menunggu perubahan state.
Effect bukan tempat umum untuk memindahkan semua kode yang dianggap efek samping. Tindakan akibat satu klik biasanya berada pada handler klik itu.
Pengambilan data Next.js memiliki pola server/client tersendiri dan dibahas pada modul data; jangan mengajarkan fetch di Effect sebagai pilihan bawaan.
Sumber: https://react.dev/learn/you-might-not-need-an-effect
Sumber: https://react.dev/learn/synchronizing-with-effects
-->

---
class: module-content
---

### Praktik: Timer dengan Cleanup

Buat `src/app/products/[id]/StudyTimer.tsx`. Interval hidup selama komponen dipasang.

```tsx {5|7-10|12-13|all}
"use client";
import { useEffect, useState } from "react";

export default function StudyTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <p>Timer latihan: {seconds} detik</p>;
}
```

<BrutalCard v-click class="mt-3 text-sm">
  <strong>Setup:</strong> mulai interval. <strong>Cleanup:</strong> hentikan interval. Nilai awal <code>0</code> sama pada render server dan render awal browser; Effect berjalan di browser.
</BrutalCard>

<!--
Timer dipasang ke page pada latihan. StudyTimer adalah contoh interval, bukan pengukur waktu presisi: tab latar dan beban browser dapat menunda callback.
Effect dijalankan setelah hasil render diterapkan. Tidak perlu memberi janji bahwa semua Effect selalu menunggu browser selesai paint.
Updater s => s + 1 tidak membaca seconds dari closure Effect; setter stabil. Tidak ada props/state reaktif lain yang perlu dimasukkan sebagai dependensi pada contoh ini.
Jangan membuat setInterval langsung di badan komponen karena render ulang dapat membuat interval tambahan.
Sumber: https://react.dev/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect
Sumber: https://react.dev/reference/react/useEffect#connecting-to-an-external-system
-->

---
class: module-content
---

### Dependensi dan Cleanup Bekerja Bersama

Dependensi adalah nilai reaktif yang dibaca Effect, misalnya props atau state.

| Penulisan                | Kapan setup dijalankan di browser?                        |
| ------------------------ | --------------------------------------------------------- |
| `useEffect(setup, [])`   | Saat dipasang; tidak diulang karena perubahan props/state |
| `useEffect(setup, [id])` | Saat dipasang dan setelah render dengan `id` berbeda      |
| `useEffect(setup)`       | Setelah setiap hasil render komponen diterapkan           |

<v-clicks>

- Sebelum setup diulang karena dependensi berubah, React menjalankan cleanup lama.
- Cleanup juga berjalan ketika komponen dilepas.
- Dalam development dengan Strict Mode, ada pemeriksaan tambahan: **setup → cleanup → setup**.

</v-clicks>

<BrutalCard v-click class="mt-3 text-sm">
  Ikuti dependensi yang diperlukan kode. Jangan menghapus dependensi hanya untuk menghentikan Effect atau membungkam peringatan linter.
</BrutalCard>

<!--
Mount berarti komponen dipasang; unmount berarti dilepas. Commit adalah tahap React menerapkan hasil render ke DOM.
React membandingkan dependensi dengan Object.is. [] bukan jaminan berjalan tepat satu kali sepanjang umur aplikasi: ada remount, pemeriksaan development, dan mekanisme framework.
Sertakan semua nilai reaktif yang dibaca setup/cleanup. Setter useState stabil dan dapat tidak dicantumkan bila linter mengizinkan.
Effect tidak berjalan dalam render server. Siklus tambahan Strict Mode membantu menguji cleanup, bukan alasan untuk mematikan Strict Mode.
Pembahasan Activity dan mekanisme penyembunyian subtree tidak diperlukan untuk latihan dasar ini.
Sumber: https://react.dev/reference/react/useEffect#parameters
Sumber: https://react.dev/reference/react/useEffect#my-effect-runs-twice-when-the-component-mounts
-->

---
class: module-content
---

### Mengapa Total Tidak Perlu Effect?

Bandingkan dua versi `BookSummary`. Versi akhir kembali ke perhitungan yang sudah kita pakai.

````md magic-move
```tsx
"use client";
import { useEffect, useState } from "react";
type Props = { quantity: number };

export default function BookSummary(props: Props) {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    setTotal(props.quantity * 50000);
  }, [props.quantity]);

  return <p>Total latihan: {total} rupiah</p>;
}
```

```tsx
type Props = { quantity: number };

export default function BookSummary(props: Props) {
  const unitPrice = 50000;
  const total = props.quantity * unitPrice;

  return <p>Total latihan: {total} rupiah</p>;
}
```
````

<BrutalCard v-click class="mt-4">
  Total dapat dihitung dari props pada render yang sama. Menyimpannya lagi lewat Effect menambah proses pembaruan yang tidak diperlukan.
</BrutalCard>

<!--
Versi pertama sengaja menunjukkan pola yang perlu diperbaiki. Jangan mengganti file latihan dengan versi awal.
Pada versi pertama render awal memakai total 0; Effect kemudian meminta pembaruan. Saat quantity berubah, nilai total tersimpan juga perlu diselaraskan lagi.
Ini perhitungan murah, tidak perlu memoization. State tetap dipakai untuk pilihan pengguna yang memang perlu disimpan.
Menghapus directive pada BookSummary tidak menjadikannya Server Component ketika ia masih diimpor oleh BookQuantity client; hubungan import Modul 04 tetap berlaku.
Sumber: https://react.dev/learn/you-might-not-need-an-effect#updating-state-based-on-props-or-state
-->

---
class: module-content
---

### Latihan: Jumlah, Total, dan Timer

Waktu **10–15 menit**. Lanjutkan komponen yang sudah dibuat.

<v-clicks>

1. Coba tombol `+1`: jumlah dan total harus berubah bersama.
2. Tambahkan tombol **Reset** di `BookQuantity` yang memanggil `setQuantity(1)`.
3. Coba handler `addThree` dengan tiga updater. Dari jumlah 1, hasilnya **4** dan total **200000 rupiah**.
4. Di bagian import page, tambahkan `import StudyTimer from "./StudyTimer";`. Di dalam `main`, tampilkan `<StudyTimer />`.

</v-clicks>

<BrutalCard v-click class="mt-3 text-sm">
  <strong>Cek:</strong> reload mengembalikan jumlah ke 1; total langsung sesuai; timer mulai dari 0. Page tetap server dan state berada di komponen client.
</BrutalCard>

<!--
Import StudyTimer diletakkan bersama import lain. JSX StudyTimer diletakkan setelah BookQuantity di dalam main.
Untuk tombol +3 pada BookQuantity, gunakan onClick={addThree} dengan label +3. BookControls tetap menyediakan tombol +1.
Tombol Reset juga bertipe button. Setelah Reset, BookControls dan BookSummary membaca quantity yang sama dari parent.
Pengayaan cleanup: buat state boolean untuk menampilkan/menyembunyikan StudyTimer di komponen client. Pasang secara kondisional, bukan hanya disembunyikan dengan CSS.
Tambahkan log sementara di setup dan cleanup untuk melihat urutannya. Saat dilepas, interval lama dibersihkan; saat dipasang lagi, timer instance baru mulai dari 0.
Jika memakai Strict Mode, setup → cleanup → setup tambahan saat mount adalah perilaku development yang diharapkan.
Jalankan npm run build dari proyek Next.js kelas. Aturan Suspense untuk QueryLabel dari Modul 03 tetap berlaku.
-->

---
class: module-content
---

### Jika State Belum Bekerja Sesuai Harapan

Gunakan gejalanya untuk mencari bagian kode yang perlu diperiksa.

| Gejala                                                | Periksa                                                     |
| ----------------------------------------------------- | ----------------------------------------------------------- |
| Variabel berubah tetapi angka di layar tetap          | Pakai setter state; hindari mutasi langsung                 |
| Log tepat setelah setter masih menunjukkan nilai lama | Handler masih membaca snapshot render saat ini              |
| Render berulang tanpa berhenti                        | Jangan memanggil setter tanpa kondisi di badan komponen     |
| Tombol berubah, ringkasan tertinggal                  | Gunakan satu state parent; hitung total dari props          |
| Timer bertambah terlalu cepat                         | Pastikan interval dibuat di Effect dan punya cleanup        |
| Hook ditolak atau urutannya berubah                   | Pakai komponen client; letakkan hook sebelum kondisi/return |

<!--
Untuk timer ganda, bedakan dua instance StudyTimer yang sengaja dirender dari satu instance dengan interval yang tidak dibersihkan.
Jangan menambahkan Effect untuk memperbaiki semua gejala. Tentukan apakah masalah ada di penyimpanan, alur props, event, atau sinkronisasi eksternal.
Jika Effect terus berulang, periksa nilai dependensi dan pembaruan yang dilakukan setup; jangan menghapus array dependensi sebagai percobaan pertama.
Pesan error berbeda antarversi; tabel ini merangkum gejala dan arah pemeriksaan.
Sumber: https://react.dev/reference/react/useState#troubleshooting
Sumber: https://react.dev/reference/react/useEffect#troubleshooting
-->

---
class: module-content
---

### Prediksi: Satu State, Dua Tampilan

<LearningCheck
  question="Jumlah awal 1. Satu klik menjalankan tiga setQuantity(q => q + 1). BookSummary menghitung quantity × 50000. Apa hasil setelah pembaruan?"
  :options='["Jumlah 2 dan total 100000", "Jumlah 4 dan total 200000", "Jumlah 4, tetapi total perlu diperbarui lewat Effect"]'
  :answer="1"
  explanation="Ketiga updater diproses berurutan: 1 → 2 → 3 → 4. Total dihitung dari quantity yang sama saat render, sehingga tidak memerlukan state atau Effect tambahan."
/>

<!--
Beri waktu 30 detik untuk prediksi. Minta peserta menjelaskan alur nilai dan mengapa opsi Effect tidak diperlukan.
Pertanyaan lanjut: jika ketiga setter memakai quantity + 1, hasilnya berapa? Dari snapshot 1, hasilnya 2.
Gunakan Ulangi prediksi untuk kelompok berikutnya.
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 05

<v-clicks>

1. **State Menyimpan Pilihan**: Pakai setter dan updater yang sesuai. Perbarui objek/array dengan salinan.
2. **Satu Pemilik Data**: Bagikan lewat props; hitung nilai turunan saat render.
3. **Effect untuk Sinkronisasi**: Gunakan dependensi yang benar dan cleanup untuk proses seperti timer.

</v-clicks>

<BrutalCard v-click class="mt-4 bg-brutal-yellow/10">
  🚀 <strong>Selanjutnya di Modul 06:</strong> Bagaimana jika jumlah buku dibutuhkan navbar dan halaman keranjang? Kita pelajari Context dan Zustand untuk kebutuhan berbagi state yang lebih luas.
</BrutalCard>

<!--
Peserta siap lanjut bila dapat menjelaskan pemilik quantity, cara updater bekerja, alasan total bukan state terpisah, serta tugas cleanup.
Berhenti sebelum membuat Context, provider, atau store global. Callback props tetap pola yang sah; banyak lapisan perantara menjadi kasus diskusi Modul 06.
State lokal pada latihan belum menjadi keranjang bersama atau data yang tersimpan permanen.
-->

---
class: module-content
layout: two-cols
hideInToc: true
---

### Sumber dan Bacaan Lanjutan

Dokumentasi resmi yang diperiksa pada **8 Oktober 2026**.

::left::

#### Menyimpan dan Memperbarui Nilai

- [State sebagai memori komponen](https://react.dev/learn/state-a-components-memory)
- [useState dan perilaku setter](https://react.dev/reference/react/useState)
- [Snapshot dan antrean pembaruan](https://react.dev/learn/queueing-a-series-of-state-updates)
- [Memperbarui objek](https://react.dev/learn/updating-objects-in-state)
- [Memperbarui array](https://react.dev/learn/updating-arrays-in-state)

::right::

#### Pemilik State dan Effect

- [Berbagi state antar komponen](https://react.dev/learn/sharing-state-between-components)
- [Mempertahankan dan mereset state](https://react.dev/learn/preserving-and-resetting-state)
- [useEffect: dependensi dan cleanup](https://react.dev/reference/react/useEffect)
- [Kapan Effect tidak diperlukan](https://react.dev/learn/you-might-not-need-an-effect)
- [Aturan pemanggilan hook](https://react.dev/reference/rules/rules-of-hooks)

<!--
Referensi tambahan tentang struktur state, snapshot, Object.is, dan params Next.js ada di catatan slide terkait.
Slide ini untuk bacaan lanjutan, bukan tambahan materi wajib. Dokumentasi daring dapat berubah setelah tanggal audit.
-->
