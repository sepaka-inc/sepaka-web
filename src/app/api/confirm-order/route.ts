import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { CartItem } from '@/types/cart'
import { ProvinceCode, extractTax } from '@/lib/tax'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      paymentIntentId,
      customerName,
      customerEmail,
      shippingAddress,
      province,
      items,
    }: {
      paymentIntentId: string
      customerName: string
      customerEmail: string
      shippingAddress: {
        line1: string
        city: string
        province: string
        postalCode: string
      }
      province: ProvinceCode
      items: CartItem[]
    } = body

    // Verify payment succeeded with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment not confirmed' },
        { status: 400 }
      )
    }

    const total     = paymentIntent.amount / 100
    const { taxAmount, taxRate } = extractTax(total, province)

    // Save order to Supabase
    const supabase = createServerSupabaseClient()
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        stripe_payment_intent_id: paymentIntentId,
        customer_name:            customerName,
        customer_email:           customerEmail,
        shipping_address:         shippingAddress,
        province,
        items,
        subtotal:   total,
        tax_rate:   taxRate,
        tax_amount: taxAmount,
        total,
        status:     'confirmed',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      // Don't fail — payment already succeeded
    }

    // Send confirmation email via Resend
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from:    'SEPAKA <hello@sepaka.ca>',
          to:      customerEmail,
          subject: `Your SEPAKA order is confirmed`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 2rem; color: #0D0C0A;">
              <h1 style="font-size: 1.5rem; font-weight: 400; letter-spacing: -0.02em; margin-bottom: 0.5rem;">
                Your order is confirmed.
              </h1>
              <p style="font-style: italic; color: rgba(13,12,10,0.5); margin-bottom: 2rem;">
                Worn in. Never out.
              </p>
              <p style="font-family: Arial, sans-serif; font-size: 0.875rem; color: rgba(13,12,10,0.7); line-height: 1.6; margin-bottom: 1.5rem;">
                Thank you, ${customerName}. Your order has been received and will be crafted to order.
              </p>
              <div style="border-top: 0.5px solid #E8E4DE; padding-top: 1.5rem; margin-bottom: 1.5rem;">
                ${items.map(item => `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-family: Arial, sans-serif; font-size: 0.875rem;">
                    <span>${item.name} — ${item.variantName}, Size ${item.size} × ${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toLocaleString()} CAD</span>
                  </div>
                `).join('')}
              </div>
              <div style="border-top: 0.5px solid #E8E4DE; padding-top: 1rem; margin-bottom: 2rem;">
                <div style="display: flex; justify-content: space-between; font-family: Arial, sans-serif; font-size: 1rem; font-weight: 500;">
                  <span>Total</span>
                  <span>$${total.toLocaleString()} CAD</span>
                </div>
                <p style="font-family: Arial, sans-serif; font-size: 0.75rem; color: rgba(13,12,10,0.65); margin-top: 0.25rem;">
                  Tax included in price
                </p>
              </div>
              <div style="background: #F5F2EC; padding: 1.25rem; margin-bottom: 2rem;">
                <p style="font-family: Arial, sans-serif; font-size: 0.875rem; color: rgba(13,12,10,0.7); line-height: 1.6; margin: 0;">
                  <strong>Made to order.</strong> Your jacket will be crafted after this confirmation. 
                  Production takes 4–6 weeks. We'll send you updates at each stage.
                </p>
              </div>
              <p style="font-family: Arial, sans-serif; font-size: 0.75rem; color: rgba(13,12,10,0.6);">
                Questions? Contact us at hello@sepaka.ca
              </p>
            </div>
          `,
        }),
      })
    } catch (emailError) {
      console.error('Email send error:', emailError)
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: order?.id,
    })
  } catch (error) {
    console.error('Confirm order error:', error)
    return NextResponse.json(
      { error: 'Failed to confirm order' },
      { status: 500 }
    )
  }
}
