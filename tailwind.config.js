/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1D58E9',
          blueDark: '#1546C6',
          navy: '#0B1527',
        },
        bg: {
          dark: '#0a0f1c',
          light: '#F4F6FB',
          panel: '#F8FAFC',
        },
        slateText: '#64748B',
      },
    },
  },
  plugins: [],
};
