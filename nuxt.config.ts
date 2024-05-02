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
    modules: ['@pinia/nuxt', 'nuxt-lodash', '@nuxtjs/i18n', 'nuxt-primevue'],
    lodash: {
        // https://nuxt.com/modules/lodash#config
        prefix: '_',
        upperAfterPrefix: false,
    },
    i18n: {
        langDir: 'locales',
        locales: [
            {
                code: 'en',
                name: 'English',
                iso: 'en-US',
                file: 'en.json',
            },
            {
                code: 'zh',
                name: '繁體中文',
                iso: 'zh-TW',
                file: 'zh-tw.json',
            },
        ],
        defaultLocale: 'en',
        strategy: 'no_prefix',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
        },
    },
    primevue: {
        /* Options */
    },
    css: [
        'primeflex/primeflex.css',
        '~/assets/theme/themes/mytheme/theme.scss',
    ],
});
