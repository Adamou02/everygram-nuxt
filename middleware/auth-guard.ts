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

    if (!user && to.name !== 'login' && to.name !== 'signup') {
        // Redirect to the login page if the user is not logged in
        return navigateTo('/login');
    }

    if (user && (to.name === 'login' || to.name === 'signup')) {
        // Redirect to the user's dashboard if the user is already logged in
        return navigateTo('/dashboard');
    }
});
