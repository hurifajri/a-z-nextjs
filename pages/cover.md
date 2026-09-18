---
layout: cover
badgeLeft: "✦ SANDBOX IT HSI 2026"
badgeRight: "KELAS NEXT.JS"
hideInToc: true
transition: fade
---

# Next.js: <span v-mark.underline.orange>Framework</span> React untuk <span v-mark.underline.orange>Web</span>

Digunakan oleh berbagai perusahaan terkemuka dunia, Next.js memudahkan Antum membangun aplikasi web modern dan berkualitas tinggi dengan memanfaatkan keunggulan komponen React

<div class="flex items-center justify-center gap-4">
  <div
    v-motion
    :initial="{ y: 30, opacity: 0 }"
    :enter="{ y: 0, opacity: 1, transition: { type: 'spring', stiffness: 280, damping: 18, delay: 200 } }"
  >
    <BrutalBadge
      color="cyan"
      class="hover:rotate-2 transition-transform"
    >react.dev</BrutalBadge>
  </div>
  <div
    v-motion
    :initial="{ y: 30, opacity: 0 }"
    :enter="{ y: 0, opacity: 1, transition: { type: 'spring', stiffness: 280, damping: 18, delay: 350 } }"
  >
    <BrutalBadge
      color="yellow"
      class="hover:-rotate-2 transition-transform"
    >nextjs.org</BrutalBadge>
  </div>
  <div
    v-motion
    :initial="{ y: 30, opacity: 0 }"
    :enter="{ y: 0, opacity: 1, transition: { type: 'spring', stiffness: 280, damping: 18, delay: 500 } }"
  >
    <BrutalBadge
      color="pink"
      class="hover:rotate-2 transition-transform"
    >vercel.com</BrutalBadge>
  </div>
</div>
