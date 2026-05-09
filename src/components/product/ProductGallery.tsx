'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  isMobile: boolean
  onImageClick: (index: number) => void
}

interface ImageBlockProps {
  src: string
  index: number
  aspectRatio: string
  sizes: string
  isHovered: boolean
  onHoverEnter: () => void
  onHoverLeave: () => void
  onClick: () => void
}

function ImageBlock({
  src,
  index,
  aspectRatio,
  sizes,
  isHovered,
  onHoverEnter,
  onHoverLeave,
  onClick,
}: ImageBlockProps) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
      style={{
        position:        'relative',
        width:           '100%',
        aspectRatio,
        overflow:        'hidden',
        cursor:          'none',
        backgroundColor: '#E8E4DC',
      }}
    >
      <Image
        src={src}
        alt={`Product image ${index + 1}`}
        fill
        sizes={sizes}
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        priority={index === 0}
      />
      <div
        style={{
          position:        'absolute',
          inset:           0,
          backgroundColor: isHovered
            ? 'rgba(13,12,10,0.06)'
            : 'rgba(13,12,10,0)',
          transition:      'background-color 200ms cubic-bezier(0.25,0.1,0.25,1)',
          pointerEvents:   'none',
        }}
        aria-hidden="true"
      />
    </div>
  )
}

export default function ProductGallery({ images, isMobile, onImageClick }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [cursorVisible, setCursorVisible] = useState(false)
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
      if (galleryRef.current) {
        const rect = galleryRef.current.getBoundingClientRect()
        const inside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        setCursorVisible(inside)
        if (!inside) setHoveredIndex(null)
      }
    }
    const handleMouseLeave = () => {
      setCursorVisible(false)
      setHoveredIndex(null)
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const heroImage = images[0]
  const restImages = images.slice(1)

  function CustomCursor({
    visible,
    x,
    y,
  }: {
    visible: boolean
    x: number
    y: number
  }) {
    return (
      <div
        aria-hidden="true"
        style={{
          position:        'fixed',
          left:            x,
          top:             y,
          width:           '56px',
          height:          '56px',
          transform:       `translate(-50%, -50%) scale(${visible ? 1 : 0})`,
          opacity:         visible ? 1 : 0,
          pointerEvents:   'none',
          zIndex:          9999,
          transition:      'transform 1000ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 800ms cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="28"
            cy="28"
            r="26"
            stroke="rgba(13,12,10,0.25)"
            strokeWidth="0.75"
          />
          <circle
            cx="28"
            cy="28"
            r="16"
            fill="rgba(245,242,236,0.88)"
            stroke="rgba(13,12,10,0.1)"
            strokeWidth="0.5"
          />
          <line
            x1="28" y1="22" x2="28" y2="34"
            stroke="#0D0C0A"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <line
            x1="22" y1="28" x2="34" y2="28"
            stroke="#0D0C0A"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>
    )
  }

  if (heroImage === undefined) {
    return null
  }

  return (
    <>
      <CustomCursor
        visible={cursorVisible && !isMobile}
        x={cursorPos.x}
        y={cursorPos.y}
      />
      <div
        ref={galleryRef}
        style={{
          width:           isMobile ? '100%' : '65%',
          flexShrink:      0,
          backgroundColor: '#F5F2EC',
          padding:         '8px',
          display:         'flex',
          flexDirection:   'column',
          gap:             '6px',
          position:        'relative',
        }}
      >
        <ImageBlock
          src={heroImage}
          index={0}
          aspectRatio="3/4"
          sizes="(max-width: 768px) 100vw, 65vw"
          isHovered={hoveredIndex === 0}
          onHoverEnter={() => setHoveredIndex(0)}
          onHoverLeave={() => setHoveredIndex(null)}
          onClick={() => onImageClick(0)}
        />
        {restImages.length > 0 && (
          <div
            style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap:                 '6px',
            }}
          >
            {restImages.map((src, i) => (
              <ImageBlock
                key={src}
                src={src}
                index={i + 1}
                aspectRatio="4/5"
                sizes="(max-width: 768px) 50vw, 29vw"
                isHovered={hoveredIndex === i + 1}
                onHoverEnter={() => setHoveredIndex(i + 1)}
                onHoverLeave={() => setHoveredIndex(null)}
                onClick={() => onImageClick(i + 1)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
