# Direktori Screenshot Aplikasi Next.js

Folder ini (`public/screenshots/`) digunakan untuk menyimpan gambar tangkapan layar (screenshot) web application yang ditampilkan pada slide **"APA SAJA YANG BISA DIBUAT DENGAN NEXT.JS?"** di `slides.md`.

## 📁 Daftar File Placeholder Saat Ini:

1. `01-ecommerce.svg` → Toko Online & Retail Platform
2. `02-saas-dashboard.svg` → SaaS & Analytics Dashboard
3. `03-ai-copilot.svg` → AI Copilot & Workspace Assistant
4. `04-lms-education.svg` → LMS & Portal Pembelajaran (EdTech)
5. `05-content-portal.svg` → Content Portal & Publikasi Media
6. `06-booking-event.svg` → Reservasi & Tiket Event
7. `07-social-community.svg` → Forum Komunitas & Diskusi
8. `08-internal-erp.svg` → Portal Internal & Admin ERP

---

## 💡 Panduan Menyimpan / Mengganti Gambar:

1. **Lokasi Penyimpanan**:
   Simpan file screenshot Anda langsung di dalam folder ini:
   `/public/screenshots/`

2. **Format yang Didukung**:
   `.png`, `.jpg`, `.jpeg`, `.webp`, atau `.svg`.

3. **Rasio & Resolusi yang Direkomendasikan**:
   - Rasio layar ideal: **16:9**
   - Resolusi ideal: **1280 × 720 px** atau **1920 × 1080 px** (minimum **600 × 340 px**).

4. **Cara Penggunaan di `slides.md`**:
   - Jika Anda menimpa file SVG dengan file baru berekstensi sama, tidak perlu mengubah `slides.md`.
   - Jika Anda menyimpan file dengan format `.png` (misal `01-ecommerce.png`), cukup ubah atribut `src` pada slide terkait di `slides.md`:
     ```html
     <img src="/screenshots/01-ecommerce.png" alt="..." />
     ```
