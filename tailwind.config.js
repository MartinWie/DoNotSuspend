module.exports = {
  content: [
    './src/**/*.{html,js}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
          require('daisyui')
      ],
      daisyui: {
          themes: ['nord'],
          base: true, // applies background color and foreground color for root element by default
          styled: true, // include daisyUI colors and design decisions for all components
          utils: true, // adds responsive and modifier utility classes
      },
}