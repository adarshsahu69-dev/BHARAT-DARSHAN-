import type { Config } from 'tailwindcss';

/**
 * BHARAT DARSHAN design system.
 * Palette: deep maroon/terracotta primary, warm sand/cream secondary,
 * saffron/gold accent, warm ivory background, dark charcoal text.
 * Contrast ratios are tuned so every text/background pair used in the app
 * meets WCAG AA (>= 4.5:1 for body copy, >= 3:1 for large text).
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Primary — deep maroon / terracotta
        maroon: {
          50: '#fbf3f0',
          100: '#f5e2db',
          200: '#e9c2b4',
          300: '#d99b85',
          400: '#c56f52',
          500: '#b04d2c',
          600: '#963a1e',
          700: '#7a2d18',
          800: '#5c2113',
          900: '#3d160c',
          950: '#210b05',
        },
        // Secondary — warm sand / cream
        sand: {
          50: '#fdfbf7',
          100: '#f8f2e8',
          200: '#efe3cf',
          300: '#e2cfad',
          400: '#d1b585',
          500: '#bf9d64',
          600: '#a9824c',
          700: '#8a683e',
          800: '#6b5032',
          900: '#4c3823',
          950: '#2a1d10',
        },
        // Accent — saffron / gold
        saffron: {
          50: '#fff9eb',
          100: '#ffefc6',
          200: '#ffdd88',
          300: '#ffc74a',
          400: '#ffb020',
          500: '#f99307',
          600: '#dd6d02',
          700: '#b74d06',
          800: '#943b0c',
          900: '#7a310d',
          950: '#431704',
        },
        // Backgrounds / surfaces
        ivory: '#fbf7f0',
        parchment: '#f4ece0',
        // Text
        charcoal: {
          DEFAULT: '#241d18',
          soft: '#4a3f37',
          muted: '#6b5d52',
        },
        // Feedback
        success: {
          50: '#eefbf3',
          100: '#d5f5e1',
          500: '#15803d',
          700: '#166534',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#b91c1c',
          700: '#991b1b',
        },
        info: {
          50: '#eef6ff',
          100: '#d9ecff',
          500: '#1d4ed8',
          700: '#1e40af',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-sm': ['clamp(1.75rem, 1.2rem + 2.2vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(2.25rem, 1.5rem + 3.2vw, 3.5rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.75rem, 1.6rem + 4.6vw, 5rem)', { lineHeight: '1.03', letterSpacing: '-0.025em' }],
        'display-xl': ['clamp(3.25rem, 1.8rem + 6vw, 6.5rem)', { lineHeight: '0.98', letterSpacing: '-0.03em' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(36,29,24,0.04), 0 8px 24px -12px rgba(36,29,24,0.14)',
        'card-hover': '0 2px 4px rgba(36,29,24,0.06), 0 20px 40px -16px rgba(36,29,24,0.24)',
        header: '0 1px 0 rgba(36,29,24,0.08)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.5)',
      },
      backgroundImage: {
        'maroon-gradient': 'linear-gradient(135deg, #7a2d18 0%, #963a1e 45%, #b04d2c 100%)',
        'sand-gradient': 'linear-gradient(180deg, #fdfbf7 0%, #f4ece0 100%)',
        'hero-scrim':
          'linear-gradient(180deg, rgba(36,29,24,0.72) 0%, rgba(61,22,12,0.58) 45%, rgba(36,29,24,0.86) 100%)',
        'gold-rule': 'linear-gradient(90deg, transparent 0%, #d1b585 20%, #ffb020 50%, #d1b585 80%, transparent 100%)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'marquee-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 1.6s infinite',
        'marquee-scroll': 'marquee-scroll 40s linear infinite',
        'pulse-ring': 'pulse-ring 1.8s ease-out infinite',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
