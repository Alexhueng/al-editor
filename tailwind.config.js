/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    ({ addComponents }) => {
      addComponents({
        '.tp': {
          'background-image': 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)',
          'background-size': '8px 8px',
          'background-position': '0 0',
        },
      })
    },
  ],
}
