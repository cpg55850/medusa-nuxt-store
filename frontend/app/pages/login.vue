<script setup lang="ts">
const { login, isLoading } = useUser()

const form = ref({
  email: '',
  password: '',
})

const handleSubmit = async () => {
  await login(form.value.email, form.value.password)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <HeaderSection />

    <main class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <label for="email" class="text-sm font-medium">Email</label>
              <Input id="email" v-model="form.email" type="email" placeholder="m@example.com" required />
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label for="password" class="text-sm font-medium">Password</label>
                <NuxtLink to="/forgot-password" class="text-sm underline-offset-4 hover:underline">
                  Forgot your password?
                </NuxtLink>
              </div>
              <Input id="password" v-model="form.password" type="password" required />
            </div>
            <div class="space-y-2">
              <Button type="submit" class="w-full" :disabled="isLoading('login')">
                {{ isLoading('login') ? 'Logging in...' : 'Login' }}
              </Button>
              <p class="text-center text-sm text-muted-foreground">
                Don't have an account?
                <NuxtLink to="/register" class="underline underline-offset-4">Sign up</NuxtLink>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>

    <FooterSection />
  </div>
</template>
