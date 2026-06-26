/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        civic: {
          blue: '#2563EB',
          dark: '#0F172A',
          surface: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          ink: '#475569',
        },
        severity: {
          low: '#16A34A',
          medium: '#D97706',
          high: '#EA580C',
          critical: '#DC2626',
        },
        safety: {
          purple: '#9333EA',
          bg: '#FAF5FF',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.06)',
        floating: '0 8px 24px -4px rgba(15, 23, 42, 0.18)',
      },
      animation: {
        'pulse-pin': 'pulsePin 2s ease-out infinite',
        'gauge-fill': 'gaugeFill 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
      },
      keyframes: {
        pulsePin: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '70%': { transform: 'scale(2.4)', opacity: '0' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        gaugeFill: {
          '0%': { strokeDashoffset: 'var(--gauge-full)' },
          '100%': { strokeDashoffset: 'var(--gauge-offset)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
