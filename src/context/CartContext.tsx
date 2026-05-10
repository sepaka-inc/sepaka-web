'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { CartItem } from '@/types/cart'

const STORAGE_KEY = 'sepaka-cart'

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const openCart  = useCallback(() => setIsCartOpen(true),  [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {}
  }, [])

  const addItem = useCallback((incoming: Omit<CartItem, 'id' | 'quantity'>) => {
    const id = `${incoming.slug}-${incoming.variantName}-${incoming.size}`
      .toLowerCase()
      .replace(/\s+/g, '-')
    setItems(prev => {
      const existing = prev.find(i => i.id === id)
      const next = existing
        ? prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...incoming, id, quantity: 1 }]
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return
    setItems(prev => {
      const next = prev.map(i => i.id === id ? { ...i, quantity } : i)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal   = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity,
      clearCart, totalItems, subtotal,
      isCartOpen, openCart, closeCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
