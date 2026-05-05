'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

const EASE_LUXURY = [0.25, 0.1, 0.25, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 1.0, ease: EASE_LUXURY },
  }),
}

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setMounted(true)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  const animate = mounted && !prefersReducedMotion

  return (
    <section
      aria-label="SEPAKA hero"
      style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100dvh - 64px)',
        minHeight: '500px',
        overflow: 'hidden',
        backgroundColor: '#0D0C0A',
        marginTop: '64px',
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            to bottom,
            rgba(13,12,10,0.1)  0%,
            rgba(13,12,10,0.0)  35%,
            rgba(13,12,10,0.35) 70%,
            rgba(13,12,10,0.72) 100%
          )`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: 'clamp(3rem, 7vh, 5.5rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          textAlign: 'center',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
        }}
      >
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={animate ? 'visible' : 'hidden'}
          custom={0.5}
          style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(245,242,236,0.85)',
            margin: 0,
          }}
        >
          Worn in. Never out.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={animate ? 'visible' : 'hidden'}
          custom={1.0}
        >
          <Link
            href="/shop"
            style={{
              display: 'inline-block',
              minWidth: '200px',
              padding: '0.875rem 2.5rem',
              border: '0.5px solid rgba(245,242,236,0.5)',
              color: '#F5F2EC',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: '0.6875rem',
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textAlign: 'center',
              textDecoration: 'none',
              backgroundColor: 'transparent',
              transition: 'border-color 350ms, background-color 350ms',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.borderColor = 'rgba(245,242,236,0.9)'
              el.style.backgroundColor = 'rgba(245,242,236,0.08)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.borderColor = 'rgba(245,242,236,0.5)'
              el.style.backgroundColor = 'transparent'
            }}
          >
            Shop Jackets
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
