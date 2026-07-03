import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F6F1E4",
          dim: "#EDE6D3",
        },
        ink: {
          DEFAULT: "#1B2A4A",
          soft: "#3C4A66",
          faint: "#8B8578",
        },
        amber: {
          DEFAULT: "#E8A33D",
          soft: "#F4D9A8",
        },
        margin: {
          green: "#4C7A52",
          greenSoft: "#DCE9DD",
          red: "#C24A3D",
          redSoft: "#F3DDD9",
        },
        nightpaper: "#14202E",
      },
      fontFamily: {
        display: ["Lora", "Georgia", "serif"],
        body: ["\"Source Sans 3\"", "system-ui", "sans-serif"],
        mono: ["\"JetBrains Mono\"", "ui-monospace", "monospace"],
      },
      borderRadius: {
        tab: "4px 4px 0 0",
      },
    },
  },
  plugins: [],
} satisfies Config;
