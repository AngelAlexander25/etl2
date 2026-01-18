module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        secondary: '#06b6d4',
        accent: '#3b82f6',
      },
      boxShadow: {
        'elegant': '0 2px 8px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
