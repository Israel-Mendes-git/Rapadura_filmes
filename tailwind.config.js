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
          // Acento do tema: ROXO (preto e roxo). 'red' reservado p/ erro/destrutivo.
          purple: '#a855f7',
          deep: '#7c3aed',
          red: '#ef4444',
          // Acento VERDE — identidade da CENTRAL DE JOGOS (roxo+preto+verde, vibe gamer).
          green: '#22c55e',
          'green-bright': '#4ade80',
        },
      },
      fontFamily: {
        display: ["'Geist Variable'", 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ["'Geist Variable'", 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Glow roxo sutil para CTAs/elementos de destaque
        glow: '0 0 40px -10px rgba(168,85,247,0.45)',
        'glow-strong': '0 0 60px -10px rgba(168,85,247,0.6)',
        // Glows VERDES da central de jogos
        'glow-green': '0 0 40px -10px rgba(34,197,94,0.55)',
        'glow-green-strong': '0 0 60px -8px rgba(74,222,128,0.7)',
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
