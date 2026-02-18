/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'merkato-orange': '#FF6B35',
        'merkato-beige': '#F5E6D3',
        'merkato-teal': '#A8C5A0',
        'merkato-cream': '#F9F8F6',
        'merkato-dark': '#111827',
        'merkato-gray': '#374151',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#FF6B35',
          secondary: '#A8C5A0',
          accent: '#F5E6D3',
          neutral: '#374151',
          'base-100': '#F9F8F6',
          info: '#3abff8',
          success: '#36d399',
          warning: '#fbbd23',
          error: '#f87272',
        },
      },
      'light',
    ],
    darkTheme: 'dark',
  },
}
