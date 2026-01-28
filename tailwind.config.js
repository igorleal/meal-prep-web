/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ec4913',
          hover: '#d53f0f',
        },
        background: {
          light: '#f8f6f6',
          dark: '#221510',
        },
        surface: {
          light: '#ffffff',
          dark: '#2d1f1a',
        },
        'text-main': {
          light: '#1b110d',
          dark: '#fcf9f8',
        },
        'text-muted': {
          light: '#9a5f4c',
          dark: '#dcbdb3',
        },
        border: {
          light: '#f3eae7',
          dark: '#4a3b36',
        },
        accent: {
          green: '#5DAE63',
          orange: '#F08E66',
        },
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
