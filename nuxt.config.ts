// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },

    routeRules: {
        "/": { prerender: true },

        // pages that require authentication
        "/login": { ssr: false },
        "/dashboard": { ssr: false },
        "/gears": { ssr: false },
    },
    modules: ["@pinia/nuxt"],
});
