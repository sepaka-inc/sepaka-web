import Hero from '@/components/sections/Hero'

export default function HomePage() {
  return (
    <>
      <Hero />

      <section
        style={{
          backgroundColor: '#FFFFFF',
          padding: 'clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 6rem)',
          maxWidth: '1440px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#9A8878',
            marginBottom: '2rem',
          }}
        >
          The Collection
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-bodoni), Georgia, serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 400,
            color: '#0D0C0A',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            maxWidth: '600px',
            margin: '0 auto 3rem',
          }}
        >
          Five jackets. Ten expressions. One standard.
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginTop: '3rem',
          }}
        >
          {[
            'The Frontier',
            'The Warden',
            'The Nomad',
            'The Heir',
            'The Sentinel',
          ].map((name) => (
            <div
              key={name}
              style={{
                aspectRatio: '3/4',
                backgroundColor: '#F5F2EC',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '1.5rem',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-bodoni), Georgia, serif',
                  fontSize: '1.25rem',
                  fontWeight: 400,
                  color: '#0D0C0A',
                  margin: 0,
                }}
              >
                {name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          backgroundColor: '#F5F2EC',
          padding: 'clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 6rem)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#9A8878',
            marginBottom: '2rem',
          }}
        >
          Craftsmanship
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-bodoni), Georgia, serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 400,
            color: '#0D0C0A',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            maxWidth: '700px',
            margin: '0 auto',
          }}
        >
          Every jacket takes 14 hours to make.
        </h2>
      </section>

      <section
        style={{
          backgroundColor: '#FFFFFF',
          padding: 'clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 6rem)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#9A8878',
            marginBottom: '2rem',
          }}
        >
          Journal
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-bodoni), Georgia, serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 400,
            color: '#0D0C0A',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          The story behind the leather.
        </h2>
      </section>

      <footer
        style={{
          backgroundColor: '#0D0C0A',
          padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 6rem)',
          textAlign: 'center',
        }}
      >
        <img
          src="/images/brand/sepaka-logo.svg"
          alt="SEPAKA"
          style={{
            height: '18px',
            width: 'auto',
            filter: 'brightness(0) invert(1)',
            margin: '0 auto 1.5rem',
            display: 'block',
          }}
        />
        <p
          style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '0.625rem',
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(245,242,236,0.4)',
            margin: 0,
          }}
        >
          Worn in. Never out. · Calgary · © 2025 SEPAKA
        </p>
      </footer>
    </>
  )
}
