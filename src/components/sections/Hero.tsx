'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

const EASE_LUXURY = [0.25, 0.1, 0.25, 1] as const
const EASE_CINEMATIC = [0.76, 0, 0.24, 1] as const

// ── Animation variants ────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: EASE_LUXURY,
    },
  },
}

const wordmarkVariants = {
  hidden: { opacity: 0, letterSpacing: '-0.1em' },
  visible: {
    opacity: 1,
    letterSpacing: '0.18em',
    transition: {
      duration: 1.2,
      ease: EASE_LUXURY,
    },
  },
}

const overlayVariants = {
  hidden: { opacity: 0.3 },
  visible: {
    opacity: 0.5,
    transition: {
      duration: 1.8,
      ease: EASE_CINEMATIC,
    },
  },
}

// ── Component ─────────────────────────────────────────────
export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section
      role="region"
      aria-label="Hero section"
      className="bg-void relative h-screen w-full overflow-hidden"
    >
      {/* ════════════════════════════════════════════════════
          VIDEO BACKGROUND
      ════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 h-full w-full">
        {/* Video element with cinematic controls */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
          poster="/images/hero-poster.jpg"
        >
          <source
            src="https://videos.pexels.com/video-files/6253633/6253633-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Gradient overlay — transparent top to void at bottom */}
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate={isLoaded && !prefersReducedMotion ? 'visible' : 'visible'}
          aria-hidden="true"
          className="from-void/20 via-void/40 to-void/70 absolute inset-0 bg-gradient-to-b"
        />

        {/* Subtle vignette for depth */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse at center, transparent 0%, rgba(13, 12, 10, 0.3) 100%)`,
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════════
          CONTENT LAYOUT
      ════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-20">
        {/* Wordmark — top left */}
        <motion.div
          initial="hidden"
          animate={isLoaded ? 'visible' : 'hidden'}
          variants={wordmarkVariants}
          className="flex w-full justify-start"
        >
          <Link
            href="/"
            className="text-parchment hover:text-metal font-serif text-[1.2rem] font-bold tracking-[0.2em] uppercase transition-colors duration-400 md:text-[1.4rem]"
          >
            SEPAKA
          </Link>
        </motion.div>

        {/* Center content — headline, subheadline, CTA */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded && !prefersReducedMotion ? 'visible' : 'visible'}
          className="flex max-w-4xl flex-1 flex-col items-center justify-center gap-6 text-center md:gap-10"
        >
          {/* Main headline */}
          <motion.h1
            variants={itemVariants}
            className="lg:text-display-xl text-parchment font-serif text-5xl leading-tight font-bold tracking-tight md:text-7xl"
          >
            Worn In.
            <br />
            Never Out.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-parchment-2 max-w-2xl font-sans text-base leading-relaxed font-light tracking-wide md:text-lg"
          >
            Leather that has protected humanity for millennia. Now made for you.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="pt-2 md:pt-4">
            <Link
              href="/shop"
              className={[
                'inline-flex items-center justify-center',
                'px-8 py-3 md:px-10 md:py-4',
                'bg-parchment text-void',
                'font-sans text-xs font-medium uppercase md:text-sm',
                'tracking-[0.18em]',
                'ease-luxury transition-all duration-400',
                'hover:bg-metal hover:shadow-lg',
                'active:scale-95',
                'focus-visible:outline-leather focus-visible:outline-2 focus-visible:outline-offset-2',
              ].join(' ')}
            >
              Discover the Collection
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator — desktop only */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-parchment-3 hidden flex-col items-center gap-2 font-sans text-xs tracking-widest md:flex"
        >
          <span>SCROLL TO EXPLORE</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            aria-hidden="true"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>

      {/* Accessibility: Skip link */}
      <a
        href="#main-content"
        className="focus:bg-leather focus:text-parchment sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:text-sm focus:outline-none"
      >
        Skip to main content
      </a>
    </section>
  )
}
