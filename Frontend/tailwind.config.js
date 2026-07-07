/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#F3F4F6',
          primary: '#EF4444',
          secondary: '#F97316',
          dark: '#1F2937'
        }
      }
    },
  },
  plugins: [],
}
