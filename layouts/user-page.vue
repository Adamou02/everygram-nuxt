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
onBeforeMount(() => {
    userGearsStore.initialize();
    userTripsStore.initialize();
});
onUnmounted(() => {
    userGearsStore.destroy();
    userTripsStore.destroy();
});
</script>

<style lang="scss">
@import '~/assets/theme/primeflex/core/_variables.scss';

.user-page {
    max-width: 1200px;
    min-height: 100vh;
    margin: auto;
    padding: 16px;

    @media (min-width: $lg) {
        padding: 24px;
    }
}
</style>
