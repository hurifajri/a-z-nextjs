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
  <div class="brutal-toc w-full mt-2">
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
  transition:
    opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.brutal-toc.slidev-vclick-hidden {
  @apply opacity-0 pointer-events-none translate-y-3;
}

:deep(.slidev-toc) {
  @apply columns-2 gap-5;
}

:deep(ol),
:deep(ul),
:deep(.slidev-toc-list) {
  @apply list-none p-0 m-0;
}

:deep(li.slidev-toc-item) {
  @apply break-inside-avoid list-none block box-border w-full mb-1.5 py-1.5 pr-3.5 pl-4.5 bg-brutal-white border-brutal-sm shadow-brutal-sm rounded-md;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease,
    background-color 0.1s ease;
}

:deep(li.slidev-toc-item:hover) {
  @apply bg-brutal-yellow;
  transform: translate(-1.5px, -1.5px);
  box-shadow: 3.5px 3.5px 0px theme("colors.brutal.black");
}

:deep(li.slidev-toc-item::marker) {
  @apply hidden content-empty;
}

:deep(li.slidev-toc-item a) {
  @apply text-brutal-black block w-full box-border p-0 m-0 font-bold text-xs leading-tight no-underline text-left;
}

:deep(li.slidev-toc-item a *) {
  @apply m-0 p-0 inline;
}
</style>
