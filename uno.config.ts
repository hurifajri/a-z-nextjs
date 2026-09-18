import { defineConfig, transformerDirectives } from "unocss";

const brutalColors = {
  canvas: "#fffdf5",
  black: "#000000",
  white: "#ffffff",
  yellow: "#ffe600",
  pink: "#ff6b8b",
  cyan: "#00e5ff",
  green: "#2ed573",
  purple: "#b388eb",
  orange: "#ffa502",
  red: "#ff6b6b",
};

const brutalShadows = {
  DEFAULT: `4px 4px 0px ${brutalColors.black}`,
  sm: `2px 2px 0px ${brutalColors.black}`,
  lg: `6px 6px 0px ${brutalColors.black}`,
};

const brutalRadius = {
  DEFAULT: "8px",
};

export default defineConfig({
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      brutal: brutalColors,
    },
    boxShadow: {
      brutal: brutalShadows.DEFAULT,
      "brutal-sm": brutalShadows.sm,
      "brutal-lg": brutalShadows.lg,
    },
    borderRadius: {
      brutal: brutalRadius.DEFAULT,
    },
  },
  shortcuts: {
    "border-brutal": "border-3 border-brutal-black",
    "border-brutal-sm": "border-2 border-brutal-black",
  },
  preflights: [
    {
      getCSS: () => `
:root {
  ${Object.entries(brutalColors)
    .map(([key, val]) => `--brutal-${key}: ${val};`)
    .join("\n  ")}
  --brutal-border: 3px solid ${brutalColors.black};
  --brutal-border-sm: 2px solid ${brutalColors.black};
  --brutal-shadow: ${brutalShadows.DEFAULT};
  --brutal-shadow-sm: ${brutalShadows.sm};
  --brutal-shadow-lg: ${brutalShadows.lg};
  --brutal-radius: ${brutalRadius.DEFAULT};
}
      `,
    },
  ],
});
