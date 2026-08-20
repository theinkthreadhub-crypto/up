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
          neon: '#00ff87',
          neonHover: '#00e077',
          cyan: '#60efff',
          purple: '#9d4edd',
          amber: '#ffb703',
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
          800: '#383f51',
          900: '#1a1d24',
          950: '#0c0d12',
        },
        background: '#090a0f',
        foreground: '#f3f4f6',
        card: {
          DEFAULT: '#111319',
          foreground: '#f3f4f6',
          border: '#1f2430',
        },
      },
      boxShadow: {
        'glow-neon': '0 0 25px -5px rgba(0, 255, 135, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(96, 239, 255, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(157, 78, 221, 0.35)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
};
