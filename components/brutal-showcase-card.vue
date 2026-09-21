<script setup lang="ts">
import { computed } from "vue";
import BrutalBadge from "./brutal-badge.vue";
import BrutalCard from "./brutal-card.vue";
import BrutalLink from "./brutal-link.vue";
import { type BadgeColor } from "./brutal-badge.vue";

export type ShowcaseColor = BadgeColor;

const BANNER_BG_MAP: Record<ShowcaseColor, string> = {
  yellow: "bg-brutal-yellow/15",
  cyan: "bg-brutal-cyan/15",
  purple: "bg-brutal-purple/15",
  pink: "bg-brutal-pink/15",
  green: "bg-brutal-green/15",
  orange: "bg-brutal-orange/15",
  red: "bg-brutal-red/15",
  white: "bg-brutal-white/15",
};

const props = withDefaults(
  defineProps<{
    tag: string;
    title: string;
    desc: string;
    img: string;
    href: string;
    color?: ShowcaseColor;
    bannerBg?: string;
    rotate?: string | number;
  }>(),
  {
    color: "yellow",
    rotate: "0deg",
  },
);

const rotateStyle = computed(() => {
  const rot =
    typeof props.rotate === "number" ? `${props.rotate}deg` : props.rotate;
  return {
    transform: `rotate(${rot})`,
  };
});

const bannerBgClass = computed(
  () =>
    props.bannerBg ||
    (props.color ? BANNER_BG_MAP[props.color] : "bg-brutal-yellow/15"),
);
</script>

<template>
  <div
    class="showcase-card-wrapper relative h-full transition-all duration-400 ease hover:z-10 [&.slidev-vclick-hidden]:opacity-0 [&.slidev-vclick-hidden]:pointer-events-none [&.slidev-vclick-hidden]:translate-y-4 [&.slidev-vclick-hidden]:scale-95 [&_a]:text-brutal-black [&_a]:no-underline"
    :style="rotateStyle"
  >
    <BrutalCard
      class="!p-0 overflow-hidden flex flex-col justify-between cursor-pointer h-full"
    >
      <div
        class="h-20 w-full border-b-2 border-brutal-black flex items-center justify-center p-1 overflow-hidden"
        :class="bannerBgClass"
      >
        <img :src="img" :alt="title" class="w-full h-full object-contain" />
      </div>
      <div class="p-2 flex flex-col justify-between flex-1">
        <div>
          <div class="flex items-center gap-1.5 mb-1">
            <BrutalBadge :color="props.color" class="!border">
              {{ tag }}
            </BrutalBadge>
            <span class="font-black text-xs text-brutal-black truncate">
              {{ title }}
            </span>
          </div>
          <p
            class="text-xs text-gray-700 leading-tight font-medium line-clamp-2"
          >
            {{ desc }}
          </p>
        </div>
        <div
          class="mt-1 pt-1 border-t border-brutal-black/10 flex items-center justify-between"
        >
          <BrutalLink :href="href" />
        </div>
      </div>
    </BrutalCard>
  </div>
</template>
