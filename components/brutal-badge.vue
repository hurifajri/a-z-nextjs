<script setup lang="ts">
import { computed } from "vue";

export type BadgeColor =
  "yellow" | "pink" | "cyan" | "green" | "purple" | "orange" | "red" | "white";

const props = withDefaults(
  defineProps<{
    color?: BadgeColor;
  }>(),
  {
    color: "yellow",
  },
);

const colorClass = computed(() => `bg-brutal-${props.color}`);
</script>

<template>
  <span
    class="inline-flex items-center gap-1 text-xs font-black px-2 py-1 border-2 border-brutal-black shadow-brutal-sm rounded-full uppercase tracking-wider"
    :class="[colorClass]"
  >
    <slot />
  </span>
</template>
