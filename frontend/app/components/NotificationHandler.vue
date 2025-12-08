<script setup lang="ts">
import { toast } from 'vue-sonner'

const notificationStore = useNotificationStore()

watch(() => notificationStore.notifications, (notifications) => {
  const latest = notifications[notifications.length - 1]
  if (latest) {
    toast[latest.type](latest.message)
    notificationStore.remove(latest.id)
  }
}, { deep: true })
</script>

<template>
  <div />
</template>
