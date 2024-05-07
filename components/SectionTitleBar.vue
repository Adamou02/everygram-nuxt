<template>
    <div
        :class="[
            'section-title-bar flex justify-content-between align-items-center',
            { 'section-title-bar--sticky': sticky },
        ]"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    sticky?: boolean;
}>();
</script>

<style lang="scss">
.section-title-bar {
    top: var(--app-header-height);
    min-height: var(--app-header-height);
    &--sticky {
        position: sticky;
        z-index: 1;
        background-color: var(--app-background-color);
    }
}
</style>
