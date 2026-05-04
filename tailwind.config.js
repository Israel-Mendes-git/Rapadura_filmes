/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#9333ea',
          green: '#22c55e',
          black: '#171717',
          white: '#ffffff',
        }
      },
      backgroundColor: {
        'brand-purple': '#9333ea',
        'brand-green': '#22c55e',
        'brand-black': '#171717',
        'brand-white': '#ffffff',
      },
      textColor: {
        'brand-purple': '#9333ea',
        'brand-green': '#22c55e',
      }
    },
  },
  plugins: [],
}