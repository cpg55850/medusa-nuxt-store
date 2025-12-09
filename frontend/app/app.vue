<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'

</script>

<template>
  <div>
    <NotificationHandler />
    <main>
      <!-- Your app content -->
      <NuxtPage />
    </main>
    <Toaster />
  </div>
</template>
