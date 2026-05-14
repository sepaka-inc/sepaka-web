'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

const EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

export default function CartDrawer() {
  const {
    items,
    subtotal,
    totalItems,
    isCartOpen,
    closeCart,
  } = useCart()

  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!isCartOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isCartOpen, closeCart])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isCartOpen])

  // Focus drawer on open
  useEffect(() => {
    if (isCartOpen) drawerRef.current?.focus()
  }, [isCartOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        style={{
          position:        'fixed',
          inset:           0,
          backgroundColor: isCartOpen ? 'rgba(13,12,10,0.25)' : 'rgba(13,12,10,0)',
          zIndex:          59,
          pointerEvents:   isCartOpen ? 'all' : 'none',
          transition:      `background-color 400ms ${EASE}`,
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        tabIndex={-1}
        style={{
          position:        'fixed',
          top:             0,
          right:           0,
          bottom:          0,
          width:           'clamp(360px, 42vw, 520px)',
          backgroundColor: '#F5F2EC',
          zIndex:          60,
          transform:       isCartOpen ? 'translateX(0)' : 'translateX(100%)',
          transition:      `transform 420ms ${EASE}`,
          display:         'flex',
          flexDirection:   'column',
          outline:         'none',
          borderLeft:      '0.5px solid #E8E4DE',
        }}
      >
        {/* Header */}
        <div style={{
          display:         'flex',
          justifyContent:  'space-between',
          alignItems:      'center',
          padding:         '1.25rem 1.5rem',
          borderBottom:    '0.5px solid #E8E4DE',
          flexShrink:      0,
        }}>
          <div>
            <p style={{
              fontFamily:    'var(--font-inter), system-ui, sans-serif',
              fontSize:      '0.6875rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         'rgba(13,12,10,0.6)',
              marginBottom:  '0.25rem',
            }}>
              Your Cart
            </p>
            <p style={{
              fontFamily:    'var(--font-bodoni), Georgia, serif',
              fontSize:      '1.125rem',
              fontWeight:    400,
              color:         '#0D0C0A',
              letterSpacing: '-0.01em',
            }}>
              {totalItems === 0
                ? 'Empty'
                : `${totalItems} item${totalItems !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            style={{
              background:  'none',
              border:      'none',
              cursor:      'pointer',
              padding:     '0.25rem',
              color:       'rgba(13,12,10,0.6)',
              fontSize:    '1.125rem',
              fontFamily:  'var(--font-inter), system-ui, sans-serif',
              transition:  `color 200ms ${EASE}`,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#0D0C0A' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(13,12,10,0.6)' }}
          >
            ✕
          </button>
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div style={{
            flex:           1,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '1.25rem',
            padding:        '2rem',
          }}>
            <p style={{
              fontFamily:    'var(--font-bodoni), Georgia, serif',
              fontSize:      '1.375rem',
              fontStyle:     'italic',
              fontWeight:    400,
              color:         'rgba(13,12,10,0.55)',
              letterSpacing: '-0.01em',
            }}>
              Nothing here yet.
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              style={{
                fontFamily:     'var(--font-inter), system-ui, sans-serif',
                fontSize:       '0.5625rem',
                fontWeight:     500,
                letterSpacing:  '0.18em',
                textTransform:  'uppercase',
                color:          '#0D0C0A',
                textDecoration: 'none',
                padding:        '0.75rem 2rem',
                border:         '0.5px solid #0D0C0A',
                display:        'inline-block',
                transition:     `all 300ms ${EASE}`,
              }}
            >
              Shop Jackets
            </Link>

            <p style={{
              fontFamily:    'var(--font-inter), system-ui, sans-serif',
              fontSize:      '0.75rem',
              color:         'rgba(13,12,10,0.7)',
              letterSpacing: '0.04em',
              textAlign:     'center',
              cursor:        'pointer',
              textDecoration:'underline',
              marginTop:     '0.25rem',
            }}>
              Login or register
            </p>
          </div>
        )}

        {/* Items list */}
        {items.length > 0 && (
          <div style={{
            flex:      1,
            overflowY: 'auto',
            padding:   '0 1.5rem',
          }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display:      'flex',
                  gap:          '0.875rem',
                  padding:      '1.5rem 0',
                  borderBottom: '0.5px solid #E8E4DE',
                }}
              >
                {/* Image */}
                <div style={{
                  width:           '120px',
                  height:          '148px',
                  backgroundColor: '#E8E4DC',
                  flexShrink:      0,
                  position:        'relative',
                  overflow:        'hidden',
                }}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="120px"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>

                {/* Info */}
                <div style={{
                  flex:          1,
                  display:       'flex',
                  flexDirection: 'column',
                  justifyContent:'space-between',
                }}>
                  <div>
                    <p style={{
                      fontFamily:    'var(--font-bodoni), Georgia, serif',
                      fontSize:      '1.25rem',
                      fontWeight:    400,
                      color:         '#0D0C0A',
                      letterSpacing: '-0.01em',
                      marginBottom:  '2px',
                    }}>
                      {item.name}
                    </p>
                    <p style={{
                      fontFamily:    'var(--font-inter), system-ui, sans-serif',
                      fontSize:      '0.875rem',
                      color:         'rgba(13,12,10,0.65)',
                      letterSpacing: '0.02em',
                      lineHeight:    1.6,
                      marginBottom:  '5px',
                    }}>
                      {item.variantName} · Size {item.size}
                    </p>
                    {/* Made to order tag */}
                    <div style={{
                      display:    'flex',
                      alignItems: 'center',
                      gap:        '4px',
                    }}>
                      <div style={{
                        width:           '4px',
                        height:          '4px',
                        borderRadius:    '50%',
                        backgroundColor: '#8B5E3C',
                        flexShrink:      0,
                      }} />
                      <span style={{
                        fontFamily:    'var(--font-inter), system-ui, sans-serif',
                        fontSize:      '0.75rem',
                        color:         'rgba(139,94,60,0.8)',
                        letterSpacing: '0.06em',
                      }}>
                        Made to Order · 4–6 weeks
                      </span>
                    </div>
                  </div>

                  {/* Price + qty display only */}
                  <div style={{
                    display:    'flex',
                    alignItems: 'baseline',
                    gap:        '0.75rem',
                    marginTop:  '0.5rem',
                  }}>
                    <p style={{
                      fontFamily:    'var(--font-bodoni), Georgia, serif',
                      fontSize:      '1.125rem',
                      fontWeight:    400,
                      color:         '#0D0C0A',
                      letterSpacing: '-0.01em',
                    }}>
                      ${(item.price * item.quantity).toLocaleString()} CAD
                    </p>
                    {item.quantity > 1 && (
                      <span style={{
                        fontFamily:    'var(--font-inter), system-ui, sans-serif',
                        fontSize:      '0.625rem',
                        color:         'rgba(13,12,10,0.6)',
                        letterSpacing: '0.04em',
                      }}>
                        × {item.quantity}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer — only when items exist */}
        {items.length > 0 && (
          <div style={{
            flexShrink:    0,
            padding:       '1.25rem 1.5rem',
            borderTop:     '0.5px solid #E8E4DE',
            paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))',
          }}>
            {/* Bronze divider */}
            <div style={{
              width:           '2rem',
              height:          '1px',
              backgroundColor: '#8B5E3C',
              marginBottom:    '1rem',
            }} />

            {/* Subtotal */}
            <div style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'baseline',
              marginBottom:   '1.25rem',
            }}>
              <span style={{
                fontFamily:    'var(--font-inter), system-ui, sans-serif',
                fontSize:      '0.8125rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color:         'rgba(13,12,10,0.5)',
              }}>
                Subtotal
              </span>
              <span style={{
                fontFamily:    'var(--font-bodoni), Georgia, serif',
                fontSize:      '1.5rem',
                fontWeight:    400,
                color:         '#0D0C0A',
                letterSpacing: '-0.01em',
              }}>
                ${subtotal.toLocaleString()} CAD
              </span>
            </div>

            {/* Checkout link */}
            <Link
              href="/checkout"
              onClick={closeCart}
              style={{
                display:        'block',
                textAlign:      'center',
                fontFamily:     'var(--font-inter), system-ui, sans-serif',
                fontSize:       '0.75rem',
                fontWeight:     500,
                letterSpacing:  '0.18em',
                textTransform:  'uppercase',
                color:          'rgba(13,12,10,0.55)',
                textDecoration: 'underline',
                marginBottom:   '0.875rem',
                transition:     `color 200ms ${EASE}`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#0D0C0A' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(13,12,10,0.55)' }}
            >
              Checkout →
            </Link>

            {/* View Cart button */}
            <Link
              href="/cart"
              onClick={closeCart}
              style={{
                display:         'block',
                width:           '100%',
                padding:         '0.875rem',
                backgroundColor: '#0D0C0A',
                color:           '#F5F2EC',
                fontFamily:      'var(--font-inter), system-ui, sans-serif',
                fontSize:        '0.75rem',
                fontWeight:      500,
                letterSpacing:   '0.18em',
                textTransform:   'uppercase',
                textDecoration:  'none',
                textAlign:       'center',
                marginBottom:    '0.625rem',
                transition:      `opacity 200ms ${EASE}`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
            >
              View Cart
            </Link>

            {/* Login */}
            <p style={{
              fontFamily:    'var(--font-inter), system-ui, sans-serif',
              fontSize:      '0.75rem',
              color:         'rgba(13,12,10,0.5)',
              textAlign:     'center',
              letterSpacing: '0.04em',
              textDecoration:'underline',
              cursor:        'pointer',
            }}>
              Login or register
            </p>
          </div>
        )}
      </div>
    </>
  )
}
