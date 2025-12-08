<script setup lang="ts">
const client = useMedusaClient()
const { products } = await client.store.product.list()
const { addToCart, isAddingToCart } = useCheckout()
const { notify } = useNotificationStore()

const handleAddToCart = async (product: any) => {
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
      <h2 class="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <article v-for="product in products" :key="product.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                ${{ ((product.variants?.[0]?.calculated_price?.calculated_amount || 0) / 100).toFixed(2)
                }}
              </span>
              <div class="flex gap-2">
                <NuxtLink :to="`/products/${product.id}`"
                  class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900">
                  View Details
                </NuxtLink>
                <Button @click="handleAddToCart(product)" :disabled="isAddingToCart(product.variants?.[0]?.id || '')">
                  {{ isAddingToCart(product.variants?.[0]?.id || '') ? 'Adding...' : 'Add to Cart' }}
                </Button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
    <FooterSection />
  </div>
</template>