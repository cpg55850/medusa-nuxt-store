<script setup lang="ts">
import type { HttpTypes } from '@medusajs/types'

definePageMeta({
  middleware: 'auth',
})

const userStore = useUserStore()
const notificationStore = useNotificationStore()
const router = useRouter()

const isEditing = ref(false)
const isSaving = ref(false)

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  billing_address: {
    first_name: '',
    last_name: '',
    address_1: '',
    address_2: '',
    city: '',
    postal_code: '',
    province: '',
    country_code: '',
    phone: '',
  },
})

onMounted(async () => {
  if (!userStore.customer) {
    await userStore.getCustomer()
  }

  if (userStore.customer) {
    form.value.first_name = userStore.customer.first_name || ''
    form.value.last_name = userStore.customer.last_name || ''
    form.value.email = userStore.customer.email || ''
    form.value.phone = userStore.customer.phone || ''

    if (userStore.customer.addresses?.[0]) {
      const addr = userStore.customer.addresses[0]
      form.value.billing_address = {
        first_name: addr.first_name || '',
        last_name: addr.last_name || '',
        address_1: addr.address_1 || '',
        address_2: addr.address_2 || '',
        city: addr.city || '',
        postal_code: addr.postal_code || '',
        province: addr.province || '',
        country_code: addr.country_code || '',
        phone: addr.phone || '',
      }
    }
  }
})

const handleSave = async () => {
  try {
    isSaving.value = true

    await userStore.updateCustomer({
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      phone: form.value.phone,
    })

    notificationStore.notify('success', 'Profile updated successfully!')
    isEditing.value = false
  } catch (error: any) {
    console.error('Failed to update profile:', error)
    notificationStore.notify('error', error.message || 'Failed to update profile')
  } finally {
    isSaving.value = false
  }
}

const handleCancel = () => {
  isEditing.value = false
  // onMounted()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <HeaderSection />

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid gap-6">
        <!-- Profile Header -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                {{ userStore.customer?.first_name }} {{ userStore.customer?.last_name }}
              </h1>
              <p class="text-gray-600 mt-1">{{ userStore.customer?.email }}</p>
            </div>
            <Button v-if="!isEditing" @click="isEditing = true">
              Edit Profile
            </Button>
          </div>

          <!-- Display Mode -->
          <div v-if="!isEditing" class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-500">First Name</label>
                <p class="text-lg text-gray-900">{{ userStore.customer?.first_name }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Last Name</label>
                <p class="text-lg text-gray-900">{{ userStore.customer?.last_name }}</p>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Email</label>
              <p class="text-lg text-gray-900">{{ userStore.customer?.email }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Phone</label>
              <p class="text-lg text-gray-900">{{ userStore.customer?.phone || 'Not provided' }}</p>
            </div>
          </div>

          <!-- Edit Mode -->
          <div v-else class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="first_name" class="text-sm font-medium">First Name</label>
                <Input id="first_name" v-model="form.first_name" type="text" placeholder="John" required />
              </div>
              <div class="space-y-2">
                <label for="last_name" class="text-sm font-medium">Last Name</label>
                <Input id="last_name" v-model="form.last_name" type="text" placeholder="Doe" required />
              </div>
            </div>
            <div class="space-y-2">
              <label for="phone" class="text-sm font-medium">Phone</label>
              <Input id="phone" v-model="form.phone" type="tel" placeholder="+1 (555) 000-0000" />
            </div>
            <div class="flex gap-2">
              <Button @click="handleSave" :disabled="isSaving">
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </Button>
              <Button variant="outline" @click="handleCancel" :disabled="isSaving">
                Cancel
              </Button>
            </div>
          </div>
        </div>

        <!-- Billing Address Section -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Billing Address</h2>

          <div v-if="!isEditing" class="space-y-2 text-gray-600">
            <p v-if="userStore.customer?.addresses?.[0]">
              {{ form.billing_address.first_name }} {{ form.billing_address.last_name }}<br />
              {{ form.billing_address.address_1 }}<br />
              <span v-if="form.billing_address.address_2">{{ form.billing_address.address_2 }}<br /></span>
              {{ form.billing_address.city }}, {{ form.billing_address.province }} {{ form.billing_address.postal_code
              }}<br />
              {{ form.billing_address.country_code }}
            </p>
            <p v-else class="text-gray-500">No billing address on file</p>
          </div>

          <div v-else class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="addr_first_name" class="text-sm font-medium">First Name</label>
                <Input id="addr_first_name" v-model="form.billing_address.first_name" type="text" placeholder="John" />
              </div>
              <div class="space-y-2">
                <label for="addr_last_name" class="text-sm font-medium">Last Name</label>
                <Input id="addr_last_name" v-model="form.billing_address.last_name" type="text" placeholder="Doe" />
              </div>
            </div>
            <div class="space-y-2">
              <label for="address_1" class="text-sm font-medium">Address Line 1</label>
              <Input id="address_1" v-model="form.billing_address.address_1" type="text" placeholder="123 Main St" />
            </div>
            <div class="space-y-2">
              <label for="address_2" class="text-sm font-medium">Address Line 2</label>
              <Input id="address_2" v-model="form.billing_address.address_2" type="text" placeholder="Apt 4B" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="city" class="text-sm font-medium">City</label>
                <Input id="city" v-model="form.billing_address.city" type="text" placeholder="New York" />
              </div>
              <div class="space-y-2">
                <label for="province" class="text-sm font-medium">State/Province</label>
                <Input id="province" v-model="form.billing_address.province" type="text" placeholder="NY" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="postal_code" class="text-sm font-medium">Postal Code</label>
                <Input id="postal_code" v-model="form.billing_address.postal_code" type="text" placeholder="10001" />
              </div>
              <div class="space-y-2">
                <label for="country_code" class="text-sm font-medium">Country Code</label>
                <Input id="country_code" v-model="form.billing_address.country_code" type="text" placeholder="US"
                  maxlength="2" />
              </div>
            </div>
            <div class="space-y-2">
              <label for="addr_phone" class="text-sm font-medium">Phone</label>
              <Input id="addr_phone" v-model="form.billing_address.phone" type="tel" placeholder="+1 (555) 000-0000" />
            </div>
          </div>
        </div>
      </div>
    </main>

    <FooterSection />
  </div>
</template>
