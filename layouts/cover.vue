<script setup lang="ts">
import { handleBackground } from "@slidev/client";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    background?: string;
    badgeLeft?: string | false;
    badgeRight?: string | false;
    badgeLeftColor?: "cyan" | "pink" | "yellow" | "green" | "purple" | "white";
    badgeRightColor?: "cyan" | "pink" | "yellow" | "green" | "purple" | "white";
  }>(),
  {
    background: undefined,
    badgeLeft: "★ PRESENTATION",
    badgeRight: "● SLIDEV",
    badgeLeftColor: "cyan",
    badgeRightColor: "pink",
  },
);

const style = computed(() => handleBackground(props.background));
</script>

<template>
  <div
    class="slidev-layout cover relative flex flex-col justify-center items-center h-full text-center"
    :style="style"
  >
    <!-- Top Left Decorative Badge -->
    <div
      v-if="$slots['badge-left'] || (badgeLeft !== false && badgeLeft)"
      class="absolute top-8 left-10"
    >
      <slot name="badge-left">
        <span class="brutal-badge" :class="`brutal-badge-${badgeLeftColor}`">
          {{ badgeLeft }}
        </span>
      </slot>
    </div>

    <!-- Top Right Decorative Badge -->
    <div
      v-if="$slots['badge-right'] || (badgeRight !== false && badgeRight)"
      class="absolute top-8 right-10"
    >
      <slot name="badge-right">
        <span class="brutal-badge" :class="`brutal-badge-${badgeRightColor}`">
          {{ badgeRight }}
        </span>
      </slot>
    </div>

    <!-- Center Hero Card -->
    <div
      class="brutal-card w-full max-w-230 mx-auto py-10 px-12 relative bg-white"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
:deep(h1) {
  font-size: 3.5rem !important;
  font-weight: 900 !important;
  letter-spacing: -0.03em !important;
  line-height: 1.1 !important;
  margin-bottom: 0.75rem !important;
  text-transform: uppercase;
}

:deep(p) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}
</style>
