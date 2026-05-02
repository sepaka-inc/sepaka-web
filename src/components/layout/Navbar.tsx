'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

// ── Nav config ────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Journal', href: '/journal' },
  { label: 'About', href: '/about' },
] as const

// ── Animation variants ────────────────────────────────────
const menuVariants = {
  closed: {
    x: '100%',
    transition: {
      duration: 0.6,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  open: {
    x: '0%',
    transition: {
      duration: 0.6,
      ease: [0.76, 0, 0.24, 1],
    },
  },
}

const menuItemVariants = {
  closed: {
    opacity: 0,
    y: 24,
    transition: { duration: 0.2 },
  },
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.25 + i * 0.07,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
}

const overlayVariants = {
  closed: {
    opacity: 0,
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
  open: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
}

// ── Component ─────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount] = useState(0) // wired to cart state in Phase 5
  const prefersReducedMotion = useReducedMotion()

  // ── Scroll detection ──────────────────────────────────
  // Navbar becomes solid after scrolling 60px
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 60)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // ── Body scroll lock ──────────────────────────────────
  // Prevents page scrolling while mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '3px' // compensate scrollbar
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [menuOpen])

  // ── Close menu on Escape key ──────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      {/* ══════════════════════════════════════════
          HEADER BAR
      ══════════════════════════════════════════ */}
      <header
        role="banner"
        className={[
          'fixed inset-x-0 top-0 z-50',
          'ease-luxury transition-all duration-600',
          scrolled
            ? 'bg-void/96 border-border border-b backdrop-blur-sm'
            : 'border-b border-transparent bg-transparent',
        ].join(' ')}
      >
        <div className="container-luxury">
          <nav
            role="navigation"
            aria-label="Main navigation"
            className="flex h-16 items-center justify-between md:h-20"
          >
            {/* ── Wordmark ──────────────────────── */}
            <Link
              href="/"
              onClick={closeMenu}
              aria-label="SEPAKA — Return to homepage"
              className={[
                'font-serif font-bold tracking-[0.18em]',
                'text-parchment text-[1.1rem] uppercase',
                'ease-luxury transition-colors duration-400',
                'hover:text-metal',
                // Subtle underline reveal on hover
                'relative after:absolute after:bottom-[-2px] after:left-0',
                'after:bg-leather after:h-px after:w-0',
                'after:ease-luxury after:transition-all after:duration-500',
                'hover:after:w-full',
              ].join(' ')}
            >
              SEPAKA
            </Link>

            {/* ── Desktop navigation ────────────── */}
            <ul role="list" className="hidden items-center gap-10 md:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={[
                      'text-label text-parchment-2',
                      'ease-luxury transition-colors duration-300',
                      'hover:text-parchment',
                      'group relative',
                      // Underline that grows from left on hover
                      'after:absolute after:bottom-[-3px] after:left-0',
                      'after:bg-leather after:h-px after:w-0',
                      'after:ease-luxury after:transition-all after:duration-400',
                      'hover:after:w-full',
                    ].join(' ')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* ── Right controls ────────────────── */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Cart icon */}
              <Link
                href="/cart"
                aria-label={`Shopping cart${cartCount > 0 ? ` — ${cartCount} item${cartCount > 1 ? 's' : ''}` : ''}`}
                className={[
                  'relative p-1.5',
                  'text-parchment-2 hover:text-parchment',
                  'ease-luxury transition-colors duration-300',
                ].join(' ')}
              >
                <ShoppingBag size={19} strokeWidth={1.25} aria-hidden="true" />
                {cartCount > 0 && (
                  <span
                    aria-hidden="true"
                    className={[
                      'absolute -top-0.5 -right-0.5',
                      'h-4 w-4 rounded-full',
                      'bg-leather text-parchment',
                      'font-sans text-[9px] font-medium',
                      'flex items-center justify-center',
                      'leading-none',
                    ].join(' ')}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button
                className={[
                  'p-1.5 md:hidden',
                  'text-parchment-2 hover:text-parchment',
                  'ease-luxury transition-colors duration-300',
                ].join(' ')}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={
                  menuOpen ? 'Close navigation menu' : 'Open navigation menu'
                }
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {menuOpen ? (
                    <motion.span
                      key="close"
                      initial={
                        prefersReducedMotion ? {} : { opacity: 0, rotate: -45 }
                      }
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={
                        prefersReducedMotion ? {} : { opacity: 0, rotate: 45 }
                      }
                      transition={{ duration: 0.2 }}
                    >
                      <X size={20} strokeWidth={1.25} aria-hidden="true" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="open"
                      initial={
                        prefersReducedMotion ? {} : { opacity: 0, rotate: 45 }
                      }
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={
                        prefersReducedMotion ? {} : { opacity: 0, rotate: -45 }
                      }
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={20} strokeWidth={1.25} aria-hidden="true" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          MOBILE MENU
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop — tinted overlay */}
            <motion.div
              key="backdrop"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="bg-void/60 fixed inset-0 z-40 backdrop-blur-sm md:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Menu panel — slides from right */}
            <motion.div
              key="menu-panel"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={[
                'fixed top-0 right-0 bottom-0 z-60',
                'w-full max-w-sm',
                'bg-void-2 border-border border-l',
                'flex flex-col',
                'px-8 pt-20 pb-10',
                'md:hidden',
              ].join(' ')}
            >
              {/* Nav links */}
              <ul role="list" className="flex flex-1 flex-col">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    custom={i}
                    variants={menuItemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className={[
                        'flex items-center justify-between',
                        'w-full py-5',
                        'border-border border-b',
                        'text-display-sm text-parchment font-serif',
                        'hover:text-parchment-2',
                        'ease-luxury transition-colors duration-300',
                        'group',
                      ].join(' ')}
                    >
                      <span>{link.label}</span>
                      {/* Subtle arrow — appears on hover */}
                      <span
                        className={[
                          'text-label text-leather',
                          'opacity-0 group-hover:opacity-100',
                          'translate-x-[-4px] group-hover:translate-x-0',
                          'ease-luxury transition-all duration-300',
                        ].join(' ')}
                      >
                        →
                      </span>
                    </Link>
                  </motion.li>
                ))}

                {/* Cart link in mobile menu */}
                <motion.li
                  custom={NAV_LINKS.length}
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <Link
                    href="/cart"
                    onClick={closeMenu}
                    className={[
                      'flex items-center justify-between',
                      'w-full py-5',
                      'border-border border-b',
                      'text-display-sm text-parchment font-serif',
                      'hover:text-parchment-2',
                      'ease-luxury transition-colors duration-300',
                      'group',
                    ].join(' ')}
                  >
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span className="text-label text-leather">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </motion.li>
              </ul>

              {/* Footer of mobile menu */}
              <motion.div
                custom={NAV_LINKS.length + 1}
                variants={menuItemVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="border-border mt-auto border-t pt-8"
              >
                <p className="text-label text-parchment-4 text-[0.625rem] tracking-[0.25em]">
                  Worn in. Never out.
                </p>
                <p className="text-label text-parchment-4 mt-2 text-[0.625rem] tracking-[0.25em] opacity-50">
                  Calgary · Est. 2025
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
