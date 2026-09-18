<script setup lang="ts">
import { computed } from "vue";
import { type BadgeColor } from "./BrutalBadge.vue";

export type CardColor = BadgeColor;

const props = withDefaults(
  defineProps<{
    as?: string;
    color?: CardColor;
  }>(),
  {
    as: "div",
  },
);

const colorClass = computed(() =>
  props.color ? `bg-brutal-${props.color}` : "bg-brutal-white",
);
</script>

<template>
  <component
    :is="as"
    class="text-sm p-2 border-2 border-brutal-black shadow-brutal hover:shadow-brutal-lg rounded-lg transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
    :class="colorClass"
  >
    <slot />
  </component>
</template>
