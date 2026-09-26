<script setup lang="ts">
import { computed } from "vue";
import { useNav } from "@slidev/client";
const props = defineProps<{ step: number }>();
const { isPrintMode } = useNav();
const steps = [
  {
    title: "1. Browser",
    detail:
      "Kirim permintaan ubah Todo. ID dari browser belum dapat dipercaya.",
  },
  {
    title: "2. Sesi",
    detail:
      "Handler atau action memverifikasi sesi. Tidak valid → tolak permintaan.",
  },
  {
    title: "3. Pemilik data",
    detail:
      "Batasi query dengan ID Todo dan ID pengguna dari sesi. Bukan dari body.",
  },
  {
    title: "4. Respons",
    detail: "Mutasi hanya jika diizinkan; kirim hasil aman, lalu perbarui UI.",
  },
];
const active = computed(() =>
  Math.min(Math.max(props.step, 0), steps.length - 1),
);
</script>

<template>
  <ol class="auth-flow" aria-label="Alur otorisasi mutasi">
    <li
      v-for="(item, index) in steps"
      :key="item.title"
      :class="{ active: index === active || isPrintMode }"
      :aria-current="!isPrintMode && index === active ? 'step' : undefined"
    >
      <strong>{{ item.title }}</strong>
      <p>{{ item.detail }}</p>
    </li>
  </ol>
  <p class="flow-caption" aria-live="polite">
    {{
      isPrintMode
        ? "Semua tahap ditampilkan untuk ekspor."
        : `Tahap ${active + 1}/4 — lanjutkan klik presentasi untuk mengikuti request.`
    }}
  </p>
</template>

<style scoped>
.auth-flow {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  list-style: none;
  padding: 0;
  margin: 24px 0 !important;
}
.auth-flow li {
  position: relative;
  border: 2px solid #111;
  border-radius: 8px;
  background: #fffdf5;
  padding: 14px;
  margin: 0;
  transition:
    transform 180ms ease,
    background-color 180ms ease;
}
.auth-flow li + li::before {
  content: "→";
  position: absolute;
  left: -16px;
  top: 20px;
  font-weight: bold;
}
.auth-flow li.active {
  background: #cdee2d;
  transform: translateY(-5px);
  box-shadow: 3px 3px 0 #111;
}
.auth-flow strong {
  font-size: 17px;
}
.auth-flow p {
  font-size: 14px;
}
.flow-caption {
  font-size: 13px;
}
@media (prefers-reduced-motion: reduce) {
  .auth-flow li {
    transition: none;
    transform: none !important;
  }
}
</style>
