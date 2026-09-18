<script setup lang="ts">
import { type BadgeColor } from "../components/BrutalBadge.vue";

const props = withDefaults(
  defineProps<{
    badgeLeft?: string;
    badgeRight?: string;
    badgeLeftColor?: BadgeColor;
    badgeRightColor?: BadgeColor;
  }>(),
  {
    badgeLeft: "★ PRESENTATION",
    badgeRight: "● SLIDEV",
    badgeLeftColor: "cyan",
    badgeRightColor: "pink",
  },
);
</script>

<template>
  <div
    class="flex flex-col gap-6 justify-center items-center h-full text-center p-16"
  >
    <!-- Top Left and Right Decorative Badge -->
    <div class="flex items-center justify-between w-full">
      <!-- Top Left Decorative Badge -->
      <div v-if="$slots['badge-left'] || badgeLeft">
        <slot name="badge-left">
          <BrutalBadge :color="badgeLeftColor">
            {{ badgeLeft }}
          </BrutalBadge>
        </slot>
      </div>

      <!-- Top Right Decorative Badge -->
      <div v-if="$slots['badge-right'] || badgeRight">
        <slot name="badge-right">
          <BrutalBadge :color="badgeRightColor">
            {{ badgeRight }}
          </BrutalBadge>
        </slot>
      </div>
    </div>

    <!-- Center Hero Card -->
    <BrutalCard class="flex flex-col gap-6 p-6">
      <slot />
    </BrutalCard>
  </div>
</template>

<style scoped>
:deep(h1) {
  @apply text-6xl font-black tracking-tight leading-tight uppercase;
}

:deep(p) {
  @apply text-xl font-semibold;
}
</style>
