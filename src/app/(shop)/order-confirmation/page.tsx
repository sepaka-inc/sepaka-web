'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

function getProductImageUrl(slug: string, variantName: string): string {
  const productKey = slug.replace('the-', '')
  const colorKey = variantName.toLowerCase().includes('black') ? 'black' :
                   variantName.toLowerCase().includes('brown') ? 'brown' :
                   variantName.toLowerCase().includes('camel') ? 'brown' : 'black'
  return `https://sepaka-web.vercel.app/images/products/${productKey}-${colorKey}.jpg`
}

function ConfirmationContent() {
  const { clearCart } = useCart()
  const params = useSearchParams()
  const name   = params.get('name') ?? 'there'
  const email  = params.get('email') ?? ''

  const [lastOrder, setLastOrder] = useState<{
    name: string
    variantName: string
    slug: string
    size: string
    price: number
    quantity: number
  } | null>(null)

  useEffect(() => {
    clearCart()
    try {
      const stored = localStorage.getItem('sepaka-last-order')
      if (stored) {
        const items = JSON.parse(stored)
        if (items.length > 0) setLastOrder(items[0])
        localStorage.removeItem('sepaka-last-order')
      }
    } catch {}
  }, [])

  return (
    <main style={{
      backgroundColor: '#FFFFFF',
      minHeight: '100dvh',
      paddingTop: '80px',
      paddingBottom: '80px',
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(2rem, 6vw, 4rem)',
        textAlign: 'center',
      }}>

        {/* SEPAKA wordmark */}
        <p style={{
          fontFamily: 'var(--font-bodoni), Georgia, serif',
          fontSize: '0.75rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#0D0C0A',
          margin: '0 0 16px',
        }}>SEPAKA</p>

        {/* Bronze rule */}
        <div style={{
          width: '40px',
          height: '0.5px',
          backgroundColor: '#8B5E3C',
          margin: '0 auto 32px',
        }} />

        {/* Checkmark */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#F5F2EC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
          border: '1px solid rgba(139,94,60,0.2)',
        }}>
          <svg width="24" height="16" viewBox="0 0 24 16" fill="none" aria-hidden="true">
            <path
              d="M1 8L8 15L23 1"
              stroke="#8B5E3C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-bodoni), Georgia, serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 400,
          color: '#0D0C0A',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: '0 0 16px',
        }}>Your jacket is now becoming real.</h1>

        {/* Tagline */}
        <p style={{
          fontFamily: 'var(--font-bodoni), Georgia, serif',
          fontSize: '1rem',
          fontStyle: 'italic',
          color: 'rgba(13,12,10,0.5)',
          margin: '0 0 32px',
        }}>Worn in. Never out.</p>

        {/* Bronze rule */}
        <div style={{
          width: '40px',
          height: '0.5px',
          backgroundColor: '#8B5E3C',
          margin: '0 auto 32px',
        }} />

        {/* Personal message */}
        <p style={{
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
          fontSize: '0.9375rem',
          color: '#0D0C0A',
          lineHeight: 1.7,
          margin: '0 0 12px',
        }}>Thank you, {decodeURIComponent(name).split(' ')[0]}.</p>

        {lastOrder && (
          <p style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '0.9375rem',
            color: 'rgba(13,12,10,0.7)',
            lineHeight: 1.8,
            margin: '0 0 12px',
          }}>
            Your <strong style={{ color: '#0D0C0A' }}>{lastOrder.name}</strong> in{' '}
            <strong style={{ color: '#0D0C0A' }}>{lastOrder.variantName}</strong> has been reserved.
            It is no longer just an idea — it is now becoming real.
            Cut, stitched, and finished by hand, specifically for you.
          </p>
        )}

        {!lastOrder && (
          <p style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '0.9375rem',
            color: 'rgba(13,12,10,0.7)',
            lineHeight: 1.8,
            margin: '0 0 12px',
          }}>
            Your jacket has been reserved and is now becoming real —
            cut, stitched, and finished by hand, specifically for you.
          </p>
        )}

        {/* Bronze rule */}
        <div style={{
          width: '40px',
          height: '0.5px',
          backgroundColor: '#8B5E3C',
          margin: '32px auto',
        }} />

        {/* Product image */}
        {lastOrder && (
          <div style={{ marginBottom: '24px' }}>
            <img
              src={getProductImageUrl(lastOrder.slug, lastOrder.variantName)}
              alt={lastOrder.name}
              width={280}
              height={340}
              style={{
                width: '280px',
                height: '340px',
                objectFit: 'cover',
                display: 'block',
                margin: '0 auto',
                boxShadow: '0 8px 32px rgba(13,12,10,0.08)',
              }}
            />
          </div>
        )}

        {/* Order details */}
        {lastOrder && (
          <div style={{ marginBottom: '32px' }}>
            <p style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: '0.625rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(13,12,10,0.4)',
              margin: '0 0 12px',
            }}>Order Details</p>
            <p style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: '0.9375rem',
              color: '#0D0C0A',
              margin: '0 0 4px',
            }}>{lastOrder.name} — {lastOrder.variantName} — Size {lastOrder.size}</p>
            <p style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: '0.9375rem',
              color: 'rgba(13,12,10,0.6)',
              margin: '0 0 4px',
            }}>${(lastOrder.price * lastOrder.quantity).toLocaleString('en-CA')} CAD</p>
            <p style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: '0.875rem',
              color: '#8B5E3C',
              margin: '0',
            }}>Delivery: Complimentary</p>
          </div>
        )}

        {/* Bronze rule */}
        <div style={{
          width: '40px',
          height: '0.5px',
          backgroundColor: '#8B5E3C',
          margin: '0 auto 32px',
        }} />

        {/* Philosophy box */}
        <div style={{
          backgroundColor: '#F5F2EC',
          padding: '28px 32px',
          marginBottom: '32px',
          textAlign: 'left',
        }}>
          <p style={{
            fontFamily: 'var(--font-bodoni), Georgia, serif',
            fontSize: '0.9375rem',
            fontStyle: 'italic',
            color: 'rgba(13,12,10,0.75)',
            lineHeight: 1.9,
            margin: '0 0 12px',
          }}>
            This jacket will not look its best the day it arrives.
          </p>
          <p style={{
            fontFamily: 'var(--font-bodoni), Georgia, serif',
            fontSize: '0.9375rem',
            fontStyle: 'italic',
            color: 'rgba(13,12,10,0.75)',
            lineHeight: 1.9,
            margin: '0',
          }}>
            It will look its best in three years — when it has softened where you move,
            darkened where you grip it, and carries the memory of every journey you take together.
          </p>
        </div>

        {/* Made to order */}
        <div style={{
          backgroundColor: '#F5F2EC',
          padding: '20px 24px',
          marginBottom: '24px',
          textAlign: 'left',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '8px',
          }}>
            <div style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#8B5E3C',
            }} />
            <span style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: '0.625rem',
              color: 'rgba(139,94,60,0.8)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>Made to Order</span>
          </div>
          <p style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '0.875rem',
            color: 'rgba(13,12,10,0.6)',
            lineHeight: 1.7,
            margin: '0',
          }}>
            Production takes 4–6 weeks. You will receive updates at each meaningful stage.
          </p>
        </div>

        {/* Confirmation email notice */}
        {email && (
          <p style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '0.875rem',
            color: 'rgba(13,12,10,0.5)',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}>
            A confirmation has been sent to{' '}
            <span style={{ color: '#0D0C0A' }}>{decodeURIComponent(email)}</span>
          </p>
        )}

        {/* Bronze rule */}
        <div style={{
          width: '40px',
          height: '0.5px',
          backgroundColor: '#8B5E3C',
          margin: '0 auto 32px',
        }} />

        {/* CTA */}
        <Link
          href="/shop"
          style={{
            display: 'block',
            width: '100%',
            padding: '1rem',
            backgroundColor: '#0D0C0A',
            color: '#F5F2EC',
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '0.625rem',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            textAlign: 'center',
            boxSizing: 'border-box',
            transition: 'background-color 200ms ease',
            marginBottom: '24px',
          }}
        >
          Continue Shopping
        </Link>

        {/* Footer */}
        <p style={{
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
          fontSize: '0.6875rem',
          color: 'rgba(13,12,10,0.4)',
          marginBottom: '4px',
          letterSpacing: '0.02em',
        }}>
          Questions?{' '}
          <a href="mailto:hello@sepaka.ca" style={{
            color: '#0D0C0A',
            textDecoration: 'underline',
          }}>hello@sepaka.ca</a>
        </p>
        <p style={{
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
          fontSize: '0.625rem',
          color: 'rgba(13,12,10,0.3)',
          letterSpacing: '0.08em',
          marginBottom: '4px',
        }}>SEPAKA · Calgary, Canada</p>
        <p style={{
          fontFamily: 'var(--font-bodoni), Georgia, serif',
          fontSize: '0.75rem',
          fontStyle: 'italic',
          color: 'rgba(13,12,10,0.3)',
          margin: '0',
        }}>Worn in. Never out.</p>

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
