<script setup lang="ts">
import { formatPrice } from '../lib/utils'

const isCartOpen = ref(false)
const cartStore = useCartStore()
const userStore = useUserStore()
const { logout, isLoading } = useUser()
const { initiateCheckout, isLoading: isCheckoutLoading } = useCheckout()
const router = useRouter()

onMounted(async () => {
  await cartStore.getCart()
  await userStore.getCustomer()
})

const cartItems = computed(() => cartStore.cart?.items || [])
const cartItemCount = computed(() => cartItems.value.length)
const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.unit_price * item.quantity)
  }, 0)
})

const getItemPrice = (item: any) => formatPrice({
  variant: { calculated_price: { calculated_amount: item.unit_price } },
  currencyFallback: cartStore.cart?.region?.currency_code,
})

const updateQuantity = async (lineId: string, quantity: number) => {
  if (quantity <= 0) {
    await removeFromCart(lineId)
    return
  }
  try {
    await cartStore.updateItem(lineId, quantity)
  } catch (error: any) {
    console.error('Failed to update quantity:', error)
  }
}

const removeFromCart = async (lineId: string) => {
  try {
    await cartStore.removeItem(lineId)
  } catch (error: any) {
    console.error('Failed to remove item:', error)
  }
}

const proceedToCheckout = async () => {
  isCartOpen.value = false
  await initiateCheckout()
}
</script>

<template>
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <NuxtLink to="/">
          <h1 class="text-2xl font-bold text-gray-900">Medusa Store</h1>
        </NuxtLink>
        <nav class="flex items-center gap-6">
          <NuxtLink to="/products" class="text-gray-600 hover:text-gray-900">Shop</NuxtLink>
          <NuxtLink to="/about" class="text-gray-600 hover:text-gray-900">About</NuxtLink>

          <!-- User Menu -->
          <div v-if="userStore.isAuthenticated" class="flex items-center gap-4">
            <NuxtLink to="/account" class="text-sm text-gray-600 hover:text-gray-900 hover:underline">
              {{ userStore.customer?.first_name }}
            </NuxtLink>
            <button @click="logout" :disabled="isLoading('logout')" class="text-sm text-gray-600 hover:text-gray-900">
              {{ isLoading('logout') ? 'Logging out...' : 'Logout' }}
            </button>
          </div>
          <NuxtLink v-else to="/login" class="text-gray-600 hover:text-gray-900">
            Login
          </NuxtLink>

          <!-- Cart Button -->
          <button @click="isCartOpen = true" class="relative hover:cursor-pointer">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="cartItemCount > 0"
              class="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ cartItemCount }}
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Cart Sheet -->
    <!-- <ClientOnly> -->
    <Sheet v-model:open="isCartOpen">
      <SheetContent class="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {{ cartItemCount }} {{ cartItemCount === 1 ? 'item' : 'items' }} in your cart
          </SheetDescription>
        </SheetHeader>

        <!-- Cart Items -->
        <div class="mt-8 flex-1 overflow-y-auto">
          <div v-if="cartItems.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p class="text-gray-600 mb-4">Your cart is empty</p>
            <Button @click="isCartOpen = false" variant="outline">
              Continue Shopping
            </Button>
          </div>

          <div v-else class="space-y-4">
            <div v-for="item in cartItems" :key="item.id" class="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <!-- Product Image -->
              <div class="w-20 h-20 bg-gray-200 rounded-md shrink-0 overflow-hidden">
                <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.title" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <!-- Product Details -->
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-semibold text-gray-900 truncate">{{ item.title }}</h4>
                <p class="text-sm text-gray-600 mt-1">{{ getItemPrice(item).symbol || getItemPrice(item).currency }}{{
                  getItemPrice(item).amount }}</p>

                <!-- Quantity Controls -->
                <div class="flex items-center gap-2 mt-2">
                  <button @click="updateQuantity(item.id, item.quantity - 1)"
                    class="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                    <span class="text-gray-600">−</span>
                  </button>
                  <span class="text-sm font-medium w-8 text-center">{{ item.quantity }}</span>
                  <button @click="updateQuantity(item.id, item.quantity + 1)"
                    class="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                    <span class="text-gray-600">+</span>
                  </button>
                </div>
              </div>

              <!-- Remove Button -->
              <button @click="removeFromCart(item.id)" class="text-gray-400 hover:text-red-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Cart Footer -->
        <SheetFooter class="mt-6 border-t pt-6">
          <div class="w-full space-y-4">
            <!-- Subtotal -->
            <div class="flex justify-between text-base font-semibold">
              <span>Subtotal</span>
              <span>${{ cartTotal.toFixed(2) }}</span>
            </div>
            <p class="text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>

            <!-- Checkout Button -->
            <Button @click="proceedToCheckout" class="w-full bg-blue-600 hover:bg-blue-700 text-white"
              :disabled="cartItems.length === 0 || isCheckoutLoading('checkout')">
              {{ isCheckoutLoading('checkout') ? 'Processing...' : 'Proceed to Checkout' }}
            </Button>
            <Button @click="isCartOpen = false" variant="outline" class="w-full">
              Continue Shopping
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
    <!-- </ClientOnly> -->
  </header>
</template>