'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const EASE_LUXURY = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

const jackets = [
  {
    id: 1,
    name: 'The Frontier',
    slug: 'the-frontier',
    tagline: 'For those who arrived first.',
    leather: 'Full-grain lamb',
    price: '$1,299 CAD',
    variants: [
      { name: 'Midnight Black', hex: '#1A1715' },
      { name: 'Tobacco', hex: '#8B6A47' },
    ],
  },
  {
    id: 2,
    name: 'The Warden',
    slug: 'the-warden',
    tagline: 'Authority worn quietly.',
    leather: 'Full-grain lamb',
    price: '$1,399 CAD',
    variants: [
      { name: 'Midnight Black', hex: '#1A1715' },
      { name: 'Cognac', hex: '#9B4F28' },
    ],
  },
  {
    id: 3,
    name: 'The Nomad',
    slug: 'the-nomad',
    tagline: 'No fixed address. No compromises.',
    leather: 'Full-grain lamb',
    price: '$1,299 CAD',
    variants: [
      { name: 'Midnight', hex: '#1A1715' },
      { name: 'Sand', hex: '#C4A882' },
    ],
  },
  {
    id: 4,
    name: 'The Heir',
    slug: 'the-heir',
    tagline: 'Earned, not inherited.',
    leather: 'Full-grain lamb',
    price: '$1,499 CAD',
    variants: [
      { name: 'Black', hex: '#1A1715' },
      { name: 'Ivory', hex: '#E8E0D0' },
    ],
  },
  {
    id: 5,
    name: 'The Sentinel',
    slug: 'the-sentinel',
    tagline: 'The camel leather jacket. Singular.',
    leather: 'Camel Leather',
    price: '$1,499 CAD',
    variants: [
      { name: 'Natural', hex: '#C49A6C' },
      { name: 'Bark', hex: '#6B4428' },
    ],
  },
]

type Jacket = (typeof jackets)[number]

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

function JacketPanel({ jacket, index }: { jacket: Jacket; index: number }) {
  const isReversed = index % 2 !== 0
  const { ref, inView } = useInView(0.15)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const fadeStyle = (delay: number): CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity 900ms ${EASE_LUXURY} ${delay}ms, transform 900ms ${EASE_LUXURY} ${delay}ms`,
  })

  const imageMap: Record<string, string> = {
    'the-frontier': '/images/products/frontier.jpg',
    'the-warden': '/images/products/warden.jpg',
    'the-nomad': '/images/products/nomad.jpg',
    'the-heir': '/images/products/heir.jpg',
    'the-sentinel': '/images/products/sentinel.jpg',
  }

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: isMobile ? 'column' : isReversed ? 'row-reverse' : 'row',
        overflow: 'hidden',
      }}
    >
      {/* Image */}
      <div
        style={{
          width: isMobile ? '100%' : '60%',
          height: isMobile ? '55vw' : '100vh',
          minHeight: isMobile ? '260px' : undefined,
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Image
          src={imageMap[jacket.slug]}
          alt={`${jacket.name} — SEPAKA`}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover object-center"
          priority={index === 0}
        />
      </div>

      {/* Info */}
      <div
        style={{
          width: isMobile ? '100%' : '40%',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: isMobile
            ? 'clamp(2rem, 6vw, 3rem) clamp(1.25rem, 5vw, 2.5rem)'
            : 'clamp(2rem, 5vw, 5rem)',
          backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F5F2EC',
        }}
      >
        <div style={fadeStyle(0)}>
          <p
            style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: '0.625rem',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(13,12,10,0.3)',
              marginBottom: '1.5rem',
            }}
          >
            {String(index + 1).padStart(2, '0')} / 05
          </p>
        </div>

        <div style={fadeStyle(80)}>
          <h2
            style={{
              fontFamily: 'var(--font-bodoni), Georgia, serif',
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: 400,
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              color: '#0D0C0A',
              margin: '0 0 1rem 0',
            }}
          >
            {jacket.name}
          </h2>
        </div>

        <div style={fadeStyle(160)}>
          <p
            style={{
              fontFamily: 'var(--font-bodoni), Georgia, serif',
              fontSize: 'clamp(0.9rem, 2vw, 1.25rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'rgba(13,12,10,0.55)',
              marginBottom: '2rem',
              lineHeight: 1.4,
            }}
          >
            {jacket.tagline}
          </p>
        </div>

        <div style={fadeStyle(200)}>
          <p
            style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 400,
              letterSpacing: '0.08em',
              color: 'rgba(13,12,10,0.45)',
              marginBottom: '2rem',
              textTransform: 'uppercase',
            }}
          >
            {jacket.leather}
          </p>
        </div>

        <div
          style={{
            ...fadeStyle(240),
            width: '2rem',
            height: '1px',
            backgroundColor: '#8B5E3C',
            marginBottom: '2rem',
          }}
        />

        <div style={fadeStyle(280)}>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
            }}
          >
            {jacket.variants.map((variant) => (
              <div
                key={variant.name}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: variant.hex,
                    border:
                      variant.hex === '#E8E0D0'
                        ? '0.5px solid rgba(13,12,10,0.2)'
                        : 'none',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '0.6875rem',
                    fontWeight: 400,
                    color: 'rgba(13,12,10,0.5)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {variant.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={fadeStyle(320)}>
          <p
            style={{
              fontFamily: 'var(--font-bodoni), Georgia, serif',
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: 400,
              color: '#0D0C0A',
              marginBottom: '2rem',
              letterSpacing: '-0.01em',
            }}
          >
            {jacket.price}
          </p>
        </div>

        <div style={fadeStyle(380)}>
          <Link
            href={`/products/${jacket.slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: '0.6875rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#0D0C0A',
              textDecoration: 'none',
              transition: 'gap 350ms cubic-bezier(0.25, 0.1, 0.25, 1)',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.gap = '1.25rem'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.gap = '0.75rem'
            }}
          >
            View Jacket
            <svg width="20" height="8" viewBox="0 0 20 8" fill="none" aria-hidden="true">
              <path
                d="M0 4H18M15 1L18.5 4L15 7"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Collection() {
  return (
    <section aria-label="SEPAKA jacket collection">
      {jackets.map((jacket, index) => (
        <JacketPanel key={jacket.id} jacket={jacket} index={index} />
      ))}

      <div
        style={{
          width: '100%',
          padding: 'clamp(4rem, 8vw, 8rem) clamp(2rem, 5vw, 5rem)',
          textAlign: 'center',
          backgroundColor: '#F5F2EC',
          borderTop: '0.5px solid #E8E4DE',
        }}
      >
        <Link
          href="/shop"
          style={{
            display: 'inline-block',
            padding: '1rem 3rem',
            border: '0.5px solid #0D0C0A',
            color: '#0D0C0A',
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'background-color 350ms, color 350ms',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.backgroundColor = '#0D0C0A'
            el.style.color = '#F5F2EC'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.backgroundColor = 'transparent'
            el.style.color = '#0D0C0A'
          }}
        >
          View All Jackets
        </Link>
      </div>
    </section>
  )
}
