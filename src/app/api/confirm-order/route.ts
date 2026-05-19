import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { stripe } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { CartItem } from '@/types/cart'
import { ProvinceCode, extractTax } from '@/lib/tax'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    const totalDollars = paymentIntent.amount / 100
    const { taxAmount, taxRate } = extractTax(totalDollars, province)
    const totalDisplay = totalDollars.toLocaleString('en-CA', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })

    // Save order to Supabase
    const supabase = createServerSupabaseClient()

    // Check if order already exists for this payment intent
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single()

    if (existingOrder) {
      return NextResponse.json({ success: true, orderId: existingOrder.id })
    }

    const { data: insertData, error: insertError } = await supabase
      .from('orders')
      .insert([{
        stripe_payment_intent_id: paymentIntentId,
        customer_name:            customerName,
        customer_email:           customerEmail,
        shipping_address:         shippingAddress,
        province,
        items,
        subtotal:   totalDollars,
        tax_rate:   taxRate,
        tax_amount: taxAmount,
        total:      totalDollars,
        status:     'confirmed',
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Supabase insert error:', JSON.stringify(insertError))
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    const html = `
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
                  <span>$${totalDisplay} CAD</span>
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
          `

    const { data: emailData, error: emailError } = await resend.emails.send({
      from:    'SEPAKA <hello@sepaka.ca>',
      to:      customerEmail,
      subject: `Your SEPAKA order is confirmed`,
      html,
    })

    if (emailError) {
      console.error('Resend error:', JSON.stringify(emailError))
    }

    return NextResponse.json({
      success: true,
      orderId: insertData.id,
    })
  } catch (error) {
    console.error('Confirm order error:', error)
    return NextResponse.json(
      { error: 'Failed to confirm order' },
      { status: 500 }
    )
  }
}
