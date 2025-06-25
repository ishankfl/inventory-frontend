/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all your frontend components

  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        'primary-dark': '#1d4ed8',
        accent: '#f59e0b',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        background: '#f8fafc',
        text: '#1e293b',
        'accent-dark': '#d97706',
         'danger-dark': '#dc2626',
      }
    },
  },
  plugins: [],
}

