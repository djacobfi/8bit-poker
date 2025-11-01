/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        poker: {
          green: '#0f5c3c',
          felt: '#0d6e47',
          gold: '#d4af37',
          red: '#c41e3a',
          blue: '#1e3a8a',
        },
      },
      animation: {
        'deal-card': 'dealCard 0.5s ease-out',
        'flip-card': 'flipCard 0.6s ease-in-out',
        'chip-move': 'chipMove 0.8s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        dealCard: {
          '0%': { transform: 'translateX(-100%) rotate(-180deg)', opacity: '0' },
          '100%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
        },
        flipCard: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        chipMove: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-50px) scale(1.2)' },
          '100%': { transform: 'translateY(0) scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};

