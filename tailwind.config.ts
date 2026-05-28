import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#111827',
        panel: '#0f172a',
        accent: '#a855f7',
        glow: '#14b8a6',
        silver: '#c7d2e0',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(168,85,247,0.12), 0 35px 80px -35px rgba(20,184,166,0.45)',
      },
    },
  },
  plugins: [],
};

export default config;
