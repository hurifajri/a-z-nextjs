---
layout: intro
badge: "MODUL 14"
badgeColor: "yellow"
level: 1
---

## 14. Proxy & Auth Pattern

Memisahkan redirect untuk pengalaman pengguna dari verifikasi sesi dan otorisasi data di server.

---
class: module-content
---

### Tiga Tanggung Jawab yang Berbeda

| Lapisan            | Pertanyaan                                | Lokasi                                          |
| :----------------- | :---------------------------------------- | :---------------------------------------------- |
| Authentication     | Siapa pengguna ini?                       | Library/layanan auth dan verifikasi sesi        |
| Session management | Apakah sesi masih berlaku?                | Cookie + session store / token terverifikasi    |
| Authorization      | Bolehkah pengguna mengakses resource ini? | Data access layer, Route Handler, Server Action |

Proxy membantu redirect awal. Menyembunyikan tombol atau redirect di client tidak melindungi endpoint.

**Kontrak contoh:** `getVerifiedSession()` adalah adapter aplikasi, bukan API Next.js. Implementasikan dengan library auth yang dipilih, termasuk expiry dan revocation.

<!--
Sumber: https://nextjs.org/docs/app/guides/authentication
-->

---
class: module-content
clicks: 3
---

### Ikuti Request: Siapa Boleh Mengubah Todo?

Proxy membantu redirect awal. Setiap mutasi tetap memerlukan pemeriksaan di server.

<AuthFlow :step="$clicks" />

<BrutalCard v-click="3">Uji pembeda: pengguna A mengganti ID Todo menjadi milik B. Database harus tetap tidak berubah.</BrutalCard>

<!--
[click] Verifikasi sesi di server, jangan hanya keberadaan cookie.
[click] Otorisasi dekat query, gunakan identitas dari sesi.
[click] Baru ubah data dan kirim respons aman. Bahas jalur penolakan pada tiap pemeriksaan.
-->

---
class: module-content
---

### Membuat Proxy untuk Redirect Awal

Jika memakai `src/app`, letakkan file di `src/proxy.ts`; jika `app` di root, gunakan `proxy.ts` di root.

```ts
// src/proxy.ts — pemeriksaan keberadaan cookie, bukan bukti login
import { NextResponse, type NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  if (!req.cookies.get("session")?.value) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/todos/:path*"],
};
```

Cookie palsu tetap bisa melewati cek ini. Setiap pembacaan/mutasi privat harus memverifikasi sesi di server. Jangan redirect `/login` hanya karena cookie ada: sesi kedaluwarsa dapat menyebabkan loop.

---
class: module-content
---

### Matcher dan Runtime

- `:path*` mencakup route dan subpath; tentukan daftar protected route dengan sengaja.
- Matcher adalah filter eksekusi Proxy, bukan daftar semua resource yang aman.
- API yang tidak masuk matcher tetap wajib melakukan auth sendiri.
- Next.js 16 mengganti nama Middleware menjadi Proxy; ikuti runtime yang didukung versi terpasang.
- Hindari query database mahal di setiap prefetch; letakkan pemeriksaan otoritatif dekat akses data.

```text
Request → Proxy (redirect awal)
        → Page / Route Handler / Server Action
        → Verifikasi sesi + izin resource
        → Database / Backend
```

<!--
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
-->

---
class: module-content
---

### Kontrak Adapter Sesi

Contoh tipe berikut merupakan batas integrasi yang harus diimplementasikan aplikasi

```ts
// src/lib/auth.ts — kontrak, bukan implementasi autentikasi
export type VerifiedSession = {
  userId: string;
  accessToken?: string; // Hanya diperlukan bila ada backend upstream
};
// getVerifiedSession(): Promise<VerifiedSession | null>
```

Adapter harus:

1. Membaca cookie menggunakan `await cookies()` atau API library auth.
2. Memverifikasi token atau lookup opaque session; mengecek expiry dan revocation.
3. Mengembalikan identitas dari sesi terverifikasi, bukan dari body/header buatan pengguna.
4. Memisahkan kegagalan sesi (401) dari kegagalan layanan (5xx); jangan menganggap semua error sebagai logout.

Gunakan library auth yang dipelihara. Jangan membuat signing, password hashing, atau rotasi token sendiri untuk contoh kelas.

---
class: module-content
---

### Otorisasi Dekat Query Database

Tambahkan `userId` dan migration pada schema Todo sebelum mengaktifkan multi-user

```ts
// Fragment Route Handler: import db, todos, eq, and sesuai modul database
import { getVerifiedSession } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

const session = await getVerifiedSession();
if (!session)
  return Response.json({ error: "Unauthenticated" }, { status: 401 });

// id dan input sudah lolos schema Modul 11
const [updated] = await db
  .update(todos)
  .set({ done: input.done })
  .where(and(eq(todos.id, id), eq(todos.userId, session.userId)))
  .returning();
if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
return Response.json(updated);
```

Terapkan scope pengguna pada **GET, POST, PATCH, DELETE**, termasuk Server Actions. Saat POST, isi `userId` dari sesi. Jangan percaya `userId` dari form.

---
class: module-content
---

### Cookie Sesi dan Siklus Login

```ts
// Fragment setelah kredensial terverifikasi dan sesi server berhasil dibuat
response.cookies.set("session", sessionId, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 8,
});
```

- Production memakai HTTPS dan secret acak dari secret manager.
- Rotasi sesi saat login/perubahan privilege; tetapkan expiry di server juga.
- Logout: revoke sesi/refresh token di server, lalu hapus cookie dengan scope yang sama.
- HttpOnly membatasi pencurian cookie via JavaScript; **XSS tetap dapat melakukan aksi sebagai pengguna**.
- Cookie dikirim otomatis: SameSite membantu, tetapi bukan pengganti seluruh perlindungan CSRF.

<!--
Contoh ini tidak menyediakan endpoint login lengkap; library auth menangani verifikasi kredensial dan session store.
-->

---
class: module-content
---

### Mutasi Cookie Memerlukan Perlindungan CSRF

Untuk Route Handler same-origin, validasi Origin terhadap origin deployment tepercaya

```ts
// Fragment awal POST/PATCH/DELETE; APP_ORIGIN berasal dari konfigurasi server
const allowedOrigin = process.env.APP_ORIGIN;
if (!allowedOrigin) throw new Error("APP_ORIGIN is required");
if (request.headers.get("origin") !== allowedOrigin) {
  return Response.json({ error: "Forbidden origin" }, { status: 403 });
}
// Lanjutkan verifikasi sesi, schema, lalu otorisasi resource
```

- Jangan mengambil origin tepercaya langsung dari header Host yang belum divalidasi.
- Ini contoh strict browser same-origin: request tanpa Origin ditolak. Desain client non-browser terpisah.
- Gunakan mekanisme CSRF library bila alur auth memerlukannya; jangan mutasi pada GET.
- Rate limit login/reset password, cegah open redirect, dan jangan log kredensial.

<!--
Sumber: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
-->

---
class: module-content
---

### Header Request vs Header Response

```ts
// Fragment alternatif di dalam proxy(req); gabungkan dengan guard bila diperlukan
const requestId = crypto.randomUUID();
const headers = new Headers(req.headers);
headers.set("x-request-id", requestId);

const response = NextResponse.next({ request: { headers } });
response.headers.set("x-request-id", requestId);
return response;
```

- Request header diteruskan ke aplikasi; response header dikirim ke browser.
- Jangan menggunakan `x-user-id` kiriman browser sebagai bukti identitas.
- Log request ID untuk menghubungkan error browser dan server tanpa membocorkan sesi.

---
class: module-content
---

### Checkpoint Keamanan Auth

| Skenario                             | Hasil yang diharapkan                   |
| :----------------------------------- | :-------------------------------------- |
| Tanpa cookie membuka halaman privat  | Redirect login                          |
| Cookie palsu / expired memanggil API | 401; tidak ada data privat              |
| User A mengubah Todo user B          | 404/403; row tidak berubah              |
| Mutasi dari origin lain              | Ditolak oleh kebijakan CSRF             |
| Logout lalu gunakan sesi lama        | Sesi ditolak sesuai strategi revocation |
| Panggil endpoint tanpa melewati UI   | Verifikasi sesi dan izin tetap berjalan |

Uji secara otomatis pada boundary server dan E2E. Lulus redirect saja belum berarti autentikasi benar.

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 14

1. **Proxy untuk redirect awal:** lokasi sejajar `app/`; keberadaan cookie bukan verifikasi sesi.
2. **Auth di setiap akses data:** verifikasi identitas dan ownership di server.
3. **Kelola siklus sesi:** cookie, CSRF, expiry, revocation, dan pengujian akses lintas pengguna.
