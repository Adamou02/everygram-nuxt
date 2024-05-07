export default function () {
    const userStore = useUserStore();
    return {
        signInWithGoogle: async () => {
            try {
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
