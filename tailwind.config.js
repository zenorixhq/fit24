/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./admin.html",
    "./member.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          black: '#050505',
          dark: '#0d0d10',
          card: '#121216',
          red: '#ff0033',
          reddark: '#b30024'
        }
      }
    }
  },
  plugins: []
}
