<script setup lang="ts">
import { formatPrice } from '../lib/utils'

const client = useMedusaClient()
const cartStore = useCartStore()
const { addToCart, isAddingToCart } = useCheckout()
const { notify } = useNotificationStore()

await cartStore.getCart()
const regionId = computed(() => cartStore.cart?.region_id)

const { data, pending, error, refresh } = await useAsyncData(
  () => client.store.product.list(regionId.value ? { region_id: regionId.value } : undefined),
  { server: false },
)

const products = computed(() => data.value?.products || [])

const getPrice = (product: any) => formatPrice({
  variant: product?.variants?.[0],
  currencyFallback: cartStore.cart?.region?.currency_code,
})

const handleAddToCart = async (event: Event, product: any) => {
  event.preventDefault()
  event.stopPropagation()
  const variantId = product?.variants?.[0]?.id
  if (!variantId) {
    notify('error', 'No variant available')
    return
  }
  await addToCart(variantId, 1)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <HeaderSection />
    <HeroSection />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex justify-end mb-4">
        <Button size="sm" variant="outline" @click="refresh">Reload products</Button>
      </div>
      <h2 class="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        <div v-for="n in 8" :key="n" class="bg-white rounded-lg shadow-md p-4 space-y-4">
          <div class="aspect-square bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      <div v-else-if="error" class="text-red-600">Failed to load products.</div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NuxtLink v-for="product in products" :key="product.id" :to="`/products/${product.id}`"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
          <article>
            <div class="aspect-square bg-gray-100 overflow-hidden">
              <img v-if="product.thumbnail" :src="product.thumbnail" :alt="product.title"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{{ product.title }}</h3>
              <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ product.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-gray-900">
                  {{ getPrice(product).symbol || getPrice(product).currency }}{{ getPrice(product).amount }}
                </span>
                <Button @click="handleAddToCart($event, product)"
                  :disabled="isAddingToCart(product.variants?.[0]?.id || '')">
                  {{ isAddingToCart(product.variants?.[0]?.id || '') ? 'Adding...' : 'Add to Cart' }}
                </Button>
              </div>
            </div>
          </article>
        </NuxtLink>
      </div>
    </main>
    <FooterSection />
  </div>
</template>