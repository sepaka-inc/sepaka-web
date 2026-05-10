'use client'

import { useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { Product, ColorVariant } from '@/types/product'

interface Props {
  isOpen: boolean
  onClose: () => void
  type: 'details' | 'delivery' | null
  product: Product
  activeVariant: ColorVariant
}

const EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

function useToggle(initial: boolean): [boolean, Dispatch<SetStateAction<boolean>>] {
  return useState(initial)
}

function NestedAccordion({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useToggle(false)
  return (
    <div style={{ borderTop: '0.5px solid #E8E4DE' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          width:           '100%',
          display:         'flex',
          justifyContent:  'space-between',
          alignItems:      'center',
          padding:         '0.65rem 0',
          background:      'none',
          border:          'none',
          borderBottom:    open ? 'none' : '0.5px solid #E8E4DE',
          cursor:          'pointer',
          fontFamily:      'var(--font-inter), system-ui, sans-serif',
          fontSize:        '0.625rem',
          fontWeight:      500,
          letterSpacing:   '0.14em',
          textTransform:   'uppercase',
          color:           'rgba(13,12,10,0.65)',
          textAlign:       'left',
        }}
      >
        {label}
        <span style={{
          fontSize:   '0.75rem',
          transform:  open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: `transform 250ms ${EASE}`,
          display:    'inline-block',
        }}
        >
          ˅
        </span>
      </button>
      {open && (
        <div
          style={{
            padding:      '0.5rem 0 0.75rem',
            borderBottom: '0.5px solid #E8E4DE',
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default function SlidePanel({ isOpen, onClose, type, product, activeVariant: _activeVariant }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const isLamb = product.leather === 'lamb'

  const bodyText = {
    details: isLamb
      ? 'A full-grain lambskin jacket cut with a relaxed, unisex silhouette. Designed in Calgary, crafted to order.'
      : 'A camel leather jacket of singular character. One design, one colorway. Designed in Calgary, crafted to order.',
    delivery: 'All SEPAKA jackets are made to order. Your jacket is crafted specifically for you after purchase.',
  }

  const bullets = {
    details: isLamb
      ? ['Full-grain lambskin leather', 'Relaxed unisex fit', 'Two colorways available', 'Fully lined interior', 'Made to order — 4 to 6 weeks', 'Designed in Calgary, Alberta']
      : ['Camel leather', 'Relaxed unisex fit', 'Single colorway', 'Fully lined interior', 'Made to order — 4 to 6 weeks', 'Designed in Calgary, Alberta'],
    delivery: ['Production time: 4–6 weeks', 'Email updates at each production stage', 'Shipped via DHL Express across Canada', 'Estimated delivery: 5–7 business days after production'],
  }

  const title = type === 'details' ? 'Product Details' : 'Delivery & Returns'

  const textStyle = {
    fontFamily:    'var(--font-inter), system-ui, sans-serif',
    fontSize:      '0.8125rem',
    color:         'rgba(13,12,10,0.6)',
    lineHeight:    1.7,
  } as const

  return (
    <>
      {/* Backdrop */}
      <div
        role="presentation"
        onClick={onClose}
        aria-hidden="true"
        style={{
          position:        'fixed',
          inset:           0,
          backgroundColor: isOpen ? 'rgba(13,12,10,0.2)' : 'rgba(13,12,10,0)',
          zIndex:          59,
          pointerEvents:   isOpen ? 'auto' : 'none',
          transition:      `background-color 350ms ${EASE}`,
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position:        'fixed',
          top:             0,
          right:           0,
          bottom:          0,
          width:           'clamp(300px, 42vw, 540px)',
          height:          '100dvh',
          maxHeight:       '100dvh',
          backgroundColor: '#FFFFFF',
          zIndex:          60,
          transform:       isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition:      `transform 380ms ${EASE}`,
          display:         'flex',
          flexDirection:   'column',
          boxShadow:       isOpen ? '-4px 0 24px rgba(13,12,10,0.08)' : 'none',
        }}
      >
        {/* Header */}
        <div
          style={{
            display:         'flex',
            justifyContent:  'space-between',
            alignItems:      'center',
            padding:         '1.25rem 1.5rem',
            borderBottom:    '0.5px solid #E8E4DE',
            position:        'sticky',
            top:             0,
            backgroundColor: '#FFFFFF',
            zIndex:          1,
          }}
        >
          <span
            style={{
              fontFamily:    'var(--font-inter), system-ui, sans-serif',
              fontSize:      '0.625rem',
              fontWeight:    500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         '#0D0C0A',
            }}
          >
            {type ? title : ''}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            style={{
              background:  'none',
              border:      'none',
              cursor:      'pointer',
              fontSize:    '1.125rem',
              color:       'rgba(13,12,10,0.45)',
              padding:     '0.25rem',
              transition:  `color 200ms ${EASE}`,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#0D0C0A' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(13,12,10,0.45)' }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        {type && (
          <div
            style={{
              flex:      1,
              overflowY: 'auto',
              padding:   '1.5rem',
              paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
            }}
          >
            {/* Description */}
            <p style={{ ...textStyle, marginBottom: '1.25rem' }}>
              {bodyText[type]}
            </p>

            {/* Bullets */}
            <ul style={{ listStyle: 'none', marginBottom: '1.5rem', padding: 0 }}>
              {bullets[type].map((b) => (
                <li key={b} style={{ ...textStyle, marginBottom: '0.4rem' }}>
                  <span style={{ color: '#8B5E3C', marginRight: '0.5rem' }}>·</span>
                  {b}
                </li>
              ))}
            </ul>

            {/* Nested accordions */}
            {type === 'details' && (
              <>
                <NestedAccordion label="Material">
                  <p style={textStyle}>
                    {isLamb
                      ? 'Full-grain lambskin — the highest grade of leather. Retains the natural grain and develops a rich patina over time.'
                      : 'Camel leather — rare, exceptionally soft, and naturally resistant to moisture and temperature change.'}
                  </p>
                </NestedAccordion>
                <NestedAccordion label="Size & Fit">
                  <p style={textStyle}>
                    Relaxed unisex fit. Designed to sit slightly oversized through the shoulders and chest. Our model is 6&apos;0&quot; and wears size S.
                  </p>
                </NestedAccordion>
                <NestedAccordion label="Product Care">
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {[
                      'Do Not Wash.',
                      'Do Not Bleach.',
                      'Do Not Tumble Dry.',
                      'Do Not Iron.',
                      'Do Not Dry Clean.',
                      'Use A Specialist Leather And Fur Cleaning Service Only.',
                    ].map((line) => (
                      <li
                        key={line}
                        style={{
                          fontFamily:    'var(--font-inter), system-ui, sans-serif',
                          fontSize:      '0.8125rem',
                          color:         'rgba(13,12,10,0.6)',
                          lineHeight:    1.8,
                        }}
                      >
                        <span style={{ color: '#8B5E3C', marginRight: '0.5rem' }}>·</span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </NestedAccordion>
              </>
            )}

            {type === 'delivery' && (
              <>
                <NestedAccordion label="Returns & Exchanges">
                  <p style={textStyle}>
                    Due to the made-to-order nature of our jackets, we do not accept returns. Size exchanges accepted within 14 days of delivery. Contact hello@sepaka.ca to begin.
                  </p>
                </NestedAccordion>
                <NestedAccordion label="Payment Methods">
                  <p style={textStyle}>
                    We accept Visa, Mastercard, American Express, and Apple Pay. All transactions processed securely via Stripe. Prices in Canadian dollars (CAD).
                  </p>
                </NestedAccordion>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}
