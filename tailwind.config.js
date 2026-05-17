/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        driver: {
          DEFAULT: '#2563eb', // blue-600
        },
        rider: {
          DEFAULT: '#16a34a', // green-600
        },
        danger: {
          DEFAULT: '#d4183d',
        }
      }
    },
  },
  plugins: [],
}
