'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CartItem } from '@/types/cart'

const EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

interface Props {
  item: CartItem | null
  isOpen: boolean
  onClose: () => void
}

export default function CartNotification({ item, isOpen, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => {
      onClose()
    }, 4000)
    return () => clearTimeout(timer)
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop — invisible, just catches clicks */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position:      'fixed',
          inset:         0,
          zIndex:        59,
          pointerEvents: isOpen ? 'all' : 'none',
        }}
      />

      {/* Notification panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Item added to cart"
        style={{
          position:        'fixed',
          top:             '72px',
          right:           '1.5rem',
          width:           'clamp(280px, 90vw, 320px)',
          backgroundColor: '#F5F2EC',
          border:          '0.5px solid #D4CFC8',
          zIndex:          60,
          boxShadow:       '-8px 0 32px rgba(13,12,10,0.08)',
          transform:       isOpen ? 'translateY(0)' : 'translateY(-12px)',
          opacity:         isOpen ? 1 : 0,
          pointerEvents:   isOpen ? 'all' : 'none',
          transition:      `transform 380ms ${EASE}, opacity 300ms ${EASE}`,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close notification"
          style={{
            position:        'absolute',
            top:             '10px',
            right:           '10px',
            width:           '24px',
            height:          '24px',
            borderRadius:    '50%',
            background:      'rgba(13,12,10,0.07)',
            border:          'none',
            cursor:          'pointer',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            fontSize:        '12px',
            color:           'rgba(13,12,10,0.5)',
            fontFamily:      'var(--font-inter), system-ui, sans-serif',
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ padding: '1rem 1.1rem 0.875rem' }}>
          <p style={{
            fontFamily:    'var(--font-inter), system-ui, sans-serif',
            fontSize:      '0.5625rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         'rgba(13,12,10,0.4)',
            marginBottom:  '0.375rem',
          }}>
            Your Cart
          </p>
          <h2 style={{
            fontFamily:    'var(--font-bodoni), Georgia, serif',
            fontSize:      '0.9375rem',
            fontWeight:    400,
            color:         '#0D0C0A',
            letterSpacing: '-0.01em',
            paddingRight:  '1.5rem',
          }}>
            Added to your collection.
          </h2>
          {/* Bronze accent */}
          <div style={{
            width:           '2rem',
            height:          '1px',
            backgroundColor: '#8B5E3C',
            marginTop:       '0.75rem',
          }} />
        </div>

        {/* Item */}
        {item && (
          <div style={{
            display:      'flex',
            gap:          '10px',
            padding:      '0.875rem 1.1rem',
            borderTop:    '0.5px solid #E8E4DE',
            borderBottom: '0.5px solid #E8E4DE',
          }}>
            <div style={{
              width:           '60px',
              height:          '74px',
              backgroundColor: '#E8E4DC',
              flexShrink:      0,
              position:        'relative',
              overflow:        'hidden',
            }}>
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="60px"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontFamily:    'var(--font-bodoni), Georgia, serif',
                fontSize:      '0.8125rem',
                fontWeight:    400,
                color:         '#0D0C0A',
                letterSpacing: '-0.01em',
                marginBottom:  '3px',
              }}>
                {item.name}
              </p>
              <p style={{
                fontFamily:    'var(--font-inter), system-ui, sans-serif',
                fontSize:      '0.5625rem',
                color:         'rgba(13,12,10,0.45)',
                lineHeight:    1.7,
                letterSpacing: '0.02em',
              }}>
                {item.variantName}<br />
                Size {item.size} · Qty {item.quantity}
              </p>
              {/* Made to order tag */}
              <div style={{
                display:    'flex',
                alignItems: 'center',
                gap:        '4px',
                marginTop:  '5px',
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
                  fontSize:      '0.5rem',
                  color:         'rgba(139,94,60,0.8)',
                  letterSpacing: '0.06em',
                }}>
                  Made to Order · 4–6 weeks
                </span>
              </div>
              <p style={{
                fontFamily:    'var(--font-bodoni), Georgia, serif',
                fontSize:      '0.75rem',
                color:         '#0D0C0A',
                marginTop:     '6px',
              }}>
                ${item.price.toLocaleString()} CAD
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{
          padding:       '0.875rem 1.1rem',
          display:       'flex',
          flexDirection: 'column',
          gap:           '0.5rem',
        }}>
          <Link
            href="/cart"
            onClick={onClose}
            style={{
              display:         'block',
              width:           '100%',
              padding:         '0.7rem',
              backgroundColor: '#0D0C0A',
              color:           '#F5F2EC',
              fontFamily:      'var(--font-inter), system-ui, sans-serif',
              fontSize:        '0.5625rem',
              fontWeight:      500,
              letterSpacing:   '0.18em',
              textTransform:   'uppercase',
              textDecoration:  'none',
              textAlign:       'center',
              transition:      `opacity 200ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
            }}
          >
            View Cart
          </Link>
          <button
            onClick={onClose}
            style={{
              width:           '100%',
              padding:         '0.6rem',
              backgroundColor: 'transparent',
              color:           'rgba(13,12,10,0.5)',
              fontFamily:      'var(--font-inter), system-ui, sans-serif',
              fontSize:        '0.5625rem',
              fontWeight:      400,
              letterSpacing:   '0.12em',
              textTransform:   'uppercase',
              border:          '0.5px solid #D4CFC8',
              cursor:          'pointer',
              transition:      `all 200ms ${EASE}`,
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  )
}
