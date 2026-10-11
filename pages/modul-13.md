---
layout: intro
badge: "MODUL 13"
badgeColor: "pink"
level: 1
---

## 13. Metadata, Gambar & Font Katalog

Lengkapi Toko Belajar dengan judul tab yang jelas, gambar yang ukurannya terjaga, dan font yang dilayani aplikasi sendiri.

<!--
Bekal: katalog dan getBook dari Modul 07–08, root layout dengan CartProvider/QueryProvider, serta UI Modul 12.
Acuan: Next.js 16.3.7, React 19, konfigurasi Cache Components nonaktif. Sumber diperiksa Oktober 2026.
Demo hasil sebelum membuka kode: dua tab detail memiliki judul berbeda, ilustrasi tetap proporsional, font dimuat dari origin aplikasi.
Kontrak HTTP telah dikenalkan pada Modul 10; workshop Swagger ada pada lampiran setelah Modul 11.
-->

---
class: module-content
---

### Tiga Perubahan yang Dapat Antum Periksa

<v-clicks>

1. **Metadata:** tab katalog dan tab detail menyebut halaman yang sedang dibuka.
2. **Gambar:** ilustrasi memiliki ruang sebelum selesai dimuat, sehingga konten di bawahnya tidak meloncat.
3. **Font:** teks memakai satu keluarga font, dengan file yang disajikan dari aplikasi.

</v-clicks>

<BrutalCard v-click class="mt-5 text-sm">
  Gunakan <a href="/examples/modul-13/README.md">aset dan file lengkap Modul 13</a>. Ilustrasi contoh adalah gambar pengganti, bukan sampul asli buku Open Library.
</BrutalCard>

<!--
Perlihatkan tab browser dan Network. Jangan menjanjikan ranking pencarian dari penambahan metadata.
Satu pertanyaan per tahap: bagaimana judul ditentukan, berapa ruang gambar, dari mana font dimuat?
-->

---
class: module-content
---

### Metadata Memberi Identitas pada Halaman

Judul di layar dan judul dokumen memiliki tugas berbeda.

| Bagian                 | Dilihat di mana?                               | Contoh                                    |
| ---------------------- | ---------------------------------------------- | ----------------------------------------- |
| `<h1>`                 | Isi halaman                                    | Katalog Buku                              |
| `metadata.title`       | Tab dan identitas dokumen                      | Katalog Buku \| Toko Belajar              |
| `metadata.description` | Deskripsi dokumen; dapat dipakai mesin pencari | Cari buku untuk belajar pengembangan web. |

<v-clicks>

- Gunakan metadata tetap untuk halaman yang identitasnya tetap.
- Gunakan `generateMetadata` ketika judul mengikuti data atau parameter route.
- Ekspor keduanya dari page/layout server; pilih salah satu pada file yang sama.

</v-clicks>

<!--
Metadata membantu identitas dan pratinjau; mesin pencari dapat memilih cuplikan lain.
Sumber: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
-->

---
class: module-content
---

### 1. Tetapkan Identitas Toko di Root Layout

Di `src/app/layout.tsx`, ganti ekspor metadata bawaan. Pertahankan import, provider, header, footer, dan `children` yang sudah ada.

```tsx {1|4-7|8|all}
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Toko Belajar",
    template: "%s | Toko Belajar",
  },
  description: "Katalog buku dan usulan bacaan untuk belajar web.",
};
```

<v-clicks>

- `default` dipakai jika route anak belum menentukan judul.
- `template` membungkus judul pada segmen anak.
- Ubah juga atribut bahasa root menjadi `<html lang="id">`.

</v-clicks>

<!--
Jangan membuat ekspor metadata kedua jika starter sudah memilikinya. Template di layout tidak berlaku pada title page pada segmen yang sama.
Sumber: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title
-->

---
class: module-content
---

### 2. Beri Judul pada Katalog

Tambahkan pada `src/app/products/page.tsx`, di luar fungsi komponen.

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Buku",
  description: "Cari buku dan buka detail bacaan di Toko Belajar.",
};
```

<BrutalCard v-click class="mt-4 text-sm">
  Buka <code>/products</code>. Judul tab menjadi <strong>Katalog Buku | Toko Belajar</strong>. Form pencarian dan batas Suspense tetap digunakan.
</BrutalCard>

<v-clicks>

- Periksa tab browser, bukan hanya `<h1>`.
- Di DevTools → Elements, temukan `<title>` dan `meta[name="description"]`.
- Metadata harus menggambarkan isi halaman yang benar-benar tersedia.

</v-clicks>

<!--
Tidak menambahkan use client ke page untuk memasang metadata.
Sumber: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
-->

---
class: module-content
---

### 3. Judul Detail Mengikuti Buku yang Dibuka

Di `src/app/products/[id]/page.tsx`, tambahkan import dan fungsi ini. Gunakan tipe `Props` yang sudah ada.

```tsx {1-2|4-7|8-11|all}
import type { Metadata } from "next";
import { getBook } from "@/lib/books";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = await getBook((await params).id);
  return {
    title: book.title,
    description: `Informasi buku ${book.title} di Toko Belajar.`,
  };
}
```

<BrutalCard v-click class="mt-4 text-sm">
  Pertahankan page, <code>BookDetails</code>, Suspense, dan <code>generateStaticParams</code>. Coba dua ID: judul tab harus mengikuti judul buku.
</BrutalCard>

<!--
getBook menggunakan fetch dan kebijakan cache Modul 07. Request fetch identik dapat dimemoisasi di generateMetadata dan render; jangan menjanjikan semua helper database otomatis dideduplikasi.
Jangan mengekspor metadata statis sekaligus generateMetadata pada file ini. notFound dari getBook tetap berlaku.
Sumber: https://nextjs.org/docs/app/getting-started/metadata-and-og-images#generated-metadata
-->

---
class: module-content
---

### 4. Sediakan Gambar Lokal untuk Latihan

Unduh [book-placeholder.png](/examples/modul-13/assets/book-placeholder.png), lalu simpan sebagai `public/images/book-placeholder.png` di aplikasi Next.js.

```text
public/images/book-placeholder.png
         ↓ disajikan melalui URL
/images/book-placeholder.png
```

<v-clicks>

- Gambar latihan berukuran **480 × 640 piksel**.
- Semua buku memakai ilustrasi pengganti yang sama; data API tetap hanya judul dan ID.
- Buka URL gambar langsung untuk memastikan path sudah benar.

</v-clicks>

<!--
Aset lokal menghindari ketergantungan gambar eksternal pada latihan pertama. Hak pakai aset dijelaskan pada README pendamping.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/public-folder
-->

---
class: module-content
---

### 5. Pasang Image pada BookDetails

Tambahkan import `Image` dan JSX ini pada `src/app/products/[id]/BookDetails.tsx`, setelah judul buku.

```tsx
import Image from "next/image";
```

```tsx {1-5|6-7|all}
<Image
  src="/images/book-placeholder.png"
  alt=""
  width={480}
  height={640}
  sizes="(max-width: 640px) 50vw, 240px"
  className="h-auto w-1/2 max-w-60"
/>
```

<v-clicks>

- `width` dan `height` memberi rasio; CSS menentukan ukuran tampil.
- `sizes` membantu browser memilih ukuran file yang sesuai.
- `alt=""` tepat di sini karena ilustrasi dekoratif; judul buku sudah tertulis di dekatnya.

</v-clicks>

<!--
Jika kelak gambar memberi informasi penting, tulis alt sesuai maknanya. Jangan menyebut placeholder sebagai sampul asli.
Default Image memuat secara lazy. Jangan preload semua gambar; prioritaskan hanya gambar penting berdasarkan pengukuran.
Sumber: https://nextjs.org/docs/app/getting-started/images
Sumber: https://nextjs.org/docs/app/api-reference/components/image
-->

---
class: module-content
---

### Periksa Gambar saat Jaringan Lambat

<v-clicks>

1. Buka DevTools → Network, nonaktifkan cache browser, lalu pilih throttling.
2. Reload detail. Ruang gambar sudah tersedia sebelum gambarnya selesai dimuat.
3. Kecilkan viewport. Gambar tidak melampaui kontainer dan tidak terdistorsi.
4. Periksa request `/_next/image`: URL, lebar yang diminta, dan ukuran transfer.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Ukuran transfer dipengaruhi sumber, format, dan ukuran tampilan. Bandingkan hasil pengukuran; penggunaan komponen Image saja belum membuktikan halaman cepat.
</BrutalCard>

<!--
Periksa production build untuk perilaku layanan gambar yang akan dirilis. Hubungkan pergeseran layout dengan CLS pada Modul 16.
Sumber: https://nextjs.org/docs/app/getting-started/images
-->

---
class: module-content
---

### 6. Siapkan Font Lokal yang Bisa Dibangun Ulang

Unduh [Geist.ttf dan lisensinya](/examples/modul-13/README.md), lalu tempatkan di `src/app/fonts/`.

Di bagian atas `src/app/layout.tsx`:

```tsx
import localFont from "next/font/local";

const geist = localFont({
  src: "./fonts/Geist.ttf",
  display: "swap",
  variable: "--font-geist-sans",
});
```

<v-clicks>

- Path `src` relatif terhadap file yang memanggil `localFont`.
- Font lokal tidak perlu diunduh dari layanan font saat build.
- Jika starter sudah memakai font Google, hapus definisi dan import lama yang digantikan.

</v-clicks>

<!--
next/font/google juga menyajikan font dari aplikasi, tetapi pengambilan aset berlangsung saat build. Pilihan lokal membuat latihan dapat dibangun tanpa layanan font eksternal.
Font Geist menggunakan SIL Open Font License; salin lisensinya bersama aset.
Sumber: https://nextjs.org/docs/app/getting-started/fonts
Sumber: https://github.com/google/fonts/tree/main/ofl/geist
-->

---
class: module-content
---

### 7. Terapkan Font tanpa Melepas Provider

Tambahkan `geist.variable` pada class `<body>` yang sudah ada. Pertahankan isi layout dan class lain yang masih dipakai.

```tsx
<body className={`${geist.variable} antialiased`}>
  {/* CartProvider, Navbar, QueryProvider, children, dan footer tetap di sini */}
</body>
```

Pada `src/app/globals.css`, gunakan variabel tersebut untuk font dasar:

```css
body {
  font-family: var(--font-geist-sans), Arial, sans-serif;
}
```

<BrutalCard v-click class="mt-4 text-sm">
  Perbarui deklarasi <code>body</code> yang sudah ada. Jika memakai utility <code>font-sans</code>, pastikan token <code>--font-sans</code> pada <code>@theme inline</code> juga mengarah ke <code>var(--font-geist-sans)</code>.
</BrutalCard>

<!--
Kode body menunjukkan tempat perubahan, bukan file layout lengkap untuk ditempel. File lengkap tersedia pada pendamping. Bila starter memiliki Geist Mono, boleh dipertahankan untuk code; jangan menyisakan referensi ke variabel yang telah dihapus.
Sumber: https://nextjs.org/docs/app/api-reference/components/font#variable
-->

---
class: module-content
---

### Checkpoint: Buktikan Ketiga Hasilnya

| Pemeriksaan                          | Hasil yang diharapkan                                    |
| ------------------------------------ | -------------------------------------------------------- |
| Buka katalog dan dua detail          | Judul tab sesuai tiap halaman                            |
| Inspeksi metadata                    | Deskripsi sesuai isi halaman                             |
| Reload gambar dengan throttling      | Rasio dan ruang gambar tetap terjaga                     |
| Network → Font                       | File font berasal dari origin aplikasi                   |
| Katalog, cart, dan usulan            | Interaksi dari modul sebelumnya tetap berjalan           |
| `npm run build` lalu `npm run start` | Metadata, gambar, dan font bekerja pada build production |

<BrutalCard v-click class="mt-4 text-sm">
  Tantangan kecil: tambahkan metadata statis pada halaman <strong>Tentang</strong>, lalu jelaskan mengapa halaman itu tidak membutuhkan <code>generateMetadata</code>.
</BrutalCard>

<!--
Jika build fetch gagal, periksa API buku/fixture Modul 07. Font lokal tidak menghilangkan ketergantungan data buku eksternal.
-->

---
class: module-content
---

### Pengayaan: Sampul Eksternal dan Pratinjau Tautan

Setelah latihan inti selesai, lanjutkan sesuai kebutuhan katalog.

<v-clicks>

- **Sampul dari API:** periksa URL yang valid, hak penggunaan, dan kasus tanpa sampul.
- **remotePatterns:** izinkan host/path gambar tertentu pada `next.config.ts`.
- **Open Graph:** tambahkan gambar pratinjau dan metadata untuk tautan publik.
- **Sitemap dan robots:** atur halaman yang perlu ditemukan; keduanya bukan pembatas akses data pribadi.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Data usulan berakun tetap dilindungi di server pada Modul 14. Menambahkan <code>noindex</code> atau menghapus URL dari sitemap tidak menggantikan otorisasi.
</BrutalCard>

<!--
Tidak perlu mengganti sumber data atau menambah schema katalog pada jalur inti.
Sumber: https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
Sumber: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
-->

---
class: module-content
---

### Prediksi: Judul Detail atau Judul Toko?

<LearningCheck
  id="modul-13-metadata"
  question="Root layout punya template '%s | Toko Belajar'. Detail buku membaca judul dari getBook. Bagaimana membuat judul tab mengikuti buku?"
  :options='["Pakai generateMetadata pada page server dan kembalikan title buku", "Ganti h1 saja; tab otomatis mengikuti", "Ubah root layout menjadi Client Component"]'
  :answer="0"
  explanation="generateMetadata membaca data route dan mengembalikan metadata. Template root menambahkan nama toko. h1 adalah isi halaman; tidak otomatis mengubah judul dokumen."
/>

<!--
Minta prediksi sebelum jawaban ditampilkan. Lanjutkan dengan pertanyaan: mengapa metadata tidak diletakkan di BookNotice client?
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 13

<v-clicks>

1. **Identitas Halaman:** metadata tetap untuk katalog; generateMetadata untuk detail yang mengikuti data.
2. **Ruang Gambar:** rasio, ukuran tampilan, dan alt dipilih sesuai peran gambar.
3. **Font Terencana:** next/font melayani aset dari aplikasi; provider dan perilaku layout tetap dipertahankan.

</v-clicks>

<BrutalCard v-click class="mt-4 bg-brutal-pink/10">
  🚀 <strong>Selanjutnya di Modul 14:</strong> Katalog publik sudah lebih lengkap. Sekarang batasi usulan buku agar setiap akun hanya mengelola miliknya sendiri.
</BrutalCard>

---
class: module-content
layout: two-cols
hideInToc: true
---

### Sumber dan Bahan Latihan

Dokumentasi resmi diperiksa **Oktober 2026**. Contoh mengikuti baseline kelas, bukan klaim versi terbaru.

::left::

#### Metadata dan Gambar

- [Metadata dan OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Image Optimization](https://nextjs.org/docs/app/getting-started/images)
- [API Image dan remotePatterns](https://nextjs.org/docs/app/api-reference/components/image)

::right::

#### Font dan Praktik

- [Font Optimization](https://nextjs.org/docs/app/getting-started/fonts)
- [API next/font](https://nextjs.org/docs/app/api-reference/components/font)
- [Aset, lisensi, dan file lengkap](/examples/modul-13/README.md)
- [Workshop Swagger setelah Modul 11](/examples/pengayaan/swagger.md)
