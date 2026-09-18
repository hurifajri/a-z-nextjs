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
  <div class="roadmap-toc w-full mt-2">
    <Toc
      :columns="columns"
      :max-depth="maxDepth"
      :min-depth="minDepth"
      :mode="mode"
    />
  </div>
</template>

<style scoped>
.roadmap-toc {
  transition:
    opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
.roadmap-toc.slidev-vclick-hidden {
  @apply opacity-0 pointer-events-none translate-y-4 scale-95;
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

@keyframes tocItemPop {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

:deep(li.slidev-toc-item) {
  animation: tocItemPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

:deep(li.slidev-toc-item:nth-child(1)) {
  animation-delay: 0.02s;
}
:deep(li.slidev-toc-item:nth-child(2)) {
  animation-delay: 0.05s;
}
:deep(li.slidev-toc-item:nth-child(3)) {
  animation-delay: 0.08s;
}
:deep(li.slidev-toc-item:nth-child(4)) {
  animation-delay: 0.11s;
}
:deep(li.slidev-toc-item:nth-child(5)) {
  animation-delay: 0.14s;
}
:deep(li.slidev-toc-item:nth-child(6)) {
  animation-delay: 0.17s;
}
:deep(li.slidev-toc-item:nth-child(7)) {
  animation-delay: 0.2s;
}
:deep(li.slidev-toc-item:nth-child(8)) {
  animation-delay: 0.23s;
}
:deep(li.slidev-toc-item:nth-child(9)) {
  animation-delay: 0.26s;
}
:deep(li.slidev-toc-item:nth-child(10)) {
  animation-delay: 0.29s;
}
:deep(li.slidev-toc-item:nth-child(11)) {
  animation-delay: 0.32s;
}
:deep(li.slidev-toc-item:nth-child(12)) {
  animation-delay: 0.35s;
}
:deep(li.slidev-toc-item:nth-child(13)) {
  animation-delay: 0.38s;
}
:deep(li.slidev-toc-item:nth-child(14)) {
  animation-delay: 0.41s;
}
:deep(li.slidev-toc-item:nth-child(15)) {
  animation-delay: 0.44s;
}
:deep(li.slidev-toc-item:nth-child(16)) {
  animation-delay: 0.47s;
}
</style>
