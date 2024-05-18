export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:beforeMount', () => {
        const userStore = useUserStore();
        const userGearsStore = useUserGearsStore();
        const userTripsStore = useUserTripsStore();
        const { user } = storeToRefs(userStore);

        userStore.initialize();

        watch(
            () => user.value,
            (newUser) => {
                if (newUser) {
                    userGearsStore.initialize();
                    userTripsStore.initialize();
                } else {
                    userGearsStore.destroy();
                    userTripsStore.destroy();
                }
            },
            { immediate: true },
        );
    });
});
