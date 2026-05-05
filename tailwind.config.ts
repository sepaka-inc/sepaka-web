import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    // Override defaults entirely — no Tailwind defaults leak through
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',
      void: {
        DEFAULT: '#0D0C0A',
        2: '#161513',
        3: '#2A2825',
      },
      parchment: {
        DEFAULT: '#F5F2EC',
        2: '#EDEAE4',
        3: '#E0DDD7',
      },
      leather: {
        DEFAULT: '#8B5E3C',
        2: '#6B4428',
        3: '#4A2E1A',
        light: '#B07D55',
      },
      camel: {
        DEFAULT: '#C49A6C',
        2: '#A67C4E',
      },
      metal: {
        DEFAULT: '#B8A898',
        2: '#9A8878',
      },
    },

    fontFamily: {
      serif: ['var(--font-bodoni)', 'Georgia', 'serif'],
      sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
    },

    // Full custom font scale — nothing from Tailwind defaults
    fontSize: {
      // ── Display — Bodoni Moda only ──────────────
      // Never use below 24px — thin strokes disappear
      'display-2xl': [
        '5.5rem',
        { lineHeight: '1.0', letterSpacing: '-0.03em', fontWeight: '400' },
      ],
      'display-xl': [
        '4.5rem',
        { lineHeight: '1.0', letterSpacing: '-0.025em', fontWeight: '400' },
      ],
      'display-lg': [
        '3.5rem',
        { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '400' },
      ],
      'display-md': [
        '2.75rem',
        { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '400' },
      ],
      'display-sm': [
        '2rem',
        { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '400' },
      ],
      'display-xs': [
        '1.5rem',
        { lineHeight: '1.2', letterSpacing: '-0.005em', fontWeight: '400' },
      ],

      // ── UI — Inter only ─────────────────────────
      'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '300' }],
      'body-md': ['1rem', { lineHeight: '1.7', fontWeight: '300' }],
      'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
      'body-xs': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],

      // ── Labels — Inter, uppercase, spaced ───────
      'label-lg': [
        '0.875rem',
        { lineHeight: '1', letterSpacing: '0.15em', fontWeight: '500' },
      ],
      'label-md': [
        '0.75rem',
        { lineHeight: '1', letterSpacing: '0.18em', fontWeight: '500' },
      ],
      'label-sm': [
        '0.6875rem',
        { lineHeight: '1', letterSpacing: '0.22em', fontWeight: '500' },
      ],
    },

    spacing: {
      px: '1px',
      0: '0',
      0.5: '0.125rem',
      1: '0.25rem',
      1.5: '0.375rem',
      2: '0.5rem',
      2.5: '0.625rem',
      3: '0.75rem',
      3.5: '0.875rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      11: '2.75rem',
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
      18: '4.5rem',
      20: '5rem',
      22: '5.5rem',
      24: '6rem',
      28: '7rem',
      32: '8rem',
      36: '9rem',
      40: '10rem',
      44: '11rem',
      48: '12rem',
      52: '13rem',
      56: '14rem',
      60: '15rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      96: '24rem',
      120: '30rem',
      160: '40rem',
      192: '48rem',
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '3/4': '75%',
      full: '100%',
      screen: '100vw',
      dvh: '100dvh',
    },

    borderRadius: {
      none: '0',
      xs: '2px',
      sm: '3px',
      DEFAULT: '4px',
      md: '4px',
      lg: '8px',
      full: '9999px',
      // No large radii — rounded = casual, not luxury
    },

    boxShadow: {
      none: 'none',
      xs: '0 1px 2px rgba(0,0,0,0.3)',
      sm: '0 2px 8px rgba(0,0,0,0.4)',
      DEFAULT: '0 4px 24px rgba(0,0,0,0.5)',
      lg: '0 8px 40px rgba(0,0,0,0.55)',
      xl: '0 16px 64px rgba(0,0,0,0.6)',
      glow: '0 0 48px rgba(139,94,60,0.12)',
      'glow-lg': '0 0 80px rgba(139,94,60,0.18)',
    },

    extend: {
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'out-luxury': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        'in-luxury': 'cubic-bezier(0.4, 0.0, 1.0, 1)',
        cinematic: 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
        '1200': '1200ms',
        '1500': '1500ms',
      },
      animation: {
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.25, 0.1, 0.25, 1) both',
        'fade-in': 'fadeIn 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) both',
        'fade-down': 'fadeDown 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) both',
        'slide-left': 'slideLeft 0.5s cubic-bezier(0.76, 0, 0.24, 1) both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeDown: {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
        '3xl': '1920px',
      },
      maxWidth: {
        site: '1440px',
        content: '720px',
        narrow: '480px',
      },
      height: {
        'screen-dvh': '100dvh',
      },
      zIndex: {
        '1': '1',
        '2': '2',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50', // Navbar
        '60': '60', // Mobile menu
        '70': '70', // Modals
        '80': '80', // Drawers
        '90': '90', // Toasts
        '100': '100', // Critical overlays
      },
    },
  },
  plugins: [],
}

export default config
