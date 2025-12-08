<script setup lang="ts">
const router = useRouter()
const notificationStore = useNotificationStore()

onMounted(() => {
  notificationStore.notify('success', 'Payment successful! Your order has been created.')
  setTimeout(() => {
    router.push('/orders')
  }, 2000)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <HeaderSection />

    <main class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card class="text-center py-12">
        <div class="flex justify-center mb-4">
          <svg class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <CardHeader>
          <CardTitle>Payment Successful!</CardTitle>
          <CardDescription>
            Your order has been created and is being processed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-gray-600">Redirecting to your orders...</p>
        </CardContent>
      </Card>
    </main>

    <FooterSection />
  </div>
</template>
