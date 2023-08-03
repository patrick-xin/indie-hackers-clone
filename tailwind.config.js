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
        'fade-in': 'fadeIn 240ms linear',
        'fade-out': 'fadeOut 240ms linear',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': {
            transform: ' translateX(-25%)',
            'animation-timing-function': 'cubic-bezier(0.8,0,1,1)',
          },
          '50%': { transform: 'none' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '50%': { opacity: 0.5 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.5 },
          '100%': { opacity: 100 },
        },
      },
      colors: {
        'brand-bg': 'var(--bg-color)',
        'brand-text': 'var(--text-color)',
        'brand-blue': 'var(--brand-blue)',
        'brand-indigo-bg': 'var(--brand-indigo-bg)',
      },
      zIndex: {
        100: '100',
        999: '999',
      },
      typography: ({ theme }) => ({
        brand: {
          css: {
            '--tw-prose-body': '#d1dbe6',
            '--tw-prose-headings': theme('colors.gray[200]'),
            '--tw-prose-lead': theme('colors.gray[200]'),
            '--tw-prose-links': '#4799eb',
            '--tw-prose-bold': theme('colors.gray[200]'),
            '--tw-prose-counters': '#9cb3c9',
            '--tw-prose-bullets': '#9cb3c9',
            '--tw-prose-hr': theme('colors.gray[600]'),
            '--tw-prose-quotes': theme('colors.gray[100]'),
            '--tw-prose-quote-borders': '#4799eb',
            '--tw-prose-captions': theme('colors.gray[300]'),
            '--tw-prose-code': theme('colors.gray[300]'),
            '--tw-prose-pre-code': theme('colors.gray[300]'),
            '--tw-prose-pre-bg': '#1e364d',
            '--tw-prose-th-borders': theme('colors.gray[300]'),
            '--tw-prose-td-borders': theme('colors.gray[200]'),
          },
        },
        DEFAULT: {
          css: {},
        },
      }),
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
};
