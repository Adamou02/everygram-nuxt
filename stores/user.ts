import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
    getRedirectResult,
    GoogleAuthProvider,
} from 'firebase/auth';
import type { User } from 'firebase/auth';

export const useUserStore = defineStore('userStore', () => {
    const auth = getAuth();
    const user = ref<null | User>(null);
    const isInitialized = ref(false);
    const unsubscribeOnAuthStateChangedRef = ref<null | (() => void)>(null);

    return {
        user,
        isLoggedIn: computed(() => user.value !== null),
        initialize: () => {
            if (isInitialized.value) {
                return;
            }
            unsubscribeOnAuthStateChangedRef.value = onAuthStateChanged(
                auth,
                (authUser) => {
                    user.value = authUser || null;
                },
            );

            isInitialized.value = true;
        },
        destroy: () => {
            unsubscribeOnAuthStateChangedRef.value?.();
            isInitialized.value = false;
        },
        signUpWithEmail: async ({
            email,
            password,
        }: {
            email: string;
            password: string;
        }) => {
            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password,
                );
                user.value = userCredential.user;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        signInWithEmail: async ({
            email,
            password,
        }: {
            email: string;
            password: string;
        }) => {
            // Sign in with email and password
            try {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password,
                );
                user.value = userCredential.user;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        signOutUser: async () => {
            try {
                await signOut(auth);
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        signInWithGoogle: async () => {
            const provider = new GoogleAuthProvider();

            try {
                // await signInWithRedirect(auth, provider); TODO: Implement this
                const userCredential = await signInWithPopup(auth, provider);
                user.value = userCredential.user || null;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        getGoogleRedirectResult: async () => {
            try {
                const result = await getRedirectResult(auth);
                if (!result) {
                    return;
                }
                const credential =
                    GoogleAuthProvider.credentialFromResult(result);

                if (!credential) {
                    return;
                }
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    };
});
