---
layout: intro
badge: "MODUL 14"
badgeColor: "yellow"
level: 1
---

## 14. Proxy (ex-Middleware) & Auth Pattern

Melindungi halaman dengan Next.js Proxy (dulu Middleware), mengelola sesi pengguna, dan membuat guard untuk rute yang memerlukan login.

---

### Apa Itu Proxy (Middleware) di Next.js?

Kode yang berjalan SEBELUM request sampai ke halaman

```text
User request → Proxy / Middleware → Page/Route Handler
                        ↓
               Cek cookie / redirect
```

<v-clicks>

- 🛡️ **Auth Guard** — Redirect ke login jika belum punya token/session
- 🔄 **Redirect** — Arahkan user ke halaman yang tepat
- 🌐 **Rewrite** — Ubah URL tanpa redirect (untuk A/B testing, multitenant)
- 📝 **Modifikasi Headers** — Sisipkan request id atau pathname info

</v-clicks>

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  📁 <strong>Evolusi Next.js 16:</strong> File kini dinamai <code>proxy.ts</code> di <strong>root project</strong> (menggantikan <code>middleware.ts</code> di Next.js 12–15) untuk memperjelas perannya sebagai batas jaringan (network boundary).
</div>

---

### Membuat Proxy (`proxy.ts`)

File `proxy.ts` (atau `middleware.ts` di Next.js 15) di root project

```tsx {1-3|5-10|12-18|all}
// proxy.ts (Next.js 16) atau middleware.ts (Next.js 15)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Jika belum login dan coba akses halaman terlindungi
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika sudah login dan coba akses halaman login
  if (token && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next(); // Lanjutkan ke halaman
}

// Tentukan rute mana yang dilindungi
export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/login"],
};
```

---

### Pola Matcher

Menentukan halaman mana yang diproses oleh middleware

```tsx {2|3|4|5|all}
export const config = {
  matcher: [
    "/dashboard/:path*", // /dashboard dan semua sub-halaman
    "/settings/:path*", // /settings dan semua sub-halaman
    "/profile", // Hanya /profile
    "/((?!api|_next|favicon.ico).*)", // Semua kecuali API dan asset
  ],
};
```

<div v-click class="mt-4 grid grid-cols-2 gap-3 text-xs">
  <div class="brutal-card bg-white p-2">
    <strong>:path*</strong><br/>
    Cocokkan semua sub-path<br/>
    <code>/dashboard/settings/...</code>
  </div>
  <div class="brutal-card bg-white p-2">
    <strong>((?!pattern).*)</strong><br/>
    Cocokkan semua kecuali pattern<br/>
    Exclude API routes, assets
  </div>
</div>

---
layout: two-cols
---

### Protected Route Pattern

Dua lapisan perlindungan: Proxy / Middleware + Client Check

::left::

#### Lapisan 1: Proxy (Server-side)

```tsx
// proxy.ts — Server-side guard
export function proxy(req: NextRequest) {
  const token = req.cookies.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
```

Redirect SEBELUM halaman dirender!

::right::

#### Lapisan 2: Client Guard

```tsx
// hooks/useAuth.ts — Client-side check
"use client";
export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // Fetch user data...
  }, []);

  return { user };
}
```

Cek tambahan di sisi client!

---

### Proxy: Menambahkan Header & Cookie

Menambahkan informasi ke setiap request di tingkat network

```tsx {3-6|8-11|all}
export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Tambah custom header
  response.headers.set("x-request-id", crypto.randomUUID());
  response.headers.set("x-pathname", request.nextUrl.pathname);

  // Set cookie
  if (!request.cookies.has("visited")) {
    response.cookies.set("visited", "true", {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 hari
    });
  }

  return response;
}
```

---

### Pola Auth Lengkap: Login → Cookie → Proxy

Alur autentikasi end-to-end yang aman

````md magic-move
```tsx
// 1. Login: Simpan token di cookie (bukan localStorage!)
// app/api/auth/login/route.ts
export async function POST(req: Request) {
  const { email, password } = await req.json();
  // ... validasi kredensial

  const token = generateJWT({ userId: user.id });

  const response = NextResponse.json({ success: true });
  response.cookies.set("token", token, {
    httpOnly: true, // Tidak bisa diakses via JavaScript
    secure: true, // Hanya via HTTPS
    maxAge: 60 * 60 * 8, // 8 jam
  });
  return response;
}
```

```tsx
// 2. Proxy: Cek cookie di setiap request
// proxy.ts (Next.js 16)
export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
```

```tsx
// 3. Logout: Hapus cookie
// app/api/auth/logout/route.ts
export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("token");
  return response;
}
```
````

<div v-click class="mt-3 brutal-card bg-white p-3 text-sm">
  🔐 <strong>httpOnly cookie</strong> lebih aman daripada localStorage karena tidak bisa diakses oleh JavaScript (XSS attack proof).
</div>

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 14

1. **Proxy (ex-Middleware) = Gerbang Utama**: Tulis di `proxy.ts` (atau `middleware.ts` di versi sebelumnya). Cek token/cookie, redirect, atau modifikasi headers SEBELUM halaman dirender.
2. **Matcher = Filter Rute**: Gunakan `config.matcher` untuk menentukan rute mana saja yang diproses. Hindari memproses API dan asset statis.
3. **httpOnly Cookie > localStorage**: Simpan token autentikasi di httpOnly cookie agar aman dari serangan XSS dan langsung terbaca oleh server.
