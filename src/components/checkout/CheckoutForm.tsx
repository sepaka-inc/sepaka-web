'use client'

import { useState, useEffect, useRef, type CSSProperties, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  useStripe,
  useElements,
  PaymentElement,
  ExpressCheckoutElement,
} from '@stripe/react-stripe-js'
import { useCart } from '@/context/CartContext'
import { ProvinceCode, PROVINCE_NAMES } from '@/lib/tax'
import OrderSummary from './OrderSummary'

const EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

type Step = 1 | 2 | 3

const PROVINCES = Object.entries(PROVINCE_NAMES) as [ProvinceCode, string][]

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

const autofillShieldStyle: CSSProperties = {
  WebkitBoxShadow:     '0 0 0 1000px #ffffff inset',
  WebkitTextFillColor: '#0D0C0A',
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
  const { items } = useCart()

  const [step,       setStep]       = useState<Step>(1)
  const [isMobile,   setIsMobile]   = useState(false)
  const [isLoading,  setIsLoading]  = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  // Step 1
  const [email,      setEmail]      = useState('')

  // Step 2
  const [firstName,  setFirstName]  = useState('')
  const [lastName,   setLastName]   = useState('')
  const [address,    setAddress]    = useState('')
  const [city,       setCity]       = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [addressSuggestions, setAddressSuggestions] = useState<{
    display: string
    city: string
    province: string
    postalCode: string
  }[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const addressDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [province,   setProvince]   = useState<ProvinceCode | ''>('')

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const stepIndicator = (n: Step, label: string) => {
    const isCompleted = n < step
    return (
      <div
        onClick={isCompleted ? () => { setError(null); setStep(n) } : undefined}
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        '0.5rem',
          cursor:     isCompleted ? 'pointer' : 'default',
          transition: 'opacity 200ms ease',
        }}
        onMouseEnter={isCompleted ? e => { e.currentTarget.style.opacity = '0.7' } : undefined}
        onMouseLeave={isCompleted ? e => { e.currentTarget.style.opacity = '1' } : undefined}
      >
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
        fontSize:      isMobile ? '0.5rem' : '0.625rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color:         step === n ? '#0D0C0A' : step > n ? '#8B5E3C' : 'rgba(13,12,10,0.55)',
        transition:    `color 300ms ${EASE}`,
      }}>{label}</span>
      </div>
    )
  }

  const handleContinueAsGuest = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    setError(null)
    setStep(2)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    console.log('handleSubmit fired', { stripe: !!stripe, elements: !!elements })
    if (!stripe || !elements) {
      console.error('Stripe not ready:', { stripe: !!stripe, elements: !!elements })
      setError('Payment system not ready. Please refresh and try again.')
      return
    }

    setIsLoading(true)
    setError(null)

    const customerFullName = `${firstName} ${lastName}`.trim()

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
          payment_method_data: {
            billing_details: {
              name:  customerFullName || email,
              email,
              address: {
                country:     'CA',
                line1:       address,
                city,
                state:       province,
                postal_code: postalCode,
              },
            },
          },
        },
        redirect: 'if_required',
      })

      if (error) {
        setError(error.message ?? 'Payment failed. Please try again.')
        setIsLoading(false)
        return
      }

      console.log('PaymentIntent status:', paymentIntent?.status)

      if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_capture')) {
        console.log('Calling confirm-order API...')
        const confirmRes = await fetch('/api/confirm-order', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            customerName:    customerFullName || email,
            customerEmail:   email,
            shippingAddress: {
              line1:      address,
              city,
              province:   province as ProvinceCode,
              postalCode,
            },
            province: province as ProvinceCode,
            items,
          }),
        })

        if (!confirmRes.ok) {
          const errData = await confirmRes.json()
          console.error('confirm-order failed:', errData)
          setError('Order confirmation failed. Please contact hello@sepaka.ca')
          setIsLoading(false)
          return
        }

        const confirmData: { orderId?: string } = await confirmRes.json()
        console.log('confirm-order response:', confirmData)

        if (!confirmData.orderId) {
          console.log('confirmData.orderId is undefined:', confirmData)
        }

        const orderId = confirmData.orderId ?? 'unknown'
        setIsLoading(false)
        router.push(
          `/order-confirmation?orderId=${orderId}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(customerFullName || email)}`
        )
      } else {
        console.log('Unexpected paymentIntent status:', paymentIntent?.status)
        setIsLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  const searchAddress = async (query: string) => {
    if (query.length < 4) {
      setAddressSuggestions([])
      setShowSuggestions(false)
      return
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', Canada')}&format=json&addressdetails=1&limit=5&countrycodes=ca`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent':       'SEPAKA/1.0 (hello@sepaka.ca)',
          },
        }
      )
      const data: {
        display_name: string
        address?: {
          house_number?: string
          road?: string
          pedestrian?: string
          footway?: string
          state?: string
          city?: string
          town?: string
          village?: string
          municipality?: string
          postcode?: string
        }
      }[] = await res.json()
      const provinceMap: Record<string, string> = {
        'Alberta':                    'AB',
        'British Columbia':           'BC',
        'Manitoba':                   'MB',
        'New Brunswick':              'NB',
        'Newfoundland and Labrador':  'NL',
        'Nova Scotia':                'NS',
        'Northwest Territories':      'NT',
        'Nunavut':                    'NU',
        'Ontario':                    'ON',
        'Prince Edward Island':       'PE',
        'Quebec':                     'QC',
        'Saskatchewan':               'SK',
        'Yukon':                      'YT',
      }
      const suggestions = data
        .filter(item => item.address)
        .map(item => {
          const a = item.address!
          const streetNumber = a.house_number || ''
          const streetName   = a.road || a.pedestrian || a.footway || ''
          const displayLine  = [streetNumber, streetName].filter(Boolean).join(' ')
            || item.display_name.split(',')[0]
          const provinceCode = provinceMap[a.state ?? ''] || 'AB'
          return {
            display:    displayLine,
            city:       a.city || a.town || a.village || a.municipality || '',
            province:   provinceCode,
            postalCode: a.postcode?.replace(' ', '') || '',
          }
        })
        .filter(s => s.display)
      setAddressSuggestions(suggestions)
      setShowSuggestions(suggestions.length > 0)
    } catch {
      setAddressSuggestions([])
      setShowSuggestions(false)
    }
  }

  return (
    <>
    <style>{`
      @media (max-width: 768px) {
        .checkout-wrapper {
          flex-direction: column !important;
        }
        .checkout-summary {
          width: 100% !important;
        }
      }
    `}</style>
    <div
      className="checkout-wrapper"
      style={{
        display:       'flex',
        flexDirection: 'row',
        alignItems:    'flex-start',
        gap:           '64px',
        maxWidth:      '1200px',
        margin:        '0 auto',
        padding:       '60px 40px',
      }}
    >
      {/* Left — steps */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Step indicators */}
        <div style={{
          display:       'flex',
          alignItems:    'center',
          gap:           isMobile ? '0.5rem' : '1rem',
          marginBottom:  '2.5rem',
          flexWrap:      'nowrap',
          overflowX:     'auto',
        }}>
          {stepIndicator(1, 'Contact')}
          <div style={{ width: isMobile ? '1rem' : '2rem', height: '0.5px', backgroundColor: '#E8E4DE', flexShrink: 0 }} />
          {stepIndicator(2, 'Shipping')}
          <div style={{ width: isMobile ? '1rem' : '2rem', height: '0.5px', backgroundColor: '#E8E4DE', flexShrink: 0 }} />
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
                onKeyDown={e => {
                  if (e.key === 'Enter') handleContinueAsGuest()
                }}
                style={inputStyle}
                placeholder="your@email.com"
              />
            </div>

            {/* Continue as guest */}
            <button
              onClick={handleContinueAsGuest}
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
                padding:         '0.9375rem clamp(0.75rem, 3vw, 1.5rem)',
                backgroundColor: 'transparent',
                color:           'rgba(13,12,10,0.65)',
                fontFamily:      'var(--font-inter), system-ui, sans-serif',
                fontSize:        'clamp(0.5625rem, 1.5vw, 0.625rem)',
                fontWeight:      400,
                letterSpacing:   '0.1em',
                textTransform:   'uppercase',
                border:          '0.5px solid #D4CFC8',
                cursor:          'pointer',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                gap:             '0.5rem',
                transition:      `all 200ms ${EASE}`,
                whiteSpace:      'nowrap',
                overflow:        'hidden',
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

            {/* First + Last name side by side */}
            <div style={{
              display:             'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap:                 '1.25rem',
              marginBottom:        '1.5rem',
            }}>
              <div>
                <label style={labelStyle} htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  style={{ ...inputStyle, ...autofillShieldStyle }}
                  placeholder=""
                  autoComplete="new-password"
                  autoCorrect="off"
                  readOnly
                  onFocus={e => e.currentTarget.removeAttribute('readonly')}
                />
              </div>
              <div>
                <label style={labelStyle} htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  style={{ ...inputStyle, ...autofillShieldStyle }}
                  placeholder=""
                  autoComplete="new-password"
                  autoCorrect="off"
                  readOnly
                  onFocus={e => e.currentTarget.removeAttribute('readonly')}
                />
              </div>
            </div>

            {/* Address fields */}
            <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
              <label style={labelStyle} htmlFor="address">Street Address</label>
              <input
                id="address"
                type="text"
                required
                value={address}
                onChange={e => {
                  const val = e.target.value
                  setAddress(val)
                  if (addressDebounceRef.current) clearTimeout(addressDebounceRef.current)
                  addressDebounceRef.current = setTimeout(() => searchAddress(val), 350)
                }}
                onFocus={() => { if (addressSuggestions.length > 0) setShowSuggestions(true) }}
                onBlur={() => { setTimeout(() => setShowSuggestions(false), 150) }}
                style={inputStyle}
                placeholder="Start typing your address..."
                autoComplete="off"
              />

              {showSuggestions && addressSuggestions.length > 0 && (
                <div style={{
                  position:        'absolute',
                  top:             '100%',
                  left:            0,
                  right:           0,
                  backgroundColor: '#FFFFFF',
                  border:          '0.5px solid #D4CFC8',
                  borderTop:       'none',
                  zIndex:          100,
                  boxShadow:       '0 4px 16px rgba(13,12,10,0.08)',
                }}>
                  {addressSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      type="button"
                      onMouseDown={() => {
                        setAddress(suggestion.display)
                        if (suggestion.city)       setCity(suggestion.city)
                        if (suggestion.province)   setProvince(suggestion.province as ProvinceCode)
                        if (suggestion.postalCode) setPostalCode(suggestion.postalCode)
                        setShowSuggestions(false)
                      }}
                      style={{
                        width:           '100%',
                        padding:         '0.75rem 1rem',
                        textAlign:       'left',
                        background:      'none',
                        border:          'none',
                        borderBottom:    i < addressSuggestions.length - 1
                          ? '0.5px solid #F0EDE7'
                          : 'none',
                        cursor:          'pointer',
                        fontFamily:      'var(--font-inter), system-ui, sans-serif',
                        fontSize:        '0.8125rem',
                        color:           '#0D0C0A',
                        letterSpacing:   '0.01em',
                        transition:      'background-color 150ms ease',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F5F2EC'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                      }}
                    >
                      <span style={{ display: 'block' }}>{suggestion.display}</span>
                      <span style={{
                        fontFamily:  'var(--font-inter), system-ui, sans-serif',
                        fontSize:    '0.6875rem',
                        color:       'rgba(13,12,10,0.5)',
                        marginTop:   '2px',
                        display:     'block',
                      }}>
                        {[suggestion.city, suggestion.province, 'Canada'].filter(Boolean).join(', ')}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{
              display:             'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap:                 '1.25rem',
              marginBottom:        '1.25rem',
            }}>
              <div>
                <label style={labelStyle} htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  style={{ ...inputStyle, ...autofillShieldStyle }}
                  placeholder=""
                  autoComplete="new-password"
                  autoCorrect="off"
                  readOnly
                  onFocus={e => e.currentTarget.removeAttribute('readonly')}
                />
              </div>
              <div>
                <label style={labelStyle} htmlFor="province">Province</label>
                <select
                  id="province"
                  required
                  value={province}
                  onChange={e => setProvince(e.target.value as ProvinceCode)}
                  style={{
                    ...inputStyle,
                    cursor:             'pointer',
                    appearance:         'none',
                    WebkitAppearance:   'none',
                    backgroundImage:    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%230D0C0A' stroke-width='1' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat:   'no-repeat',
                    backgroundPosition: 'right 0 center',
                    paddingRight:       '1.5rem',
                    color:              province ? '#0D0C0A' : 'rgba(13,12,10,0.4)',
                  }}
                >
                  <option value="" disabled>Select province</option>
                  {PROVINCES.map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={labelStyle} htmlFor="postalCode">Postal Code</label>
              <input
                id="postalCode"
                type="text"
                required
                value={postalCode}
                onChange={e => setPostalCode(e.target.value.toUpperCase())}
                style={{ ...inputStyle, ...autofillShieldStyle }}
                placeholder=""
                maxLength={7}
                autoComplete="new-password"
                autoCorrect="off"
                readOnly
                onFocus={e => e.currentTarget.removeAttribute('readonly')}
              />
            </div>

            {/* Continue */}
            <button
              onClick={() => {
                if (!firstName || !lastName) {
                  setError('Please enter your first and last name')
                  return
                }
                if (!address || !city || !postalCode) {
                  setError('Please complete your shipping address')
                  return
                }
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
                width:          '100%',
                padding:        '0.75rem',
                background:     'none',
                border:         'none',
                cursor:         'pointer',
                fontFamily:     'var(--font-inter), system-ui, sans-serif',
                fontSize:       '0.625rem',
                letterSpacing:  '0.1em',
                textTransform:  'uppercase',
                color:          'rgba(13,12,10,0.6)',
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

      {/* Right — order summary */}
      <div className="checkout-summary" style={{ width: '420px', flexShrink: 0 }}>
        <OrderSummary items={items} province={province || null} total={total} />
      </div>
    </div>
    </>
  )
}
