/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        //body: ['"Poppins", "sans-serif"'],
        body: ['"Source Sans Pro", "sans-serif"'],
      },
      borderWidth: {
        DEFAULT: '3px',
        3: '3px',
      },
      animation: {
        'bounce-front-back': 'wiggle 1s linear infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': {
            transform: ' translateX(-25%)',
            'animation-timing-function': 'cubic-bezier(0.8,0,1,1)',
          },
          '50%': { transform: 'none' },
        },
      },
      colors: {
        'brand-bg': 'var(--bg-color)',
        'brand-text': 'var(--text-color)',
        'brand-blue': 'var(--brand-blue)',
        'brand-indigo-bg': 'var(--brand-indigo-bg)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar-hide')],
};
