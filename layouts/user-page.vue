<template>
    <AppHeader>
        <template #navigation>
            <UserNavButtons />
        </template>
        <template #actions>
            <UserMenu />
        </template>
        <template #menu>
            <UserMobileMenu />
        </template>
    </AppHeader>
    <div class="user-page">
        <slot />
    </div>
    <AppFooter />
</template>

<script setup lang="ts">
const userGearsStore = useUserGearsStore();
const userTripsStore = useUserTripsStore();
const userStore = useUserStore();
onBeforeMount(() => {
    userGearsStore.initialize();
    userTripsStore.initialize();
    userStore.initialize();
});
onUnmounted(() => {
    userGearsStore.destroy();
    userTripsStore.destroy();
    userStore.destroy();
});
</script>

<style lang="scss">
@import '~/assets/theme/primeflex/core/_variables.scss';

.user-page {
    max-width: 900px;
    min-height: 100vh;
    margin: auto;
    padding: 40px 20px;

    @media (max-width: $lg) {
        padding: 20px;
    }
}
</style>
