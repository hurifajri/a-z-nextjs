---
layout: intro
badge: "MODUL 09"
badgeColor: "yellow"
level: 1
---

## 09. Usulan Buku: Form, Validasi & Mutasi

Menambahkan form usulan buku ke Toko Belajar dengan React Hook Form, Valibot, dan TanStack Query.

<!--
Bekal: form pencarian Modul 03, props dan custom hook Modul 05–06, fetch/status HTTP serta QueryProvider dari Modul 08.
Target: peserta dapat memvalidasi input, menampilkan pesan per field, mengirim POST, serta menangani pending, gagal, dan berhasil.
Praktik utama: form usulan buku di /suggestions, memakai API simulasi JSONPlaceholder. Respons sukses tidak berarti data tersimpan permanen.
Route Handlers, database/Drizzle, dan Server Actions dimulai di Modul 10.
Acuan paket yang diperiksa pada 8 Oktober 2026: React Hook Form 7.89.0, Valibot 1.5.0, @hookform/resolvers 5.9.1, dan TanStack Query v5 dari Modul 08.
-->

---
class: module-content
layout: two-cols
---

### Dari Mencari Buku ke Mengirim Usulan

Katalog Toko Belajar sudah memakai Open Library. Kini pengguna dapat mengusulkan judul buku untuk dipertimbangkan pengelola toko.

::left::

#### Modul 08: Membaca

- Pengguna mengirim kata kunci.
- `useQuery` mengambil hasil pencarian.
- `queryKey` memberi identitas cache.
- Hasil membuka detail buku Modul 07.

::right::

#### Modul 09: Mengirim

<v-clicks>

1. Pengguna mengisi judul buku dan alasan usulan.
2. Form memeriksa aturan input.
3. `useMutation` mengirim usulan.
4. UI menjelaskan hasil pengiriman.

</v-clicks>

::bottom::

<BrutalCard v-click class="text-sm">
  Satu fitur berlanjut: <strong>09 form → 10 API sendiri → 11 penyimpanan dan CRUD usulan buku</strong>. Katalog Open Library tetap menjadi sumber pencarian.
</BrutalCard>

<!--
Mutasi berarti operasi yang meminta perubahan data, berbeda dari query yang membaca data.
SearchForm sederhana dari Modul 03 tetap sesuai kebutuhannya; tidak perlu mengganti setiap form menjadi React Hook Form.
QueryProvider harus tetap membungkus children pada root layout; useMutation juga memerlukannya.
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/mutations
-->

---
class: module-content
layout: two-cols
---

### Siapa yang Menyimpan Nilai Input?

Controlled dan uncontrolled menjelaskan hubungan nilai input dengan React.

::left::

#### Controlled: Nilai dari State

```tsx
"use client";
import { useState } from "react";

export default function TitleInput() {
  const [title, setTitle] = useState("");
  return (
    <label>
      Judul buku
      <input
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </label>
  );
}
```

::right::

#### Uncontrolled: Nilai di Elemen Input

```tsx
export default function TitleInput() {
  return (
    <label>
      Judul buku
      <input name="title" defaultValue="" />
    </label>
  );
}
```

Nilai dapat dibaca saat submit dengan `FormData`, seperti Modul 03, atau didaftarkan ke library form.

::bottom::

<BrutalCard v-click class="text-sm">
  Pada contoh controlled, ketikan memperbarui state. Form uncontrolled juga dapat render ulang saat error atau status berubah.
</BrutalCard>

<!--
Dua contoh alternatif, bukan dua komponen dengan nama sama untuk satu file.
defaultValue hanya memberi nilai awal. Jangan menggabungkan value dan defaultValue atau berpindah controlled/uncontrolled selama masa hidup input.
React Hook Form menggunakan register untuk input native; Controller tersedia untuk integrasi komponen controlled. Detail Controller di luar praktik utama.
Sumber: https://react.dev/reference/react-dom/components/input
Sumber: https://react-hook-form.com/get-started
-->

---
class: module-content
---

### Tiga Alat dengan Tugas yang Jelas

Kita memakai library untuk mengelola nilai, aturan, dan status pengiriman.

| Alat            | Tugas pada Latihan                                           |
| :-------------- | :----------------------------------------------------------- |
| React Hook Form | Mendaftarkan input, menjalankan submit, menyimpan error form |
| Valibot         | Memeriksa bentuk data dan aturan setiap field                |
| TanStack Query  | Menjalankan mutasi dan memberikan status hasilnya            |

Jalankan di **proyek Next.js latihan**:

```bash
npm install react-hook-form@7 valibot@1 @hookform/resolvers@5
```

<BrutalCard v-click class="mt-4 text-sm">
  <strong>Resolver</strong> adalah penghubung: hasil pemeriksaan Valibot menjadi error field yang dipahami React Hook Form.
</BrutalCard>

<!--
@tanstack/react-query@5 sudah terpasang pada Modul 08. Tidak perlu provider tambahan untuk React Hook Form pada contoh ini.
Library form membantu mengelola error, touched/dirty state, dan submit; manfaatnya tidak cukup dinilai hanya dari jumlah render.
Alternatif: TanStack Form juga mengelola state/validasi form. Untuk schema, Zod 4 dan Zod Mini tersedia. Pilih sesuai integrasi tim dan ukur bundle proyek, bukan klaim ukuran/performa tanpa konteks.
Valibot dipakai karena API modularnya cocok untuk menjelaskan aturan bertahap, bukan karena semua proyek wajib memakainya.
Sumber integrasi: https://github.com/react-hook-form/resolvers#valibot
Sumber alternatif: https://tanstack.com/form/latest/docs/overview
Sumber alternatif: https://zod.dev/packages/mini
-->

---
class: module-content
---

### Aturan untuk Judul Buku dan Alasan Usulan

Buat `src/lib/book-suggestion-schema.ts`. Setiap aturan mempunyai pesan yang dapat dibaca pengguna.

```ts {all|3-9|10-16|18|all}
import * as v from "valibot";

export const BookSuggestionSchema = v.object({
  title: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(3, "Judul minimal 3 karakter."),
    v.maxLength(80, "Judul maksimal 80 karakter."),
  ),
  reason: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(10, "Alasan minimal 10 karakter."),
    v.maxLength(500, "Alasan maksimal 500 karakter."),
  ),
});

export type BookSuggestionValues = v.InferOutput<typeof BookSuggestionSchema>;
```

`InferOutput` menghasilkan tipe dari schema. Pemeriksaan runtime tetap memerlukan Valibot saat data diproses.

<!--
reason berarti alasan usulan buku. Nama field register harus sama dengan key schema. Helper akan memetakan reason ke body yang diminta API simulasi.
v.pipe menjalankan urutan schema/action. trim membuang spasi tepi, lalu minLength dan maxLength memeriksa panjang hasilnya.
Pada schema ini, input dan output sama-sama berisi dua string. Jika memakai transform yang mengubah tipe, bedakan InferInput dan InferOutput serta generik useForm<Input, Context, Output>.
Batas panjang adalah aturan latihan, bukan ketentuan Open Library atau JSONPlaceholder.
Sumber: https://valibot.dev/guides/pipelines/
Sumber: https://valibot.dev/guides/infer-types/
-->

---
class: module-content
---

### Urutan Validasi Mengubah Hasil

Teks yang hanya berisi spasi seharusnya tidak lolos sebagai judul.

````md magic-move
```ts
import * as v from "valibot";

const TitleSchema = v.pipe(
  v.string(),
  v.minLength(3, "Judul minimal 3 karakter."),
);
v.safeParse(TitleSchema, "   ").success; // true
```

```ts
import * as v from "valibot";

const TitleSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(3, "Judul minimal 3 karakter."),
);
v.safeParse(TitleSchema, "   ").success; // false
```
````

<BrutalCard v-click class="mt-4 text-sm">
  <strong>safeParse</strong> mengembalikan hasil dengan penanda success. <strong>parse</strong> melempar error saat data tidak valid.
</BrutalCard>

<!--
Ilustrasi urutan aturan, bukan pengganti BookSuggestionSchema. Contoh akhir schema latihan sudah menggunakan trim sebelum aturan panjang.
safeParse yang berhasil menyimpan data olahan di result.output; kegagalan memberi result.issues.
Type assertion seperti as BookSuggestionValues tidak menjalankan aturan ini.
Sumber: https://valibot.dev/guides/parse-data/
Sumber: https://valibot.dev/api/trim/
-->

---
class: module-content
layout: two-cols
---

### Kenali Kontrak API Latihan

Kita memakai endpoint publik JSONPlaceholder untuk mencoba pengiriman JSON.

::left::

#### Request

```text
POST
https://jsonplaceholder.typicode.com/posts
Content-Type: application/json
```

```json
{
  "title": "Learning React",
  "body": "Untuk latihan komponen React.",
  "userId": 1
}
```

::right::

#### Respons Simulasi

```json
{
  "id": 101,
  "title": "Learning React",
  "body": "Untuk latihan komponen React.",
  "userId": 1
}
```

API menyimulasikan pembuatan data. ID respons dapat berulang pada pengiriman berbeda.

::bottom::

<BrutalCard v-click class="text-sm">
  Data <strong>tidak disimpan permanen</strong>. GET berikutnya tidak akan mengembalikan usulan yang baru dikirim. Gunakan teks contoh untuk latihan.
</BrutalCard>

<!--
JSONPlaceholder kini memuat panduan pada halaman utama; URL /guide/ mengarah ke sana saat audit.
userId: 1 adalah data dummy sesuai contoh API, bukan identitas login pengguna Toko Belajar.
Endpoint ini bukan API usulan buku sesungguhnya dan tidak menjamin aturan bisnis schema kita diterapkan di server.
Frontend mengonsumsi API yang tersedia; membuat endpoint sendiri dan menyimpan data dibahas mulai Modul 10.
Sumber: https://jsonplaceholder.typicode.com/
-->

---
class: module-content
---

### Kirim Data dan Periksa Respons

Buat `src/lib/suggestions.ts`. Seperti Modul 08, status HTTP dan JSON tetap diperiksa.

```ts {all|4|7-15|16-17|all}
import * as v from "valibot";
import type { BookSuggestionValues } from "./book-suggestion-schema";

const ReceiptSchema = v.object({ id: v.number(), title: v.string() });

export async function sendSuggestion(values: BookSuggestionValues) {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: values.title,
      body: values.reason,
      userId: 1,
    }),
  });
  if (!res.ok) throw new Error(`Pengiriman: HTTP ${res.status}`);
  return v.parse(ReceiptSchema, await res.json());
}
```

Helper memetakan alasan `reason` ke `body` milik JSONPlaceholder. `ReceiptSchema` memeriksa respons yang akan ditampilkan.

<!--
Promise berhasil hanya setelah HTTP dan data respons diterima dengan format yang diharapkan.
Jangan catch lalu return objek sukses palsu. Error harus diteruskan agar useMutation mengetahui kegagalan.
v.parse memeriksa saat runtime; tipe TypeScript return disimpulkan dari schema. Respons berisi field lain boleh ada, tetapi UI hanya memakai id dan title.
Status 204 tidak mempunyai body. Helper ini khusus kontrak POST yang mengembalikan JSON; jangan menyalinnya tanpa menyesuaikan kontrak endpoint lain.
Sumber: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
Sumber: https://valibot.dev/guides/parse-data/
Sumber: https://jsonplaceholder.typicode.com/
-->

---
class: module-content
---

### Hubungkan Form, Schema, dan Mutasi

Buat `src/hooks/use-suggestion-form.ts`. Langkah berikutnya menambahkan fungsi submit ke hook ini.

```ts {all|12-15|16-19|all}
"use client";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import {
  BookSuggestionSchema,
  type BookSuggestionValues,
} from "@/lib/book-suggestion-schema";
import { sendSuggestion } from "@/lib/suggestions";

export function useSuggestionForm() {
  const form = useForm<BookSuggestionValues>({
    resolver: valibotResolver(BookSuggestionSchema),
    defaultValues: { title: "", reason: "" },
  });
  const mutation = useMutation({
    mutationFn: sendSuggestion,
    retry: false,
  });
  return { form, mutation };
}
```

`useMutation` menyiapkan pengiriman. Request baru dijalankan ketika kita memanggil `mutate` atau `mutateAsync`.

<!--
Mode validasi bawaan RHF adalah onSubmit. Setelah submit, input yang bermasalah diperiksa ulang saat berubah menurut reValidateMode bawaan.
defaultValues memberi nilai awal dan tujuan reset. Tidak ada useState duplikat untuk title/reason.
retry false sama dengan bawaan mutasi v5 dan sengaja ditulis agar berbeda dari default query Modul 08.
Sumber: https://react-hook-form.com/docs/useform
Sumber: https://github.com/react-hook-form/resolvers#valibot
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/mutations
-->

---
class: module-content
---

### Tunggu Hasil sebelum Mengosongkan Form

Di dalam `useSuggestionForm`, ganti baris `return` lama dengan potongan berikut.

```ts {all|1-5|6-10|13|all}
async function submit(values: BookSuggestionValues) {
  form.clearErrors("root");
  try {
    await mutation.mutateAsync(values);
    form.reset();
  } catch {
    form.setError("root.server", {
      message: "Pengiriman belum terkonfirmasi. Input tetap ada.",
    });
  }
}

return { form, mutation, submit };
```

- `mutateAsync` memberi Promise yang dapat ditunggu dengan `await`.
- Berhasil → form dikosongkan; gagal → input tersedia untuk diperbaiki atau dikirim kembali.

<!--
Potongan ditempatkan sebelum penutup fungsi hook, bukan di module scope.
handleSubmit dari RHF memanggil submit hanya setelah resolver menyatakan data valid. Ia menunggu Promise callback, sehingga isSubmitting mengikuti seluruh pengiriman.
mutate mengembalikan void; jangan await mutate lalu menganggap request sudah selesai.
mutateAsync menolak Promise saat gagal. Catch diperlukan agar callback form menangani error; setError root.server menyimpan pesan yang tidak terkait satu field.
Pesan memakai belum terkonfirmasi: jika jaringan putus setelah server memproses request, klien belum tentu mengetahui hasil akhirnya.
reset form berbeda dari mutation.reset(): yang kedua hanya membersihkan status/hasil mutasi, bukan membatalkan perubahan di server.
Sumber: https://react-hook-form.com/docs/useform/handlesubmit
Sumber: https://react-hook-form.com/docs/useform/seterror
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/mutations
-->

---
class: module-content
---

### Daftarkan Field Judul dan Pesan Error

Buat `src/app/suggestions/TitleField.tsx`. `register` menghubungkan input native ke form.

```tsx
import { useId } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { BookSuggestionValues } from "@/lib/book-suggestion-schema";
type Props = { form: UseFormReturn<BookSuggestionValues> };

export default function TitleField({ form }: Props) {
  const id = useId();
  const error = form.formState.errors.title;
  return (
    <div className="grid gap-1">
      <label htmlFor={id}>Judul buku</label>
      <input
        id={id}
        className="border p-2"
        readOnly={form.formState.isSubmitting}
        aria-invalid={!!error}
        aria-describedby={`${id}-error`}
        {...form.register("title")}
      />
      <p id={`${id}-error`} role="alert">
        {error?.message}
      </p>
    </div>
  );
}
```

<!--
UseFormReturn adalah tipe objek yang dikembalikan useForm. Form diteruskan lewat props seperti pada Modul 05; tidak memerlukan context baru.
register memberi name, ref, onChange, dan onBlur. Jangan menimpanya dengan value/onChange buatan sendiri pada latihan ini.
useId menghasilkan ID unik saat komponen dipakai berulang, termasuk pada form edit Modul 11. htmlFor terhubung ke id input; aria-describedby terhubung ke pesan error.
Sumber ID: https://react.dev/reference/react/useId
readOnly menahan pengeditan selama submit tanpa membuang nilai input. Field tetap dapat menerima fokus.
Sumber: https://react-hook-form.com/docs/useform/register
Sumber: https://react-hook-form.com/advanced-usage#AccessibilityA11y
-->

---
class: module-content
---

### Daftarkan Field Alasan dengan Pola yang Sama

Buat `src/app/suggestions/ReasonField.tsx`. Field `reason` menyimpan alasan buku tersebut diusulkan untuk Toko Belajar.

```tsx
import { useId } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { BookSuggestionValues } from "@/lib/book-suggestion-schema";
type Props = { form: UseFormReturn<BookSuggestionValues> };

export default function ReasonField({ form }: Props) {
  const id = useId();
  const error = form.formState.errors.reason;
  return (
    <div className="grid gap-1">
      <label htmlFor={id}>Alasan usulan</label>
      <textarea
        id={id}
        className="border p-2"
        readOnly={form.formState.isSubmitting}
        aria-invalid={!!error}
        aria-describedby={`${id}-error`}
        {...form.register("reason")}
      />
      <p id={`${id}-error`} role="alert">
        {error?.message}
      </p>
    </div>
  );
}
```

<!--
Dua field dipisah agar label, register, dan error dapat dibaca satu per satu. Komponen diimpor melalui SuggestionForm yang menjadi batas use client.
Tidak ada field wajib tersembunyi: title dan reason sama-sama tersedia untuk diisi.
Placeholder bukan pengganti label. Tombol dan pesan tetap dapat diakses tanpa mouse.
Sumber: https://react-hook-form.com/docs/useform/register
Sumber: https://react.dev/reference/react-dom/components/textarea
-->

---
class: module-content
---

### Gabungkan Field dan Status Pengiriman

Buat `src/app/suggestions/SuggestionForm.tsx`. `handleSubmit` memeriksa data sebelum memanggil `submit`.

```tsx
"use client";
import { useSuggestionForm } from "@/hooks/use-suggestion-form";
import TitleField from "./TitleField";
import ReasonField from "./ReasonField";

export default function SuggestionForm() {
  const { form, mutation, submit } = useSuggestionForm();
  return (
    <form onSubmit={form.handleSubmit(submit)} noValidate>
      <TitleField form={form} />
      <ReasonField form={form} />
      <button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Mengirim…" : "Kirim usulan"}
      </button>
      <p role="alert">{form.formState.errors.root?.server?.message}</p>
      {mutation.isSuccess && (
        <p role="status">Respons simulasi terakhir: {mutation.data.title}</p>
      )}
    </form>
  );
}
```

<!--
noValidate menonaktifkan pesan validasi HTML bawaan agar pesan dari resolver dipakai. Itu tidak menonaktifkan schema Valibot atau validasi server.
Kegagalan field ada dekat input; kegagalan pengiriman ada pada root.server.
isSubmitting mencakup validasi dan callback submit asinkron. mutation.isPending menjelaskan proses mutasi; keduanya bisa memiliki rentang waktu berbeda.
Label Respons simulasi terakhir sengaja dipakai: jika pengguna kemudian memasukkan data tidak valid, pesan itu merujuk pengiriman sebelumnya.
Tombol disabled dan field readOnly mengurangi kiriman berulang serta perubahan draf selama pengiriman; ini bukan jaminan idempotensi server.
Sumber: https://react-hook-form.com/docs/useform/handlesubmit
Sumber: https://react-hook-form.com/docs/useform/formstate
-->

---
class: module-content
layout: two-cols
---

### Tambahkan Halaman Usulan Buku

Buat `src/app/suggestions/page.tsx`, lalu tambahkan tautannya pada katalog.

::left::

#### Halaman Server

```tsx
import SuggestionForm from "./SuggestionForm";

export default function SuggestionsPage() {
  return (
    <main className="p-8">
      <h1>Usulan Buku Toko Belajar</h1>
      <p>Usulkan judul untuk katalog toko.</p>
      <p>Simulasi: belum disimpan permanen.</p>
      <SuggestionForm />
    </main>
  );
}
```

::right::

#### Tautan pada Katalog

Di `src/app/products/page.tsx`, tambahkan setelah tautan promo:

```tsx
<Link href="/suggestions">Usulkan buku</Link>
```

Import `Link` sudah ada. Root layout masih memasang `QueryProvider` dan `CartProvider` dari modul sebelumnya.

::bottom::

<BrutalCard v-click class="text-sm">
  Uji dari <strong>/products</strong> → <strong>Usulkan buku</strong>. Form ini tetap bagian dari proyek Toko Belajar.
</BrutalCard>

<!--
Page tidak perlu use client. SuggestionForm adalah batas klien; TitleField dan ReasonField masuk graph impor klien tersebut.
Jika rute dikelompokkan dalam (shop) dari pengayaan Modul 02, letakkan suggestions di grup yang sesuai; URL tetap /suggestions.
Tidak membuat route.ts atau endpoint lokal pada modul ini.
Sumber: https://nextjs.org/docs/app/getting-started/server-and-client-components
-->

---
class: module-content
---

### Bedakan Tiga Jenis Umpan Balik

Klik untuk mengikuti alur yang dilihat pengguna.

<v-switch>
<template #1>

#### 1. Input Perlu Diperbaiki

- Pengguna menekan **Kirim usulan**.
- Resolver menemukan judul atau alasan tidak valid.
- Pesan muncul dekat field; request POST belum dikirim.
- RHF dapat memfokuskan field pertama yang bermasalah.

</template>
<template #2>

#### 2. Pengiriman Sedang Berjalan atau Gagal

- Tombol menunjukkan **Mengirim…** selama submit berlangsung.
- Jika pengiriman gagal, pesan muncul di tingkat form.
- Input dipertahankan agar pengguna bisa meninjau atau mencoba lagi.
- Periksa status HTTP/koneksi; jangan menyamarkan error sebagai sukses.

</template>
<template #3>

#### 3. Respons Berhasil Diterima

- HTTP dan format respons sudah diperiksa oleh helper.
- `mutateAsync` selesai, lalu `form.reset()` mengosongkan input.
- UI menampilkan judul dari respons simulasi.
- Pada API latihan ini, sukses belum berarti ada data baru yang bisa dibaca kembali.

</template>
</v-switch>

<!--
shouldFocusError bawaan true; fokus memerlukan ref input terdaftar dan input dapat difokuskan.
Jika browser offline, mutasi dengan networkMode bawaan dapat paused sampai koneksi tersedia. Pesan Mengirim menggambarkan proses submit yang belum selesai.
isSubmitSuccessful pada RHF bukan bukti HTTP berhasil jika callback menelan kegagalan; contoh ini memakai setError saat catch dan status mutation untuk hasil API.
Sumber: https://react-hook-form.com/docs/useform
Sumber: https://react-hook-form.com/docs/useform/formstate
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/network-mode
-->

---
class: module-content
layout: two-cols
---

### Checkpoint: Buktikan Alurnya

Buka DevTools → Network. Cocokkan tindakan pengguna dengan request yang terjadi.

::left::

#### Validasi dan Pengiriman

1. Kirim form kosong: dua pesan field.
2. Isi judul dengan spasi: tetap ditolak.
3. Isi judul dan alasan sesuai aturan.
4. Kirim: satu percobaan POST terlihat.
5. Sukses: judul respons tampil; form kosong.

::right::

#### Coba Kegagalan

<v-clicks>

- Blokir request lewat DevTools atau gunakan mock HTTP 500.
- Kirim data valid: tampil pesan form.
- Judul dan alasan tetap tersedia.
- Pulihkan request, lalu coba lagi.
- Tab dan Enter tetap bisa dipakai untuk mengisi dan mengirim.

</v-clicks>

::bottom::

<BrutalCard v-click class="text-sm">
  Mematikan koneksi dapat membuat mutasi menunggu. Untuk kegagalan yang pasti, gunakan <strong>request blocking</strong> atau respons tiruan.
</BrutalCard>

<!--
Jalankan npm run build pada proyek latihan setelah semua file digabungkan.
Jangan berharap API simulasi menolak aturan panjang milik kita atau menyimpan hasil POST. Untuk menguji server yang benar-benar memvalidasi, lanjutkan ke Modul 10.
Gunakan response override/mock untuk respons HTTP 500 atau JSON dengan tipe salah. Pulihkan konfigurasi setelah percobaan.
Mengubah validasi HTML browser tidak mengubah aturan resolver; noValidate pada form sudah memusatkan pesan melalui schema.
-->

---
class: module-content
---

### Pilih Metode Sesuai Kontrak Endpoint

POST adalah langkah praktik kita. Metode lain diperlukan saat aplikasi mulai mengelola data yang tersimpan.

| Metode | Maksud Umum                                              | Contoh Kebutuhan             |
| :----- | :------------------------------------------------------- | :--------------------------- |
| GET    | Membaca representasi data                                | Membaca daftar usulan        |
| POST   | Memproses data; sering dipakai untuk membuat entri       | Mengirim usulan baru         |
| PUT    | Membuat atau mengganti representasi pada alamat tertentu | Mengganti isi suatu usulan   |
| PATCH  | Menerapkan perubahan sebagian                            | Memperbarui judul dan alasan |
| DELETE | Menghapus resource yang dituju                           | Menghapus usulan             |

<BrutalCard v-click class="mt-4 text-sm">
  Endpoint menentukan field, izin, dan bentuk respons. Mengganti tulisan <strong>POST</strong> menjadi <strong>PATCH</strong> saja belum tentu menghasilkan request yang benar.
</BrutalCard>

<!--
POST tidak terbatas pada create. PUT bermakna penggantian representasi; perilaku field yang tidak dikirim mengikuti kontrak server.
PUT dan DELETE bersifat idempoten menurut semantik HTTP: pengulangan permintaan yang sama mempunyai efek yang dimaksud sama, tetapi responsnya tidak harus identik. POST dan PATCH tidak dijamin idempoten.
Tidak membuat route.ts atau mengimplementasikan CRUD backend di sini; itu bagian Modul 10.
Sumber: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods
-->

---
class: module-content
---

### Status HTTP Membantu Memilih Tindakan

Baca status bersama body respons dan dokumentasi API.

| Status          | Arti yang Perlu Dikenali                       | Tindakan UI                                   |
| :-------------- | :--------------------------------------------- | :-------------------------------------------- |
| 200 / 201 / 204 | Berhasil / dibuat / berhasil tanpa body        | Tampilkan hasil sesuai kontrak                |
| 400 / 422       | Request tidak valid / isi tidak dapat diproses | Jelaskan input yang perlu diperbaiki          |
| 401 / 403       | Perlu autentikasi yang valid / akses ditolak   | Ikuti alur akses yang disediakan aplikasi     |
| 404             | Resource tidak ditemukan                       | Periksa alamat atau data yang dituju          |
| 409             | Konflik dengan keadaan data                    | Minta pengguna meninjau data                  |
| 429             | Terlalu banyak request                         | Tunggu sesuai petunjuk server                 |
| 500 / 503       | Gangguan server / layanan tidak tersedia       | Pertahankan input dan beri jalan mencoba lagi |

<BrutalCard v-click class="mt-4 text-sm">
  <strong>res.ok</strong> memeriksa status 200–299. Respons 204 tidak mempunyai body untuk dibaca dengan <strong>res.json()</strong>.
</BrutalCard>

<!--
400 tidak selalu berarti validasi field; bisa juga JSON atau bentuk request yang salah. 422 dipakai sesuai kontrak API.
401 bukan hanya sesi kedaluwarsa; kredensial dapat hilang atau tidak valid. 403 tidak otomatis selesai dengan login ulang.
Jangan menampilkan pesan sukses hanya karena fetch selesai: fetch tetap resolve untuk banyak status HTTP gagal.
Sumber: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
Sumber: https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
-->

---
class: module-content
layout: two-cols
---

### Validasi Browser dan Server Saling Melengkapi

Browser membantu pengguna memperbaiki input. Server menentukan data yang boleh diproses.

::left::

#### Di Browser

<v-clicks>

- Tampilkan aturan sebelum pengguna mengirim.
- Hubungkan pesan error ke field.
- Pertahankan input saat pengiriman gagal.
- Bila server mengenali error field, arahkan pengguna ke field tersebut.

</v-clicks>

::right::

#### Saat API Sendiri Sudah Tersedia

Contoh pemetaan error yang disepakati backend, di dalam hook form:

```ts
form.setError(
  "title",
  {
    type: "server",
    message: "Judul sudah pernah diusulkan.",
  },
  { shouldFocus: true },
);
```

Server tetap memeriksa schema, aturan bisnis, dan izin pengguna sebelum menulis data.

::bottom::

<BrutalCard v-click class="text-sm">
  Request dapat dikirim langsung tanpa UI. Pada Modul 10, schema akan dipakai lagi pada batas masuk API.
</BrutalCard>

<!--
Contoh error field hanya diterapkan jika kontrak backend memang menyatakan title bermasalah. JSONPlaceholder tidak memberi aturan usulan duplikat ini.
Petakan field yang dikenal, bukan sembarang nama field dari respons. Error umum tetap masuk root.server.
Schema yang sama dapat dipakai browser dan server, tetapi pemeriksaan tambahan seperti konflik dan kepemilikan data tetap dilakukan di server.
Latihan ini tidak membuat akun; userId dummy di JSONPlaceholder bukan contoh otorisasi produksi.
Untuk field angka pada latihan lain, input DOM biasanya menghasilkan string. valueAsNumber pada register mengubahnya sebelum validasi; kosong dapat menjadi NaN. Pasangkan dengan schema number/integer/rentang dan pesan yang sesuai.
Sumber: https://react-hook-form.com/docs/useform/seterror
Sumber: https://react-hook-form.com/docs/useform/register
Sumber: https://nextjs.org/docs/app/guides/forms#form-validation
-->

---
class: module-content
---

### Pengayaan: Jika Daftar Usulan Memakai useQuery

Contoh alternatif setelah API penyimpanan tersedia: daftar usulan dibaca dengan key `["suggestions"]`.

```tsx {all|6|7-11|all}
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendSuggestion } from "@/lib/suggestions";
import type { BookSuggestionValues } from "@/lib/book-suggestion-schema";

function useCreateSuggestion() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (values: BookSuggestionValues) => sendSuggestion(values),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });
}
```

<v-clicks>

- Invalidasi menandai daftar terkait agar diperbarui.
- Query aktif yang diaktifkan dapat diambil ulang.
- Cache pencarian buku Open Library memiliki key dan sumber berbeda.

</v-clicks>

<!--
Pada Modul 11, daftar dibaca Server Component dan diperbarui dengan router.refresh. Sketsa useQuery ini merupakan alternatif pembacaan di client, bukan langkah wajib proyek.
Sketsa ini memerlukan sendSuggestion yang sudah diarahkan ke API penyimpanan sendiri. Praktik utama masih memakai helper API simulasi.
Terapkan setelah backend dan query daftar usulan tersedia. Pada JSONPlaceholder, invalidasi tidak membuat POST menjadi persisten.
Jika onSuccess mengembalikan Promise, mutation.isPending tetap true sampai Promise selesai. Kegagalan pembaruan daftar perlu dibedakan dari kegagalan menyimpan: write yang sukses belum tentu gagal hanya karena pembacaan berikutnya bermasalah.
Invalidasi TanStack Query tidak merevalidasi cache server Next.js. Gunakan mekanisme lapisan yang benar sesuai Modul 07–08.
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation
-->

---
class: module-content
layout: two-cols
---

### Pengayaan: Retry dan Optimistic Update

Pahami konsekuensinya sebelum mempercepat tampilan hasil mutasi.

::left::

#### Menunggu Konfirmasi

Pola latihan kita:

1. Tampilkan status pengiriman.
2. Tunggu respons yang valid.
3. Tampilkan berhasil atau gagal.

Jika respons jaringan hilang, server mungkin sudah memproses request. Pengiriman ulang dapat membuat data ganda pada API nyata.

::right::

#### Menampilkan Hasil Lebih Awal

Pola **optimistic update**:

1. Tampilkan perubahan sementara.
2. Kirim permintaan ke server.
3. Cocokkan dengan hasil server.
4. Jika gagal, pulihkan UI atau tandai perubahan yang gagal.

Tampilan terasa cepat, tetapi pembatalan, konflik, dan pemulihan harus dirancang.

::bottom::

<BrutalCard v-click class="text-sm">
  TanStack Query tidak otomatis mencoba ulang mutasi secara bawaan. Untuk kiriman ulang yang harus aman, backend dapat mengenali <strong>ID permintaan yang sama</strong> melalui rancangan idempotensi.
</BrutalCard>

<!--
retry false pada latihan sengaja eksplisit. Tombol disabled hanya mengurangi pengiriman berulang di UI; itu bukan mekanisme deduplikasi server.
Tidak semua kegagalan pantas di-retry otomatis: kesalahan input memerlukan perbaikan, sedangkan 429 memerlukan jeda sesuai layanan.
Optimistic update adalah pengayaan konsep. Implementasi yang mengubah cache memerlukan strategi cancel/snapshot/update/rollback/invalidate sesuai kasus, terutama ketika beberapa mutasi berlangsung bersamaan.
Membatalkan fetch mutasi tidak menjamin perubahan di server dibatalkan.
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/mutations
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates
Sumber: https://developer.mozilla.org/en-US/docs/Glossary/Idempotent
-->

---
class: module-content
---

### Cek Pemahaman: Kapan Form Boleh Dikosongkan?

<LearningCheck
  id="modul-09-mutation-result"
  question="Form sudah valid. POST mendapat HTTP 500, lalu helper melempar error. Apa yang dilakukan UI latihan?"
  :options='["Mengosongkan form karena tombol Kirim sudah ditekan", "Menampilkan pesan gagal dan mempertahankan input untuk ditinjau atau dikirim lagi", "Menampilkan sukses lalu menginvalidasi cache pencarian buku"]'
  :answer="1"
  explanation="Input valid belum menjamin API berhasil. mutateAsync menolak Promise; catch mengisi error form. reset hanya dijalankan setelah respons berhasil diperiksa."
/>

<!--
Beri 30 detik untuk prediksi. Minta peserta menelusuri helper → mutateAsync → catch → root.server.
Pertanyaan lanjutan: setelah JSONPlaceholder merespons sukses, apakah GET pasti memuat data baru? Tidak, layanan itu menyimulasikan write tanpa menyimpannya.
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/mutations
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 4 Hal Penting dari Modul 09

<v-clicks>

1. **Atur Alur Form**: register menghubungkan input; handleSubmit memvalidasi sebelum mengirim.
2. **Periksa Data Saat Runtime**: schema Valibot memberi aturan, pesan, dan tipe TypeScript.
3. **Tunggu Hasil Mutasi**: periksa HTTP dan respons; pertahankan input saat gagal.
4. **Sinkronkan Data yang Tepat**: API nyata membutuhkan validasi server, penyimpanan, dan pembaruan cache terkait.

</v-clicks>

<BrutalCard v-click class="mt-4 bg-brutal-cyan/10">
  🚀 <strong>Selanjutnya di Modul 10:</strong> Membuat API usulan buku sendiri, memakai ulang schema ini, lalu mengenal penyimpanan dengan Drizzle.
</BrutalCard>

<!--
Peserta siap lanjut bila form dua field berjalan, pesan error dapat dijelaskan, kegagalan tidak menghapus input, dan API simulasi tidak dianggap sebagai penyimpanan permanen.
Route Handlers, CRUD database, dan alternatif Server Actions diperkenalkan setelah modul ini.
-->

---
class: module-content
layout: two-cols
hideInToc: true
---

### Sumber dan Bacaan Lanjutan

Dokumentasi resmi diperiksa pada **9 Oktober 2026**. Rujukan tambahan ada pada catatan slide.

::left::

#### Input, Form, dan Schema

- [React: input controlled dan uncontrolled](https://react.dev/reference/react-dom/components/input)
- [React Hook Form: useForm](https://react-hook-form.com/docs/useform)
- [React Hook Form: handleSubmit](https://react-hook-form.com/docs/useform/handlesubmit)
- [Resolver untuk Valibot](https://github.com/react-hook-form/resolvers#valibot)
- [Valibot: parse dan safeParse](https://valibot.dev/guides/parse-data/)
- [Valibot: tipe dari schema](https://valibot.dev/guides/infer-types/)

::right::

#### Mutasi dan HTTP

- [TanStack Query: mutasi](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
- [Invalidasi setelah mutasi](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations)
- [Optimistic updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
- [MDN: metode HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
- [MDN: status HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
- [JSONPlaceholder: API simulasi](https://jsonplaceholder.typicode.com/)

<!--
Situs RHF tidak terbaca oleh alat pencarian pada sebagian halaman saat audit; isi API diperiksa melalui sumber dokumentasi resmi react-hook-form/documentation di GitHub.
Versi paket diperiksa pada metadata npm masing-masing paket. API dan dokumentasi daring dapat berubah setelah audit; cocokkan dengan versi proyek.
-->
