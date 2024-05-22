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

    if (!user) {
        return navigateTo('/');
    }
});
