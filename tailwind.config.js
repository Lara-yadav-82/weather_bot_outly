/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        pulse: {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(255, 77, 79, 0.4)',
          },
          '70%': {
            boxShadow: '0 0 0 10px rgba(255, 77, 79, 0)',
          },
        },
        rotate: {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },
      },
      animation: {
        pulse: 'pulse 1.5s infinite',
        rotate: 'rotate 90s linear infinite',
      },
    },
  },
  plugins: [],
}


