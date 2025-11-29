import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        rock: {
          50: "#f7f6f5",
          100: "#edeae7",
          200: "#d9d4ce",
          300: "#c2b9af",
          400: "#a89a8c",
          500: "#938374",
          600: "#867568",
          700: "#706157",
          800: "#5d514a",
          900: "#4d443f",
          950: "#292321",
        },
        pixel: {
          green: "#4ade80",
          gold: "#fbbf24",
          pink: "#f472b6",
          blue: "#60a5fa",
        },
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(74, 222, 128, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(74, 222, 128, 0.6)",
          },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        pixel: "4px 4px 0px 0px rgba(0,0,0,0.8)",
        "pixel-sm": "2px 2px 0px 0px rgba(0,0,0,0.8)",
        "pixel-lg": "6px 6px 0px 0px rgba(0,0,0,0.8)",
      },
    },
  },
  plugins: [],
};

export default config;

