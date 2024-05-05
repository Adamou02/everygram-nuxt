export default function () {
    const userStore = useUserStore();
    return {
        signInWWithGoogle: async () => {
            try {
                await userStore.signInWithGoogle();
                navigateTo('/gears');
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    };
}
