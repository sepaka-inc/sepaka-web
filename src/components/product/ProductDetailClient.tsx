'use client'

import { useState, useEffect } from 'react'
import { Product, ColorVariant } from '@/types/product'
import { useCart } from '@/context/CartContext'
import CartNotification from '@/components/cart/CartNotification'
import { CartItem } from '@/types/cart'
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
  const { addItem } = useCart()
  const [notificationItem, setNotificationItem] = useState<CartItem | null>(null)
  const [notificationOpen, setNotificationOpen] = useState(false)
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

  const handleAddToCart = (size: string) => {
    const item: Omit<CartItem, 'id' | 'quantity'> = {
      slug:        product.slug,
      name:        product.name,
      variantName: activeVariant.name,
      variantHex:  activeVariant.hex,
      size,
      price:       parseInt(product.price.replace(/[^0-9]/g, '')),
      image:       activeVariant.productImage,
    }
    addItem(item)
    const fullItem: CartItem = { ...item, id: '', quantity: 1 }
    setNotificationItem(fullItem)
    setNotificationOpen(true)
  }

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
          onAddToCart={handleAddToCart}
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

      <CartNotification
        item={notificationItem}
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </main>
  )
}
