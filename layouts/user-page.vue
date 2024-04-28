<template>
    <div>user page</div>
    <slot />
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
