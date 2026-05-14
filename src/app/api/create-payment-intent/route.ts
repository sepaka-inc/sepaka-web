import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { products } from '@/data/products'
import { extractTax, ProvinceCode } from '@/lib/tax'
import { CartItem } from '@/types/cart'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, province }: { items: CartItem[], province: ProvinceCode } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    if (!province) {
      return NextResponse.json({ error: 'Province required' }, { status: 400 })
    }

    // Verify prices server-side — never trust frontend prices
    let verifiedSubtotal = 0
    for (const item of items) {
      const product = products.find(p => p.slug === item.slug)
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.slug}` },
          { status: 400 }
        )
      }
      const serverPrice = parseInt(product.price.replace(/[^0-9]/g, ''), 10)
      verifiedSubtotal += serverPrice * item.quantity
    }

    // Tax-inclusive — total is the same as subtotal
    const total = verifiedSubtotal
    const { taxAmount, taxRate, taxLabel } = extractTax(total, province)

    // Create PaymentIntent in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   total * 100,
      currency: 'cad',
      metadata: {
        province,
        taxAmount:  taxAmount.toString(),
        taxRate:    taxRate.toString(),
        taxLabel,
        itemCount:  items.length.toString(),
      },
    })

    return NextResponse.json({
      clientSecret:  paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      total,
      taxAmount,
      taxRate,
      taxLabel,
    })
  } catch (error) {
    console.error('Create payment intent error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
