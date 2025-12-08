<script setup lang="ts">
const { register, isLoading } = useUser()

const form = ref({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
})

const handleSubmit = async () => {
  await register(form.value.email, form.value.password, form.value.firstName, form.value.lastName)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <HeaderSection />

    <main class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="firstName" class="text-sm font-medium">First Name</label>
                <Input id="firstName" v-model="form.firstName" type="text" placeholder="John" required />
              </div>
              <div class="space-y-2">
                <label for="lastName" class="text-sm font-medium">Last Name</label>
                <Input id="lastName" v-model="form.lastName" type="text" placeholder="Doe" required />
              </div>
            </div>
            <div class="space-y-2">
              <label for="email" class="text-sm font-medium">Email</label>
              <Input id="email" v-model="form.email" type="email" placeholder="m@example.com" required />
            </div>
            <div class="space-y-2">
              <label for="password" class="text-sm font-medium">Password</label>
              <Input id="password" v-model="form.password" type="password" required />
            </div>
            <div class="space-y-2">
              <Button type="submit" class="w-full" :disabled="isLoading('register')">
                {{ isLoading('register') ? 'Creating account...' : 'Create account' }}
              </Button>
              <p class="text-center text-sm text-muted-foreground">
                Already have an account?
                <NuxtLink to="/login" class="underline underline-offset-4">Sign in</NuxtLink>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>

    <FooterSection />
  </div>
</template>
