import fs from "fs";

/** @type {import('tailwindcss').Config} */

let theme = {};
try {
  const themePath = "./theme.json";

  if (fs.existsSync(themePath)) {
    theme = JSON.parse(fs.readFileSync(themePath, "utf-8"));
  }
} catch (err) {
  console.error('failed to parse custom styles', err)
}
const defaultTheme = {
  extend: {
    screens: {
      coarse: { raw: "(pointer: coarse)" },
      fine: { raw: "(pointer: fine)" },
      pwa: { raw: "(display-mode: standalone)" },
    },
    colors: {
      neutral: {
        1: "var(--bxd-neutral-10)",
        2: "var(--bxd-neutral-20)",
        3: "var(--bxd-neutral-30)",
        4: "var(--bxd-neutral-40)",
        5: "var(--bxd-neutral-50)",
        6: "var(--bxd-neutral-60)",
        7: "var(--bxd-neutral-70)",
        8: "var(--bxd-neutral-80)",
        9: "var(--bxd-neutral-90)",
        10: "var(--bxd-neutral-100)",
        11: "var(--bxd-neutral-110)",
        12: "var(--bxd-neutral-120)",
        a1: "var(--bxd-neutral-10)",
        a2: "var(--bxd-neutral-20)",
        a3: "var(--bxd-neutral-30)",
        a4: "var(--bxd-neutral-40)",
        a5: "var(--bxd-neutral-50)",
        a6: "var(--bxd-neutral-60)",
        a7: "var(--bxd-neutral-70)",
        a8: "var(--bxd-neutral-80)",
        a9: "var(--bxd-neutral-90)",
        a10: "var(--bxd-neutral-100)",
        a11: "var(--bxd-neutral-110)",
        a12: "var(--bxd-neutral-120)",
        contrast: "var(--bxd-neutral-white)",
      },
      accent: {
        1: "var(--bxd-blue-10)",
        2: "var(--bxd-blue-20)",
        3: "var(--bxd-blue-30)",
        4: "var(--bxd-blue-40)",
        5: "var(--bxd-blue-50)",
        6: "var(--bxd-blue-60)",
        7: "var(--bxd-blue-70)",
        8: "var(--bxd-blue-80)",
        9: "var(--bxd-blue-90)",
        10: "var(--bxd-blue-100)",
        11: "var(--bxd-blue-110)",
        12: "var(--bxd-blue-120)",
        contrast: "var(--bxd-neutral-white)",
      },
      "accent-secondary": {
        1: "var(--bxd-azure-blue-10)",
        2: "var(--bxd-azure-blue-20)",
        3: "var(--bxd-azure-blue-30)",
        4: "var(--bxd-azure-blue-40)",
        5: "var(--bxd-azure-blue-50)",
        6: "var(--bxd-azure-blue-60)",
        7: "var(--bxd-azure-blue-70)",
        8: "var(--bxd-azure-blue-80)",
        9: "var(--bxd-azure-blue-90)",
        10: "var(--bxd-azure-blue-100)",
        11: "var(--bxd-azure-blue-110)",
        12: "var(--bxd-azure-blue-120)",
        contrast: "var(--bxd-neutral-white)",
      },
      fg: {
        DEFAULT: "var(--on-surface)",
        secondary: "var(--subtle-on-surface)",
      },
      bg: {
        DEFAULT: "var(--body)",
        inset: "var(--base-surface)",
        overlay: "var(--surface)",
      },
      "focus-ring": "var(--primary-emphasis)",
    },
    borderRadius: {
      sm: "var(--radius-sm)",
      md: "var(--radius-md)",
      lg: "var(--radius-lg)",
      xl: "var(--radius-xl)",
      "2xl": "var(--radius-2xl)",
      full: "var(--radius-full)",
    },
  },
  spacing: {
    px: "var(--size-px)",
    0: "var(--size-0)",
    0.5: "var(--size-0-5)",
    1: "var(--size-1)",
    1.5: "var(--size-1-5)",
    2: "var(--size-2)",
    2.5: "var(--size-2-5)",
    3: "var(--size-3)",
    3.5: "var(--size-3-5)",
    4: "var(--size-4)",
    5: "var(--size-5)",
    6: "var(--size-6)",
    7: "var(--size-7)",
    8: "var(--size-8)",
    9: "var(--size-9)",
    10: "var(--size-10)",
    11: "var(--size-11)",
    12: "var(--size-12)",
    14: "var(--size-14)",
    16: "var(--size-16)",
    20: "var(--size-20)",
    24: "var(--size-24)",
    28: "var(--size-28)",
    32: "var(--size-32)",
    36: "var(--size-36)",
    40: "var(--size-40)",
    44: "var(--size-44)",
    48: "var(--size-48)",
    52: "var(--size-52)",
    56: "var(--size-56)",
    60: "var(--size-60)",
    64: "var(--size-64)",
    72: "var(--size-72)",
    80: "var(--size-80)",
    96: "var(--size-96)",
  },
  darkMode: ["selector", '[data-appearance="dark"]'],
}

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { ...defaultTheme, ...theme },
  // Blocklist the container utility to prevent invalid CSS generation
  // The container utility in Tailwind v4 tries to create responsive containers for ALL breakpoints,
  // including our custom 'raw' media query breakpoints (pwa, coarse, fine), which generates
  // invalid CSS syntax that Lightning CSS cannot parse during optimization
  blocklist: ['container'],
};