import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { stripe } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { CartItem } from '@/types/cart'
import { ProvinceCode, extractTax } from '@/lib/tax'
import { brandConfig } from '@/config/brand'

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
      userId,
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
      userId?: string
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

    if (userId) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ user_id: userId })
        .eq('id', insertData.id)
      if (updateError) console.error('Order user_id update error:', JSON.stringify(updateError))

      const { data: existingAddress, error: addressCheckError } = await supabase
        .from('addresses')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle()
      if (addressCheckError) console.error('Address check error:', JSON.stringify(addressCheckError))

      if (!existingAddress) {
        const { error: addressInsertError } = await supabase.from('addresses').insert({
          user_id: userId,
          line1: shippingAddress.line1,
          city: shippingAddress.city,
          province: shippingAddress.province,
          postal_code: shippingAddress.postalCode,
          is_default: true,
        })
        if (addressInsertError) console.error('Address insert error:', JSON.stringify(addressInsertError))
      }
    }

    const productImageBase = 'https://sepaka-web.vercel.app/images/products'

    const getProductImageUrl = (slug: string, variantName: string): string => {
      const productKey = slug.replace('the-', '')

      const colorKey = variantName.toLowerCase().includes('black') ? 'black' :
                       variantName.toLowerCase().includes('brown') ? 'brown' :
                       variantName.toLowerCase().includes('camel') ? 'brown' : 'black'

      return `${productImageBase}/${productKey}-${colorKey}.jpg`
    }

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Your SEPAKA order is confirmed</title>
  <style>
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .order-item { flex-direction: column !important; }
      .product-image { width: 100% !important; height: 200px !important; }
      .timeline-row { flex-direction: column !important; gap: 4px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F0EDE8; font-family: Arial, sans-serif;">

  <div style="display: none; max-height: 0; overflow: hidden; color: #F0EDE8;">
    Worn in. Never out. Your piece is now in the hands of our artisans in Calgary.
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F0EDE8;">
    <tr>
      <td align="center" style="padding: 40px 16px;">

        <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0"
          style="background-color: #FAFAF8; max-width: 600px; width: 100%;">

          <!-- HEADER -->
          <tr>
            <td align="center" style="padding: 48px 48px 32px;">
              <p style="
                font-family: Georgia, 'Times New Roman', serif;
                font-size: 22px;
                font-weight: 400;
                letter-spacing: 0.25em;
                color: #0D0C0A;
                margin: 0;
                text-transform: uppercase;
              ">SEPAKA</p>
              <div style="width: 40px; height: 1px; background-color: #8B5E3C; margin: 16px auto 0;"></div>
            </td>
          </tr>

          <!-- HERO HEADING -->
          <tr>
            <td align="center" style="padding: 0 48px 32px;">
              <h1 style="
                font-family: Georgia, 'Times New Roman', serif;
                font-size: 28px;
                font-weight: 400;
                color: #0D0C0A;
                letter-spacing: -0.01em;
                line-height: 1.2;
                margin: 0 0 12px;
              ">Your order is confirmed.</h1>
              <p style="
                font-family: Georgia, 'Times New Roman', serif;
                font-style: italic;
                font-size: 15px;
                color: rgba(13,12,10,0.5);
                margin: 0;
              ">${brandConfig.tagline}</p>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding: 0 48px;">
              <div style="height: 0.5px; background-color: #E8E4DE;"></div>
            </td>
          </tr>

          <!-- PERSONAL LETTER -->
          <tr>
            <td style="padding: 32px 48px;">
              <p style="
                font-family: Arial, sans-serif;
                font-size: 15px;
                color: #0D0C0A;
                line-height: 1.7;
                margin: 0 0 16px;
              ">Dear ${customerName.split(' ')[0]},</p>
              <p style="
                font-family: Arial, sans-serif;
                font-size: 15px;
                color: rgba(13,12,10,0.75);
                line-height: 1.8;
                margin: 0 0 16px;
              ">Thank you for choosing SEPAKA.</p>
              <p style="
                font-family: Arial, sans-serif;
                font-size: 15px;
                color: rgba(13,12,10,0.75);
                line-height: 1.8;
                margin: 0 0 16px;
              ">Your <strong style="color: #0D0C0A;">${items[0]?.name} in ${items[0]?.variantName}</strong> has been reserved.
              It is now entering production — designed in Calgary,
              crafted with care by specialist artisans chosen for their
              mastery of leather.</p>
              <p style="
                font-family: Arial, sans-serif;
                font-size: 15px;
                color: rgba(13,12,10,0.75);
                line-height: 1.8;
                margin: 0 0 16px;
              ">This is not mass production.<br />
              This is a garment made specifically for you.</p>
              <p style="
                font-family: Arial, sans-serif;
                font-size: 15px;
                color: rgba(13,12,10,0.75);
                line-height: 1.8;
                margin: 0;
              ">Welcome to the SEPAKA family.</p>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding: 0 48px;">
              <div style="height: 0.5px; background-color: #E8E4DE;"></div>
            </td>
          </tr>

          <!-- ORDER SUMMARY HEADING -->
          <tr>
            <td style="padding: 32px 48px 16px;">
              <p style="
                font-family: Arial, sans-serif;
                font-size: 9px;
                font-weight: 600;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: rgba(13,12,10,0.4);
                margin: 0;
              ">Your Order</p>
            </td>
          </tr>

          <!-- ORDER ITEMS -->
          ${items.map(item => `
          <tr>
            <td style="padding: 0 48px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="120" valign="top">
                    <img
                      src="${getProductImageUrl(item.slug, item.variantName)}"
                      alt="${item.name}"
                      width="110"
                      style="display: block; width: 110px; height: 135px; object-fit: cover; background-color: #E8E4DE;"
                    />
                  </td>
                  <td valign="top" style="padding-left: 20px;">
                    <p style="
                      font-family: Georgia, 'Times New Roman', serif;
                      font-size: 16px;
                      font-weight: 400;
                      color: #0D0C0A;
                      margin: 0 0 6px;
                    ">${item.name}</p>
                    <p style="
                      font-family: Arial, sans-serif;
                      font-size: 13px;
                      color: rgba(13,12,10,0.55);
                      margin: 0 0 4px;
                      letter-spacing: 0.02em;
                    ">${item.variantName} &nbsp;·&nbsp; Size ${item.size}</p>
                    <p style="
                      font-family: Arial, sans-serif;
                      font-size: 13px;
                      color: rgba(13,12,10,0.55);
                      margin: 0 0 16px;
                    ">Qty ${item.quantity}</p>
                    <p style="
                      font-family: Arial, sans-serif;
                      font-size: 15px;
                      font-weight: 500;
                      color: #0D0C0A;
                      margin: 0;
                    ">$${(item.price * item.quantity).toLocaleString('en-CA')} CAD</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `).join('')}

          <!-- ORDER TOTAL -->
          <tr>
            <td style="padding: 0 48px 32px;">
              <div style="height: 0.5px; background-color: #E8E4DE; margin-bottom: 16px;"></div>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="
                      font-family: Arial, sans-serif;
                      font-size: 13px;
                      color: rgba(13,12,10,0.5);
                      margin: 0 0 8px;
                    ">Delivery &nbsp;&nbsp; <span style="color: #8B5E3C;">Complimentary</span></p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                          <p style="
                            font-family: Georgia, 'Times New Roman', serif;
                            font-size: 18px;
                            font-weight: 400;
                            color: #0D0C0A;
                            margin: 0;
                          ">Total</p>
                        </td>
                        <td align="right">
                          <p style="
                            font-family: Georgia, 'Times New Roman', serif;
                            font-size: 18px;
                            font-weight: 400;
                            color: #0D0C0A;
                            margin: 0;
                          ">$${totalDisplay} CAD</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding: 0 48px;">
              <div style="height: 0.5px; background-color: #E8E4DE;"></div>
            </td>
          </tr>

          <!-- WHAT HAPPENS NEXT -->
          <tr>
            <td style="padding: 32px 48px;">
              <p style="
                font-family: Arial, sans-serif;
                font-size: 9px;
                font-weight: 600;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: rgba(13,12,10,0.4);
                margin: 0 0 20px;
              ">What Happens Next</p>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-bottom: 14px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="90" valign="top">
                          <p style="font-family: Arial, sans-serif; font-size: 11px; color: rgba(13,12,10,0.4); margin: 0; letter-spacing: 0.05em;">Week 1–2</p>
                        </td>
                        <td valign="top">
                          <p style="font-family: Arial, sans-serif; font-size: 13px; color: rgba(13,12,10,0.75); margin: 0;">Leather selection and hand cutting</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 14px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="90" valign="top">
                          <p style="font-family: Arial, sans-serif; font-size: 11px; color: rgba(13,12,10,0.4); margin: 0; letter-spacing: 0.05em;">Week 2–4</p>
                        </td>
                        <td valign="top">
                          <p style="font-family: Arial, sans-serif; font-size: 13px; color: rgba(13,12,10,0.75); margin: 0;">Assembly and hand stitching</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="90" valign="top">
                          <p style="font-family: Arial, sans-serif; font-size: 11px; color: rgba(13,12,10,0.4); margin: 0; letter-spacing: 0.05em;">Week 4–6</p>
                        </td>
                        <td valign="top">
                          <p style="font-family: Arial, sans-serif; font-size: 13px; color: rgba(13,12,10,0.75); margin: 0;">Finishing, quality control, and preparation for shipment</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="
                font-family: Arial, sans-serif;
                font-size: 13px;
                color: rgba(13,12,10,0.5);
                font-style: italic;
                margin: 0;
              ">We will keep you informed at each meaningful milestone.</p>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding: 0 48px;">
              <div style="height: 0.5px; background-color: #E8E4DE;"></div>
            </td>
          </tr>

          <!-- PHILOSOPHY -->
          <tr>
            <td style="padding: 32px 48px;">
              <div style="background-color: #F0EDE8; padding: 28px 32px;">
                <p style="
                  font-family: Georgia, 'Times New Roman', serif;
                  font-size: 13px;
                  font-weight: 400;
                  letter-spacing: 0.08em;
                  text-transform: uppercase;
                  color: rgba(139,94,60,0.8);
                  margin: 0 0 16px;
                ">A note on time and leather —</p>
                <p style="
                  font-family: Georgia, 'Times New Roman', serif;
                  font-size: 15px;
                  color: rgba(13,12,10,0.75);
                  line-height: 1.9;
                  font-style: italic;
                  margin: 0 0 12px;
                ">The jacket you have ordered will not look its best the day it arrives.</p>
                <p style="
                  font-family: Georgia, 'Times New Roman', serif;
                  font-size: 15px;
                  color: rgba(13,12,10,0.75);
                  line-height: 1.9;
                  font-style: italic;
                  margin: 0 0 12px;
                ">It will look its best in three years — when it has softened where you move,
                darkened where you grip it, and carries the story of your life in its creases.</p>
                <p style="
                  font-family: Georgia, 'Times New Roman', serif;
                  font-size: 15px;
                  color: rgba(13,12,10,0.75);
                  line-height: 1.9;
                  font-style: italic;
                  margin: 0 0 12px;
                ">This is the promise of well-made leather. It rewards patience. It remembers.</p>
                <p style="
                  font-family: Georgia, 'Times New Roman', serif;
                  font-size: 15px;
                  color: #0D0C0A;
                  line-height: 1.9;
                  font-style: italic;
                  font-weight: 500;
                  margin: 0;
                ">Welcome to the long road.</p>
              </div>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding: 0 48px;">
              <div style="height: 0.5px; background-color: #E8E4DE;"></div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding: 32px 48px 48px;">
              <p style="
                font-family: Arial, sans-serif;
                font-size: 12px;
                color: rgba(13,12,10,0.4);
                margin: 0 0 8px;
              ">Questions? <a href="mailto:${brandConfig.email}" style="color: #0D0C0A; text-decoration: underline;">${brandConfig.email}</a></p>
              <p style="
                font-family: Arial, sans-serif;
                font-size: 11px;
                color: rgba(13,12,10,0.3);
                margin: 0 0 16px;
                letter-spacing: 0.05em;
              ">SEPAKA &nbsp;·&nbsp; Calgary, Canada</p>
              <p style="
                font-family: Georgia, 'Times New Roman', serif;
                font-size: 12px;
                font-style: italic;
                color: rgba(13,12,10,0.35);
                margin: 0;
              ">${brandConfig.tagline}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`

    const { data: emailData, error: emailError } = await resend.emails.send({
      from:    `${brandConfig.name} <${brandConfig.email}>`,
      to:      customerEmail,
      subject: `Your ${brandConfig.name} order is confirmed`,
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
