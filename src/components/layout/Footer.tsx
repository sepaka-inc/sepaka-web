'use client'

import Link from 'next/link'

const columns = [
  {
    heading: 'The Jackets',
    links: [
      { label: 'The Frontier', href: '/products/the-frontier' },
      { label: 'The Warden', href: '/products/the-warden' },
      { label: 'The Nomad', href: '/products/the-nomad' },
      { label: 'The Heir', href: '/products/the-heir' },
      { label: 'The Sentinel', href: '/products/the-sentinel' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Sizing Guide', href: '#' },
      { label: 'Care & Leather', href: '#' },
      { label: 'Shipping Info', href: '#' },
      { label: 'Contact Us', href: 'mailto:hello@sepaka.ca' },
    ],
  },
  {
    heading: 'The Brand',
    links: [
      { label: 'The Story', href: '#' },
      { label: 'Journal', href: '#' },
      { label: 'About SEPAKA', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Returns Policy', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#0D0C0A',
        color: '#F5F2EC',
        width: '100%',
      }}
    >
      {/* Main columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(2rem, 4vw, 4rem)',
          padding: 'clamp(4rem, 8vw, 7rem) clamp(2rem, 6vw, 7rem)',
          borderBottom: '0.5px solid rgba(245,242,236,0.12)',
        }}
      >
        {columns.map((col) => (
          <div key={col.heading}>
            {/* Column heading */}
            <p
              style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontSize: '0.625rem',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(245,242,236,0.6)',
                marginBottom: '1.75rem',
              }}
            >
              {col.heading}
            </p>

            {/* Links */}
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {col.links.map((link) => (
                <li key={link.label} style={{ marginBottom: '1rem' }}>
                  <Link
                    href={link.href}
                    style={{
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '0.8125rem',
                      fontWeight: 400,
                      color: 'rgba(245,242,236,0.8)',
                      textDecoration: 'none',
                      letterSpacing: '0.02em',
                      transition: 'color 300ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#F5F2EC'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(245,242,236,0.8)'
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(2rem, 6vw, 7rem)',
        }}
      >
        {/* Copyright */}
        <p
          style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '0.625rem',
            fontWeight: 400,
            letterSpacing: '0.08em',
            color: 'rgba(245,242,236,0.5)',
            textTransform: 'uppercase',
          }}
        >
          © 2026 SEPAKA. Calgary, Alberta.
        </p>

        {/* Tagline */}
        <p
          style={{
            fontFamily: 'var(--font-bodoni), Georgia, serif',
            fontSize: '0.9375rem',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'rgba(245,242,236,0.45)',
            letterSpacing: '0.02em',
          }}
        >
          Worn in. Never out.
        </p>

        {/* Instagram */}
        <Link
          href="https://instagram.com/sepaka.ca"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '0.625rem',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(245,242,236,0.5)',
            textDecoration: 'none',
            transition: 'color 300ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#F5F2EC'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(245,242,236,0.5)'
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
          </svg>
          @sepaka.ca
        </Link>
      </div>
    </footer>
  )
}
