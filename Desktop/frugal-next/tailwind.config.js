/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'green': {
          50: '#f0faf5',
          700: '#15803d',
        },
        'pink': {
          500: '#ec4899',
          600: '#db2777',
        },
      },
    },
  },
  plugins: [],
} 