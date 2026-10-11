# Pembaca kontrak API — Modul 10

Jalankan pada aplikasi Next.js Toko Belajar; endpoint preview harus sudah berjalan.

1. Unduh [preview.openapi.yaml](./preview.openapi.yaml) sebagai `public/openapi.yaml`.
2. Unduh [api-docs.html](./api-docs.html) sebagai `public/api-docs.html`.
3. Pasang aset Swagger UI lokal:

```bash
npm install -D --save-exact swagger-ui-dist@5.33.1
mkdir -p public/swagger-ui
cp node_modules/swagger-ui-dist/swagger-ui.css public/swagger-ui/
cp node_modules/swagger-ui-dist/swagger-ui-bundle.js public/swagger-ui/
cp node_modules/swagger-ui-dist/LICENSE public/swagger-ui/
cp node_modules/swagger-ui-dist/NOTICE public/swagger-ui/
cp node_modules/swagger-ui-dist/swagger-ui-bundle.js.LICENSE.txt public/swagger-ui/
```

Di Windows, buat folder dan salin kelima file melalui File Explorer/PowerShell. Simpan package-lock.json.

4. Jalankan `npm run dev`, buka `/api-docs.html`, lalu coba POST preview valid dan tidak valid. Bandingkan respons aktual dengan dokumen. GET health memberi 200; preview tidak menyimpan data.
5. Setelah CRUD Modul 11 selesai, ganti isi `public/openapi.yaml` dengan [suggestions.openapi.yaml](./suggestions.openapi.yaml). Endpoint baru sekarang dapat dicoba.
6. Modul 14 mengubah kontrak: wajib sesi, daftar per pemilik, 401/403/404. Ikuti patch pada slide atau gunakan dokumen di checkpoint 14. Login lewat `/login`; cookie same-origin dikirim browser. Swagger UI tidak mengisi cookie HttpOnly melalui Authorize.

HTML ini memuat aset dan API dari origin yang sama. `validatorUrl: null` menonaktifkan validator daring; kecocokan kontrak tetap perlu diperiksa dengan request. Jangan menaruh secret pada dokumen publik.

[Workshop lanjutan](../pengayaan/swagger.md) menjelaskan schema, path, body, dan respons lebih rinci. [Dokumentasi instalasi Swagger UI](https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/).
