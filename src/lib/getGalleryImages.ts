import { Product, ColorVariant } from '@/types/product'

export function getGalleryImages(
  product: Product,
  activeVariant: ColorVariant
): string[] {
  if (product.leather === 'camel') {
    return [
      '/images/products/sentinel-brown.jpg',
      '/images/products/sentinel-model.jpg',
    ]
  }
  const otherVariant = product.variants.find(
    (v) => v.name !== activeVariant.name
  )
  return [
    activeVariant.productImage,
    activeVariant.modelImage,
    otherVariant ? otherVariant.productImage : activeVariant.productImage,
  ]
}
