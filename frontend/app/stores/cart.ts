import { defineStore } from 'pinia'
import type { HttpTypes } from '@medusajs/types'

export const useCartStore = defineStore('cart', () => {
  const client = useMedusaClient()
  const cartId = useCookie('cartId', { maxAge: 60 * 60 * 24 * 7 }) // 7 days
  const cart = ref<HttpTypes.StoreCart | null>(null)

  const createCart = async () => {
    // Fetch available regions
    const { regions } = await client.store.region.list()
    const regionId = regions?.[0]?.id
    
    if (!regionId) {
      throw new Error('No regions available')
    }

    const { cart: newCart } = await client.store.cart.create({
      region_id: regionId,
    })
    cartId.value = newCart.id
    cart.value = newCart
    return newCart
  }

  const getCart = async () => {
    if (!cartId.value) {
      return await createCart()
    }
    try {
      const { cart: fetchedCart } = await client.store.cart.retrieve(cartId.value)
      cart.value = fetchedCart
      return fetchedCart
    } catch {
      return await createCart()
    }
  }

  const addItem = async (variantId: string, quantity = 1) => {
    if (!cartId.value) await createCart()
    if (!cartId.value) throw new Error('Failed to create cart')
    
    const { cart: updatedCart } = await client.store.cart.createLineItem(cartId.value, {
      variant_id: variantId,
      quantity,
    })
    cart.value = updatedCart
    return updatedCart
  }

  const updateItem = async (lineId: string, quantity: number) => {
    if (!cartId.value) throw new Error('No cart found')
    
    const { cart: updatedCart } = await client.store.cart.updateLineItem(cartId.value, lineId, {
      quantity,
    })
    cart.value = updatedCart
    return updatedCart
  }

  const removeItem = async (lineId: string) => {
    if (!cartId.value) throw new Error('No cart found')

    const response = await client.store.cart.deleteLineItem(cartId.value, lineId)
    cart.value = response.parent || null
    return response.parent || null
  }

  const completeCart = async () => {
    if (!cartId.value) throw new Error('No cart found')
    
    const response = await client.store.cart.complete(cartId.value)
    cartId.value = null
    cart.value = null
    
    return response
  }

  return {
    cart,
    getCart,
    addItem,
    updateItem,
    removeItem,
    completeCart,
  }
})