import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Core palette
        void: '#0D0C0A', // Primary background — near-black, warm undertone
        'void-2': '#161513', // Slightly lighter — cards, overlays
        'void-3': '#1E1C19', // Elevated surfaces
        border: '#2A2825', // Subtle borders on dark bg
        parchment: '#F5F2EC', // Primary text + light mode bg
        'parch-2': '#C4BFB6', // Secondary text — muted
        'parch-3': '#8A8480', // Tertiary — very muted
        // Leather palette
        leather: '#8B5E3C', // Primary brand accent
        'leather-2': '#6B4428', // Hover / pressed state
        'leather-3': '#4A2E1A', // Deep leather — headers on light bg
        camel: '#C49A6C', // Camel leather variant accent
        // Metallic
        metal: '#B8A898', // Brushed — zippers, hardware
        'metal-2': '#D4CEC8', // Light metallic details
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Display scale — for hero headlines
        'display-2xl': [
          '5rem',
          { lineHeight: '1.0', letterSpacing: '-0.03em' },
        ],
        'display-xl': [
          '4rem',
          { lineHeight: '1.05', letterSpacing: '-0.025em' },
        ],
        'display-lg': [
          '3.25rem',
          { lineHeight: '1.1', letterSpacing: '-0.02em' },
        ],
        'display-md': [
          '2.5rem',
          { lineHeight: '1.15', letterSpacing: '-0.015em' },
        ],
        'display-sm': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        // UI scale
        'ui-lg': ['1.125rem', { lineHeight: '1.6' }],
        'ui-md': ['1rem', { lineHeight: '1.6' }],
        'ui-sm': ['0.875rem', { lineHeight: '1.5' }],
        'ui-xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
        // Label scale — spaced capitals
        'label-lg': ['0.875rem', { lineHeight: '1', letterSpacing: '0.15em' }],
        'label-sm': ['0.75rem', { lineHeight: '1', letterSpacing: '0.2em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '120': '30rem', // Hero section heights
        '160': '40rem',
        '200': '50rem',
      },
      borderRadius: {
        none: '0',
        xs: '2px', // Very subtle — inputs, tags
        sm: '4px', // Cards
        DEFAULT: '4px',
        lg: '8px',
        full: '9999px',
        // No large rounded corners — too casual for luxury
      },
      boxShadow: {
        // Luxury uses almost no shadow — when used, it must be precise
        'luxury-sm': '0 1px 3px rgba(0,0,0,0.4)',
        luxury: '0 4px 24px rgba(0,0,0,0.5)',
        'luxury-lg': '0 16px 64px rgba(0,0,0,0.6)',
        glow: '0 0 40px rgba(139,94,60,0.15)', // Leather glow
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'in-luxury': 'cubic-bezier(0.4, 0, 1, 1)',
        'out-luxury': 'cubic-bezier(0, 0, 0.2, 1)',
        cinematic: 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        'slide-left': 'slideLeft 1.2s cubic-bezier(0.76, 0, 0.24, 1) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
