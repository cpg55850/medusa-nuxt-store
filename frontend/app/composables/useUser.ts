export function useUser() {
  const userStore = useUserStore()
  const notificationStore = useNotificationStore()
  const router = useRouter()

  const loadingIds = ref<Set<string>>(new Set())

  const isLoading = (id: string = 'auth') => {
    return loadingIds.value.has(id)
  }

  const executeAsync = async (
    operation: () => Promise<void>,
    options: {
      loadingId: string
      successMessage?: string
      errorContext: string
      redirectTo?: string
    }
  ) => {
    const { loadingId, successMessage, errorContext, redirectTo } = options

    try {
      loadingIds.value.add(loadingId)

      await operation()

      if (successMessage) {
        notificationStore.notify('success', successMessage)
      }

      if (redirectTo) {
        router.push(redirectTo)
      }
    } catch (error: any) {
      console.error(`${errorContext}:`, error)
      notificationStore.notify('error', error.message || `${errorContext} failed`)
    } finally {
      loadingIds.value.delete(loadingId)
    }
  }

  const login = async (email: string, password: string) => {
    await executeAsync(
      async () => {
        await userStore.login(email, password)
      },
      {
        loadingId: 'login',
        successMessage: 'Welcome back!',
        errorContext: 'Login failed',
        redirectTo: '/',
      }
    )
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    await executeAsync(
      async () => {
        await userStore.register(email, password, firstName, lastName)
      },
      {
        loadingId: 'register',
        successMessage: 'Account created successfully!',
        errorContext: 'Registration failed',
        redirectTo: '/',
      }
    )
  }

  const logout = async () => {
    await executeAsync(
      async () => {
        await userStore.logout()
      },
      {
        loadingId: 'logout',
        successMessage: 'Logged out successfully',
        errorContext: 'Logout failed',
        redirectTo: '/',
      }
    )
  }

  return {
    login,
    register,
    logout,
    isLoading,
    customer: userStore.customer,
    isAuthenticated: userStore.isAuthenticated,
  }
}
