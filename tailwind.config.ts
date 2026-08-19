import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          light: "#F2DFBD",
          DEFAULT: "#E7CEA3",
          dark: "#D8BE91",
          card: "#F2DFBD",
          deep: "#C5AD8E",
          vignette: "#B89E7D",
        },
        ink: {
          DEFAULT: "#17130E",
          light: "#24170D",
          muted: "#5A4839",
          subtle: "#7E6B5A",
        },
        bhagwa: {
          DEFAULT: "#F05A12",
          light: "#FF6D00",
          dark: "#C8460B",
          rust: "#D84315",
          highlight: "#FF8A65",
          amber: "#FFA000",
        },
        saffron: {
          DEFAULT: "#F05A12",
          secondary: "#C8460B",
          highlight: "#FF7A1A",
          light: "#FFA047",
        },
        darksurface: {
          DEFAULT: "#17130E",
          elevated: "#24170D",
          card: "#2E1E12",
          border: "rgba(231, 206, 163, 0.18)",
        }
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "Impact", "Oswald", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        devanagari: ["var(--font-noto-devanagari)", "sans-serif"],
      },
      boxShadow: {
        "bhagwa-sm": "0 2px 12px rgba(240, 90, 18, 0.28)",
        "bhagwa-md": "0 4px 22px rgba(240, 90, 18, 0.38)",
        "bhagwa-lg": "0 10px 35px rgba(240, 90, 18, 0.48)",
        "parchment-card": "0 4px 25px rgba(23, 19, 14, 0.09)",
        "parchment-deep": "0 12px 45px rgba(23, 19, 14, 0.18)",
      },
    },
  },
  plugins: [],
};
export default config;
