/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981',
        'primary-fg': '#FFFFFF',
        surface: '#1F2937',
        muted: '#9CA3AF',
        border: '#374151',
      }
    },
  },
  plugins: [],
}

