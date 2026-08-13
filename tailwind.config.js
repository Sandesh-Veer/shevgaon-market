/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        card: 'rgba(255, 255, 255, 0.4)',
        brand: {
          blue: '#4F7CFF',
          purple: '#8B5CF6',
          dark: '#111111',
          muted: '#6B7280',
        },
        accent: {
          cyan: '#0EA5E9',
          green: '#10B981',
          amber: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'Mukta', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-medium': 'floatMedium 6s ease-in-out infinite',
        'float-fast': 'floatFast 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(30px, -40px) scale(1.1)' },
        },
        floatMedium: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(-20px, 30px) scale(1.05)' },
        },
        floatFast: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(15px, -15px) scale(1.02)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 0.4 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 20px rgba(255, 255, 255, 0.2), 0 0 40px rgba(79, 124, 255, 0.2)' },
          '100%': { boxShadow: '0 0 35px rgba(255, 255, 255, 0.4), 0 0 60px rgba(139, 92, 246, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
