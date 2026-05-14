'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { products } from '@/data/products'
import { Product, ColorVariant } from '@/types/product'

type Filter = 'all' | 'lamb' | 'camel'

function ProductCard({ product }: { product: Product }) {
  const [activeVariant, setActiveVariant] = useState<ColorVariant>(product.variants[0])
  const [isHovered, setIsHovered] = useState(false)
  const [variantChosen, setVariantChosen] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Only swap to model image if no swatch has been manually chosen
  const currentImage = (!variantChosen && isHovered)
    ? activeVariant.modelImage
    : activeVariant.productImage

  const handleVariantClick = (variant: ColorVariant) => {
    setActiveVariant(variant)
    setVariantChosen(true)
  }

  // Build href with color param so product page opens on correct colorway
  const productHref = `/products/${product.slug}?color=${encodeURIComponent(activeVariant.name)}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Image card */}
      <Link
        href={productHref}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position:        'relative',
            width:           '100%',
            aspectRatio:     '4 / 5',
            overflow:        'hidden',
            backgroundColor: '#F0EDE7',
            cursor:          'pointer',
          }}
        >
          {/* Product image */}
          <Image
            src={currentImage}
            alt={`${product.name} — ${activeVariant.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
            style={{
              transition: 'opacity 600ms cubic-bezier(0.25, 0.1, 0.25, 1)',
            }}
            priority={product.id <= 2}
          />

          {/* Hover overlay — subtle darken */}
          <div style={{
            position:        'absolute',
            inset:           0,
            backgroundColor: isHovered ? 'rgba(13,12,10,0.08)' : 'rgba(13,12,10,0)',
            transition:      'background-color 600ms cubic-bezier(0.25, 0.1, 0.25, 1)',
            pointerEvents:   'none',
          }} />

          {/* Bookmark icon */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsBookmarked(!isBookmarked)
            }}
            style={{
              position:        'absolute',
              top:             '1rem',
              right:           '1rem',
              background:      'none',
              border:          'none',
              cursor:          'pointer',
              padding:         '0.25rem',
              color:           isBookmarked ? '#0D0C0A' : 'rgba(13,12,10,0.5)',
              transition:      'color 300ms ease',
              zIndex:          2,
            }}
            aria-label="Save to wishlist"
          >
            <svg
              width="16"
              height="20"
              viewBox="0 0 16 20"
              fill={isBookmarked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 1h14v18l-7-5-7 5V1z" />
            </svg>
          </button>

          {/* Hover CTA — only show when hovered */}
          <div style={{
            position:   'absolute',
            bottom:     '1.25rem',
            left:       '1.25rem',
            opacity:    isHovered ? 1 : 0,
            transform:  isHovered ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 400ms ease, transform 400ms ease',
            zIndex:     2,
          }}>
            <span style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           '0.5rem',
              fontFamily:    'var(--font-inter), system-ui, sans-serif',
              fontSize:      '0.625rem',
              fontWeight:    500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color:         '#F5F2EC',
            }}>
              View Jacket
              <svg width="16" height="8" viewBox="0 0 20 8" fill="none" aria-hidden="true">
                <path
                  d="M0 4H18M15 1L18.5 4L15 7"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>

      {/* Card info below image */}
      <div style={{ paddingTop: '1.25rem' }}>
        {/* Name + price row */}
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'baseline',
          marginBottom:   '0.4rem',
        }}>
          <h3 style={{
            fontFamily:    'var(--font-bodoni), Georgia, serif',
            fontSize:      'clamp(1.1rem, 1.8vw, 1.375rem)',
            fontWeight:    400,
            color:         '#0D0C0A',
            letterSpacing: '-0.01em',
            margin:        0,
          }}>
            {product.name}
          </h3>
          <span style={{
            fontFamily:    'var(--font-bodoni), Georgia, serif',
            fontSize:      'clamp(0.9rem, 1.4vw, 1.125rem)',
            fontWeight:    400,
            color:         '#0D0C0A',
            letterSpacing: '-0.01em',
          }}>
            {product.price}
          </span>
        </div>

        {/* Material */}
        <p style={{
          fontFamily:    'var(--font-inter), system-ui, sans-serif',
          fontSize:      '0.6875rem',
          fontWeight:    400,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color:         'rgba(13,12,10,0.6)',
          marginBottom:  product.variants.length > 1 ? '0.875rem' : '0',
        }}>
          {product.leather === 'camel' ? 'Camel Leather' : 'Full-Grain Lamb'}
        </p>

        {/* Color swatches — only if more than 1 variant */}
        {product.variants.length > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {product.variants.map((variant) => (
              <button
                key={variant.name}
                onClick={() => handleVariantClick(variant)}
                title={variant.name}
                style={{
                  width:           '16px',
                  height:          '16px',
                  borderRadius:    '50%',
                  backgroundColor: variant.hex,
                  border:          activeVariant.name === variant.name
                    ? '1.5px solid #0D0C0A'
                    : '1.5px solid transparent',
                  outline:         activeVariant.name === variant.name
                    ? '1px solid #0D0C0A'
                    : '1px solid transparent',
                  outlineOffset:   '2px',
                  cursor:          'pointer',
                  padding:         0,
                  transition:      'outline 200ms ease, border 200ms ease',
                  flexShrink:      0,
                }}
                aria-label={variant.name}
              />
            ))}
            <span style={{
              fontFamily:    'var(--font-inter), system-ui, sans-serif',
              fontSize:      '0.625rem',
              fontWeight:    400,
              letterSpacing: '0.06em',
              color:         'rgba(13,12,10,0.6)',
              marginLeft:    '0.25rem',
            }}>
              {activeVariant.name}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ShopPage() {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = products.filter((p) => {
    if (filter === 'all') return true
    return p.leather === filter
  })

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>

      {/* Page header */}
      <div style={{
        padding:      'clamp(6rem, 10vw, 9rem) clamp(2rem, 6vw, 7rem) clamp(2rem, 4vw, 3rem)',
        borderBottom: '0.5px solid #E8E4DE',
      }}>
        <p style={{
          fontFamily:    'var(--font-inter), system-ui, sans-serif',
          fontSize:      '0.625rem',
          fontWeight:    500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color:         'rgba(13,12,10,0.55)',
          marginBottom:  '1rem',
        }}>
          The Collection
        </p>
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'flex-end',
          flexWrap:       'wrap',
          gap:            '2rem',
        }}>
          <h1 style={{
            fontFamily:    'var(--font-inter), system-ui, sans-serif',
            fontSize:      'clamp(2.5rem, 5vw, 4rem)',
            fontWeight:    300,
            color:         '#0D0C0A',
            letterSpacing: '-0.03em',
            lineHeight:    1.0,
            margin:        0,
          }}>
            All Jackets
          </h1>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['all', 'lamb', 'camel'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  fontFamily:      'var(--font-inter), system-ui, sans-serif',
                  fontSize:        '0.625rem',
                  fontWeight:      500,
                  letterSpacing:   '0.15em',
                  textTransform:   'uppercase',
                  padding:         '0.6rem 1.25rem',
                  border:          '0.5px solid',
                  borderColor:     filter === f ? '#0D0C0A' : '#D4CFC8',
                  backgroundColor: filter === f ? '#0D0C0A' : 'transparent',
                  color:           filter === f ? '#F5F2EC' : 'rgba(13,12,10,0.65)',
                  cursor:          'pointer',
                  transition:      'all 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                }}
              >
                {f === 'all' ? 'All' : f === 'lamb' ? 'Lamb' : 'Camel'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div style={{
        padding: 'clamp(3rem, 5vw, 5rem) clamp(2rem, 6vw, 7rem)',
      }}>
        {/* First 4 jackets — 2 column grid */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap:                 'clamp(2rem, 4vw, 4rem) clamp(1.5rem, 3vw, 3rem)',
          marginBottom:        'clamp(2rem, 4vw, 4rem)',
        }}>
          {filtered
            .filter((p) => p.leather === 'lamb')
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>

        {/* The Sentinel — centered solo */}
        {filtered.some((p) => p.leather === 'camel') && (
          <div style={{
            display:        'flex',
            justifyContent: 'center',
          }}>
            <div style={{ width: '50%', minWidth: '280px' }}>
              {filtered
                .filter((p) => p.leather === 'camel')
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{
            textAlign:  'center',
            padding:    '6rem 0',
            fontFamily: 'var(--font-bodoni), Georgia, serif',
            fontSize:   '1.125rem',
            fontStyle:  'italic',
            color:      'rgba(13,12,10,0.55)',
          }}>
            No jackets found.
          </div>
        )}
      </div>

      {/* Made to order note */}
      <div style={{
        borderTop:      '0.5px solid #E8E4DE',
        padding:        'clamp(2rem, 4vw, 3rem) clamp(2rem, 6vw, 7rem)',
        display:        'flex',
        justifyContent: 'center',
      }}>
        <p style={{
          fontFamily:    'var(--font-inter), system-ui, sans-serif',
          fontSize:      '0.6875rem',
          fontWeight:    400,
          letterSpacing: '0.06em',
          color:         'rgba(13,12,10,0.6)',
          textAlign:     'center',
        }}>
          All SEPAKA jackets are made to order. Production time 4–6 weeks.
        </p>
      </div>

    </main>
  )
}
