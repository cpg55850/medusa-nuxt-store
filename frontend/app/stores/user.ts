import { defineStore } from 'pinia'
import type { HttpTypes } from '@medusajs/types'

export const useUserStore = defineStore('user', () => {
  const client = useMedusaClient()
  const customer = ref<HttpTypes.StoreCustomer | null>(null)
  const isAuthenticated = computed(() => !!customer.value)

  const getCustomer = async () => {
    try {
      const { customer: fetchedCustomer } = await client.store.customer.retrieve()
      customer.value = fetchedCustomer
      return fetchedCustomer
    } catch (error) {
      customer.value = null
      return null
    }
  }

  const login = async (email: string, password: string) => {
    const response = await client.auth.login('customer', 'emailpass', {
      email,
      password,
    })
    await getCustomer()
    return response
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await client.store.customer.create({
      email,
      first_name: firstName,
      last_name: lastName,
    })
    
    // Login after registration
    await login(email, password)
    return response
  }

  const logout = async () => {
    await client.auth.logout()
    customer.value = null
  }

  const updateCustomer = async (data: HttpTypes.StoreUpdateCustomer) => {
    const response = await client.store.customer.update(data)
    customer.value = response.customer
    return response
  }

  return {
    customer: readonly(customer),
    isAuthenticated,
    getCustomer,
    login,
    register,
    logout,
    updateCustomer,
  }
})
