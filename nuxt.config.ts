// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    app: {
        head: {
            link: [
                // material icons
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@300',
                },
                {
                    rel: 'preconnect',
                    href: 'https://fonts.googleapis.com',
                },
                {
                    rel: 'preconnect',
                    href: 'https://fonts.gstatic.com',
                    crossorigin: 'anonymous',
                },
                {
                    href: 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap',
                    rel: 'stylesheet',
                },
            ],
        },
    },
    css: [
        'primeicons/primeicons.css', // prime icons
        '~/assets/theme/themes/mytheme/theme.scss', // prime components
        '~/assets/theme/primeflex/primeflex.scss', // prime flex utilities
        '~/assets/theme/eg-custom.scss', // everygram custom styles
    ],
    routeRules: {
        '/welcome': { prerender: true },

        // pages that require authentication
        '/': { ssr: false },
        '/signin': { ssr: false },
        '/signup': { ssr: false },
        '/reset-password': { ssr: false },
        '/gears': { ssr: false },
        '/trips': { ssr: false },
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
                code: 'zh-tw',
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
        experimental: {
            localeDetector: './localeDetector.ts',
        },
    },
    primevue: {
        components: {
            prefix: 'Prime',
        },
    },
});
