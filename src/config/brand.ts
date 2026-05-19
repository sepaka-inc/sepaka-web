export const brandConfig = {
  name: 'SEPAKA',
  tagline: 'Worn in. Never out.',
  email: 'hello@sepaka.ca',
  domain: 'sepaka.ca',
  colors: {
    background: '#FFFFFF',
    cream: '#F5F2EC',
    text: '#0D0C0A',
    accent: '#8B5E3C',
    accentMuted: 'rgba(139,94,60,0.8)',
    textMuted: 'rgba(13,12,10,0.6)',
    textSubtle: 'rgba(13,12,10,0.5)',
  },
  fonts: {
    display: 'var(--font-bodoni), Georgia, serif',
    ui: 'var(--font-inter), system-ui, sans-serif',
  },
  production: {
    leadTime: '4–6 weeks',
    model: 'Made to Order',
    notice: 'Your jacket will be crafted after purchase. Production takes 4–6 weeks.',
  },
  legal: {
    refundPolicy: 'All jackets are made to order and non-refundable.',
    termsUrl: '/terms',
    privacyUrl: '/privacy',
  },
  social: {
    instagram: '',
    facebook: '',
  },
} as const

export type BrandConfig = typeof brandConfig
