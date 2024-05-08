export default function () {
    const userStore = useUserStore();
    const isSigningIn = ref(false);
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
                console.error(error);
                throw error;
            }
        },
        getGoogleRedirectResult: async () => {
            try {
                await userStore.getGoogleRedirectResult();
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    };
}
