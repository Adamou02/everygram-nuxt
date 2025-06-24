export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:beforeMount', () => {
        const userStore = useUserStore();
        const userMetaStore = useUserMetaStore();
        const userGearsStore = useUserGearsStore();
        const userTripsStore = useUserTripsStore();
        const { user } = storeToRefs(userStore);

        userStore.initialize();

        watch(
            () => user.value,
            (newUser) => {
                if (newUser) {
                    userMetaStore.initialize();
                    userGearsStore.initialize();
                    userTripsStore.initialize();
                } else {
                    userMetaStore.destroy();
                    userGearsStore.destroy();
                    userTripsStore.destroy();
                }
            },
            { immediate: true },
        );
    });
});
