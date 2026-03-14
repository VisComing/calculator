import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        calc: {
          bg: {
            light: '#F3F3F3',
            dark: '#202020',
          },
          display: {
            light: '#FFFFFF',
            dark: '#1E1E1E',
          },
          btn: {
            light: '#FFFFFF',
            dark: '#323232',
            operator: {
              light: '#F0F0F0',
              dark: '#3C3C3C',
            },
            accent: '#005FB8',
          },
          text: {
            light: '#202020',
            dark: '#FFFFFF',
            muted: {
              light: '#717171',
              dark: '#A0A0A0',
            },
          },
          border: {
            light: '#E5E5E5',
            dark: '#444444',
          },
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'calc': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'calc-dark': '0 2px 8px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
