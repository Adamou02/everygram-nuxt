import 'firebase/auth';
import { initializeApp } from 'firebase/app';
export default defineNuxtPlugin({
    name: 'firebase.client',
    async setup(nuxtApp) {
        // this is the equivalent of a normal functional plugin
        // initialize Firebase app
        const config = useRuntimeConfig();
        const firebaseConfig = {
            apiKey: config.public.FIREBASE_API_KEY as string,
            authDomain: config.public.FIREBASE_AUTH_DOMAIN as string,
            databaseURL: config.public.FIREBASE_DATABASE_URL as string,
            projectId: config.public.FIREBASE_PROJECT_ID as string,
            storageBucket: config.public.FIREBASE_STORAGE_BUCKET as string,
            messagingSenderId: config.public
                .FIREBASE_MESSAGING_SENDER_ID as string,
            appId: config.public.FIREBASE_APP_ID as string,
            measurementId: config.public.FIREBASE_MEASUREMENT_ID as string,
        };

        initializeApp(firebaseConfig);
    },
    hooks: {
        // You can directly register Nuxt app runtime hooks here
        'app:beforeMount'() {},
        'vue:setup'() {},
        'app:created'() {},
    },
});
