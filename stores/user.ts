import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";

export const useUserStore = defineStore("userStore", () => {
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
                    user.value = authUser;
                },
            );
            isInitialized.value = true;
        },
        destroy: () => {
            unsubscribeOnAuthStateChangedRef.value?.();
            isInitialized.value = false;
            console.log("destroy useUserStore");
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
    };
});
