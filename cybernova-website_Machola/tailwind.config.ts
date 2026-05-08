import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#05091A',
        'bg-secondary': '#0F1117',
        'accent-primary': '#0060FF',
        'accent-secondary': '#00CCFF',
        'accent-success': '#00FF88',
        'text-primary': '#FFFFFF',
        'text-secondary': 'rgba(255,255,255,0.55)',
        'text-tertiary': 'rgba(255,255,255,0.25)',
        'glass-light': 'rgba(255,255,255,0.03)',
        'glass-border': 'rgba(0,204,255,0.2)',
      },
      fontFamily: {
        serif: ['Instrument Serif', 'serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        zoomInFade: {
          from: { opacity: '0', transform: 'scale(0.85) translateY(40px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        slideUpFade: {
          from: { opacity: '0', transform: 'translateY(50px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        revealScale: {
          from: { opacity: '0', transform: 'scale(0.9)', filter: 'blur(5px)' },
          to: { opacity: '1', transform: 'scale(1)', filter: 'blur(0)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 1s ease-out',
        zoomInFade: 'zoomInFade 0.7s ease-out',
        slideUpFade: 'slideUpFade 0.8s ease-out',
        revealScale: 'revealScale 0.8s ease-out',
        bounce: 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
};

export default config;