export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { cartId, totalAmount } = body

  if (!cartId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cart ID is required',
    })
  }

  try {
    const config = useRuntimeConfig()
    const stripeSecretKey = config.stripeSecretKey
    const medusaUrl = config.public.medusaUrl || 'http://localhost:9000'
    const appUrl = config.public.appUrl || 'http://localhost:3000'

    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured')
    }

    // Call Stripe API to create a checkout session
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${stripeSecretKey}`,
      },
      body: new URLSearchParams({
        'payment_method_types[0]': 'card',
        'mode': 'payment',
        'success_url': `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${appUrl}/checkout/payment/${cartId}`,
        'metadata[cart_id]': cartId,
      }).toString(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to create Stripe session')
    }

    const session = await response.json()

    return {
      sessionId: session.id,
    }
  } catch (error: any) {
    console.error('Error creating Stripe session:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create payment session',
    })
  }
})
