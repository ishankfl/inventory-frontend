/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
        "./src/**/*.{js,jsx,ts,tsx}", // Include all your frontend components

  ],
  theme: {
    extend: {
      colors:{
        primary:'#0EA5E9',
        'primary-dark': '#0284c7',

      }
    },
  },
  plugins: [],
}

