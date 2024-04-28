export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook("app:beforeMount", () => {
        const userStore = useUserStore();
        userStore.initialize();
    });
});
