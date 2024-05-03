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

    if (to.name === '') {
        if (user) {
            return navigateTo('/gears');
        } else {
            return navigateTo('/welcome');
        }
    }

    if (!user && to.name !== 'login' && to.name !== 'signup') {
        return navigateTo('/login');
    }

    if (user && (to.name === 'login' || to.name === 'signup')) {
        return navigateTo('/gears');
    }
});
