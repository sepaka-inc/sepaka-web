'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { brandConfig } from '@/config/brand'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

const STATUS_LABELS: Record<string, string> = {
  confirmed:     'Order received',
  in_production: 'Now in production',
  cutting:       'Week 1–2 · Leather selection & cutting',
  stitching:     'Week 2–4 · Hand stitching & assembly',
  finishing:     'Week 4–6 · Finishing & quality control',
  shipped:       'On its way to you',
  delivered:     'Welcome to the family',
}

interface Order {
  id: string
  created_at: string
  items: Array<{
    name: string
    variantName: string
    slug: string
    size: string
    price: number
    quantity: number
  }>
  total: number
  order_status: string
}

interface Profile {
  first_name: string | null
  last_name: string | null
}

interface Address {
  id: string
  line1: string
  city: string
  province: string
  postal_code: string
  is_default: boolean
}

interface Preferences {
  production_updates: boolean
  care_guides: boolean
  new_arrivals: boolean
}

export default function AccountPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [address, setAddress] = useState<Address | null>(null)
  const [preferences, setPreferences] = useState<Preferences>({
    production_updates: true,
    care_guides: true,
    new_arrivals: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getProductImageUrl = (slug: string, variantName: string): string => {
    const productKey = slug.replace('the-', '')
    const colorKey = variantName?.toLowerCase().includes('black') ? 'black' :
                     variantName?.toLowerCase().includes('brown') ? 'brown' :
                     variantName?.toLowerCase().includes('camel') ? 'brown' : 'black'
    return `/images/products/${productKey}-${colorKey}.jpg`
  }

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/account/login'); return }
      setUser(user)

      const [profileRes, addressRes, prefsRes, ordersResponse] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('addresses').select('*').eq('user_id', user.id).eq('is_default', true).single(),
        supabase.from('preferences').select('*').eq('user_id', user.id).single(),
        fetch('/api/account/orders').then(r => r.json()),
      ])

      // Auto-create profile if it doesn't exist (magic link users)
      if (!profileRes.data) {
        // Only create profile if it truly doesn't exist
        const nameFromMeta = user.user_metadata?.full_name ?? ''
        const parts = nameFromMeta.split(' ')
        const autoFirst = user.user_metadata?.first_name ?? parts[0] ?? ''
        const autoLast = user.user_metadata?.last_name ?? parts.slice(1).join(' ') ?? ''
        const { error: profileInsertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            first_name: autoFirst || null,
            last_name: autoLast || null,
          })
        if (profileInsertError) console.error('Profile insert error:', JSON.stringify(profileInsertError))
        setProfile({ first_name: autoFirst || null, last_name: autoLast || null })
        setFirstName(autoFirst)
        setLastName(autoLast)
      } else {
        setProfile(profileRes.data)
        setFirstName(profileRes.data.first_name ?? '')
        setLastName(profileRes.data.last_name ?? '')
      }

      if (ordersResponse.orders) setOrders(ordersResponse.orders)
      if (addressRes.data) setAddress(addressRes.data)
      if (prefsRes.data) setPreferences(prefsRes.data)
      setIsLoading(false)
    }
    load()
  }, [])

  const handleSaveProfile = async () => {
    if (!user) return
    setSavingProfile(true)
    await supabase.from('profiles').upsert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      updated_at: new Date().toISOString(),
    })
    setProfile({ first_name: firstName, last_name: lastName })
    setEditingProfile(false)
    setSavingProfile(false)
  }

  const handleTogglePref = async (key: keyof Preferences) => {
    if (!user) return
    const updated = { ...preferences, [key]: !preferences[key] }
    setPreferences(updated)
    await supabase.from('preferences').upsert({
      user_id: user.id,
      ...updated,
      updated_at: new Date().toISOString(),
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const sectionLabelStyle = {
    fontFamily: brandConfig.fonts.ui,
    fontSize: '0.625rem',
    fontWeight: 600,
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    color: brandConfig.colors.textSubtle,
    margin: '0 0 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }

  const bronzeDot = (
    <div style={{
      width: '4px', height: '4px',
      borderRadius: '50%',
      backgroundColor: brandConfig.colors.accent,
      flexShrink: 0,
    }} />
  )

  const divider = (
    <div style={{
      width: '40px', height: '0.5px',
      backgroundColor: brandConfig.colors.accent,
      margin: '40px auto',
    }} />
  )

  if (isLoading) {
    return (
      <main style={{
        backgroundColor: '#FFFFFF',
        minHeight: '100dvh',
        paddingTop: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{
          fontFamily: brandConfig.fonts.display,
          fontSize: '0.875rem',
          fontStyle: 'italic',
          color: brandConfig.colors.textSubtle,
        }}>Loading your account...</p>
      </main>
    )
  }

  const displayName = profile?.first_name || user?.email?.split('@')[0] || 'there'

  return (
    <main style={{
      backgroundColor: '#FFFFFF',
      minHeight: '100dvh',
      paddingTop: '80px',
      paddingBottom: '80px',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(2rem, 6vw, 4rem)',
      }}>

        {/* Wordmark */}
        <p style={{
          fontFamily: brandConfig.fonts.display,
          fontSize: '0.75rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: brandConfig.colors.text,
          margin: '0 0 16px',
          textAlign: 'center',
        }}>SEPAKA</p>

        <div style={{
          width: '40px', height: '0.5px',
          backgroundColor: brandConfig.colors.accent,
          margin: '0 auto 32px',
        }} />

        {/* Greeting */}
        <h1 style={{
          fontFamily: brandConfig.fonts.display,
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 400,
          color: brandConfig.colors.text,
          letterSpacing: '-0.02em',
          margin: '0 0 32px',
          textAlign: 'center',
        }}>{getGreeting()}, {displayName}.</h1>

        {divider}

        {/* YOUR COLLECTION */}
        <div style={{ marginBottom: '8px' }}>
          <div style={sectionLabelStyle}>{bronzeDot} Your Collection</div>

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{
                fontFamily: brandConfig.fonts.display,
                fontSize: '1rem',
                fontStyle: 'italic',
                color: brandConfig.colors.textSubtle,
                margin: '0 0 20px',
              }}>Your collection is waiting to begin.</p>
              <Link href="/shop" style={{
                fontFamily: brandConfig.fonts.ui,
                fontSize: '0.625rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: brandConfig.colors.text,
                textDecoration: 'underline',
              }}>Explore the collection</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map(order => (
                <div key={order.id} style={{
                  border: `0.5px solid #E8E4DE`,
                  padding: '20px',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                }}>
                  {order.items?.[0] && (
                    <img
                      src={getProductImageUrl(order.items[0].slug, order.items[0].variantName)}
                      alt={order.items[0].name}
                      style={{
                        width: '80px',
                        height: '98px',
                        objectFit: 'cover',
                        flexShrink: 0,
                        backgroundColor: brandConfig.colors.cream,
                      }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: brandConfig.fonts.display,
                      fontSize: '1rem',
                      color: brandConfig.colors.text,
                      margin: '0 0 4px',
                    }}>{order.items?.[0]?.name}</p>
                    <p style={{
                      fontFamily: brandConfig.fonts.ui,
                      fontSize: '0.8125rem',
                      color: brandConfig.colors.textMuted,
                      margin: '0 0 4px',
                    }}>{order.items?.[0]?.variantName} · Size {order.items?.[0]?.size}</p>
                    <p style={{
                      fontFamily: brandConfig.fonts.ui,
                      fontSize: '0.8125rem',
                      color: brandConfig.colors.text,
                      margin: '0 0 12px',
                    }}>${order.total?.toLocaleString('en-CA')} CAD</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '6px', height: '6px',
                        borderRadius: '50%',
                        backgroundColor: brandConfig.colors.accent,
                        flexShrink: 0,
                      }} />
                      <p style={{
                        fontFamily: brandConfig.fonts.ui,
                        fontSize: '0.75rem',
                        color: brandConfig.colors.accentMuted,
                        letterSpacing: '0.05em',
                        margin: 0,
                        textTransform: 'uppercase',
                      }}>{STATUS_LABELS[order.order_status] ?? order.order_status}</p>
                    </div>
                    <p style={{
                      fontFamily: brandConfig.fonts.ui,
                      fontSize: '0.6875rem',
                      color: brandConfig.colors.textSubtle,
                      margin: '6px 0 0',
                    }}>
                      Ordered {new Date(order.created_at).toLocaleDateString('en-CA', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {divider}

        {/* YOUR DETAILS */}
        <div style={{ marginBottom: '8px' }}>
          <div style={sectionLabelStyle}>{bronzeDot} Your Details</div>
          {!editingProfile ? (
            <div>
              <p style={{
                fontFamily: brandConfig.fonts.ui,
                fontSize: '0.9375rem',
                color: brandConfig.colors.text,
                margin: '0 0 4px',
              }}>
                {profile?.first_name && profile?.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : profile?.first_name ?? '—'}
              </p>
              <p style={{
                fontFamily: brandConfig.fonts.ui,
                fontSize: '0.9375rem',
                color: brandConfig.colors.textMuted,
                margin: '0 0 16px',
              }}>{user?.email}</p>
              <button
                onClick={() => setEditingProfile(true)}
                style={{
                  background: 'none', border: 'none',
                  fontFamily: brandConfig.fonts.ui,
                  fontSize: '0.75rem',
                  color: brandConfig.colors.textMuted,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >Edit details</button>
            </div>
          ) : (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '16px',
              }}>
                <div>
                  <label style={{
                    fontFamily: brandConfig.fonts.ui,
                    fontSize: '0.625rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: brandConfig.colors.textMuted,
                    display: 'block',
                    marginBottom: '8px',
                  }}>First Name</label>
                  <input
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0',
                      border: 'none',
                      borderBottom: `0.5px solid ${brandConfig.colors.text}`,
                      background: 'transparent',
                      fontFamily: brandConfig.fonts.ui,
                      fontSize: '0.9375rem',
                      color: brandConfig.colors.text,
                      outline: 'none',
                      boxSizing: 'border-box' as const,
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    fontFamily: brandConfig.fonts.ui,
                    fontSize: '0.625rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: brandConfig.colors.textMuted,
                    display: 'block',
                    marginBottom: '8px',
                  }}>Last Name</label>
                  <input
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0',
                      border: 'none',
                      borderBottom: `0.5px solid ${brandConfig.colors.text}`,
                      background: 'transparent',
                      fontFamily: brandConfig.fonts.ui,
                      fontSize: '0.9375rem',
                      color: brandConfig.colors.text,
                      outline: 'none',
                      boxSizing: 'border-box' as const,
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  style={{
                    padding: '0.625rem 1.5rem',
                    backgroundColor: brandConfig.colors.text,
                    color: brandConfig.colors.cream,
                    fontFamily: brandConfig.fonts.ui,
                    fontSize: '0.625rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >{savingProfile ? 'Saving...' : 'Save'}</button>
                <button
                  onClick={() => setEditingProfile(false)}
                  style={{
                    padding: '0.625rem 1.5rem',
                    backgroundColor: 'transparent',
                    color: brandConfig.colors.textMuted,
                    fontFamily: brandConfig.fonts.ui,
                    fontSize: '0.625rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    border: `0.5px solid #E8E4DE`,
                    cursor: 'pointer',
                  }}
                >Cancel</button>
              </div>
            </div>
          )}
        </div>

        {divider}

        {/* SAVED ADDRESS */}
        <div style={{ marginBottom: '8px' }}>
          <div style={sectionLabelStyle}>{bronzeDot} Saved Address</div>
          {address ? (
            <p style={{
              fontFamily: brandConfig.fonts.ui,
              fontSize: '0.9375rem',
              color: brandConfig.colors.text,
              lineHeight: 1.7,
              margin: 0,
            }}>
              {address.line1}<br />
              {address.city}, {address.province} {address.postal_code}
            </p>
          ) : (
            <p style={{
              fontFamily: brandConfig.fonts.display,
              fontSize: '0.9375rem',
              fontStyle: 'italic',
              color: brandConfig.colors.textSubtle,
              margin: 0,
            }}>
              No address saved yet. Your shipping address will be saved after your next order.
            </p>
          )}
        </div>

        {divider}

        {/* STAY CONNECTED */}
        <div style={{ marginBottom: '8px' }}>
          <div style={sectionLabelStyle}>{bronzeDot} Stay Connected</div>

          {[
            { key: 'production_updates' as const, label: 'Production updates', description: 'Updates at each stage of your jacket\'s journey' },
            { key: 'care_guides' as const, label: 'Care & patina guides', description: 'How to nurture your leather over the years' },
            { key: 'new_arrivals' as const, label: 'New arrivals', description: 'When new designs enter the collection' },
          ].map(pref => (
            <div key={pref.key} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 0',
              borderBottom: '0.5px solid #F0EDE8',
            }}>
              <div>
                <p style={{
                  fontFamily: brandConfig.fonts.ui,
                  fontSize: '0.875rem',
                  color: brandConfig.colors.text,
                  margin: '0 0 2px',
                }}>{pref.label}</p>
                <p style={{
                  fontFamily: brandConfig.fonts.ui,
                  fontSize: '0.75rem',
                  color: brandConfig.colors.textSubtle,
                  margin: 0,
                }}>{pref.description}</p>
              </div>
              <button
                onClick={() => handleTogglePref(pref.key)}
                style={{
                  width: '40px',
                  height: '22px',
                  borderRadius: '11px',
                  backgroundColor: preferences[pref.key] ? brandConfig.colors.accent : '#E8E4DE',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  flexShrink: 0,
                  transition: `background-color 200ms ${EASE}`,
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '3px',
                  left: preferences[pref.key] ? '21px' : '3px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  transition: `left 200ms ${EASE}`,
                }} />
              </button>
            </div>
          ))}

          <p style={{
            fontFamily: brandConfig.fonts.display,
            fontSize: '0.8125rem',
            fontStyle: 'italic',
            color: brandConfig.colors.textSubtle,
            lineHeight: 1.7,
            margin: '20px 0 0',
          }}>
            We believe in communication that means something. We will only reach out when there is something worth saying.
          </p>
        </div>

        {divider}

        {/* YOUR STORY */}
        <div style={{ marginBottom: '8px' }}>
          <div style={sectionLabelStyle}>{bronzeDot} Your Story</div>
          <p style={{
            fontFamily: brandConfig.fonts.display,
            fontSize: '0.9375rem',
            fontStyle: 'italic',
            color: brandConfig.colors.textSubtle,
            lineHeight: 1.8,
            margin: 0,
          }}>
            As your jacket ages, this space will tell its story.
          </p>
        </div>

        {divider}

        {/* Sign out */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleSignOut}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: brandConfig.fonts.ui,
              fontSize: '0.75rem',
              color: brandConfig.colors.textMuted,
              cursor: 'pointer',
              letterSpacing: '0.05em',
              textDecoration: 'underline',
              marginBottom: '24px',
              display: 'block',
              margin: '0 auto 24px',
            }}
          >Sign out</button>

          <p style={{
            fontFamily: brandConfig.fonts.ui,
            fontSize: '0.625rem',
            color: 'rgba(13,12,10,0.3)',
            letterSpacing: '0.08em',
            marginBottom: '4px',
          }}>SEPAKA · Calgary, Canada</p>
          <p style={{
            fontFamily: brandConfig.fonts.display,
            fontSize: '0.75rem',
            fontStyle: 'italic',
            color: 'rgba(13,12,10,0.3)',
            margin: 0,
          }}>{brandConfig.tagline}</p>
        </div>

      </div>
    </main>
  )
}
