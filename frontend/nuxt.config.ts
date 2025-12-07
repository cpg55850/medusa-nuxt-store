// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/medusa', 'shadcn-nuxt', '@nuxtjs/tailwindcss'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui'
  },
  medusa: {
    baseUrl: process.env.MEDUSA_API_URL,       // your Medusa backend
    publishableKey: process.env.MEDUSA_PUBLISHABLE_KEY
  },
} as any)