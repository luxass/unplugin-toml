// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  compatibilityDate: "2024-07-03",
  modules: ["@nuxtjs/tailwindcss", "unplugin-toml/nuxt"],
  future: {
    compatibilityVersion: 4,
  },
});
