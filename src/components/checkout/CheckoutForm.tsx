'use client'

import { useState, useEffect, type CSSProperties, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  useStripe,
  useElements,
  PaymentElement,
  ExpressCheckoutElement,
  AddressElement,
} from '@stripe/react-stripe-js'
import { useCart } from '@/context/CartContext'
import { ProvinceCode } from '@/lib/tax'
import OrderSummary from './OrderSummary'

const EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

type Step = 1 | 2 | 3

const sectionHeadingStyle: CSSProperties = {
  fontFamily:    'var(--font-bodoni), Georgia, serif',
  fontSize:      'clamp(1.25rem, 2vw, 1.625rem)',
  fontWeight:    400,
  color:         '#0D0C0A',
  letterSpacing: '-0.01em',
  marginBottom:  '1.5rem',
}

const labelStyle: CSSProperties = {
  fontFamily:    'var(--font-inter), system-ui, sans-serif',
  fontSize:      '0.5625rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
  color:         'rgba(13,12,10,0.5)',
  display:       'block',
  marginBottom:  '0.25rem',
}

const inputStyle: CSSProperties = {
  width:           '100%',
  padding:         '0.75rem 0',
  border:          'none',
  borderBottom:    '0.5px solid #D4CFC8',
  backgroundColor: 'transparent',
  fontFamily:      'var(--font-inter), system-ui, sans-serif',
  fontSize:        '0.9375rem',
  color:           '#0D0C0A',
  outline:         'none',
  letterSpacing:   '0.01em',
}

interface Props {
  clientSecret: string
  total: number
}

export default function CheckoutForm({ clientSecret, total }: Props) {
  void clientSecret

  const stripe   = useStripe()
  const elements = useElements()
  const router   = useRouter()
  const { items, clearCart } = useCart()

  const [step,       setStep]       = useState<Step>(1)
  const [isMobile,   setIsMobile]   = useState(false)
  const [isLoading,  setIsLoading]  = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  // Step 1
  const [email,      setEmail]      = useState('')

  // Step 2
  const [fullName, setFullName] = useState('')
  const [province,   setProvince]   = useState<ProvinceCode>('AB')

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const stepIndicator = (n: Step, label: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{
        width:           '24px',
        height:          '24px',
        borderRadius:    '50%',
        backgroundColor: step === n ? '#0D0C0A' : step > n ? '#8B5E3C' : 'transparent',
        border:          step === n ? 'none' : '0.5px solid #D4CFC8',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        flexShrink:      0,
        transition:      `all 300ms ${EASE}`,
      }}>
        {step > n ? (
          <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
            <path d="M1 3.5L3.5 6L9 1" stroke="#F5F2EC" strokeWidth="1.25" strokeLinecap="round"/>
          </svg>
        ) : (
          <span style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize:   '0.5625rem',
            color:      step === n ? '#F5F2EC' : 'rgba(13,12,10,0.6)',
            fontWeight: 500,
          }}>{n}</span>
        )}
      </div>
      <span style={{
        fontFamily:    'var(--font-inter), system-ui, sans-serif',
        fontSize:      '0.625rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color:         step === n ? '#0D0C0A' : step > n ? '#8B5E3C' : 'rgba(13,12,10,0.55)',
        transition:    `color 300ms ${EASE}`,
      }}>{label}</span>
    </div>
  )

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsLoading(true)
    setError(null)

    const addressElement = elements.getElement(AddressElement)
    let billingName = fullName || email
    if (addressElement) {
      const addrResult = await addressElement.getValue()
      if (addrResult.complete && addrResult.value?.name) {
        billingName = addrResult.value.name
      }
    }

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
          payment_method_data: {
            billing_details: {
              name:  billingName,
              email,
            },
          },
        },
      })

      if (stripeError) {
        setError(stripeError.message ?? 'Payment failed. Please try again.')
        setIsLoading(false)
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        let customerNameForOrder = fullName || email
        let provinceForOrder: ProvinceCode = province
        let shippingForOrder: {
          line1: string
          city: string
          province: string
          postalCode: string
        } = {
          line1:      '',
          city:       '',
          province:   province,
          postalCode: '',
        }

        if (addressElement) {
          const addrResult = await addressElement.getValue()
          if (addrResult.complete && addrResult.value) {
            if (addrResult.value.name) {
              customerNameForOrder = addrResult.value.name
            }
            const a = addrResult.value.address
            provinceForOrder = (a.state as ProvinceCode) || provinceForOrder
            shippingForOrder = {
              line1:      a.line1,
              city:       a.city,
              province:   a.state || provinceForOrder,
              postalCode: a.postal_code,
            }
            if (a.state) {
              setProvince(a.state as ProvinceCode)
            }
          }
        }

        const confirmRes = await fetch('/api/confirm-order', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            customerName:    customerNameForOrder,
            customerEmail:   email,
            shippingAddress: shippingForOrder,
            province:        provinceForOrder,
            items,
          }),
        })

        const confirmData: { orderId?: string } = await confirmRes.json()
        clearCart()
        setIsLoading(false)
        router.push(
          `/order-confirmation?orderId=${confirmData.orderId}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(fullName || email)}`
        )
      } else {
        setIsLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      display:       'flex',
      flexDirection: isMobile ? 'column' : 'row',
      minHeight:     'calc(100dvh - 60px)',
      maxWidth:      '1400px',
      margin:        '0 auto',
      width:         '100%',
    }}>
      {/* Left — steps */}
      <div style={{
        flex:        1,
        padding:     'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem)',
        borderRight: isMobile ? 'none' : '0.5px solid #E8E4DE',
      }}>

        {/* Mobile order summary */}
        {isMobile && (
          <OrderSummary items={items} province={province} total={total} isMobile />
        )}

        {/* Step indicators */}
        <div style={{
          display:       'flex',
          alignItems:    'center',
          gap:           '1rem',
          marginBottom:  '2.5rem',
          flexWrap:      'wrap',
        }}>
          {stepIndicator(1, 'Contact')}
          <div style={{ width: '2rem', height: '0.5px', backgroundColor: '#E8E4DE' }} />
          {stepIndicator(2, 'Shipping')}
          <div style={{ width: '2rem', height: '0.5px', backgroundColor: '#E8E4DE' }} />
          {stepIndicator(3, 'Payment')}
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div>
            <h2 style={sectionHeadingStyle}>How would you like to continue?</h2>

            {/* Express checkout */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{
                fontFamily:    'var(--font-inter), system-ui, sans-serif',
                fontSize:      '0.625rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color:         'rgba(13,12,10,0.6)',
                textAlign:     'center',
                marginBottom:  '1rem',
              }}>
                Express Checkout
              </p>
              <ExpressCheckoutElement
                onConfirm={async (event) => {
                  if (!stripe || !elements) return
                  const { error: expressError } = await stripe.confirmPayment({
                    elements,
                    redirect: 'if_required',
                    confirmParams: {
                      return_url: `${window.location.origin}/order-confirmation`,
                    },
                  })
                  if (expressError) {
                    setError(expressError.message ?? 'Express checkout failed')
                    event.paymentFailed({ message: expressError.message })
                  }
                }}
                options={{
                  buttonHeight: 52,
                  buttonTheme: {
                    applePay:  'black',
                    googlePay: 'black',
                  },
                }}
              />
            </div>

            {/* Divider */}
            <div style={{
              display:      'flex',
              alignItems:   'center',
              gap:          '1rem',
              marginBottom: '2rem',
            }}>
              <div style={{ flex: 1, height: '0.5px', backgroundColor: '#E8E4DE' }} />
              <span style={{
                fontFamily:    'var(--font-inter), system-ui, sans-serif',
                fontSize:      '0.625rem',
                letterSpacing: '0.1em',
                color:         'rgba(13,12,10,0.55)',
                textTransform: 'uppercase',
              }}>or continue with email</span>
              <div style={{ flex: 1, height: '0.5px', backgroundColor: '#E8E4DE' }} />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle} htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="your@email.com"
              />
            </div>

            {/* Continue as guest */}
            <button
              onClick={() => {
                if (!email || !email.includes('@')) {
                  setError('Please enter a valid email address')
                  return
                }
                setError(null)
                setStep(2)
              }}
              style={{
                width:           '100%',
                padding:         '0.9375rem',
                backgroundColor: '#0D0C0A',
                color:           '#F5F2EC',
                fontFamily:      'var(--font-inter), system-ui, sans-serif',
                fontSize:        '0.625rem',
                fontWeight:      500,
                letterSpacing:   '0.2em',
                textTransform:   'uppercase',
                border:          'none',
                cursor:          'pointer',
                marginBottom:    '0.75rem',
                transition:      `opacity 200ms ${EASE}`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
            >
              Continue as Guest
            </button>

            {/* Login with Google placeholder */}
            <button
              onClick={() => {}}
              style={{
                width:           '100%',
                padding:         '0.9375rem',
                backgroundColor: 'transparent',
                color:           'rgba(13,12,10,0.65)',
                fontFamily:      'var(--font-inter), system-ui, sans-serif',
                fontSize:        '0.625rem',
                fontWeight:      400,
                letterSpacing:   '0.12em',
                textTransform:   'uppercase',
                border:          '0.5px solid #D4CFC8',
                cursor:          'pointer',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                gap:             '0.75rem',
                transition:      `all 200ms ${EASE}`,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Login with Google
            </button>

            {error && (
              <p style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontSize:   '0.8125rem',
                color:      'rgba(180,40,40,0.85)',
                marginTop:  '0.75rem',
              }}>{error}</p>
            )}
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div>
            <h2 style={sectionHeadingStyle}>Shipping Details</h2>

            {/* Stripe Address Element — handles autocomplete */}
            <div style={{ marginBottom: '2rem' }}>
              <AddressElement
                options={{
                  mode: 'shipping',
                  allowedCountries: ['CA'],
                  fields: {
                    phone: 'never',
                  },
                }}
                onChange={(event) => {
                  if (event.complete) {
                    const addr = event.value.address
                    const name = event.value.name
                    if (addr.state) setProvince(addr.state as ProvinceCode)
                    if (name) setFullName(name)
                  }
                }}
              />
            </div>

            {/* Continue */}
            <button
              onClick={() => {
                setError(null)
                setStep(3)
              }}
              style={{
                width:           '100%',
                padding:         '0.9375rem',
                backgroundColor: '#0D0C0A',
                color:           '#F5F2EC',
                fontFamily:      'var(--font-inter), system-ui, sans-serif',
                fontSize:        '0.625rem',
                fontWeight:      500,
                letterSpacing:   '0.2em',
                textTransform:   'uppercase',
                border:          'none',
                cursor:          'pointer',
                marginBottom:    '0.75rem',
                transition:      `opacity 200ms ${EASE}`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
            >
              Continue to Payment
            </button>

            <button
              onClick={() => { setError(null); setStep(1) }}
              style={{
                width:      '100%',
                padding:    '0.75rem',
                background: 'none',
                border:     'none',
                cursor:     'pointer',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontSize:   '0.625rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color:      'rgba(13,12,10,0.6)',
                textDecoration: 'underline',
              }}
            >
              ← Back
            </button>

            {error && (
              <p style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontSize:   '0.8125rem',
                color:      'rgba(180,40,40,0.85)',
                marginTop:  '0.75rem',
              }}>{error}</p>
            )}
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <h2 style={sectionHeadingStyle}>Payment</h2>

            <div style={{ marginBottom: '2rem' }}>
              <PaymentElement
                options={{
                  layout: 'tabs',
                  fields: {
                    billingDetails: {
                      name:    'never',
                      email:   'never',
                      address: 'never',
                    },
                  },
                }}
              />
            </div>

            {error && (
              <div style={{
                padding:         '0.875rem',
                backgroundColor: 'rgba(180,40,40,0.06)',
                border:          '0.5px solid rgba(180,40,40,0.2)',
                marginBottom:    '1.25rem',
              }}>
                <p style={{
                  fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  fontSize:   '0.8125rem',
                  color:      'rgba(180,40,40,0.85)',
                  lineHeight: 1.5,
                }}>
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !stripe || !elements}
              style={{
                width:           '100%',
                padding:         '1rem',
                backgroundColor: isLoading ? 'rgba(13,12,10,0.5)' : '#0D0C0A',
                color:           '#F5F2EC',
                fontFamily:      'var(--font-inter), system-ui, sans-serif',
                fontSize:        '0.625rem',
                fontWeight:      500,
                letterSpacing:   '0.2em',
                textTransform:   'uppercase',
                border:          'none',
                cursor:          isLoading ? 'not-allowed' : 'pointer',
                marginBottom:    '0.75rem',
                transition:      `background-color 200ms ${EASE}`,
              }}
            >
              {isLoading ? 'Processing...' : `Place Order — $${total.toLocaleString()} CAD`}
            </button>

            <button
              type="button"
              onClick={() => { setError(null); setStep(2) }}
              style={{
                width:         '100%',
                padding:       '0.75rem',
                background:    'none',
                border:        'none',
                cursor:        'pointer',
                fontFamily:    'var(--font-inter), system-ui, sans-serif',
                fontSize:      '0.625rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color:         'rgba(13,12,10,0.6)',
                textDecoration:'underline',
                marginBottom:  '1rem',
              }}
            >
              ← Back
            </button>

            <p style={{
              fontFamily:    'var(--font-inter), system-ui, sans-serif',
              fontSize:      '0.5625rem',
              color:         'rgba(13,12,10,0.55)',
              textAlign:     'center',
              lineHeight:    1.6,
              letterSpacing: '0.02em',
            }}>
              By placing your order you agree to our{' '}
              <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms</span>
              {' '}and{' '}
              <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>.
              All jackets are made to order and non-refundable.
            </p>
          </form>
        )}
      </div>

      {/* Right — order summary desktop only */}
      {!isMobile && (
        <div style={{ width: 'clamp(380px, 44vw, 520px)', flexShrink: 0 }}>
          <OrderSummary items={items} province={province} total={total} />
        </div>
      )}
    </div>
  )
}
