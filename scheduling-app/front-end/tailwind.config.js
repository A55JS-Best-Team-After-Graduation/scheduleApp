/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',  // Add support for JS, TS, JSX, TSX files
  ],
  theme: {
    extend: {
      colors: {
        'teams-left': '#f0f4f8',  
        'chat': '#e0e4e8',        
      },

    },
  },
  plugins: [],
}

