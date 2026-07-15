/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        ink: "#16211E",
        paper: "#dee4e7",
        teal: {
          50: "#E8F1F1",
          100: "#C7DADA",
          300: "#8FB5B5",
          500: "#183D3D",
          600: "#143535",
          700: "#102C2C",
          900: "#081818",
        },
        gold: {
          300: "#d6952e",
          400: "#d6952e",
          500: "#d6952e",
          600: "#d6952e",
        },
      },
      fontFamily: {
        display: ['"Oswald"', "sans-serif"],
        body: ['"Jost"', "serif"],
      },
    },
  },
  plugins: [],
};
