'use client'
import { useState, type CSSProperties } from 'react'
import { createClient } from '@/lib/supabase-client'
import { brandConfig } from '@/config/brand'

const EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

type PanelView = 'login' | 'register' | 'check-email'

interface AuthPanelProps {
  isOpen: boolean
  onClose: () => void
  defaultView?: PanelView
}

export default function AuthPanel({ isOpen, onClose, defaultView = 'login' }: AuthPanelProps) {
  const [view, setView] = useState<PanelView>(defaultView)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const reset = () => {
    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
    setShowPassword(false)
    setError(null)
    setIsLoading(false)
  }

  const switchView = (v: PanelView) => {
    reset()
    setView(v)
  }

  const handleMagicLink = async () => {
    if (!email || !email.includes('@')) { setError('Please enter a valid email address.'); return }
    setIsLoading(true); setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/account/callback` },
    })
    if (error) { setError(error.message); setIsLoading(false); return }
    setView('check-email')
    setIsLoading(false)
  }

  const handlePassword = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setIsLoading(true); setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Invalid email or password.'); setIsLoading(false); return }
    onClose()
    window.location.reload()
  }

  const handleRegister = async () => {
    if (!firstName || !email || !password) { setError('Please fill in all required fields.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setIsLoading(true); setError(null)
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/account/callback`,
        data: { first_name: firstName, last_name: lastName },
      },
    })
    if (signUpError) { setError(signUpError.message); setIsLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        first_name: firstName,
        last_name: lastName,
      })
    }
    setView('check-email')
    setIsLoading(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/account/callback` },
    })
  }

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '0.75rem 0',
    border: 'none',
    borderBottom: `0.5px solid ${brandConfig.colors.text}`,
    background: 'transparent',
    fontFamily: brandConfig.fonts.ui,
    fontSize: '0.9375rem',
    color: brandConfig.colors.text,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: CSSProperties = {
    fontFamily: brandConfig.fonts.ui,
    fontSize: '0.625rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: brandConfig.colors.textMuted,
    display: 'block',
    marginBottom: '8px',
  }

  const googleButton = (
    <button
      onClick={handleGoogle}
      style={{
        width: '100%',
        padding: '0.875rem',
        backgroundColor: 'transparent',
        border: `0.5px solid ${brandConfig.colors.text}`,
        color: brandConfig.colors.text,
        fontFamily: brandConfig.fonts.ui,
        fontSize: '0.8125rem',
        letterSpacing: '0.05em',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '16px',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Continue with Google
    </button>
  )

  const orDivider = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
      <div style={{ flex: 1, height: '0.5px', backgroundColor: '#E8E4DE' }} />
      <span style={{
        fontFamily: brandConfig.fonts.ui,
        fontSize: '0.625rem',
        letterSpacing: '0.1em',
        color: brandConfig.colors.textSubtle,
        textTransform: 'uppercase',
      }}>or</span>
      <div style={{ flex: 1, height: '0.5px', backgroundColor: '#E8E4DE' }} />
    </div>
  )

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(13,12,10,0.3)',
            zIndex: 998,
            transition: `opacity 300ms ${EASE}`,
          }}
        />
      )}

      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'clamp(360px, 42vw, 520px)',
        backgroundColor: '#F5F2EC',
        zIndex: 999,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: `transform 420ms ${EASE}`,
        display: 'flex',
        flexDirection: 'column',
        outline: 'none',
        borderLeft: '0.5px solid #E8E4DE',
        overflowY: 'auto',
        padding: '32px 40px 48px',
        boxSizing: 'border-box',
      }}>

        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: brandConfig.colors.textMuted,
            fontSize: '1.25rem',
            lineHeight: 1,
          }}
        >✕</button>

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

        {view === 'login' && (
          <>
            <h2 style={{
              fontFamily: brandConfig.fonts.display,
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 400,
              color: brandConfig.colors.text,
              letterSpacing: '-0.02em',
              margin: '0 0 8px',
              textAlign: 'center',
            }}>Welcome back.</h2>

            <p style={{
              fontFamily: brandConfig.fonts.display,
              fontSize: '0.9375rem',
              fontStyle: 'italic',
              color: brandConfig.colors.textSubtle,
              margin: '0 0 32px',
              textAlign: 'center',
            }}>{brandConfig.tagline}</p>

            <div style={{ width: '40px', height: '0.5px', backgroundColor: brandConfig.colors.accent, margin: '0 auto 32px' }} />

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (showPassword ? handlePassword() : handleMagicLink())}
                autoComplete="email"
                style={inputStyle}
              />
            </div>

            {showPassword && (
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handlePassword()}
                  autoComplete="current-password"
                  style={inputStyle}
                />
              </div>
            )}

            {error && (
              <p style={{ fontFamily: brandConfig.fonts.ui, fontSize: '0.8125rem', color: '#B42828', margin: '0 0 16px' }}>{error}</p>
            )}

            <button
              onClick={showPassword ? handlePassword : handleMagicLink}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: isLoading ? 'rgba(13,12,10,0.5)' : brandConfig.colors.text,
                color: brandConfig.colors.cream,
                fontFamily: brandConfig.fonts.ui,
                fontSize: '0.625rem',
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginBottom: '12px',
              }}
            >
              {isLoading ? 'Please wait...' : showPassword ? 'Sign In' : 'Send My Private Link'}
            </button>

            {!showPassword && (
              <p style={{
                fontFamily: brandConfig.fonts.display,
                fontSize: '0.8125rem',
                fontStyle: 'italic',
                color: brandConfig.colors.textSubtle,
                margin: '0 0 16px',
                textAlign: 'center',
                lineHeight: 1.6,
              }}>
                A link will arrive in your inbox within a few moments.
              </p>
            )}

            {orDivider}
            {googleButton}

            <button
              onClick={() => { setShowPassword(!showPassword); setError(null) }}
              style={{
                background: 'none', border: 'none',
                fontFamily: brandConfig.fonts.ui,
                fontSize: '0.75rem',
                color: brandConfig.colors.textMuted,
                cursor: 'pointer',
                textDecoration: 'underline',
                display: 'block',
                width: '100%',
                marginBottom: '32px',
              }}
            >
              {showPassword ? 'Send me a magic link instead' : 'Continue with password'}
            </button>

            <div style={{ width: '40px', height: '0.5px', backgroundColor: brandConfig.colors.accent, margin: '0 auto 24px' }} />

            <p style={{
              fontFamily: brandConfig.fonts.ui,
              fontSize: '0.8125rem',
              color: brandConfig.colors.textMuted,
              textAlign: 'center',
              margin: 0,
            }}>
              New to SEPAKA?{' '}
              <button
                onClick={() => switchView('register')}
                style={{
                  background: 'none', border: 'none',
                  fontFamily: brandConfig.fonts.ui,
                  fontSize: '0.8125rem',
                  color: brandConfig.colors.text,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >Join us</button>
            </p>
          </>
        )}

        {view === 'register' && (
          <>
            <h2 style={{
              fontFamily: brandConfig.fonts.display,
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 400,
              color: brandConfig.colors.text,
              letterSpacing: '-0.02em',
              margin: '0 0 8px',
              textAlign: 'center',
            }}>Join the family.</h2>

            <p style={{
              fontFamily: brandConfig.fonts.display,
              fontSize: '0.9375rem',
              fontStyle: 'italic',
              color: brandConfig.colors.textSubtle,
              margin: '0 0 32px',
              textAlign: 'center',
            }}>{brandConfig.tagline}</p>

            <div style={{ width: '40px', height: '0.5px', backgroundColor: brandConfig.colors.accent, margin: '0 auto 32px' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  readOnly
                  onFocus={e => e.currentTarget.removeAttribute('readonly')}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  readOnly
                  onFocus={e => e.currentTarget.removeAttribute('readonly')}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRegister()}
                autoComplete="new-password"
                style={inputStyle}
              />
              <p style={{
                fontFamily: brandConfig.fonts.ui,
                fontSize: '0.6875rem',
                color: brandConfig.colors.textSubtle,
                margin: '8px 0 0',
              }}>Minimum 8 characters</p>
            </div>

            {error && (
              <p style={{ fontFamily: brandConfig.fonts.ui, fontSize: '0.8125rem', color: '#B42828', margin: '0 0 16px' }}>{error}</p>
            )}

            <button
              onClick={handleRegister}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: isLoading ? 'rgba(13,12,10,0.5)' : brandConfig.colors.text,
                color: brandConfig.colors.cream,
                fontFamily: brandConfig.fonts.ui,
                fontSize: '0.625rem',
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
              }}
            >
              {isLoading ? 'Creating account...' : 'Create My Account'}
            </button>

            {orDivider}
            {googleButton}

            <div style={{ width: '40px', height: '0.5px', backgroundColor: brandConfig.colors.accent, margin: '0 auto 24px' }} />

            <p style={{
              fontFamily: brandConfig.fonts.ui,
              fontSize: '0.8125rem',
              color: brandConfig.colors.textMuted,
              textAlign: 'center',
              margin: 0,
            }}>
              Already a member?{' '}
              <button
                onClick={() => switchView('login')}
                style={{
                  background: 'none', border: 'none',
                  fontFamily: brandConfig.fonts.ui,
                  fontSize: '0.8125rem',
                  color: brandConfig.colors.text,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >Sign in</button>
            </p>
          </>
        )}

        {view === 'check-email' && (
          <>
            <div style={{
              width: '64px', height: '64px',
              borderRadius: '50%',
              backgroundColor: brandConfig.colors.cream,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              border: '1px solid rgba(139,94,60,0.2)',
            }}>
              <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                <rect x="1" y="1" width="22" height="18" rx="1" stroke="#8B5E3C" strokeWidth="1.5"/>
                <path d="M1 5L12 12L23 5" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>

            <h2 style={{
              fontFamily: brandConfig.fonts.display,
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 400,
              color: brandConfig.colors.text,
              letterSpacing: '-0.02em',
              margin: '0 0 16px',
              textAlign: 'center',
            }}>Check your inbox.</h2>

            <p style={{
              fontFamily: brandConfig.fonts.ui,
              fontSize: '0.9375rem',
              color: brandConfig.colors.textMuted,
              textAlign: 'center',
              lineHeight: 1.7,
              margin: '0 0 8px',
            }}>We&apos;ve sent a private link to</p>

            <p style={{
              fontFamily: brandConfig.fonts.ui,
              fontSize: '0.9375rem',
              color: brandConfig.colors.text,
              fontWeight: 500,
              textAlign: 'center',
              margin: '0 0 24px',
            }}>{email}</p>

            <p style={{
              fontFamily: brandConfig.fonts.display,
              fontSize: '0.875rem',
              fontStyle: 'italic',
              color: brandConfig.colors.textSubtle,
              textAlign: 'center',
              lineHeight: 1.7,
              margin: '0 0 32px',
            }}>It will expire in one hour.</p>

            <div style={{ width: '40px', height: '0.5px', backgroundColor: brandConfig.colors.accent, margin: '0 auto 24px' }} />

            <p style={{
              fontFamily: brandConfig.fonts.ui,
              fontSize: '0.75rem',
              color: brandConfig.colors.textMuted,
              textAlign: 'center',
              margin: 0,
            }}>
              Didn&apos;t receive it?{' '}
              <button
                onClick={() => switchView('login')}
                style={{
                  background: 'none', border: 'none',
                  fontFamily: brandConfig.fonts.ui,
                  fontSize: '0.75rem',
                  color: brandConfig.colors.text,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >Try again</button>
            </p>
          </>
        )}
      </div>
    </>
  )
}
