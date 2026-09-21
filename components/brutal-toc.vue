<script setup lang="ts">
withDefaults(
  defineProps<{
    columns?: string | number;
    maxDepth?: string | number;
    minDepth?: string | number;
    mode?: "all" | "onlyCurrentTree" | "onlySiblings";
  }>(),
  {
    columns: "2",
    maxDepth: "1",
  },
);
</script>

<template>
  <div class="brutal-toc">
    <Toc
      :columns="columns"
      :max-depth="maxDepth"
      :min-depth="minDepth"
      :mode="mode"
    />
  </div>
</template>

<style scoped>
.brutal-toc {
  @apply flex-1 flex flex-col transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)];
}

.brutal-toc.slidev-vclick-hidden {
  @apply opacity-0 pointer-events-none translate-y-3;
}

:deep(.slidev-toc) {
  @apply flex-1 !columns-auto;
}

:deep(ol),
:deep(ul),
:deep(.slidev-toc-list) {
  @apply grid grid-cols-2 grid-flow-col grid-rows-8 gap-y-2 gap-x-5;
}

:deep(li.slidev-toc-item) {
  @apply break-inside-avoid list-none box-border w-full bg-brutal-white border-brutal-sm shadow-brutal-sm rounded-md py-3 px-3 transition-all duration-100 ease;
}

:deep(li.slidev-toc-item:hover) {
  @apply bg-brutal-yellow -translate-x-[1.5px] -translate-y-[1.5px] shadow-[3.5px_3.5px_0px_#000000];
}

:deep(li.slidev-toc-item a) {
  @apply text-brutal-black font-bold text-xs leading-tight no-underline text-left flex items-center h-full;
}

:deep(li.slidev-toc-item a *) {
  @apply inline;
}
</style>
