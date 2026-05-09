import { notFound } from 'next/navigation'
import { products } from '@/data/products'
import ProductDetailClient from '@/components/product/ProductDetailClient'

export const dynamicParams = false

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ color?: string }>
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { color } = await searchParams

  const product = products.find((p) => p.slug === slug)
  if (!product) notFound()

  const resolvedColor = color ? decodeURIComponent(color).trim() : null
  const initialVariant =
    product.variants.find((v) => v.name === resolvedColor) ??
    product.variants[0]

  return (
    <ProductDetailClient
      product={product}
      initialVariant={initialVariant}
    />
  )
}
