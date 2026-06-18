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
        // Paleta existente — NÃO remover (usada em vários lugares)
        brand: {
          purple: '#9333ea',
          green: '#22c55e',
          black: '#171717',
          white: '#ffffff',
        },
        // Nova paleta cinematográfica (dark-first)
        cinema: {
          bg: '#0a0a0a',
          surface: '#141414',
          elevated: '#1c1c1c',
        },
        accent: {
          amber: '#f59e0b',
          red: '#ef4444',
        },
      },
      fontFamily: {
        display: ["'Geist Variable'", 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ["'Geist Variable'", 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Glow âmbar sutil para CTAs/elementos de destaque
        glow: '0 0 40px -10px rgba(245,158,11,0.4)',
        'glow-strong': '0 0 60px -10px rgba(245,158,11,0.55)',
        // Sombras fortes para pôsteres
        poster: '0 10px 30px -8px rgba(0,0,0,0.7)',
        'poster-hover': '0 22px 45px -10px rgba(0,0,0,0.85)',
      },
      borderRadius: {
        card: '0.875rem',
        'card-lg': '1.25rem',
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
