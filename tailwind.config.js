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
        border: "#e5e7eb",
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
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      transitionTimingFunction: {
        'custom': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
  // Safelist critical utility classes to prevent purging
  safelist: [
    'tracking-custom',
    'shadow-container',
    'shadow-container-lg',
    'font-heading',
    'font-body',
    'bg-custom-cyan',
    'bg-custom-purple',
    'bg-custom-pink',
    'bg-custom-white',
    'from-custom-cyan',
    'via-custom-purple',
    'to-custom-pink',
    'border-custom-purple',
  ],
}