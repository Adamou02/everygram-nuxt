import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
    getRedirectResult,
    GoogleAuthProvider,
    updateProfile,
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
                await createUserWithEmailAndPassword(auth, email, password);
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
                await signInWithEmailAndPassword(auth, email, password);
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        signOutUser: async () => {
            try {
                await signOut(auth);
                analyticsUtils.log(constants.ANALYTICS_EVENTS.SIGN_OUT);
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        signInWithGoogle: async () => {
            const provider = new GoogleAuthProvider();

            try {
                // await signInWithRedirect(auth, provider); TODO: Implement this
                await signInWithPopup(auth, provider);
                analyticsUtils.log(constants.ANALYTICS_EVENTS.SIGN_IN, {
                    sign_in_method: 'google',
                });
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
        updateUserProfile: async (profileData: Partial<ProfileData>) => {
            if (!user.value) {
                return;
            }

            // validate profileData
            if (!profileData.displayName && !profileData.photoURL) {
                throw new Error(
                    'Profile data must contain displayName or photoURL',
                );
            }

            try {
                await updateProfile(user.value, profileData);
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    };
});
