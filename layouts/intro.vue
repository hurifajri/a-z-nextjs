<script setup lang="ts">
import { handleBackground } from "@slidev/client";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    background?: string;
    badge?: string | false;
    badgeColor?: "cyan" | "pink" | "yellow" | "green" | "purple" | "white";
  }>(),
  {
    background: undefined,
    badge: "SPEAKER / INTRO",
    badgeColor: "green",
  },
);

const style = computed(() => handleBackground(props.background));
</script>

<template>
  <div
    class="slidev-layout intro flex flex-col justify-center h-full"
    :style="style"
  >
    <div class="brutal-card bg-white max-w-220">
      <div v-if="$slots['badge'] || (badge !== false && badge)" class="mb-4">
        <slot name="badge">
          <span class="brutal-badge" :class="`brutal-badge-${badgeColor}`">
            {{ badge }}
          </span>
        </slot>
      </div>
      <slot />
    </div>
  </div>
</template>
