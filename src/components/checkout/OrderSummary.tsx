'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import { CartItem } from '@/types/cart'
import { ProvinceCode } from '@/lib/tax'

const EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

function SummaryAccordion({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderTop: '0.5px solid #E8E4DE' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width:           '100%',
          display:         'flex',
          justifyContent:  'space-between',
          alignItems:      'center',
          padding:         '0.875rem 0',
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
          fontSize:   '0.875rem',
          transform:  open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: `transform 250ms ${EASE}`,
          display:    'inline-block',
          color:      'rgba(13,12,10,0.55)',
        }}>
          ˅
        </span>
      </button>
      {open && (
        <div style={{
          padding:      '0.625rem 0 0.875rem',
          borderBottom: '0.5px solid #E8E4DE',
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

interface Props {
  items: CartItem[]
  province: ProvinceCode | null
  total: number
  isMobile?: boolean
}

export default function OrderSummary({ items, province: _province, total, isMobile }: Props) {
  void _province

  if (isMobile) {
    return (
      <div style={{
        padding:         '0.875rem clamp(1.5rem, 5vw, 4rem)',
        borderBottom:    '0.5px solid #E8E4DE',
        backgroundColor: '#F5F2EC',
        display:         'flex',
        justifyContent:  'space-between',
        alignItems:      'center',
      }}>
        <span style={{
          fontFamily:    'var(--font-inter), system-ui, sans-serif',
          fontSize:      '0.75rem',
          color:         'rgba(13,12,10,0.6)',
          letterSpacing: '0.04em',
        }}>
          {items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
        </span>
        <span style={{
          fontFamily:    'var(--font-bodoni), Georgia, serif',
          fontSize:      '1rem',
          color:         '#0D0C0A',
          letterSpacing: '-0.01em',
        }}>
          ${total.toLocaleString()} CAD
        </span>
      </div>
    )
  }

  return (
    <div style={{
      width:           '100%',
      backgroundColor: '#F5F2EC',
      padding:         'clamp(2rem, 4vw, 3rem)',
      position:        'sticky',
      top:             '60px',
      maxHeight:       'calc(100dvh - 60px)',
      overflowY:       'auto',
    }}>
      {/* Header */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        marginBottom:   '1.5rem',
      }}>
        <p style={{
          fontFamily:    'var(--font-inter), system-ui, sans-serif',
          fontSize:      '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color:         'rgba(13,12,10,0.65)',
          margin:        0,
        }}>
          Order Summary
        </p>
        <a href="/cart" style={{
          fontFamily:    'var(--font-inter), system-ui, sans-serif',
          fontSize:      '0.6875rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color:         'rgba(13,12,10,0.6)',
          textDecoration:'underline',
        }}>
          Edit Cart
        </a>
      </div>

      {/* Items */}
      <div style={{ marginBottom: '1.5rem' }}>
        {items.map((item) => (
          <div key={item.id} style={{
            display:      'flex',
            gap:          '1rem',
            paddingBottom:'1.25rem',
            marginBottom: '1.25rem',
            borderBottom: '0.5px solid #E8E4DE',
          }}>
            <div style={{
              width:           '132px',
              height:          '162px',
              backgroundColor: '#E8E4DC',
              flexShrink:      0,
              position:        'relative',
              overflow:        'hidden',
            }}>
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="132px"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              {item.quantity > 1 && (
                <div style={{
                  position:        'absolute',
                  top:             '-6px',
                  right:           '-6px',
                  width:           '18px',
                  height:          '18px',
                  borderRadius:    '50%',
                  backgroundColor: '#0D0C0A',
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  fontFamily:      'var(--font-inter), system-ui, sans-serif',
                  fontSize:        '0.5rem',
                  color:           '#F5F2EC',
                  fontWeight:      500,
                }}>
                  {item.quantity}
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontFamily:    'var(--font-bodoni), Georgia, serif',
                fontSize:      '1.125rem',
                color:         '#0D0C0A',
                marginBottom:  '3px',
                letterSpacing: '-0.01em',
              }}>
                {item.name}
              </p>
              <p style={{
                fontFamily:    'var(--font-inter), system-ui, sans-serif',
                fontSize:      '0.8125rem',
                color:         'rgba(13,12,10,0.5)',
                lineHeight:    1.5,
                marginBottom:  '0.5rem',
              }}>
                {item.variantName} · Size {item.size}
              </p>
              <p style={{
                fontFamily:    'var(--font-bodoni), Georgia, serif',
                fontSize:      '1.0625rem',
                color:         '#0D0C0A',
              }}>
                ${(item.price * item.quantity).toLocaleString()} CAD
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize:   '0.875rem',
            color:      'rgba(13,12,10,0.7)',
          }}>Subtotal</span>
          <span style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize:   '0.875rem',
            color:      '#0D0C0A',
          }}>${total.toLocaleString()} CAD</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize:   '0.875rem',
            color:      'rgba(13,12,10,0.7)',
          }}>Delivery</span>
          <span style={{
            fontFamily:    'var(--font-inter), system-ui, sans-serif',
            fontSize:      '0.875rem',
            color:         '#8B5E3C',
          }}>Complimentary</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize:   '0.875rem',
            color:      'rgba(13,12,10,0.7)',
          }}>
            Taxes
          </span>
          <span style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize:   '0.875rem',
            color:      'rgba(13,12,10,0.6)',
          }}>$0.00</span>
        </div>
      </div>

      <div style={{ height: '0.5px', backgroundColor: '#E8E4DE', margin: '1rem 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
        <span style={{
          fontFamily:    'var(--font-inter), system-ui, sans-serif',
          fontSize:      '0.75rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color:         'rgba(13,12,10,0.7)',
        }}>Total</span>
        <span style={{
          fontFamily:    'var(--font-bodoni), Georgia, serif',
          fontSize:      'clamp(1.5rem, 2.5vw, 1.875rem)',
          fontWeight:    400,
          color:         '#0D0C0A',
          letterSpacing: '-0.01em',
        }}>${total.toLocaleString()} CAD</span>
      </div>

      {/* Made to order */}
      <div style={{
        padding:    '0.875rem',
        background: '#FFFFFF',
        marginBottom: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <div style={{
            width:           '4px',
            height:          '4px',
            borderRadius:    '50%',
            backgroundColor: '#8B5E3C',
          }} />
          <span style={{
            fontFamily:    'var(--font-inter), system-ui, sans-serif',
            fontSize:      '0.625rem',
            color:         '#8B5E3C',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>Made to Order</span>
        </div>
        <p style={{
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
          fontSize:   '0.75rem',
          color:      'rgba(13,12,10,0.7)',
          lineHeight: 1.5,
        }}>
          Your jacket will be crafted after purchase. Production takes 4–6 weeks.
        </p>
      </div>

      {/* Secure */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        gap:            '6px',
        justifyContent: 'center',
      }}>
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
          <path d="M6 0L0 2.5v4.5C0 10.5 2.5 13.5 6 14c3.5-.5 6-3.5 6-7V2.5L6 0z" fill="rgba(13,12,10,0.2)"/>
        </svg>
        <span style={{
          fontFamily:    'var(--font-inter), system-ui, sans-serif',
          fontSize:      '0.5625rem',
          color:         'rgba(13,12,10,0.55)',
          letterSpacing: '0.06em',
        }}>Secured by Stripe</span>
      </div>

      {/* Accordions */}
      <div style={{ marginTop: '1.5rem' }}>
        <SummaryAccordion label="Secure Payment">
          <p style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize:   '0.75rem',
            color:      'rgba(13,12,10,0.55)',
            lineHeight: 1.65,
            marginBottom: '0.75rem',
          }}>
            All transactions are secured and encrypted. Payment processed by Stripe — the same security used by Amazon and Apple.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {['Visa', 'Mastercard', 'Amex', 'Apple Pay'].map(m => (
              <span key={m} style={{
                fontFamily:    'var(--font-inter), system-ui, sans-serif',
                fontSize:      '0.5625rem',
                letterSpacing: '0.06em',
                color:         'rgba(13,12,10,0.6)',
                border:        '0.5px solid #D4CFC8',
                padding:       '3px 8px',
              }}>{m}</span>
            ))}
          </div>
        </SummaryAccordion>

        <SummaryAccordion label="Returns & Exchanges">
          <p style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize:   '0.75rem',
            color:      'rgba(13,12,10,0.55)',
            lineHeight: 1.65,
          }}>
            As each jacket is made to order, we do not accept returns. Size exchanges are accepted within 14 days of delivery. Contact hello@sepaka.ca to begin an exchange.
          </p>
        </SummaryAccordion>

        <SummaryAccordion label="Need Help?">
          <p style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize:   '0.75rem',
            color:      'rgba(13,12,10,0.55)',
            lineHeight: 1.65,
          }}>
            Email us at{' '}
            <a href="mailto:hello@sepaka.ca" style={{ color: '#0D0C0A', textDecoration: 'underline' }}>
              hello@sepaka.ca
            </a>
            {' '}and we&apos;ll get back to you within one business day.
          </p>
        </SummaryAccordion>
      </div>
    </div>
  )
}
