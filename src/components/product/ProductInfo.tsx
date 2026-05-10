'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Product, ColorVariant } from '@/types/product'

const SIZES = ['XS', 'S', 'M', 'L', 'XL']
const EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

interface Props {
  product: Product
  activeVariant: ColorVariant
  isMobile: boolean
  onVariantChange: (variant: ColorVariant) => void
  onOpenPanel: (panel: 'details' | 'delivery') => void
  onAddToCart: (size: string) => void
}

export default function ProductInfo({
  product,
  activeVariant,
  isMobile,
  onVariantChange,
  onOpenPanel,
  onAddToCart,
}: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [sizeError, setSizeError] = useState(false)

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    onAddToCart(selectedSize)
  }

  return (
    <div
      style={{
        width:         isMobile ? '100%' : '35%',
        flexShrink:    0,
        padding:       'clamp(1.5rem, 4vw, 3rem) clamp(1.25rem, 4vw, 3rem)',
        paddingBottom: `calc(clamp(1.5rem, 4vw, 3rem) + env(safe-area-inset-bottom))`,
        position:      'sticky',
        top:           '60px',
        alignSelf:     'flex-start',
        maxHeight:     'calc(100dvh - 60px)',
        overflowY:     'auto',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Breadcrumb */}
      <p
        style={{
          fontFamily:    'var(--font-inter), system-ui, sans-serif',
          fontSize:      '0.625rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color:         'rgba(13,12,10,0.65)',
          marginBottom:  '1rem',
        }}
      >
        <Link href="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>
          Shop
        </Link>
        {' / '}
        {product.name}
      </p>

      {/* Product name */}
      <h1
        style={{
          fontFamily:    'var(--font-bodoni), Georgia, serif',
          fontSize:      'clamp(2rem, 4vw, 3rem)',
          fontWeight:    400,
          color:         '#0D0C0A',
          letterSpacing: '-0.02em',
          lineHeight:    1.0,
          marginBottom:  '0.5rem',
        }}
      >
        {product.name}
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontFamily:    'var(--font-bodoni), Georgia, serif',
          fontSize:      'clamp(0.875rem, 1.5vw, 1.125rem)',
          fontWeight:    400,
          fontStyle:     'italic',
          color:         'rgba(13,12,10,0.45)',
          marginBottom:  '1rem',
        }}
      >
        {product.tagline}
      </p>

      {/* Material */}
      <p
        style={{
          fontFamily:    'var(--font-inter), system-ui, sans-serif',
          fontSize:      '0.625rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color:         'rgba(13,12,10,0.4)',
          marginBottom:  '1rem',
        }}
      >
        {product.leather === 'camel' ? 'Camel Leather' : 'Full-Grain Lamb'}
      </p>

      {/* Bronze divider */}
      <div
        style={{
          width:           '2rem',
          height:          '1px',
          backgroundColor: '#8B5E3C',
          marginBottom:    '1.25rem',
        }}
      />

      {/* Colour selector — only if more than 1 variant */}
      {product.variants.length > 1 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <p
            style={{
              fontFamily:    'var(--font-inter), system-ui, sans-serif',
              fontSize:      '0.5625rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color:         'rgba(13,12,10,0.65)',
              marginBottom:  '0.5rem',
            }}
          >
            Colour — {activeVariant.name}
          </p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {product.variants.map((variant) => (
              <button
                key={variant.name}
                type="button"
                onClick={() => onVariantChange(variant)}
                title={variant.name}
                aria-label={variant.name}
                style={{
                  width:           '18px',
                  height:          '18px',
                  borderRadius:    '50%',
                  backgroundColor: variant.hex,
                  border:          'none',
                  outline:         activeVariant.name === variant.name
                    ? '1.5px solid #0D0C0A'
                    : '1.5px solid transparent',
                  outlineOffset:   '2px',
                  cursor:          'pointer',
                  padding:         0,
                  flexShrink:      0,
                  transition:      `outline 150ms ${EASE}`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size selector */}
      <div style={{ marginBottom: '0.5rem' }}>
        <p
          style={{
            fontFamily:    'var(--font-inter), system-ui, sans-serif',
            fontSize:      '0.5625rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color:         'rgba(13,12,10,0.65)',
            marginBottom:  '0.5rem',
          }}
        >
          Size
        </p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => {
                setSelectedSize(size)
                setSizeError(false)
              }}
              style={{
                padding:         '5px 10px',
                border:          '0.5px solid',
                borderColor:     selectedSize === size ? '#0D0C0A' : '#D4CFC8',
                backgroundColor: selectedSize === size ? '#0D0C0A' : 'transparent',
                color:           selectedSize === size
                  ? '#F5F2EC'
                  : 'rgba(13,12,10,0.5)',
                fontFamily:      'var(--font-inter), system-ui, sans-serif',
                fontSize:        '0.6875rem',
                letterSpacing:   '0.06em',
                cursor:          'pointer',
                transition:      `all 150ms ${EASE}`,
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Size error */}
      {sizeError && (
        <p
          style={{
            fontFamily:    'var(--font-inter), system-ui, sans-serif',
            fontSize:      '0.625rem',
            color:         'rgba(180,40,40,0.85)',
            letterSpacing: '0.04em',
            marginBottom:  '0.5rem',
          }}
        >
          Please select a size
        </p>
      )}

      {/* Size guide */}
      <p
        style={{
          fontFamily:    'var(--font-inter), system-ui, sans-serif',
          fontSize:      '0.625rem',
          color:         'rgba(13,12,10,0.65)',
          letterSpacing: '0.04em',
          textDecoration:'underline',
          cursor:        'pointer',
          marginBottom:  '1.25rem',
        }}
      >
        Size guide →
      </p>

      {/* Price */}
      <p
        style={{
          fontFamily:    'var(--font-bodoni), Georgia, serif',
          fontSize:      'clamp(1.25rem, 2vw, 1.625rem)',
          fontWeight:    400,
          color:         '#0D0C0A',
          letterSpacing: '-0.01em',
          marginBottom:  '1.25rem',
        }}
      >
        {product.price}
      </p>

      {/* Add to cart */}
      <button
        type="button"
        onClick={handleAddToCart}
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
          marginBottom:    '1.5rem',
          transition:      `opacity 200ms ${EASE}`,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
      >
        Add to Cart
      </button>

      {/* Slide panel triggers */}
      <div
        style={{
          borderTop: '0.5px solid #E8E4DE',
        }}
      >
        {(['details', 'delivery'] as const).map((panel) => (
          <button
            key={panel}
            type="button"
            onClick={() => onOpenPanel(panel)}
            style={{
              width:           '100%',
              display:         'flex',
              justifyContent:  'space-between',
              alignItems:      'center',
              padding:         '0.75rem 0',
              background:      'none',
              border:          'none',
              borderBottom:    '0.5px solid #E8E4DE',
              cursor:          'pointer',
              fontFamily:      'var(--font-inter), system-ui, sans-serif',
              fontSize:        '0.75rem',
              letterSpacing:   '0.04em',
              color:           'rgba(13,12,10,0.65)',
              textAlign:       'left',
              transition:      `color 200ms ${EASE}`,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#0D0C0A' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(13,12,10,0.65)' }}
          >
            {panel === 'details' ? 'Product Details' : 'Delivery & Returns'}
            <span style={{ fontSize: '1rem', fontWeight: 300 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  )
}
