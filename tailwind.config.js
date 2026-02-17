/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        xpBlue: "#0058e6",
        xpGreen: "#24d148",
      },
    },
  },
  plugins: [],
}