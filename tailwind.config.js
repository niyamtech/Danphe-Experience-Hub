/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 }
        }
      },
      animation: {
        pulseGlow: 'pulseGlow 3s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
