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
  flex: 1;
  display: flex;
  flex-direction: column;
  transition:
    opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.brutal-toc.slidev-vclick-hidden {
  @apply opacity-0 pointer-events-none translate-y-3;
}

:deep(.slidev-toc) {
  flex: 1;
  column-count: auto !important;
}

:deep(ol),
:deep(ul),
:deep(.slidev-toc-list) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-flow: column;
  grid-template-rows: repeat(8, minmax(0, 1fr));
  gap: 0.5rem 1.25rem;
  height: 100%;
}

:deep(li.slidev-toc-item) {
  @apply break-inside-avoid list-none box-border w-full bg-brutal-white border-brutal-sm shadow-brutal-sm rounded-md;
  padding: 0 0.85rem;
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
  @apply text-brutal-black font-bold text-xs leading-tight no-underline text-left;
  display: flex;
  align-items: center;
  height: 100%;
}

:deep(li.slidev-toc-item a *) {
  @apply m-0 p-0 inline;
}
</style>
