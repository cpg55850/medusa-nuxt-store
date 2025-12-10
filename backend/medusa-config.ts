import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  // Project configuration
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    databaseDriverOptions: {
      ssl: false,
      sslmode: "disable",
    },
    cookieOptions: {
      sameSite: "lax",
      secure: false
    }
  },

  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL!,
  },


  // Modules (placed outside projectConfig)
  modules: [
  {
      resolve: "@medusajs/medusa/auth",
      // (recommended) add required dependencies for the Auth module
      // dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
            options: {
              // emailpass-specific options (e.g. hashConfig) if needed
            },
          },
        ],
      },
    },

    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              // other options...
              // backendUrl or equivalent option set to your prod URL
              backend_url: process.env.MEDUSA_BACKEND_URL!,
            },
          },
        ],
      },
    },


    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-stripe", // Stripe is built-in
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY, // Secret key here
            },
          },
        ],
      },
    },
  ],
})
