export type ColorVariant = {
  name: string
  hex: string
  productImage: string
  modelImage: string
}

export type Product = {
  id: number
  name: string
  slug: string
  tagline: string
  leather: 'lamb' | 'camel'
  price: string
  variants: ColorVariant[]
}
