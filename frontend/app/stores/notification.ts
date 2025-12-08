import { defineStore } from 'pinia'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  timestamp: number
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])

  function notify(type: NotificationType, message: string) {
    const notification: Notification = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      message,
      timestamp: Date.now(),
    }
    notifications.value.push(notification)
  }

  function remove(id: string) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  function clear() {
    notifications.value = []
  }

  return {
    notifications: readonly(notifications),
    notify,
    remove,
    clear,
  }
})