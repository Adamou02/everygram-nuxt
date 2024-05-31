<template>
    <div
        :class="[
            'section-title-bar flex justify-content-between align-items-center',
            { 'section-title-bar--sticky sticky z-1': sticky },
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
    &--sticky {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(6px);
    }
}
</style>
