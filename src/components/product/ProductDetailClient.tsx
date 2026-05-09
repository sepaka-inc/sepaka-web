'use client'

import { useState, useEffect } from 'react'
import { Product, ColorVariant } from '@/types/product'
import ProductGallery from './ProductGallery'
import ProductInfo from './ProductInfo'
import Lightbox from './Lightbox'
import SlidePanel from './SlidePanel'
import { getGalleryImages } from '@/lib/getGalleryImages'

interface Props {
  product: Product
  initialVariant: ColorVariant
}

export default function ProductDetailClient({ product, initialVariant }: Props) {
  const [activeVariant, setActiveVariant] = useState<ColorVariant>(initialVariant)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [slidePanel, setSlidePanel] = useState<'details' | 'delivery' | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setActiveVariant(initialVariant)
  }, [initialVariant])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const images = getGalleryImages(product, activeVariant)

  return (
    <main
      style={{
        backgroundColor: '#FFFFFF',
        minHeight: '100dvh',
        paddingTop: '60px',
      }}
    >
      <div
        style={{
          display:       'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems:    'flex-start',
          minHeight:     'calc(100dvh - 60px)',
        }}
      >
        <ProductGallery
          images={images}
          isMobile={isMobile}
          onImageClick={(index) => {
            setLightboxIndex(index)
            setLightboxOpen(true)
          }}
        />
        <ProductInfo
          product={product}
          activeVariant={activeVariant}
          isMobile={isMobile}
          onVariantChange={setActiveVariant}
          onOpenPanel={(panel) => setSlidePanel(panel)}
        />
      </div>

      <Lightbox
        images={images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      <SlidePanel
        isOpen={slidePanel !== null}
        onClose={() => setSlidePanel(null)}
        type={slidePanel}
        product={product}
        activeVariant={activeVariant}
      />
    </main>
  )
}
