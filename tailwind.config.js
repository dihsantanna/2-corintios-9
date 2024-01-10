/* eslint-disable global-require */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
        cyan: colors.cyan,
        redOrange: '#f14f1b',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
};
