/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#C9A84C',
          goldHover: '#B39238',
          goldLight: '#E6C66D',
          neon: '#C9A84C',
          neonHover: '#B39238',
          cyan: '#E6C66D',
          purple: '#9d4edd',
          amber: '#E6C66D',
          red: '#ff3366',
        },
        street: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5d9e2',
          300: '#b1b9c9',
          400: '#8693ab',
          500: '#66738f',
          600: '#505b75',
          700: '#414a60',
          800: '#1a1a1a',
          900: '#121212',
          950: '#080808',
        },
        background: '#080808',
        foreground: '#f3f4f6',
        card: {
          DEFAULT: '#121212',
          foreground: '#f3f4f6',
          border: 'rgba(201, 168, 76, 0.2)',
        },
      },
      boxShadow: {
        'glow-neon': '0 0 25px -5px rgba(201, 168, 76, 0.4)',
        'glow-gold': '0 0 25px -5px rgba(201, 168, 76, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(230, 198, 109, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(157, 78, 221, 0.35)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
      },
    },
  },
};
