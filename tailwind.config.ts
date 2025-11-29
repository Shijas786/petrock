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
        background: "var(--background)",
        foreground: "var(--foreground)",
        pastel: {
          bg: "#E0F7FA", // Light cyan/sky blue
          card: "#FFFFFF",
          primary: "#4DD0E1",
          secondary: "#FFAB91", // Light coral
          accent: "#FFD54F", // Amber
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive', 'system-ui'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
};
export default config;
