module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        script: ['"Playfair Script"', 'cursive'],
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        brandGold: '#020100',
      },
    },
  },
  plugins: [],
};

