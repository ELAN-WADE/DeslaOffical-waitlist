/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        delsla: {
          cream: '#FBF9F5',
          ivory: '#F3EFE6',
          nude: '#E5DDD0',
          blush: '#F7EBE1',
          obsidian: '#0C0C0D',
          charcoal: '#1E1D1F',
          muted: '#686460',
          stone: '#A39E98',
          gold: '#C5A059',
          'gold-light': '#F6EEDA',
          'gold-dark': '#8F6E2E',
          'gold-glow': 'rgba(197, 160, 89, 0.25)',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Italiana', 'Didot', 'Georgia', 'serif'],
        display: ['Italiana', '"Cormorant Garamond"', 'Didot', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'plasma': '42px 18px 48px 24px',
        'plasma-lg': '64px 32px 72px 40px',
        'pill': '9999px',
        'editorial': '20px',
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(12, 12, 13, 0.04)',
        'luxury': '0 20px 48px -12px rgba(12, 12, 13, 0.08), 0 4px 12px -2px rgba(197, 160, 89, 0.06)',
        'float': '0 24px 60px -8px rgba(12, 12, 13, 0.12)',
        'gold-ring': '0 0 0 1px rgba(197, 160, 89, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-gentle': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
