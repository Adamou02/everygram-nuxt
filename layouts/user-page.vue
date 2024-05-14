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
    <div class="page-container">
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
