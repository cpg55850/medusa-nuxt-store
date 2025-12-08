export function useCheckout() {
  const cartStore = useCartStore()
  const client = useMedusaClient()
  const router = useRouter()
  const notificationStore = useNotificationStore()

  const loadingIds = ref<Set<string>>(new Set())

  const isLoading = (id: string = 'checkout') => {
    return loadingIds.value.has(id)
  }

  const isAddingToCart = (variantId: string) => {
    return loadingIds.value.has(variantId)
  }

  const executeAsync = async (
    operation: () => Promise<void>,
    options: {
      loadingId: string
      successMessage?: string
      errorContext: string
    }
  ) => {
    const { loadingId, successMessage, errorContext } = options

    try {
      loadingIds.value.add(loadingId)

      await operation()

      if (successMessage) {
        notificationStore.notify('success', successMessage)
      }
    } catch (error: any) {
      console.error(`${errorContext}:`, error)
      notificationStore.notify('error', error.message || `${errorContext} failed`)
    } finally {
      loadingIds.value.delete(loadingId)
    }
  }

  const addToCart = async (variantId: string, quantity: number = 1) => {
    await executeAsync(
      async () => {
        if (!cartStore.cart) {
          await cartStore.getCart()
        }
        await cartStore.addItem(variantId, quantity)
      },
      {
        loadingId: variantId,
        successMessage: 'Added to cart!',
        errorContext: 'Failed to add to cart',
      }
    )
  }

  const initiateCheckout = async () => {
    await executeAsync(
      async () => {
        if (!cartStore.cart?.id) {
          throw new Error('No cart found')
        }

        // Initialize payment session but do NOT complete the order yet
        // The order should only complete after Stripe webhook confirms payment
        const { cart } = await client.store.cart.retrieve(cartStore.cart.id)

        if (!cart.payment_collection?.id) {
          throw new Error('No payment collection found on cart')
        }

        // Just redirect to Stripe checkout
        // The order completion will happen via webhook after payment
        notificationStore.notify('success', 'Redirecting to payment...')
        
        // Redirect to payment page with cart ID
        router.push(`/checkout/payment/${cartStore.cart.id}`)
      },
      {
        loadingId: 'checkout',
        errorContext: 'Failed to initiate checkout',
      }
    )
  }

  const checkout = async () => {
    await executeAsync(
      async () => {
        const response = await cartStore.completeCart()
        
        if (response.type === 'order') {
          notificationStore.notify('success', `Order #${response.order.id} placed successfully!`)
          router.push('/orders')
        } else {
          throw new Error(response.error.message || 'Checkout failed')
        }
      },
      {
        loadingId: 'complete-checkout',
        errorContext: 'Checkout error',
      }
    )
  }

  return {
    addToCart,
    initiateCheckout,
    checkout,
    isLoading,
    isAddingToCart,
  }
}