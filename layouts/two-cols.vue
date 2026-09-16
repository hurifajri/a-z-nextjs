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
    <div class="grid grid-cols-2 gap-5 mt-2 flex-1 min-h-0">
      <div class="brutal-card bg-white h-full !p-4 flex flex-col">
        <slot name="left" />
      </div>
      <div class="brutal-card bg-white h-full !p-4 flex flex-col">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
