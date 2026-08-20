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
          neon:      '#FF5C1A',
          neonHover: '#E04A10',
          cyan:      '#C6F135',
          purple:    '#8B5CF6',
          amber:     '#F59E0B',
          red:       '#EF4444',
        },
        street: {
          50:  '#F5F3EF',
          100: '#E8E5E0',
          200: '#D2CEC9',
          300: '#A8A4A0',
          400: '#78756F',
          500: '#58554F',
          600: '#3E3B36',
          700: '#2A2825',
          800: '#1E1C19',
          900: '#141210',
          950: '#0C0C0D',
        },
        background: '#0C0C0D',
        foreground: '#F5F3EF',
        card: {
          DEFAULT:    '#161618',
          foreground: '#F5F3EF',
          border:     '#2A2A2D',
        },
      },
      boxShadow: {
        'glow-neon': '0 0 30px -5px rgba(255, 92, 26, 0.55), 0 10px 40px -10px rgba(255, 92, 26, 0.3)',
        'glow-lime': '0 0 25px -5px rgba(198, 241, 53, 0.4)',
        'glass':     '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
    },
  },
};
