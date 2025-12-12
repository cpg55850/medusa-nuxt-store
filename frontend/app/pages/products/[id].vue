<script setup lang="ts">
import { formatPrice } from '../../lib/utils'

const route = useRoute();
const client = useMedusaClient();
const cartStore = useCartStore();
const { addToCart, isAddingToCart } = useCheckout()
const { notify } = useNotificationStore()

await cartStore.getCart()
const regionId = computed(() => cartStore.cart?.region_id)

const { data, pending, error } = await useAsyncData(
  () => client.store.product.retrieve(
    route.params.id as string,
    regionId.value ? { region_id: regionId.value } : undefined,
  ),
  { server: true },
);

const product = computed(() => data.value?.product);

const price = computed(() => formatPrice({
  variant: product.value?.variants?.[0],
  currencyFallback: cartStore.cart?.region?.currency_code,
}))

const handleAddToCart = async () => {
  const variantId = product.value?.variants?.[0]?.id
  if (!variantId) {
    notify('error', 'No variant available')
    return
  }
  await addToCart(variantId, 1)
}
</script>

<template>
  <HeaderSection />
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb class="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NuxtLink to="/">
                Home
              </NuxtLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator v-if="product" />
          <BreadcrumbItem v-if="product">
            <BreadcrumbPage>{{ product.title }}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <!-- <div class="flex items-center gap-3 text-sm text-gray-600 mb-6">
        <NuxtLink to="/" class="hover:text-gray-900">Home</NuxtLink>
        <span>/</span>
        <span class="text-gray-900" v-if="product">{{ product.title }}</span>
      </div> -->

      <div v-if="pending" class="animate-pulse grid md:grid-cols-2 gap-10">
        <div class="aspect-square bg-gray-200 rounded-lg"></div>
        <div class="space-y-4">
          <div class="h-8 w-2/3 bg-gray-200 rounded"></div>
          <div class="h-4 w-full bg-gray-200 rounded"></div>
          <div class="h-4 w-5/6 bg-gray-200 rounded"></div>
          <div class="h-12 w-1/2 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div v-else-if="error" class="text-red-600">Failed to load product.</div>

      <div v-else-if="product" class="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow-md">
        <div class="space-y-4">
          <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img v-if="product.images?.[0]?.url" :src="product.images[0].url" :alt="product.title"
              class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-3" v-if="product.images?.length">
            <div v-for="img in product.images" :key="img.id"
              class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img :src="img.url" :alt="product.title" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ product.title }}</h1>
            <p class="text-gray-600 mt-3">{{ product.description }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-500">Price</p>
            <p class="text-4xl font-semibold text-gray-900">{{ price.symbol || price.currency }}{{ price.amount }}</p>
          </div>

          <div v-if="product.options?.length" class="space-y-3">
            <p class="text-sm font-semibold text-gray-800">Options</p>
            <div class="space-y-2">
              <div v-for="option in product.options" :key="option.id">
                <p class="text-sm text-gray-700 font-medium">{{ option.title }}</p>
                <div class="flex flex-wrap gap-2 mt-1">
                  <span v-for="value in option.values || []" :key="value.id"
                    class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                    {{ value.value }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button @click="handleAddToCart" :disabled="isAddingToCart(product?.variants?.[0]?.id || '')">
              {{ isAddingToCart(product?.variants?.[0]?.id || '') ? 'Adding...' : 'Add to Cart' }}
            </Button>
            <Button variant="outline">
              Save for Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <FooterSection />
</template>
