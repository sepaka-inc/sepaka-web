import { Product } from '@/types/product'

export const products: Product[] = [
  {
    id: 1,
    name: 'The Frontier',
    slug: 'the-frontier',
    tagline: 'For those who arrived first.',
    leather: 'lamb',
    price: '$1,299 CAD',
    variants: [
      {
        name: 'Midnight Black',
        hex: '#1A1715',
        productImage: '/images/products/frontier-black.jpg',
        modelImage: '/images/products/frontier-model.jpg',
      },
      {
        name: 'Warm Brown',
        hex: '#8B6A47',
        productImage: '/images/products/frontier-brown.jpg',
        modelImage: '/images/products/frontier-model.jpg',
      },
    ],
  },
  {
    id: 2,
    name: 'The Warden',
    slug: 'the-warden',
    tagline: 'Authority worn quietly.',
    leather: 'lamb',
    price: '$1,399 CAD',
    variants: [
      {
        name: 'Midnight Black',
        hex: '#1A1715',
        productImage: '/images/products/warden-black.jpg',
        modelImage: '/images/products/warden-model.jpg',
      },
      {
        name: 'Warm Brown',
        hex: '#8B6A47',
        productImage: '/images/products/warden-brown.jpg',
        modelImage: '/images/products/warden-model.jpg',
      },
    ],
  },
  {
    id: 3,
    name: 'The Nomad',
    slug: 'the-nomad',
    tagline: 'No fixed address. No compromises.',
    leather: 'lamb',
    price: '$1,299 CAD',
    variants: [
      {
        name: 'Midnight Black',
        hex: '#1A1715',
        productImage: '/images/products/nomad-black.jpg',
        modelImage: '/images/products/nomad-model.jpg',
      },
      {
        name: 'Warm Brown',
        hex: '#8B6A47',
        productImage: '/images/products/nomad-brown.jpg',
        modelImage: '/images/products/nomad-model.jpg',
      },
    ],
  },
  {
    id: 4,
    name: 'The Heir',
    slug: 'the-heir',
    tagline: 'Earned, not inherited.',
    leather: 'lamb',
    price: '$1,499 CAD',
    variants: [
      {
        name: 'Midnight Black',
        hex: '#1A1715',
        productImage: '/images/products/heir-black.jpg',
        modelImage: '/images/products/heir-model.jpg',
      },
      {
        name: 'Warm Brown',
        hex: '#8B6A47',
        productImage: '/images/products/heir-brown.jpg',
        modelImage: '/images/products/heir-model.jpg',
      },
    ],
  },
  {
    id: 5,
    name: 'The Sentinel',
    slug: 'the-sentinel',
    tagline: 'The camel leather jacket. Singular.',
    leather: 'camel',
    price: '$1,499 CAD',
    variants: [
      {
        name: 'Natural Camel',
        hex: '#C49A6C',
        productImage: '/images/products/sentinel-brown.jpg',
        modelImage: '/images/products/sentinel-model.jpg',
      },
    ],
  },
]
