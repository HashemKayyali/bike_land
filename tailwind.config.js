/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.{html,js}",
    "./node_modules/preline/dist/*.js", // مهم
  ],
  theme: { extend: {} },
  plugins: [], // احذف require('preline/plugin')
}
