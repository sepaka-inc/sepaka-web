'use client'

import { useEffect, useRef, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useCart } from '@/context/CartContext'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import Link from 'next/link'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function CheckoutPage() {
  const hasInitialized = useRef(false)
  const { items } = useCart()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (hasInitialized.current) return
    if (items.length === 0) return
    hasInitialized.current = true

    fetch('/api/create-payment-intent', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, province: 'AB' }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) { setError(data.error); return }
        setClientSecret(data.clientSecret)
        setTotal(data.total)
      })
      .catch(() => setError('Failed to initialise checkout'))
  }, [items])

  if (error) {
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
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
          fontSize:   '0.875rem',
          color:      'rgba(180,40,40,0.85)',
        }}>
          {error}
        </p>
        <Link href="/cart" style={{
          fontFamily:     'var(--font-inter), system-ui, sans-serif',
          fontSize:       '0.625rem',
          letterSpacing:  '0.15em',
          textTransform:  'uppercase',
          color:          '#0D0C0A',
          textDecoration: 'underline',
        }}>
          Return to Cart
        </Link>
      </main>
    )
  }

  if (!clientSecret) {
    return (
      <main style={{
        backgroundColor: '#FFFFFF',
        minHeight:       '100dvh',
        paddingTop:      '60px',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
      }}>
        <p style={{
          fontFamily:    'var(--font-inter), system-ui, sans-serif',
          fontSize:      '0.6875rem',
          color:         'rgba(13,12,10,0.6)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          Preparing checkout...
        </p>
      </main>
    )
  }

  return (
    <main style={{
      backgroundColor: '#FFFFFF',
      minHeight:       '100dvh',
      paddingTop:      '60px',
    }}>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme:     'stripe',
            variables: {
              fontFamily:      'Inter, system-ui, sans-serif',
              colorPrimary:    '#0D0C0A',
              colorBackground: '#FFFFFF',
              colorText:       '#0D0C0A',
              colorDanger:     'rgba(180,40,40,0.85)',
              borderRadius:    '0px',
              fontSizeBase:    '15px',
              spacingUnit:     '4px',
            },
          },
        }}
      >
        <CheckoutForm clientSecret={clientSecret} total={total} />
      </Elements>
    </main>
  )
}
