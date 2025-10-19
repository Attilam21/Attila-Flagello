/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { 
          DEFAULT: '#0A66FF', 
          fg: '#FFFFFF' 
        },
        bg: '#0B1020',
        surface: '#11182A',
        muted: '#9AA4B2',
        success: '#16A34A',
        warn: '#F59E0B',
        error: '#DC2626'
      },
      borderRadius: { 
        xl: '1rem', 
        '2xl': '1.25rem' 
      },
      boxShadow: { 
        soft: '0 10px 25px -12px rgba(0,0,0,.35)' 
      }
    },
  },
  plugins: [],
}
