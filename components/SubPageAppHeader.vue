<template>
    <template v-if="shouldRender">
        <Teleport to="#app-header-navigation-slot">
            <slot name="navigation" />
        </Teleport>
        <Teleport to="#app-header-mobile-actions-slot">
            <slot name="mobile-actions" />
        </Teleport>
    </template>
</template>

<script setup lang="ts">
const shouldRender = ref(false);
onMounted(() => {
    // wait for the next tick to ensure the target slots are rendered
    shouldRender.value = true;
});
</script>
