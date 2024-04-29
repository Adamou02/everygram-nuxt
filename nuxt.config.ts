// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },

    routeRules: {
        '/': { prerender: true },

        // pages that require authentication
        '/login': { ssr: false },
        '/signup': { ssr: false },
        '/dashboard': { ssr: false },
        '/gears': { ssr: false },
        '/trip/**': { ssr: false },
    },
    modules: ['@pinia/nuxt', 'nuxt-lodash'],
    lodash: {
        // https://nuxt.com/modules/lodash#config
        prefix: '_',
        upperAfterPrefix: false,
    },
});
