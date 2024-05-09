import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const auth = getAuth();
    const user = await new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                unsubscribe();
                resolve(user);
            },
            reject,
        );
    });

    if (to.name === 'index') {
        if (user) {
            return navigateTo('/trips');
        } else {
            return navigateTo('/welcome');
        }
    }

    if (!user) {
        return navigateTo('/welcome');
    }

    if (
        user &&
        (to.name === 'signin' ||
            to.name === 'signup' ||
            to.name === 'reset-password')
    ) {
        return navigateTo('/trips');
    }
});
