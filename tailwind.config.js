/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        terracotta: {
          50: '#fdf4f2',
          100: '#fbe8e4',
          200: '#f7d5cd',
          300: '#f1b7a9',
          400: '#e7917d',
          500: '#da6b52',
          600: '#c55138',
          700: '#a5402a',
          800: '#893625',
          900: '#723123',
        }
      }
    },
  },
  plugins: [],
}
