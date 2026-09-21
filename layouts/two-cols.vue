<script setup lang="ts">
import { handleBackground } from "@slidev/client";
import { computed } from "vue";

const props = defineProps({
  background: {
    type: String,
    default: undefined,
  },
  class: {
    type: String,
    default: "",
  },
});

const style = computed(() => handleBackground(props.background));
</script>

<template>
  <div
    class="slidev-layout two-cols h-full flex flex-col justify-between"
    :class="props.class"
    :style="style"
  >
    <div>
      <slot />
    </div>
    <div class="grid grid-cols-2 gap-4 mt-2 flex-1 min-h-0">
      <BrutalCard class="flex flex-col h-fit">
        <slot name="left" />
      </BrutalCard>
      <BrutalCard class="flex flex-col h-fit">
        <slot name="right" />
      </BrutalCard>
    </div>
  </div>
</template>

<style scoped>
:deep(h3) {
  @apply text-brutal-black text-2xl font-extrabold leading-tight tracking-tight my-2;
}

:deep(h4) {
  @apply text-brutal-black text-lg font-extrabold leading-snug my-2;
}
</style>
