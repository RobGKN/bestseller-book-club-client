// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{css,js,jsx,ts,tsx}', './src/*.{css,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7', // used by `bg-primary-600`
          700: '#0369a1', // used by `hover:bg-primary-700`
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
};
