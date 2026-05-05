'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Search, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'The Story', href: '/story' },
  { label: 'Journal', href: '/journal' },
  { label: 'About', href: '/about' },
] as const

const EASE_CINEMATIC = [0.76, 0, 0.24, 1] as const
const EASE_LUXURY = [0.25, 0.1, 0.25, 1] as const

const menuVariants = {
  closed: {
    x: '100%',
    transition: { duration: 0.6, ease: EASE_CINEMATIC },
  },
  open: {
    x: '0%',
    transition: { duration: 0.6, ease: EASE_CINEMATIC },
  },
}

const itemVariants = {
  closed: { opacity: 0, y: 20 },
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.07,
      duration: 0.5,
      ease: EASE_LUXURY,
    },
  }),
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount] = useState(0)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const LINK_COLOR = '#0D0C0A'
  const LINK_COLOR_MUTED = '#2A2825'

  return (
    <>
      <header
        role="banner"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: '#FFFFFF',
          borderBottom: '0.5px solid #E8E4DE',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <Link
            href="/"
            aria-label="SEPAKA homepage"
            style={{ textDecoration: 'none', flexShrink: 0, zIndex: 1 }}
          >
            <img
              src="/images/brand/sepaka-logo.svg"
              alt="SEPAKA"
              style={{
                height: '28px',
                width: 'auto',
                display: 'block',
                filter: 'brightness(0)',
              }}
            />
          </Link>

          <nav
            role="navigation"
            aria-label="Main navigation"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '2.75rem',
            }}
            className="desktop-nav"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 400,
                  letterSpacing: '0.04em',
                  textDecoration: 'none',
                  color: LINK_COLOR_MUTED,
                  transition: 'color 250ms',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = LINK_COLOR
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = LINK_COLOR_MUTED
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              flexShrink: 0,
              zIndex: 1,
            }}
          >
            <button
              type="button"
              aria-label="Search"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                color: LINK_COLOR_MUTED,
                display: 'flex',
                alignItems: 'center',
                transition: 'color 250ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = LINK_COLOR
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = LINK_COLOR_MUTED
              }}
            >
              <Search size={20} strokeWidth={1.25} aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-label="My account"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                color: LINK_COLOR_MUTED,
                display: 'flex',
                alignItems: 'center',
                transition: 'color 250ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = LINK_COLOR
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = LINK_COLOR_MUTED
              }}
            >
              <User size={20} strokeWidth={1.25} aria-hidden="true" />
            </button>

            <Link
              href="/cart"
              aria-label={
                cartCount > 0 ? `Cart — ${cartCount} items` : 'Cart'
              }
              style={{
                position: 'relative',
                padding: '8px',
                color: LINK_COLOR_MUTED,
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                transition: 'color 250ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = LINK_COLOR
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = LINK_COLOR_MUTED
              }}
            >
              <ShoppingBag size={20} strokeWidth={1.25} aria-hidden="true" />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#8B5E3C',
                    color: '#fff',
                    fontSize: '9px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              className="mobile-menu-btn"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                color: LINK_COLOR_MUTED,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                aria-hidden="true"
              >
                <line
                  x1="3"
                  y1="6"
                  x2="19"
                  y2="6"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
                <line
                  x1="3"
                  y1="11"
                  x2="19"
                  y2="11"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
                <line
                  x1="3"
                  y1="16"
                  x2="19"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <style>{`
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          @media (max-width: 767px) {
            .desktop-nav { display: none !important; }
            .mobile-menu-btn { display: flex !important; }
          }
        `}</style>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 40,
                backgroundColor: 'rgba(13,12,10,0.15)',
              }}
            />
            <motion.div
              key="panel"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 60,
                width: '100%',
                maxWidth: '360px',
                backgroundColor: '#FFFFFF',
                borderLeft: '0.5px solid #E8E4DE',
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '5rem',
                paddingBottom: '2.5rem',
                paddingLeft: '2rem',
                paddingRight: '2rem',
              }}
            >
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  flex: 1,
                }}
              >
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    custom={i}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '1.25rem',
                        paddingBottom: '1.25rem',
                        borderBottom: '0.5px solid #E8E4DE',
                        fontFamily: 'var(--font-bodoni), Georgia, serif',
                        fontSize: '1.75rem',
                        fontWeight: 400,
                        color: '#0D0C0A',
                        textDecoration: 'none',
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <p
                style={{
                  fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: '#9A8878',
                  marginTop: 'auto',
                  paddingTop: '2rem',
                  borderTop: '0.5px solid #E8E4DE',
                }}
              >
                Worn in. Never out.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
