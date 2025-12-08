<script setup lang="ts">
const client = useMedusaClient()
const cartStore = useCartStore()

const { data, pending } = await useAsyncData(
  'products',
  () => client.store.product.list(),
  { server: true }
)

const products = computed(() => data.value?.products || [])

const addToCart = (product: any) => {
  const variantId = product.variants?.[0]?.id
  if (variantId) {
    cartStore.addItem(variantId, 1)
    // Optional: show toast notification
  }
}

// Filter and sort state
const searchQuery = ref('')
const sortBy = ref('name')

const filteredProducts = computed(() => {
  let filtered = products.value

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter(p =>
      p.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Sort
  if (sortBy.value === 'name') {
    filtered = [...filtered].sort((a, b) => (a.title || '').localeCompare(b.title || ''))
  } else if (sortBy.value === 'price-low') {
    filtered = [...filtered].sort((a, b) => {
      const priceA = a.variants?.[0]?.calculated_price?.calculated_amount || 0
      const priceB = b.variants?.[0]?.calculated_price?.calculated_amount || 0
      return priceA - priceB
    })
  } else if (sortBy.value === 'price-high') {
    filtered = [...filtered].sort((a, b) => {
      const priceA = a.variants?.[0]?.calculated_price?.calculated_amount || 0
      const priceB = b.variants?.[0]?.calculated_price?.calculated_amount || 0
      return priceB - priceA
    })
  }

  return filtered
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <HeaderSection />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">All Products</h1>
        <p class="text-gray-600">Browse our complete collection of premium products</p>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="grid md:grid-cols-2 gap-4">
          <!-- Search -->
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div class="relative">
              <input id="search" v-model="searchQuery" type="text" placeholder="Search products..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Sort -->
          <div>
            <label for="sort" class="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
            <select id="sort" v-model="sortBy"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
            </select>
          </div>
        </div>

        <!-- Results count -->
        <div class="mt-4 text-sm text-gray-600">
          Showing {{ filteredProducts.length }} of {{ products.length }} products
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div class="aspect-square bg-gray-200"></div>
          <div class="p-4">
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div class="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else-if="filteredProducts.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <article v-for="product in filteredProducts" :key="product.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <NuxtLink :to="`/products/${product.id}`" class="block">
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
          </NuxtLink>

          <div class="p-4">
            <NuxtLink :to="`/products/${product.id}`">
              <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 hover:text-blue-600">
                {{ product.title }}
              </h3>
            </NuxtLink>
            <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ product.description }}</p>

            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-gray-900">
                ${{ ((product.variants?.[0]?.calculated_price?.calculated_amount || 0) / 100).toFixed(2)
                }}
              </span>
              <div class="flex gap-2">
                <NuxtLink :to="`/products/${product.id}`"
                  class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 transition-colors">
                  View
                </NuxtLink>
                <Button @click="addToCart(product)"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
        <p class="text-gray-600 mb-4">Try adjusting your search or filters</p>
        <Button @click="searchQuery = ''" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
          Clear Search
        </Button>
      </div>
    </main>

    <FooterSection />
  </div>
</template>