export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Work Sans', 'sans-serif'],
      },
      colors: {
        'neon-green': '#39FF14',
        'neon-cyan': '#00D9FF',
        'neon-magenta': '#FF10F0',
        'neon-orange': '#FF6B00',
        'neon-yellow': '#FFFF00',
        'neon-violet': '#BF00FF',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 1s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { textShadow: '0 0 10px rgba(57, 255, 20, 0.5)' },
          '50%': { textShadow: '0 0 20px rgba(57, 255, 20, 1)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
