/** @type {import('tailwindcss').Config} */
module.exports = {
  content:  [`./views/**/*.ejs`],
  daisyui: {
    themes: ['valentine'],
  },
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}

