import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        window: 'rgb(var(--color-window) / <alpha-value>)',
        panel: 'rgb(var(--color-panel) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        'accent-green': 'rgb(var(--color-accent-green) / <alpha-value>)',
        'accent-blue': 'rgb(var(--color-accent-blue) / <alpha-value>)',
        'accent-cyan': 'rgb(var(--color-accent-cyan) / <alpha-value>)',
        'accent-peach': 'rgb(var(--color-accent-peach) / <alpha-value>)',
        'accent-rose': 'rgb(var(--color-accent-rose) / <alpha-value>)',
        'accent-pink': 'rgb(var(--color-accent-pink) / <alpha-value>)',
        'accent-lavender': 'rgb(var(--color-accent-lavender) / <alpha-value>)',
        'accent-gray': 'rgb(var(--color-accent-gray) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['CaskaydiaMono Nerd Font', ...defaultTheme.fontFamily.mono]
      }
    }
  }
};

export default config;
