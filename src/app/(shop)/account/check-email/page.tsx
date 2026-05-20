'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { brandConfig } from '@/config/brand'

function CheckEmailContent() {
  const params = useSearchParams()
  const email = params.get('email') ?? ''

  return (
    <main style={{
      backgroundColor: '#FFFFFF',
      minHeight: '100dvh',
      paddingTop: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        padding: 'clamp(2rem, 6vw, 3rem)',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: brandConfig.fonts.display,
          fontSize: '0.75rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: brandConfig.colors.text,
          margin: '0 0 16px',
        }}>SEPAKA</p>

        <div style={{
          width: '40px', height: '0.5px',
          backgroundColor: brandConfig.colors.accent,
          margin: '0 auto 32px',
        }} />

        <div style={{
          width: '64px', height: '64px',
          borderRadius: '50%',
          backgroundColor: brandConfig.colors.cream,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
          border: `1px solid rgba(139,94,60,0.2)`,
        }}>
          <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
            <rect x="1" y="1" width="22" height="18" rx="1" stroke="#8B5E3C" strokeWidth="1.5"/>
            <path d="M1 5L12 12L23 5" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 style={{
          fontFamily: brandConfig.fonts.display,
          fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
          fontWeight: 400,
          color: brandConfig.colors.text,
          letterSpacing: '-0.02em',
          margin: '0 0 16px',
        }}>Check your inbox.</h1>

        <p style={{
          fontFamily: brandConfig.fonts.ui,
          fontSize: '0.9375rem',
          color: brandConfig.colors.textMuted,
          lineHeight: 1.7,
          margin: '0 0 8px',
        }}>
          We&apos;ve sent a private link to
        </p>
        <p style={{
          fontFamily: brandConfig.fonts.ui,
          fontSize: '0.9375rem',
          color: brandConfig.colors.text,
          fontWeight: 500,
          margin: '0 0 24px',
        }}>{decodeURIComponent(email)}</p>

        <p style={{
          fontFamily: brandConfig.fonts.display,
          fontSize: '0.875rem',
          fontStyle: 'italic',
          color: brandConfig.colors.textSubtle,
          margin: '0 0 32px',
          lineHeight: 1.7,
        }}>
          It will expire in one hour.
        </p>

        <div style={{
          width: '40px', height: '0.5px',
          backgroundColor: brandConfig.colors.accent,
          margin: '0 auto 24px',
        }} />

        <p style={{
          fontFamily: brandConfig.fonts.ui,
          fontSize: '0.75rem',
          color: brandConfig.colors.textMuted,
          margin: 0,
        }}>
          Didn&apos;t receive it?{' '}
          <Link
            href="/account/login"
            style={{ color: brandConfig.colors.text, textDecoration: 'underline' }}
          >
            Try again
          </Link>
        </p>
      </div>
    </main>
  )
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={null}>
      <CheckEmailContent />
    </Suspense>
  )
}
