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
                    analyticsUtils.log(constants.ANALYTICS_EVENTS.SIGN_IN);
                } else {
                    userGearsStore.destroy();
                    userTripsStore.destroy();
                    analyticsUtils.log(constants.ANALYTICS_EVENTS.SIGN_OUT);
                }
            },
            { immediate: true },
        );
    });
});
