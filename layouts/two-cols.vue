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
  leftCard: {
    type: [Boolean, String],
    default: true,
  },
  rightCard: {
    type: [Boolean, String],
    default: true,
  },
});

const style = computed(() => handleBackground(props.background));

const parseBooleanProp = (val: unknown): boolean => {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    if (val.toLowerCase() === "false") return false;
    if (val.toLowerCase() === "true") return true;
  }
  return Boolean(val);
};

const hasLeftCard = computed(() => parseBooleanProp(props.leftCard));
const hasRightCard = computed(() => parseBooleanProp(props.rightCard));
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
    <div class="grid grid-cols-2 gap-4 flex-1 min-h-0">
      <BrutalCard v-if="hasLeftCard" class="flex flex-col h-fit">
        <slot name="left" />
      </BrutalCard>
      <div v-else class="flex flex-col h-fit">
        <slot name="left" />
      </div>

      <BrutalCard v-if="hasRightCard" class="flex flex-col h-fit">
        <slot name="right" />
      </BrutalCard>
      <div v-else class="flex flex-col h-fit">
        <slot name="right" />
      </div>
    </div>
    <div v-if="$slots.bottom" class="mt-3">
      <slot name="bottom" />
    </div>
  </div>
</template>

<style scoped>
:deep(h3) {
  @apply text-brutal-black text-2xl font-extrabold leading-tight tracking-tight;
}

:deep(h4) {
  @apply text-brutal-black text-lg font-extrabold leading-snug;
}
</style>
