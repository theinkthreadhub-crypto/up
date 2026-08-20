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
      fontFamily: {
        serif: ['Bodoni Moda', 'Didot', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Hanken Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Bodoni Moda', 'Didot', 'Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          neon: '#111111',
          neonHover: '#222222',
          cyan: '#444444',
          purple: '#111111',
          amber: '#c9a84c',
          red: '#ba1a1a',
        },
        street: {
          50: '#ffffff',
          100: '#f5f3f3',
          200: '#efeded',
          300: '#e4e2e2',
          400: '#c4c7c7',
          500: '#747878',
          600: '#5e5e5b',
          700: '#444748',
          800: '#303031',
          900: '#1b1c1c',
          950: '#111111',
        },
        background: '#fbf9f9',
        foreground: '#1b1c1c',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1b1c1c',
          border: '#e4e2e2',
        },
      },
    },
  },
};
