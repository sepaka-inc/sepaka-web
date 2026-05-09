'use client'

import { useEffect, useRef, useState, useCallback, type KeyboardEvent } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
}

const EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)'
const MIN_SCALE = 1
const MAX_SCALE = 3
const SCALE_STEP = 0.4

function LightboxCursor({
  x,
  y,
  scale,
  visible,
}: {
  x: number
  y: number
  scale: number
  visible: boolean
}) {
  const isZoomed = scale > 1
  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position:      'fixed',
        left:          x,
        top:           y,
        width:         '56px',
        height:        '56px',
        transform:     'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex:        9999,
        transition:    'opacity 150ms ease',
      }}
    >
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle */}
        <circle
          cx="28"
          cy="28"
          r="26"
          stroke="rgba(245,242,236,0.7)"
          strokeWidth="0.75"
        />
        {/* Inner filled circle */}
        <circle
          cx="28"
          cy="28"
          r="16"
          fill="rgba(245,242,236,0.15)"
          stroke="rgba(245,242,236,0.6)"
          strokeWidth="0.75"
        />
        {/* Minus horizontal line — always visible */}
        <line
          x1="22"
          y1="28"
          x2="34"
          y2="28"
          stroke="rgba(245,242,236,0.9)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Vertical line — only shown when not zoomed (making it a + sign) */}
        {!isZoomed && (
          <line
            x1="28"
            y1="22"
            x2="28"
            y2="34"
            stroke="rgba(245,242,236,0.9)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  )
}

export default function Lightbox({ images, initialIndex, isOpen, onClose }: Props) {
  const [activeIndex, setActiveIndex]   = useState(initialIndex)
  const [scale, setScale]               = useState(MIN_SCALE)
  const [objectX, setObjectX]           = useState(50)
  const [objectY, setObjectY]           = useState(50)
  const [cursorPos, setCursorPos]       = useState({ x: 0, y: 0 })
  const [cursorVisible, setCursorVisible] = useState(false)
  const openerRef                       = useRef<Element | null>(null)
  const containerRef                    = useRef<HTMLDivElement>(null)
  const mainAreaRef                     = useRef<HTMLDivElement>(null)

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      openerRef.current = document.activeElement
      setActiveIndex(initialIndex)
      setScale(MIN_SCALE)
      setObjectX(50)
      setObjectY(50)
      containerRef.current?.focus()
    } else {
      if (openerRef.current instanceof HTMLElement) {
        openerRef.current.focus()
      }
    }
  }, [isOpen, initialIndex])

  // Reset focal point when switching images
  useEffect(() => {
    setObjectX(50)
    setObjectY(50)
    setScale(MIN_SCALE)
  }, [activeIndex])

  useEffect(() => {
    if (!isOpen) return
    const handleGlobalMouse = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
      const el = mainAreaRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const inside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        setCursorVisible(inside)

        if (inside) {
          const xPct = (e.clientX - rect.left) / rect.width
          const yPct = (e.clientY - rect.top) / rect.height
          setObjectX(xPct * 100)
          setObjectY(yPct * 100)
        }
      }
    }
    const handleMouseLeave = () => setCursorVisible(false)
    document.addEventListener('mousemove', handleGlobalMouse)
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouse)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isOpen])

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const el = mainAreaRef.current
    if (!el) return

    setScale((prev) => {
      const delta = e.deltaY < 0 ? SCALE_STEP : -SCALE_STEP
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev + delta))
      if (next === MIN_SCALE) {
        setObjectX(50)
        setObjectY(50)
      } else {
        const rect = el.getBoundingClientRect()
        const xPct = (e.clientX - rect.left) / rect.width
        const yPct = (e.clientY - rect.top) / rect.height
        setObjectX(xPct * 100)
        setObjectY(yPct * 100)
      }
      return next
    })
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const el = mainAreaRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [isOpen, handleWheel])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowRight') {
      setActiveIndex((i) => Math.min(i + 1, images.length - 1))
    }
    if (e.key === 'ArrowLeft') {
      setActiveIndex((i) => Math.max(i - 1, 0))
    }
  }, [isOpen, images.length, onClose])

  const activeSrc = images[activeIndex]

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      style={{
        position:        'fixed',
        inset:           0,
        backgroundColor: 'rgba(13,12,10,0.95)',
        zIndex:          50,
        display:         'flex',
        alignItems:      'stretch',
        outline:         'none',
        cursor:          'none',
        opacity:         isOpen ? 1 : 0,
        pointerEvents:   isOpen ? 'all' : 'none',
        transition:      'opacity 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
    >
      {/* Custom cursor */}
      <LightboxCursor
        x={cursorPos.x}
        y={cursorPos.y}
        scale={scale}
        visible={cursorVisible}
      />

      {/* Thumbnail strip */}
      <div
        style={{
          width:         '64px',
          flexShrink:    0,
          display:       'flex',
          flexDirection: 'column',
          gap:           '6px',
          padding:       '1rem 0.5rem',
          overflowY:     'auto',
          alignItems:    'center',
        }}
      >
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => {
              setActiveIndex(i)
              setScale(MIN_SCALE)
              setObjectX(50)
              setObjectY(50)
            }}
            style={{
              width:      '48px',
              height:     '48px',
              flexShrink: 0,
              position:   'relative',
              overflow:   'hidden',
              background: 'none',
              border:     activeIndex === i
                ? '1px solid rgba(245,242,236,0.6)'
                : '1px solid transparent',
              cursor:     'pointer',
              padding:    0,
              transition: `border 150ms ${EASE}`,
            }}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={src}
              alt={`Thumbnail ${i + 1}`}
              fill
              sizes="48px"
              style={{ objectFit: 'cover' }}
            />
          </button>
        ))}
      </div>

      {/* Main image area — click anywhere to exit */}
      <div
        ref={mainAreaRef}
        role="presentation"
        onClick={onClose}
        style={{
          flex:     1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {activeSrc !== undefined ? (
          <div
            style={{
              position:  'absolute',
              inset:     0,
              transform: `scale(${scale})`,
              transition: scale === MIN_SCALE
                ? `transform 300ms ${EASE}`
                : `transform 150ms ${EASE}`,
              transformOrigin: `${objectX}% ${objectY}%`,
            }}
          >
            <Image
              src={activeSrc}
              alt={`Product image ${activeIndex + 1}`}
              fill
              sizes="100vw"
              style={{
                objectFit:      'cover',
                objectPosition: `${objectX}% ${objectY}%`,
              }}
              priority
            />
          </div>
        ) : null}

        {/* Hint text */}
        <p
          style={{
            position:      'absolute',
            bottom:        '1rem',
            right:         '1rem',
            fontFamily:    'var(--font-inter), system-ui, sans-serif',
            fontSize:      '0.5625rem',
            letterSpacing: '0.1em',
            color:         'rgba(245,242,236,0.3)',
            pointerEvents: 'none',
            userSelect:    'none',
          }}
        >
          Scroll to zoom · arrow keys to navigate · click to exit
        </p>
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image viewer"
        style={{
          position:   'absolute',
          top:        '1rem',
          right:      '1rem',
          background: 'none',
          border:     'none',
          color:      'rgba(245,242,236,0.5)',
          fontSize:   '1.125rem',
          cursor:     'pointer',
          padding:    '0.25rem 0.5rem',
          zIndex:     1,
          transition: `color 200ms ${EASE}`,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.color = '#F5F2EC'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,242,236,0.5)'
        }}
      >
        ✕
      </button>
    </div>
  )
}
