// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET || '',
  },
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  components: [
    { path: '~/components', pathPrefix: false },
  ],
  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
    head: {
      title: '🌍 旅行者传说 - 全球旅游RPG',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      ],
    },
  },
})
