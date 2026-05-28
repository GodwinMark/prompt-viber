import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#111827',
        panel: '#0f172a',
        accent: '#38bdf8',
        glow: '#60a5fa',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(56,189,248,0.12), 0 35px 80px -35px rgba(56,189,248,0.45)',
      },
    },
  },
  plugins: [],
};

export default config;
