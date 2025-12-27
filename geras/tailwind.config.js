/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#205a2d',
        secondary: '#efab59', 
        tertiary: '#db6536',
        neutral: '#1d1d1b',
      },
      fontFamily: {
        momo: ['MomoTrustDisplay-Regular'],
        rubik: ['Rubik-Regular'],
      },
    },
  },
  plugins: [],
};
