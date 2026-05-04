/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0D1B2A",
        secondary: "#00A7A7",
        accent: "#F4A261",
        neutral100: "#F9F5F3",
        neutral700: "#475569",
        success: "#22C55E",
      },
      boxShadow: {
        card: "0 6px 16px rgba(2,8,23,0.08)",
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
