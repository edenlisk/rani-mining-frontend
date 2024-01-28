/** @type {import('tailwindcss').Config} */
export default {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        custom_blue: {
          50: '#f0f7fe',
          100: '#deedfb',
          200: '#c4e2f9',
          300: '#9bcef5',
          400: '#6bb4ef',
          500: '#4996e8',
          600: '#2c75db',
          700: '#2b66ca',
          800: '#2953a4',
          900: '#264882',
          950: '#1c2c4f',
      },
      punch: {
        50: '#fff1f1',
        100: '#ffe0e0',
        200: '#ffc7c7',
        300: '#ffa0a0',
        400: '#ff6a6a',
        500: '#f83b3b',
        600: '#e11919',
        700: '#c11414',
        800: '#a01414',
        900: '#841818',
        950: '#480707',
    },
    shark: {
      50: '#f6f6f6',
      100: '#e7e7e7',
      200: '#d1d1d1',
      300: '#b0b0b0',
      400: '#888888',
      500: '#6d6d6d',
      600: '#5d5d5d',
      700: '#4f4f4f',
      800: '#454545',
      900: '#3d3d3d',
      950: '#262626',
  },
  
    
      }
    },
  },
  plugins: [],
}

