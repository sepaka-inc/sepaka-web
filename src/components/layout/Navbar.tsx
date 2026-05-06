'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const isHomepage = pathname === '/'

  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    // On homepage — always visible, no scroll logic needed
    if (isHomepage) {
      setVisible(true)
      return
    }

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          const scrollingDown = currentScrollY > lastScrollY.current

          // Only hide after scrolled past 80px to avoid flickering at top
          if (currentScrollY < 80) {
            setVisible(true)
          } else if (scrollingDown) {
            setVisible(false)
          } else {
            setVisible(true)
          }

          lastScrollY.current = currentScrollY
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomepage])

  return (
    <header
      style={{
        position:        'fixed',
        top:             0,
        left:            0,
        right:           0,
        zIndex:          50,
        backgroundColor: '#FFFFFF',
        borderBottom:    '0.5px solid #E8E4DE',
        transform:       visible ? 'translateY(0)' : 'translateY(-100%)',
        transition:      isHomepage
          ? 'none'
          : 'transform 400ms cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
    >
      <nav
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '0 clamp(1.5rem, 4vw, 4rem)',
          height:         '60px',
        }}
      >
        {/* Logo — left */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Image
            src="/images/brand/sepaka-logo.svg"
            alt="SEPAKA"
            width={100}
            height={28}
            priority
          />
        </Link>

        {/* Nav links — centre */}
        <div style={{
          position:  'absolute',
          left:      '50%',
          transform: 'translateX(-50%)',
          display:   'flex',
          gap:       'clamp(1.5rem, 3vw, 3rem)',
        }}>
          {[
            { label: 'Shop',      href: '/shop'      },
            { label: 'The Story', href: '#'          },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              style={{
                fontFamily:     'var(--font-inter), system-ui, sans-serif',
                fontSize:       '0.75rem',
                fontWeight:     400,
                letterSpacing:  '0.06em',
                color:          '#0D0C0A',
                textDecoration: 'none',
                opacity:        0.75,
                transition:     'opacity 200ms ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = '1'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75'
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Icons — right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
          {/* Search */}
          <button
            aria-label="Search"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#0D0C0A', opacity: 0.7 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>

          {/* Account */}
          <button
            aria-label="Account"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#0D0C0A', opacity: 0.7 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {/* Cart */}
          <button
            aria-label="Cart"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#0D0C0A', opacity: 0.7 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  )
}
