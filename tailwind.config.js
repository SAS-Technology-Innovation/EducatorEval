/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,astro}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx,astro}",
  ],
  theme: {
    extend: {
      colors: {
        'crp-blue': '#3B82F6',
        'crp-green': '#10B981',
        'crp-purple': '#8B5CF6',
        'crp-orange': '#F59E0B',
        'crp-pink': '#EC4899',
        'crp-indigo': '#6366F1',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
