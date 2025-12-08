import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const signature = getHeader(event, 'stripe-signature')

  if (!signature) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing stripe-signature header',
    })
  }

  try {
    // Verify the webhook signature with Stripe
    const config = useRuntimeConfig()
    const stripeWebhookSecret = config.stripeWebhookSecret
    const event_ = await verifyStripeWebhookSignature(body, signature, stripeWebhookSecret)

    // Handle checkout.session.completed event
    if (event_.type === 'checkout.session.completed') {
      const session = event_.data.object

      // Get the cart ID from the session metadata
      const cartId = session.metadata?.cart_id

      if (!cartId) {
        console.error('No cart_id in webhook metadata')
        return { received: true }
      }

      // Get Medusa backend URL
      const medusaUrl = config.public.medusaUrl || 'http://localhost:9000'

      // Complete the cart to create the order
      try {
        const response = await fetch(`${medusaUrl}/store/carts/${cartId}/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          console.error('Failed to complete cart:', response.statusText)
          return { received: true, error: true }
        }

        const data = await response.json()

        if (data.order) {
          console.log(`Order #${data.order.id} created successfully`)
          return { received: true, orderId: data.order.id }
        } else {
          console.error('No order in response')
          return { received: true, error: true }
        }
      } catch (error: any) {
        console.error('Error completing cart:', error.message)
        return { received: true, error: true }
      }
    }

    return { received: true }
  } catch (error) {
    console.error('Webhook verification failed:', error)
    throw createError({
      statusCode: 400,
      statusMessage: 'Webhook verification failed',
    })
  }
})

async function verifyStripeWebhookSignature(
  body: any,
  signature: string,
  secret: string
): Promise<any> {
  // For production, use stripe.webhooks.constructEvent
  // You'll need to install stripe SDK:
  // pnpm add stripe
  
  // Then use:
  // import Stripe from 'stripe'
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  // const event = stripe.webhooks.constructEvent(body, signature, secret)
  
  // For now, return the parsed body (NOT SECURE - for development only)
  // IMPORTANT: In production, verify the signature!
  try {
    return typeof body === 'string' ? JSON.parse(body) : body
  } catch {
    throw new Error('Invalid webhook body')
  }
}
