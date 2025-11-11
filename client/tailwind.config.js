// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
        'primary': '#007BFF',
        'primary-hover': '#0056b3',
        'secondary': '#6c757d',
        'light-bg': '#F8F9FA',
        'dark-text': '#212529',
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}