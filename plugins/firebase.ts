import 'firebase/auth';
import firebaseConfig from '~/firebase.config.json';
import { initializeApp, getApp } from 'firebase/app';
export default defineNuxtPlugin({
    name: 'firebase.client',
    async setup(nuxtApp) {
        // this is the equivalent of a normal functional plugin
        // initialize Firebase app
        initializeApp(firebaseConfig);
        const app = getApp();
    },
    hooks: {
        // You can directly register Nuxt app runtime hooks here
        'app:beforeMount'() {},
        'vue:setup'() {},
        'app:created'() {},
    },
});
