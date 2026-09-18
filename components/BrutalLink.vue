<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    href: string;
    arrow?: boolean;
  }>(),
  {
    arrow: true,
  },
);

const displayUrl = computed(() => {
  return props.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
});
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-0.5 text-xs font-black no-underline border-b-2 border-transparent hover:border-brutal-black transition-all duration-150 hover:-translate-y-0.5"
    @click.stop
  >
    <slot>
      <span>{{ displayUrl }}</span>
    </slot>
    <span v-if="arrow">↗</span>
  </a>
</template>
