import type { Config } from 'tailwindcss';

/**
 * Tailwind consumes SEMANTIC design tokens only (see src/app/globals.css).
 * Components must never reference raw color literals — always these token names —
 * so light/dark and future reskins are a single source-of-truth change.
 */
const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    './packages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-raised': 'rgb(var(--surface-raised) / <alpha-value>)',
        'surface-sunken': 'rgb(var(--surface-sunken) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
        'text-muted': 'rgb(var(--text-muted) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-fg': 'rgb(var(--accent-fg) / <alpha-value>)',
        'stat-positive': 'rgb(var(--stat-positive) / <alpha-value>)',
        'stat-negative': 'rgb(var(--stat-negative) / <alpha-value>)',
        'stat-temp': 'rgb(var(--stat-temp) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontVariantNumeric: {
        tabular: 'tabular-nums',
      },
      borderRadius: {
        token: 'var(--radius)',
      },
    },
  },
  plugins: [],
};

export default config;
