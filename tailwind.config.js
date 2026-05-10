/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#ffffff',
        parchment: '#f5f5f7',
        pearl: '#fafafc',
        'tile-dark': '#272729',
        'tile-dark-2': '#2a2a2c',
        'tile-dark-3': '#252527',
        ink: '#1d1d1f',
        'ink-muted': '#333333',
        primary: '#0066cc',
        'primary-focus': '#0071e3',
        'primary-on-dark': '#2997ff',
        hairline: '#e0e0e0',
        'body-muted': '#cccccc',
      },
      fontFamily: {
        display: ['"SF Pro Display"', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['"SF Pro Text"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        section: '80px',
      },
      borderRadius: {
        pill: '9999px',
      },
    },
  },
  plugins: [],
}
