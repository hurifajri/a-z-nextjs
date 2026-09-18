<script setup lang="ts">
import { type BadgeColor } from "../components/BrutalBadge.vue";

const props = withDefaults(
  defineProps<{
    badge?: string;
    badgeColor?: BadgeColor;
  }>(),
  {
    badge: "SPEAKER / INTRO",
    badgeColor: "green",
  },
);
</script>

<template>
  <div class="flex flex-col justify-center h-full p-16">
    <BrutalCard class="p-6 flex flex-col gap-2">
      <div v-if="$slots['badge'] || badge">
        <slot name="badge">
          <BrutalBadge :color="badgeColor">
            {{ badge }}
          </BrutalBadge>
        </slot>
      </div>
      <slot />
    </BrutalCard>
  </div>
</template>

<style scoped>
:deep(h2) {
  @apply text-brutal-black text-4xl font-black leading-tight tracking-tight;
}
</style>
