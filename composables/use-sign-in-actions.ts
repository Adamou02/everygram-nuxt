export default function () {
    const userStore = useUserStore();
    const isSigningIn = ref(false);
    const { errorToast } = useErrorToast();

    return {
        isSigningIn,
        signInWithGoogle: async () => {
            try {
                isSigningIn.value = true;
                setTimeout(() => {
                    isSigningIn.value = false;
                }, 10000);
                await userStore.signInWithGoogle();
            } catch (error) {
                errorToast('Failed to sign in with Google', error);
                throw error;
            }
        },
        getGoogleRedirectResult: async () => {
            try {
                await userStore.getGoogleRedirectResult();
            } catch (error) {
                errorToast('Failed to get Google redirect result', error);
                throw error;
            }
        },
    };
}
