const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", flowbite.content()],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#eeeeea",
          3: "#dedece",
          4: "#c7c7bf",
        },
        primary: {
          DEFAULT: "#FA9191",
          1: "#febaba",
        },
        secondary: {
          DEFAULT: "#c5a880",
        },
        gold: {
          DEFAULT: "#d4af37",
        },
        dark: {
          1: "#b4b4b4",
          2: "#787878",
          3: "#616161",
          4: "#3c3c3c",
        },
        light: {
          1: "#f1f3f6",
          2: "#dedede", // Very light gray
          3: "#c9c9c9", // Light gray
          4: "#b8b8b8", // Slightly darker light gray
        },
      },
    },
  },
  plugins: [flowbite.plugin()],
};
