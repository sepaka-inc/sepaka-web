'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { createClient } from '@/lib/supabase-client'
import type { User } from '@supabase/supabase-js'
import AuthPanel from '@/components/auth/AuthPanel'

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'The Story', href: '#' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { totalItems, openCart } = useCart()
  const isHomepage = pathname === '/'

  const [visible, setVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [authPanelOpen, setAuthPanelOpen] = useState(false)
  const [authPanelView, setAuthPanelView] = useState<'login' | 'register' | 'check-email'>('login')
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('#account-menu-wrapper')) {
        setShowAccountMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Smart hide on scroll
  useEffect(() => {
    if (isHomepage) {
      setVisible(true)
      return
    }

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          if (currentScrollY < 80) {
            setVisible(true)
          } else if (currentScrollY > lastScrollY.current) {
            setVisible(false)
            setMenuOpen(false)
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

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: '#FFFFFF',
          borderBottom: '0.5px solid #E8E4DE',
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
          transition: isHomepage
            ? 'none'
            : 'transform 400ms cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      >
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 clamp(1rem, 4vw, 4rem)',
            height: '60px',
            position: 'relative',
          }}
        >
          {/* Logo — left */}
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', flexShrink: 0, zIndex: 2 }}
          >
            <Image
              src="/images/brand/sepaka-logo.svg"
              alt="SEPAKA"
              width={120}
              height={34}
              priority
            />
          </Link>

          {/* Centre nav links — desktop only */}
          {!isMobile && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 'clamp(1.5rem, 3vw, 3rem)',
              }}
            >
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  style={{
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 400,
                    letterSpacing: '0.06em',
                    color: '#0D0C0A',
                    textDecoration: 'none',
                    opacity: 0.75,
                    transition: 'opacity 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.opacity = '0.75'
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side icons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexShrink: 0,
              zIndex: 2,
            }}
          >
            {/* Search — always visible */}
            <button
              type="button"
              aria-label="Search"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                color: '#0D0C0A',
                opacity: 0.7,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            {/* Account — desktop only */}
            {!isMobile && (
              user ? (
                <div id="account-menu-wrapper" style={{ position: 'relative' }}>
                  <button
                    type="button"
                    aria-label="Account"
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0D0C0A',
                      opacity: 0.7,
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <div style={{
                      position: 'absolute',
                      top: '0px',
                      right: '0px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#8B5E3C',
                      border: '1.5px solid #FFFFFF',
                    }} />
                  </button>

                  {showAccountMenu && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 12px)',
                      right: 0,
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 4px 24px rgba(13,12,10,0.10)',
                      minWidth: '160px',
                      zIndex: 1000,
                      padding: '8px 0',
                    }}>
                      <p style={{
                        fontFamily: 'var(--font-inter), system-ui, sans-serif',
                        fontSize: '0.6875rem',
                        color: 'rgba(13,12,10,0.4)',
                        letterSpacing: '0.05em',
                        padding: '8px 20px 4px',
                        margin: 0,
                        textTransform: 'uppercase',
                      }}>
                        {user.user_metadata?.first_name || user.email?.split('@')[0]}
                      </p>

                      <div style={{ height: '0.5px', backgroundColor: '#F0EDE8', margin: '8px 0' }} />

                      <Link
                        href="/account"
                        onClick={() => setShowAccountMenu(false)}
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '0.8125rem',
                          color: '#0D0C0A',
                          padding: '8px 20px',
                          textDecoration: 'none',
                          letterSpacing: '0.02em',
                        }}
                      >
                        My Account
                      </Link>

                      <button
                        type="button"
                        onClick={async () => {
                          setShowAccountMenu(false)
                          const supabase = createClient()
                          await supabase.auth.signOut()
                          window.location.href = '/'
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '0.8125rem',
                          color: 'rgba(13,12,10,0.5)',
                          padding: '8px 20px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          letterSpacing: '0.02em',
                        }}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  aria-label="Account"
                  onClick={() => { setAuthPanelView('login'); setAuthPanelOpen(true) }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0D0C0A',
                    opacity: 0.7,
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>
              )
            )}

            {/* Cart — always visible */}
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}
              style={{
                position:   'relative',
                background: 'none',
                border:     'none',
                cursor:     'pointer',
                padding:    '0.25rem',
                color:      totalItems > 0 ? '#0D0C0A' : 'rgba(13,12,10,0.7)',
                display:    'flex',
                alignItems: 'center',
                transition: 'color 200ms ease',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={totalItems > 0 ? 1.75 : 1.25}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItems > 0 && (
                <div style={{
                  position:        'absolute',
                  top:             '-6px',
                  right:           '-6px',
                  width:           '14px',
                  height:          '14px',
                  borderRadius:    '50%',
                  backgroundColor: '#0D0C0A',
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  fontFamily:      'var(--font-inter), system-ui, sans-serif',
                  fontSize:        '0.4375rem',
                  fontWeight:      500,
                  color:           '#F5F2EC',
                }}>
                  {totalItems > 9 ? '9+' : totalItems}
                </div>
              )}
            </button>

            {/* Hamburger — mobile only */}
            {isMobile && (
              <button
                type="button"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  color: '#0D0C0A',
                }}
              >
                {menuOpen ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay — below fixed header so bar + close control stay usable */}
      {isMobile && (
        <div
          style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 45,
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2.5rem',
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? 'all' : 'none',
            transition: 'opacity 350ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-bodoni), Georgia, serif',
                fontSize: 'clamp(2rem, 8vw, 3rem)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                color: '#0D0C0A',
                textDecoration: 'none',
              }}
            >
              {label}
            </Link>
          ))}

          <Link
            href={user ? '/account' : '/account/login'}
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'relative',
              display: 'inline-block',
              fontFamily: 'var(--font-bodoni), Georgia, serif',
              fontSize: 'clamp(2rem, 8vw, 3rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#0D0C0A',
              textDecoration: 'none',
            }}
          >
            Account
            {user && (
              <span style={{
                position: 'absolute',
                top: '0.15em',
                right: '-0.5em',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#8B5E3C',
                border: '1.5px solid #FFFFFF',
              }} />
            )}
          </Link>

          <Link
            href="https://instagram.com/sepaka.ca"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: '0.625rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(13,12,10,0.6)',
              textDecoration: 'none',
              marginTop: '2rem',
            }}
          >
            @sepaka.ca
          </Link>
        </div>
      )}

      <AuthPanel
        isOpen={authPanelOpen}
        onClose={() => setAuthPanelOpen(false)}
        defaultView={authPanelView}
      />
    </>
  )
}
