/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx,html}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                // Primary Colors (Blue)
                primary: '#3b82f6',
                'primary-dark': '#1e40af',
                'primary-light': '#dbeafe',

                // Secondary/Neutral Colors
                secondary: '#64748b',
                'secondary-dark': '#334155',
                'secondary-light': '#f1f5f9',

                // Accent Colors (Amber/Orange)
                accent: '#f59e0b',
                'accent-dark': '#d97706',
                'accent-light': '#fef3c7',

                // Success Colors (Emerald)
                success: '#10b981',
                'success-dark': '#047857',
                'success-light': '#dcfce7',

                // Danger Colors (Red)
                danger: '#ef4444',
                'danger-dark': '#dc2626',
                'danger-light': '#fee2e2',

                // Warning Colors (Yellow)
                warning: '#f59e0b',
                'warning-dark': '#d97706',
                'warning-light': '#fef3c7',

                // Background Colors
                background: '#ffffff',
                'background-secondary': '#f8fafc',
                'background-tertiary': '#f1f5f9',

                // Text Colors
                text: '#0f172a',
                'text-secondary': '#475569',
                'text-muted': '#94a3b8',

                // Card Colors
                card1color: '#8CCDEB',
                card2color: '#FFE3A9',
                card3color: '#725CAD',
                card4color: '#0B1D51',
                card5color: '#c2e6f6',
                'card-text': '#1e293b',

                // Border Colors
                border: '#e2e8f0',
                'border-dark': '#cbd5e1',

                // Utility Colors
                white: '#ffffff',
                black: '#000000',
                transparent: 'transparent',
            },
        },
    },
    plugins: [],
}
