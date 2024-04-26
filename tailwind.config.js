/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        flexo: ['Flexo'],
        ['flexo-demi']: ['Flexo-demi'],
        ['flexo-bold']: ['Flexo-bold'],
        ['flexo-medium']: ['Flexo-medium'],
      },
      boxShadow: {
        custom: ['0px 2px 3px 0px rgba(0, 0, 0, 0.2)']
      }
    },
  },
  plugins: [],
};
