/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        surface: "var(--surface)",
        surface2: "var(--surface2)",
        foreground: "var(--text)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        bordercolor: "var(--border)",
      },
    },
  },

  plugins: [],
};