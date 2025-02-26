import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          accent: "#D7F400",
          dark: "#080A13",
          DEFAULT: "#222222",
          muted: "#3C383C",
        },
        secondary: {
          lighter: "#FAFAFA",
          light: "#F6F6F6",
          DEFAULT: "#DCDCDC",
          medium: "#A1A1A1",
          dark: "#4E4E4E",
        },
        contrast: {
          green: "#53CF50",
          yellow: "#FBB004",
          red: "#D92233",
        },
      },
      fontFamily: {
        grotesk: ["HK Grotesk", "sans-serif"],
      },
      fontSize: {
        'display-1': ['64px', { lineHeight: '1.2', fontWeight: '700' }],
        'display-2': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'display-3': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        'h1': ['28px', { lineHeight: '1.3', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['22px', { lineHeight: '1.3', fontWeight: '700' }],
        'h4': ['20px', { lineHeight: '1.4', fontWeight: '700' }],
        'h5': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'subtitle-1': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        'subtitle-2': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-1': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-2': ['14px', { lineHeight: '1.5', fontWeight: '500' }],
        'button-lg': ['13px', { lineHeight: '1.4', fontWeight: '600' }],
        'button-sm': ['12px', { lineHeight: '1.4', fontWeight: '600' }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
