<script setup lang="ts">
declare global {
  interface Window {
    Stripe: any
  }
}

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()

const cartId = route.params.cartId as string
const isLoading = ref(true)
const stripePromise = ref(null as any)

onMounted(async () => {
  try {
    // Load Stripe script
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/'
    script.async = true
    document.head.appendChild(script)

    // Wait for Stripe to load
    await new Promise((resolve) => {
      script.onload = resolve
    })

    // Retrieve the cart
    const client = useMedusaClient()
    const { cart } = await client.store.cart.retrieve(cartId)

    if (!cart) {
      notificationStore.notify('error', 'Cart not found')
      return
    }

    // Load Stripe
    const stripeKey = useRuntimeConfig().public.stripePublishableKey
    if (!stripeKey) {
      throw new Error('Stripe key not configured')
    }

    // Initialize Stripe
    const stripe = (window as any).Stripe?.(stripeKey)
    if (!stripe) {
      throw new Error('Failed to load Stripe')
    }

    stripePromise.value = stripe

    // Initialize Stripe payment session
    await initializeStripeCheckout(cart, stripe)
  } catch (error: any) {
    console.error('Error:', error)
    notificationStore.notify('error', error.message || 'Failed to initialize checkout')
  } finally {
    isLoading.value = false
  }
})

async function initializeStripeCheckout(cart: any, stripe: any) {
  try {
    // Call your backend to create a Stripe session
    const response = await $fetch<{ sessionId: string }>('/api/checkout/create-session', {
      method: 'POST',
      body: {
        cartId: cart.id,
        totalAmount: cart.total,
      },
    })

    // Redirect to Stripe checkout
    if (response?.sessionId) {
      const result = await stripe.redirectToCheckout({
        sessionId: response.sessionId,
      })

      if (result.error) {
        throw new Error(result.error.message)
      }
    } else {
      throw new Error('Failed to create payment session')
    }
  } catch (error: any) {
    console.error('Checkout error:', error)
    notificationStore.notify('error', error.message || 'Failed to create payment session')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <HeaderSection />

    <main class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Initializing payment...</p>
      </Card>

      <Card v-else>
        <CardHeader>
          <CardTitle>Payment Processing</CardTitle>
          <CardDescription>
            You will be redirected to Stripe checkout shortly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-gray-600">If you are not redirected automatically, please check your browser console for
            errors.</p>
        </CardContent>
      </Card>
    </main>

    <FooterSection />
  </div>
</template>
