import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    getAdditionalUserInfo,
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
                    user.value = authUser;
                    const userMemberStore = useUserMemberStore();
                    if (authUser) {
                        userMemberStore.initialize({
                            userId: authUser.uid,
                        });
                    } else {
                        userMemberStore.destroy();
                    }
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
            const userMemberStore = useUserMemberStore();

            try {
                const userCredential = await signInWithPopup(auth, provider);
                user.value = userCredential.user;
                const additionalUserInfo =
                    getAdditionalUserInfo(userCredential);

                if (additionalUserInfo) {
                    userMemberStore.setMember(user.value.uid, {
                        displayName:
                            (additionalUserInfo.profile?.name as string) ||
                            'Google User',
                        photoUrl:
                            (additionalUserInfo.profile?.picture as string) ||
                            '',
                        email:
                            (additionalUserInfo.profile?.email as string) || '',
                    });
                }
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    };
});
