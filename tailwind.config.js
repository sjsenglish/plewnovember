/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Custom color palette
        'custom-cyan': '#DBF7F9',
        'custom-purple': '#D4D0FF',
        'custom-pink': '#FADEE8',
        'custom-white': '#F9F9FF',
      },
      fontFamily: {
        'heading': ['var(--font-madimi)', 'system-ui', '-apple-system', 'sans-serif'],
        'body': ['var(--font-figtree)', 'system-ui', '-apple-system', 'sans-serif'],
        'figtree': ['var(--font-figtree)', 'system-ui', '-apple-system', 'sans-serif'],
        'madimi': ['var(--font-madimi)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        'custom': '0.04em',
      },
    },
  },
  plugins: [],
}