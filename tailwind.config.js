const plugin = require('tailwindcss/plugin')

// tailwind.config.js
module.exports = {
  content: ['./App.jsx', './src/**/*.jsx'],
  theme: {
    extend: {
      colors: {
        accent: '#E50014',
        success: '#4CAF50',
        error: '#E50014',
        'bg-default': 'bg-gradient-to-b from-10% via-[#fff] to-[#f4f6fa]',
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        '*': {
          fontSize: '16px',
        },
      })
    }),
  ],
}
