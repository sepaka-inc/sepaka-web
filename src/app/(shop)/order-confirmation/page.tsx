'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

const EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

function ConfirmationContent() {
  const { clearCart } = useCart()
  const params = useSearchParams()
  const name   = params.get('name') ?? 'there'
  const email  = params.get('email') ?? ''

  useEffect(() => {
    clearCart()
  }, [])

  return (
    <main style={{
      backgroundColor: '#FFFFFF',
      minHeight:       '100dvh',
      paddingTop:      '60px',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
    }}>
      <div style={{
        maxWidth:  '560px',
        width:     '100%',
        padding:   'clamp(2rem, 6vw, 4rem)',
        textAlign: 'center',
      }}>
        {/* Check mark */}
        <div style={{
          width:           '48px',
          height:          '48px',
          borderRadius:    '50%',
          backgroundColor: '#F5F2EC',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          margin:          '0 auto 2rem',
        }}>
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
            <path
              d="M1 7L7 13L19 1"
              stroke="#8B5E3C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily:    'var(--font-bodoni), Georgia, serif',
          fontSize:      'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight:    400,
          color:         '#0D0C0A',
          letterSpacing: '-0.02em',
          lineHeight:    1.1,
          marginBottom:  '0.75rem',
        }}>
          Your order is confirmed.
        </h1>

        {/* Tagline */}
        <p style={{
          fontFamily:    'var(--font-bodoni), Georgia, serif',
          fontSize:      '1rem',
          fontStyle:     'italic',
          color:         'rgba(13,12,10,0.65)',
          marginBottom:  '2rem',
        }}>
          Worn in. Never out.
        </p>

        {/* Bronze divider */}
        <div style={{
          width:           '2rem',
          height:          '1px',
          backgroundColor: '#8B5E3C',
          margin:          '0 auto 2rem',
        }} />

        {/* Message */}
        <p style={{
          fontFamily:    'var(--font-inter), system-ui, sans-serif',
          fontSize:      '0.9375rem',
          color:         'rgba(13,12,10,0.6)',
          lineHeight:    1.7,
          marginBottom:  '1.5rem',
          letterSpacing: '0.01em',
        }}>
          Thank you, {decodeURIComponent(name)}. Your jacket is now entering production.
        </p>

        {email && (
          <p style={{
            fontFamily:    'var(--font-inter), system-ui, sans-serif',
            fontSize:      '0.875rem',
            color:         'rgba(13,12,10,0.5)',
            lineHeight:    1.6,
            marginBottom:  '2rem',
          }}>
            A confirmation has been sent to{' '}
            <span style={{ color: '#0D0C0A' }}>{decodeURIComponent(email)}</span>
          </p>
        )}

        {/* Made to order box */}
        <div style={{
          backgroundColor: '#F5F2EC',
          padding:         '1.25rem 1.5rem',
          marginBottom:    '2.5rem',
          textAlign:       'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
            <div style={{
              width:           '4px',
              height:          '4px',
              borderRadius:    '50%',
              backgroundColor: '#8B5E3C',
            }} />
            <span style={{
              fontFamily:    'var(--font-inter), system-ui, sans-serif',
              fontSize:      '0.625rem',
              color:         'rgba(139,94,60,0.8)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Made to Order
            </span>
          </div>
          <p style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize:   '0.875rem',
            color:      'rgba(13,12,10,0.6)',
            lineHeight: 1.6,
          }}>
            Production takes 4–6 weeks. You&apos;ll receive email updates at each stage — when cutting begins, when stitching is complete, and when your jacket ships.
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/shop"
          style={{
            display:         'inline-block',
            padding:         '0.875rem 2.5rem',
            backgroundColor: '#0D0C0A',
            color:           '#F5F2EC',
            fontFamily:      'var(--font-inter), system-ui, sans-serif',
            fontSize:        '0.625rem',
            fontWeight:      500,
            letterSpacing:   '0.18em',
            textTransform:   'uppercase',
            textDecoration:  'none',
            transition:      `opacity 200ms ${EASE}`,
          }}
        >
          Continue Shopping
        </Link>

        {/* Contact */}
        <p style={{
          fontFamily:    'var(--font-inter), system-ui, sans-serif',
          fontSize:      '0.6875rem',
          color:         'rgba(13,12,10,0.55)',
          marginTop:     '1.5rem',
          letterSpacing: '0.02em',
        }}>
          Questions? <a href="mailto:hello@sepaka.ca" style={{ color: '#0D0C0A', textDecoration: 'underline' }}>hello@sepaka.ca</a>
        </p>
      </div>
    </main>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationContent />
    </Suspense>
  )
}
