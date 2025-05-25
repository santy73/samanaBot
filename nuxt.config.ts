// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  // CSS global
  css: ['~/assets/css/main.css'],

  // Configuración de runtime
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000/api'
    }
  },

  // Auto-importación de composables
  imports: {
    dirs: ['composables/**']
  },

  // Componentes auto-importados
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  // Módulos
  modules: [
    '@nuxtjs/google-fonts'
  ],

  // Google Fonts
  googleFonts: {
    families: {
      Roboto: [300, 400, 500, 700]
    }
  },

  // Configuración de TypeScript
  typescript: {
    strict: true
  },

  // Configuración de Nitro para desarrollo
  nitro: {
    devProxy: {
      '/api': {
        target: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000/api',
        changeOrigin: true
      }
    }
  },

  // Configuración de build
  build: {
    transpile: ['uuid']
  },

  // Configuración de servidor
  ssr: true
})

// package.json dependencies que necesitas instalar:
/*
{
  "dependencies": {
    "@nuxt/devtools": "latest",
    "@nuxtjs/google-fonts": "^3.0.2",
    "nuxt": "^3.8.0",
    "uuid": "^9.0.1",
    "vue": "^3.3.0",
    "vue-router": "^4.2.0"
  },
  "devDependencies": {
    "@nuxt/typescript": "^3.8.0",
    "@types/uuid": "^9.0.7"
  }
}
*/