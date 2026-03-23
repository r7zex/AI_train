/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', 'Arial', 'Helvetica', 'sans-serif'],
        mono: ['"Source Code Pro"', 'Consolas', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
