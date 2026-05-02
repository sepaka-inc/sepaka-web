export type LeatherType = 'lamb' | 'camel'

export type SizeOption = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export type ColorVariant = {
  name: string
  hex: string
  slug: string
  images: {
    hero: string
    gallery: string[]
    texture: string
    worn: string
    label: string
  }
  inStock: boolean
  inventory: number
}

export type Product = {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  leatherType: LeatherType
  origin: string
  weight: string
  lining: string
  hardware: string
  variants: ColorVariant[]
  sizes: SizeOption[]
  price: number
  careInstructions: string[]
  patinaNote: string
  craftingTime: string
  featured: boolean
  order: number
}
