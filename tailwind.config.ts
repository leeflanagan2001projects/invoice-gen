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
        primary: '#1B4F8A',
        accent: '#E87722',
        success: '#2D7A4F',
        warning: '#C9A227',
        danger: '#B91C1C',
        background: '#F5F7FA',
        surface: '#FFFFFF',
        'text-base': '#1C2329',
      },
      fontSize: {
        base: ['16px', '1.6'],
      },
      minHeight: {
        tap: '44px',
      },
      minWidth: {
        tap: '44px',
      },
    },
  },
  plugins: [],
};
export default config;
