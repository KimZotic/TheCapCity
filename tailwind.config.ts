import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: { xs: "360px" },
      fontFamily: {
        sans: ["var(--font-tcc-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-tcc-display)", "var(--font-tcc-body)", "ui-sans-serif", "sans-serif"]
      },
      boxShadow: { lift: "0 18px 46px rgba(14,15,17,.08)" }
    }
  },
  plugins: []
};

export default config;
