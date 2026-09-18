---
hideInToc: true
---

## APA SAJA YANG BISA DIBUAT DENGAN NEXT.JS?

<p>
  Dari <span v-mark.underline.orange="1">landing page</span> interaktif hingga <span v-mark.underline.orange="2">platform enterprise</span> skala global — apa pun yang bisa diakses melalui browser, insyaa Allah bisa Antum buat.
</p>

<!-- 4 Columns × 2 Rows Showcase Grid with Rotated Neobrutalist Cards (Click Animation Fade-In) -->
<div class="grid grid-cols-4 gap-3.5 px-1">

  <!-- 01. E-Commerce -->
  <div
    v-click="3"
    class="showcase-card bg-brutal-white border-2 border-brutal-black rounded-lg overflow-hidden flex flex-col justify-between cursor-pointer"
    style="transform: rotate(-1.5deg);"
  >
    <div class="h-20 w-full bg-brutal-yellow/15 border-b-2 border-brutal-black flex items-center justify-center p-1 overflow-hidden">
      <img src="/screenshots/01-ecommerce.svg" alt="E-Commerce Store" class="w-full h-full object-contain" />
    </div>
    <div class="p-2 flex flex-col justify-between flex-1">
      <div>
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-xs font-black uppercase px-1.5 py-0.5 bg-brutal-yellow border border-brutal-black rounded shadow-brutal-sm">
            E-Commerce
          </span>
          <span class="font-black text-xs text-brutal-black truncate">Toko Online</span>
        </div>
        <p class="text-xs text-gray-700 leading-tight font-medium line-clamp-2">
          Katalog produk, filter pencarian, keranjang belanja, & integrasi payment gateway.
        </p>
      </div>
      <div class="mt-1 pt-1 border-t border-brutal-black/10 flex items-center justify-between">
        <BrutalLink href="https://www.lg.com/id/" />
      </div>
    </div>
  </div>

  <!-- 02. SaaS Analytics -->
  <div
    v-click="4"
    class="showcase-card bg-brutal-white border-2 border-brutal-black rounded-lg overflow-hidden flex flex-col justify-between cursor-pointer"
    style="transform: rotate(1.2deg);"
  >
    <div class="h-20 w-full bg-brutal-cyan/15 border-b-2 border-brutal-black flex items-center justify-center p-1 overflow-hidden">
      <img src="/screenshots/02-saas-dashboard.svg" alt="SaaS Dashboard" class="w-full h-full object-contain" />
    </div>
    <div class="p-2 flex flex-col justify-between flex-1">
      <div>
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-xs font-black uppercase px-1.5 py-0.5 bg-brutal-cyan border border-brutal-black rounded shadow-brutal-sm">
            SaaS
          </span>
          <span class="font-black text-xs text-brutal-black truncate">Dashboard Analytics</span>
        </div>
        <p class="text-xs text-gray-700 leading-tight font-medium line-clamp-2">
          Visualisasi grafik bisnis, metrik interaktif, & ekspor laporan otomatis.
        </p>
      </div>
      <div class="mt-1 pt-1 border-t border-brutal-black/10 flex items-center justify-between">
        <BrutalLink href="https://dub.co" />
      </div>
    </div>
  </div>

  <!-- 03. AI Copilot -->
  <div
    v-click="5"
    class="showcase-card bg-brutal-white border-2 border-brutal-black rounded-lg overflow-hidden flex flex-col justify-between cursor-pointer"
    style="transform: rotate(-1deg);"
  >
    <div class="h-20 w-full bg-brutal-purple/15 border-b-2 border-brutal-black flex items-center justify-center p-1 overflow-hidden">
      <img src="/screenshots/03-ai-copilot.svg" alt="AI Copilot" class="w-full h-full object-contain" />
    </div>
    <div class="p-2 flex flex-col justify-between flex-1">
      <div>
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-xs font-black uppercase px-1.5 py-0.5 bg-brutal-purple border border-brutal-black rounded shadow-brutal-sm">
            AI App
          </span>
          <span class="font-black text-xs text-brutal-black truncate">Chat & Copilot</span>
        </div>
        <p class="text-xs text-gray-700 leading-tight font-medium line-clamp-2">
          Asisten AI respons streaming, tanya-jawab dokumen, & otomasi tugas.
        </p>
      </div>
      <div class="mt-1 pt-1 border-t border-brutal-black/10 flex items-center justify-between">
        <BrutalLink href="https://openai.com" />
      </div>
    </div>
  </div>

  <!-- 04. LMS Portal -->
  <div
    v-click="6"
    class="showcase-card bg-brutal-white border-2 border-brutal-black rounded-lg overflow-hidden flex flex-col justify-between cursor-pointer"
    style="transform: rotate(1.8deg);"
  >
    <div class="h-20 w-full bg-brutal-pink/15 border-b-2 border-brutal-black flex items-center justify-center p-1 overflow-hidden">
      <img src="/screenshots/04-lms-education.svg" alt="LMS Education" class="w-full h-full object-contain" />
    </div>
    <div class="p-2 flex flex-col justify-between flex-1">
      <div>
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-xs font-black uppercase px-1.5 py-0.5 bg-brutal-pink text-brutal-white border border-brutal-black rounded shadow-brutal-sm">
            EdTech
          </span>
          <span class="font-black text-xs text-brutal-black truncate">LMS & E-Learning</span>
        </div>
        <p class="text-xs text-gray-700 leading-tight font-medium line-clamp-2">
          Kurikulum belajar terstruktur, video player, kuis, & sertifikat online.
        </p>
      </div>
      <div class="mt-1 pt-1 border-t border-brutal-black/10 flex items-center justify-between">
        <BrutalLink href="https://egghead.io" />
      </div>
    </div>
  </div>

  <!-- 05. Content & Media CMS -->
  <div
    v-click="7"
    class="showcase-card bg-brutal-white border-2 border-brutal-black rounded-lg overflow-hidden flex flex-col justify-between cursor-pointer"
    style="transform: rotate(1.4deg);"
  >
    <div class="h-20 w-full bg-brutal-green/15 border-b-2 border-brutal-black flex items-center justify-center p-1 overflow-hidden">
      <img src="/screenshots/05-content-portal.svg" alt="Content Portal" class="w-full h-full object-contain" />
    </div>
    <div class="p-2 flex flex-col justify-between flex-1">
      <div>
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-xs font-black uppercase px-1.5 py-0.5 bg-brutal-green border border-brutal-black rounded shadow-brutal-sm">
            Media
          </span>
          <span class="font-black text-xs text-brutal-black truncate">Portal Berita</span>
        </div>
        <p class="text-xs text-gray-700 leading-tight font-medium line-clamp-2">
          Publikasi artikel instan, optimasi SEO maksimal, & tata letak responsif.
        </p>
      </div>
      <div class="mt-1 pt-1 border-t border-brutal-black/10 flex items-center justify-between">
        <BrutalLink href="https://washingtonpost.com" />
      </div>
    </div>
  </div>

  <!-- 06. Booking & Ticketing -->
  <div
    v-click="8"
    class="showcase-card bg-brutal-white border-2 border-brutal-black rounded-lg overflow-hidden flex flex-col justify-between cursor-pointer"
    style="transform: rotate(-1.4deg);"
  >
    <div class="h-20 w-full bg-brutal-orange/15 border-b-2 border-brutal-black flex items-center justify-center p-1 overflow-hidden">
      <img src="/screenshots/06-booking-event.svg" alt="Booking & Tickets" class="w-full h-full object-contain" />
    </div>
    <div class="p-2 flex flex-col justify-between flex-1">
      <div>
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-xs font-black uppercase px-1.5 py-0.5 bg-brutal-orange border border-brutal-black rounded shadow-brutal-sm">
            Booking
          </span>
          <span class="font-black text-xs text-brutal-black truncate">Reservasi & Jadwal</span>
        </div>
        <p class="text-xs text-gray-700 leading-tight font-medium line-clamp-2">
          Sinkronisasi kalender, reservasi janji temu, & konfirmasi otomatis.
        </p>
      </div>
      <div class="mt-1 pt-1 border-t border-brutal-black/10 flex items-center justify-between">
        <BrutalLink href="https://cal.com" />
      </div>
    </div>
  </div>

  <!-- 07. Social Forum -->
  <div
    v-click="9"
    class="showcase-card bg-brutal-white border-2 border-brutal-black rounded-lg overflow-hidden flex flex-col justify-between cursor-pointer"
    style="transform: rotate(1.1deg);"
  >
    <div class="h-20 w-full bg-brutal-cyan/15 border-b-2 border-brutal-black flex items-center justify-center p-1 overflow-hidden">
      <img src="/screenshots/07-social-community.svg" alt="Community Forum" class="w-full h-full object-contain" />
    </div>
    <div class="p-2 flex flex-col justify-between flex-1">
      <div>
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-xs font-black uppercase px-1.5 py-0.5 bg-brutal-cyan border border-brutal-black rounded shadow-brutal-sm">
            Social
          </span>
          <span class="font-black text-xs text-brutal-black truncate">Komunitas & Kreator</span>
        </div>
        <p class="text-xs text-gray-700 leading-tight font-medium line-clamp-2">
          Forum diskusi anggota, feed interaktif, utas obrolan, & sistem membership.
        </p>
      </div>
      <div class="mt-1 pt-1 border-t border-brutal-black/10 flex items-center justify-between">
        <BrutalLink href="https://patreon.com" />
      </div>
    </div>
  </div>

  <!-- 08. Internal ERP & Ops -->
  <div
    v-click="10"
    class="showcase-card bg-brutal-white border-2 border-brutal-black rounded-lg overflow-hidden flex flex-col justify-between cursor-pointer"
    style="transform: rotate(-1.2deg);"
  >
    <div class="h-20 w-full bg-brutal-yellow/15 border-b-2 border-brutal-black flex items-center justify-center p-1 overflow-hidden">
      <img src="/screenshots/08-internal-erp.svg" alt="Internal ERP" class="w-full h-full object-contain" />
    </div>
    <div class="p-2 flex flex-col justify-between flex-1">
      <div>
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-xs font-black uppercase px-1.5 py-0.5 bg-brutal-yellow border border-brutal-black rounded shadow-brutal-sm">
            Internal
          </span>
          <span class="font-black text-xs text-brutal-black truncate">Admin & ERP</span>
        </div>
        <p class="text-xs text-gray-700 leading-tight font-medium line-clamp-2">
          Pengelolaan data internal perusahaan, hak akses staf, & alur approval.
        </p>
      </div>
      <div class="mt-1 pt-1 border-t border-brutal-black/10 flex items-center justify-between">
        <BrutalLink href="https://zapier.com" />
      </div>
    </div>
  </div>

</div>

<style>
.showcase-card {
  @apply shadow-brutal;
  transition: opacity 0.4s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
  position: relative;
}

.showcase-card.slidev-vclick-hidden {
  opacity: 0 !important;
  pointer-events: none !important;
  transform: translateY(16px) scale(0.95) !important;
}

.showcase-card:hover {
  @apply shadow-brutal-lg!;
  transform: rotate(0deg) scale(1.06) translateY(-4px) !important;
  z-index: 30 !important;
}

.showcase-card a,
.showcase-card a:hover,
.showcase-card a:focus {
  @apply text-brutal-black!;
  text-decoration: none !important;
}
</style>
