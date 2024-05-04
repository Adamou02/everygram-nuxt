<template>
    <div class="user-page flex flex-row">
        <div class="flex-grow-0 px-6 py-8 w-20rem">
            <UserPageNavMenu />
        </div>
        <div class="flex-grow-1 px-6 py-8">
            <slot />
        </div>
    </div>
    <PrimeToast position="bottom-right" />
    <PrimeConfirmDialog />
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
@import '~/assets/theme/themes/mytheme/_variables.scss';

.user-page {
    border-top: 8px solid $eg-c-primary;
}
</style>
