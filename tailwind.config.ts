import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // ✅ Feature 6: enables .dark class on <html>
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Streetwear Palette
        offwhite: "#FAF9F6",
        "brand-black": "#0A0A0A",
        "brand-gray": "#1C1C1C",
        "brand-muted": "#6B6B6B",
        "brand-border": "#E5E5E5",
        "brand-accent": "#C8FF00", // neon-lime streetwear accent
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.05em",
        widest: "0.25em",
        ultra: "0.5em",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      borderRadius: {
        none: "0",
        sm: "2px",
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.19, 1, 0.22, 1)",
      },
      keyframes: {
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "popup-in": {
          "0%": { opacity: "0", transform: "scale(0.92) translateY(12px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.6" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 2s linear infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "popup-in": "popup-in 0.4s cubic-bezier(0.19, 1, 0.22, 1)",
        ripple: "ripple 0.5s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
