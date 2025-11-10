/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: { center: true, padding: '1rem', screens: { lg: '1024px', xl: '1200px' } },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c09eff', // Spaceflux Iris
          light: '#d5bfff',
          dark: '#a780ff',
        },
        secondary: {
          DEFAULT: '#9492b4', // GreyFade
          light: '#aaa7ba', // GreyWhite Secondary
          dark: '#6f6e8f',
        },
        spaceflux: {
          white: '#f5eeff',
          greyFade: '#9492b4',
          greySecondary: '#aaa7ba',
          iris: '#c09eff',
          bg: '#0B1020',
          surface: '#11172A',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        architekt: ['NB Architekt Std', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 12px 30px -12px rgb(0 0 0 / 35%)',
      },
    },
  },
  plugins: [],
}
