/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'card-border': '#2c3e50',
        'card-bg': '#fdfbf7',
        'magic-header': '#8e44ad',
        'equipment-header': '#c0392b',
      },
      fontFamily: {
        'serif': ['Georgia', 'serif'],
        'sans': ['Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
