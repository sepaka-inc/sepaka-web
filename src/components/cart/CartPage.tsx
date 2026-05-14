'use client'

import { useState, useEffect, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { CartItem } from '@/types/cart'

const EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

function AccordionRow({
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
          borderBottom:    '0.5px solid #E8E4DE',
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
          color:      'rgba(13,12,10,0.55)',
        }}>
          ˅
        </span>
      </button>
      {open && (
        <div style={{
          padding:      '0.625rem 0 0.75rem',
          borderBottom: '0.5px solid #E8E4DE',
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

function RemoveConfirmation({
  isOpen,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onCancel])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        aria-hidden="true"
        style={{
          position:        'fixed',
          inset:           0,
          backgroundColor: isOpen ? 'rgba(13,12,10,0.3)' : 'rgba(13,12,10,0)',
          zIndex:          69,
          pointerEvents:   isOpen ? 'all' : 'none',
          transition:      `background-color 300ms ${EASE}`,
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Remove item"
        style={{
          position:        'fixed',
          top:             0,
          right:           0,
          bottom:          0,
          width:           'clamp(300px, 38vw, 440px)',
          backgroundColor: '#F5F2EC',
          zIndex:          70,
          transform:       isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition:      `transform 380ms ${EASE}`,
          display:         'flex',
          flexDirection:   'column',
          justifyContent:  'center',
          padding:         'clamp(2rem, 6vw, 4rem)',
          borderLeft:      '0.5px solid #E8E4DE',
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          style={{
            position:   'absolute',
            top:        '1.25rem',
            right:      '1.25rem',
            background: 'none',
            border:     'none',
            cursor:     'pointer',
            fontSize:   '1.125rem',
            color:      'rgba(13,12,10,0.6)',
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
          }}
        >
          ✕
        </button>

        {/* Heading */}
        <h2 style={{
          fontFamily:    'var(--font-bodoni), Georgia, serif',
          fontSize:      'clamp(1.375rem, 2.5vw, 1.75rem)',
          fontWeight:    400,
          color:         '#0D0C0A',
          letterSpacing: '-0.02em',
          marginBottom:  '1rem',
          lineHeight:    1.1,
        }}>
          Remove this jacket?
        </h2>

        {/* Bronze divider */}
        <div style={{
          width:           '2rem',
          height:          '1px',
          backgroundColor: '#8B5E3C',
          marginBottom:    '1.25rem',
        }} />

        {/* Body */}
        <p style={{
          fontFamily:    'var(--font-inter), system-ui, sans-serif',
          fontSize:      '0.875rem',
          color:         'rgba(13,12,10,0.55)',
          lineHeight:    1.65,
          marginBottom:  '2rem',
          letterSpacing: '0.01em',
        }}>
          Are you sure you want to remove this jacket from your cart?
        </p>

        {/* Buttons */}
        <div style={{
          display:       'flex',
          flexDirection: 'column',
          gap:           '0.75rem',
        }}>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              width:           '100%',
              padding:         '0.875rem',
              backgroundColor: '#0D0C0A',
              color:           '#F5F2EC',
              fontFamily:      'var(--font-inter), system-ui, sans-serif',
              fontSize:        '0.625rem',
              fontWeight:      500,
              letterSpacing:   '0.18em',
              textTransform:   'uppercase',
              border:          'none',
              cursor:          'pointer',
              transition:      `opacity 200ms ${EASE}`,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
          >
            Yes, remove it
          </button>

          <button
            type="button"
            onClick={onCancel}
            style={{
              width:           '100%',
              padding:         '0.875rem',
              backgroundColor: 'transparent',
              color:           '#0D0C0A',
              fontFamily:      'var(--font-inter), system-ui, sans-serif',
              fontSize:        '0.625rem',
              fontWeight:      400,
              letterSpacing:   '0.18em',
              textTransform:   'uppercase',
              border:          '0.5px solid #D4CFC8',
              cursor:          'pointer',
              transition:      `all 200ms ${EASE}`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#0D0C0A'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#D4CFC8'
            }}
          >
            No, keep it
          </button>
        </div>
      </div>
    </>
  )
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, addItem, subtotal } = useCart()

  const [isMobile, setIsMobile] = useState(false)
  const [removeTarget, setRemoveTarget] = useState<string | null>(null)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleSizeChange = (item: CartItem, newSize: string) => {
    if (newSize === item.size) return
    const newId = `${item.slug}-${item.variantName}-${newSize}`
      .toLowerCase()
      .replace(/\s+/g, '-')
    const existingItem = items.find(i => i.id === newId)
    if (existingItem) {
      updateQuantity(newId, existingItem.quantity + item.quantity)
      removeItem(item.id)
    } else {
      const payload: Omit<CartItem, 'id' | 'quantity'> = {
        slug:        item.slug,
        name:        item.name,
        variantName: item.variantName,
        variantHex:  item.variantHex,
        size:        newSize,
        price:       item.price,
        image:       item.image,
      }
      const qty = item.quantity
      removeItem(item.id)
      for (let i = 0; i < qty; i++) {
        addItem(payload)
      }
    }
  }

  const textStyle = {
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    fontSize:   '0.875rem',
    color:      'rgba(13,12,10,0.55)',
    lineHeight: 1.7,
  }

  if (items.length === 0) {
    return (
      <main style={{
        backgroundColor: '#FFFFFF',
        minHeight:       '100dvh',
        paddingTop:      '60px',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        flexDirection:   'column',
        gap:             '1.5rem',
      }}>
        <p style={{
          fontFamily:  'var(--font-bodoni), Georgia, serif',
          fontSize:    'clamp(1.25rem, 2vw, 1.75rem)',
          fontWeight:  400,
          fontStyle:   'italic',
          color:       'rgba(13,12,10,0.55)',
          letterSpacing: '-0.01em',
        }}>
          Your cart is empty.
        </p>
        <Link
          href="/shop"
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
      </main>
    )
  }

  return (
    <main style={{
      backgroundColor: '#FFFFFF',
      minHeight:       '100dvh',
      paddingTop:      '60px',
    }}>
      <div style={{
        maxWidth:  '1400px',
        margin:    '0 auto',
        width:     '100%',
      }}>
        <div style={{
          display:        'flex',
          flexDirection:  isMobile ? 'column' : 'row',
          alignItems:     'flex-start',
          minHeight:      'calc(100dvh - 60px)',
        }}>
        {/* Left — items */}
        <div style={{
          flex:         1,
          width:        isMobile ? '100%' : undefined,
          minWidth:     0,
          padding:      'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 4vw, 3rem)',
          borderRight:  isMobile ? 'none' : '0.5px solid #E8E4DE',
          borderBottom: isMobile ? '0.5px solid #E8E4DE' : 'none',
        }}>
          {/* Heading */}
          <p style={{ marginBottom: '0.5rem' }}>
            <button
              type="button"
              onClick={() => window.history.back()}
              style={{
                background:    'none',
                border:        'none',
                cursor:        'pointer',
                fontFamily:    'var(--font-inter), system-ui, sans-serif',
                fontSize:      '0.5625rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color:         'rgba(13,12,10,0.6)',
                padding:       0,
                textDecoration:'underline',
              }}
            >
              ← Back
            </button>
          </p>
          <h1 style={{
            fontFamily:    'var(--font-bodoni), Georgia, serif',
            fontSize:      'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight:    400,
            color:         '#0D0C0A',
            letterSpacing: '-0.02em',
            marginBottom:  '0.25rem',
          }}>
            Your Cart
          </h1>
          <p style={{
            fontFamily:    'var(--font-inter), system-ui, sans-serif',
            fontSize:      '0.5625rem',
            color:         'rgba(13,12,10,0.55)',
            letterSpacing: '0.08em',
            marginBottom:  '1rem',
          }}>
            {items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
          </p>
          <div style={{
            width:           '2rem',
            height:          '1px',
            backgroundColor: '#8B5E3C',
            marginBottom:    '1.5rem',
          }} />

          {/* Items */}
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display:      'flex',
                gap:          'clamp(0.75rem, 2vw, 1.25rem)',
                padding:      'clamp(1.25rem, 3vw, 2rem) 0',
                borderBottom: '0.5px solid #E8E4DE',
              }}
            >
              {/* Image */}
              <div style={{
                width:           isMobile ? '120px' : 'clamp(160px, 18vw, 220px)',
                height:          isMobile ? '148px' : 'clamp(196px, 22vw, 270px)',
                backgroundColor: '#F0EDE7',
                flexShrink:      0,
                position:        'relative',
                overflow:        'hidden',
              }}>
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 120px, 220px"
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
                  <h2 style={{
                    fontFamily:    'var(--font-bodoni), Georgia, serif',
                    fontSize:      'clamp(1.125rem, 2vw, 1.5rem)',
                    fontWeight:    400,
                    color:         '#0D0C0A',
                    letterSpacing: '-0.01em',
                    marginBottom:  '3px',
                  }}>
                    {item.name}
                  </h2>
                  <p style={{
                    fontFamily:    'var(--font-inter), system-ui, sans-serif',
                    fontSize:      'clamp(0.75rem, 1.2vw, 0.9375rem)',
                    color:         'rgba(13,12,10,0.65)',
                    lineHeight:    1.7,
                    letterSpacing: '0.02em',
                    marginBottom:  '6px',
                  }}>
                    {item.variantName} · Size {item.size}
                  </p>
                  {/* Made to order tag */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
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

                {/* Size + Qty row */}
                <div style={{
                  display:        'flex',
                  alignItems:     'center',
                  gap:            '1rem',
                  marginTop:      '0.75rem',
                  flexWrap:       'wrap',
                }}>
                  {/* Size selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      fontFamily:    'var(--font-inter), system-ui, sans-serif',
                      fontSize:      '0.6875rem',
                      color:         'rgba(13,12,10,0.5)',
                      letterSpacing: '0.06em',
                    }}>
                      Size
                    </span>
                    <select
                      value={item.size}
                      onChange={(e) => handleSizeChange(item, e.target.value)}
                      style={{
                        fontFamily:    'var(--font-inter), system-ui, sans-serif',
                        fontSize:      '0.6875rem',
                        color:         '#0D0C0A',
                        letterSpacing: '0.04em',
                        border:        '0.5px solid #D4CFC8',
                        background:    'transparent',
                        padding:       '4px 24px 4px 8px',
                        cursor:        'pointer',
                        appearance:    'none',
                        WebkitAppearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%230D0C0A' stroke-width='1' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat:   'no-repeat',
                        backgroundPosition: 'right 8px center',
                        minWidth:      '60px',
                      }}
                    >
                      {['XS', 'S', 'M', 'L', 'XL'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontFamily:    'var(--font-inter), system-ui, sans-serif',
                      fontSize:      '0.6875rem',
                      color:         'rgba(13,12,10,0.5)',
                      letterSpacing: '0.06em',
                    }}>
                      Qty
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      style={{
                        width:           '26px',
                        height:          '26px',
                        border:          '0.5px solid #D4CFC8',
                        background:      'transparent',
                        cursor:          item.quantity <= 1 ? 'not-allowed' : 'pointer',
                        display:         'flex',
                        alignItems:      'center',
                        justifyContent:  'center',
                        fontSize:        '14px',
                        color:           item.quantity <= 1 ? 'rgba(13,12,10,0.2)' : 'rgba(13,12,10,0.6)',
                        fontFamily:      'var(--font-inter), system-ui, sans-serif',
                      }}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span style={{
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize:   '0.875rem',
                      color:      '#0D0C0A',
                      minWidth:   '20px',
                      textAlign:  'center',
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      style={{
                        width:           '26px',
                        height:          '26px',
                        border:          '0.5px solid #D4CFC8',
                        background:      'transparent',
                        cursor:          'pointer',
                        display:         'flex',
                        alignItems:      'center',
                        justifyContent:  'center',
                        fontSize:        '14px',
                        color:           'rgba(13,12,10,0.6)',
                        fontFamily:      'var(--font-inter), system-ui, sans-serif',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price + remove row */}
                <div style={{
                  display:        'flex',
                  justifyContent: 'space-between',
                  alignItems:     'center',
                  marginTop:      '0.75rem',
                }}>
                  <p style={{
                    fontFamily:    'var(--font-bodoni), Georgia, serif',
                    fontSize:      'clamp(1rem, 1.8vw, 1.25rem)',
                    color:         '#0D0C0A',
                  }}>
                    ${(item.price * item.quantity).toLocaleString()} CAD
                  </p>
                  <button
                    type="button"
                    onClick={() => setRemoveTarget(item.id)}
                    style={{
                      background:    'none',
                      border:        'none',
                      cursor:        'pointer',
                      fontFamily:    'var(--font-inter), system-ui, sans-serif',
                      fontSize:      '0.625rem',
                      color:         'rgba(13,12,10,0.3)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      textDecoration:'underline',
                      padding:       0,
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right — summary */}
        <div style={{
          width:           isMobile ? '100%' : 'clamp(340px, 38vw, 460px)',
          flexShrink:      0,
          padding:         'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
          backgroundColor: '#F5F2EC',
          position:        isMobile ? 'relative' : 'sticky',
          top:             isMobile ? undefined : '60px',
          alignSelf:       isMobile ? undefined : 'flex-start',
        }}>
          <p style={{
            fontFamily:    'var(--font-inter), system-ui, sans-serif',
            fontSize:      '0.6875rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color:         'rgba(13,12,10,0.6)',
            marginBottom:  '1.25rem',
          }}>
            Order Summary
          </p>

          {/* Line items */}
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display:        'flex',
                justifyContent: 'space-between',
                marginBottom:   '0.5rem',
              }}
            >
              <span style={{
                fontFamily:    'var(--font-inter), system-ui, sans-serif',
                fontSize:      '0.8125rem',
                color:         'rgba(13,12,10,0.5)',
                flex:          1,
                paddingRight:  '0.5rem',
              }}>
                {item.name} × {item.quantity}
              </span>
              <span style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontSize:   '0.8125rem',
                color:      '#0D0C0A',
              }}>
                ${(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}

          {/* Shipping */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize:   '0.8125rem',
              color:      'rgba(13,12,10,0.5)',
            }}>
              Shipping
            </span>
            <span style={{
              fontFamily:    'var(--font-inter), system-ui, sans-serif',
              fontSize:      '0.8125rem',
              color:         'rgba(139,94,60,0.8)',
              letterSpacing: '0.04em',
            }}>
              Complimentary
            </span>
          </div>

          {/* Divider */}
          <div style={{
            height:          '0.5px',
            backgroundColor: '#E8E4DE',
            margin:          '0.875rem 0',
          }} />

          {/* Total */}
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
              Total
            </span>
            <span style={{
              fontFamily:    'var(--font-bodoni), Georgia, serif',
              fontSize:      'clamp(1.375rem, 2.5vw, 1.75rem)',
              fontWeight:    400,
              color:         '#0D0C0A',
              letterSpacing: '-0.01em',
            }}>
              ${subtotal.toLocaleString()} CAD
            </span>
          </div>

          {/* Checkout */}
          <Link
            href="/checkout"
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
              marginBottom:    '0.5rem',
              transition:      `opacity 200ms ${EASE}`,
            }}
          >
            Proceed to Checkout
          </Link>

          {/* Continue */}
          <Link
            href="/shop"
            style={{
              display:         'block',
              width:           '100%',
              padding:         '0.625rem',
              backgroundColor: 'transparent',
              color:           'rgba(13,12,10,0.65)',
              fontFamily:      'var(--font-inter), system-ui, sans-serif',
              fontSize:        '0.75rem',
              fontWeight:      400,
              letterSpacing:   '0.1em',
              textTransform:   'uppercase',
              textDecoration:  'none',
              textAlign:       'center',
              border:          '0.5px solid #D4CFC8',
              marginBottom:    '1.5rem',
            }}
          >
            ← Continue Shopping
          </Link>

          {/* Accordions */}
          <AccordionRow label="Returns & Exchanges">
            <p style={textStyle}>
              Size exchanges accepted within 14 days of delivery. As each jacket is made to order, we do not accept returns. Contact hello@sepaka.ca to begin an exchange.
            </p>
          </AccordionRow>
          <AccordionRow label="Shipping Information">
            <p style={textStyle}>
              Complimentary DHL Express shipping across Canada. Estimated delivery 5–7 business days after production completes.
            </p>
          </AccordionRow>
          <AccordionRow label="Payment & Security">
            <p style={textStyle}>
              Visa, Mastercard, American Express, and Apple Pay accepted. All transactions processed securely via Stripe. Prices in Canadian dollars (CAD).
            </p>
          </AccordionRow>
        </div>
        </div>
      </div>

      <RemoveConfirmation
        isOpen={removeTarget !== null}
        onConfirm={() => {
          if (removeTarget) removeItem(removeTarget)
          setRemoveTarget(null)
        }}
        onCancel={() => setRemoveTarget(null)}
      />
    </main>
  )
}
