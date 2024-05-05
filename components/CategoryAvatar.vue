<template>
    <div
        :class="['category-avatar', `category-avatar--${size}`]"
        :style="{
            backgroundColor,
        }"
    >
        <div class="category-avatar__icon material-symbols-outlined">
            {{ icon }}
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    icon: string;
    size: 'small' | 'medium' | 'large';
    backgroundColor: string;
}>();
</script>

<style lang="scss">
.category-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    color: white;
    --icon-size: 1rem;
    &--small {
        width: 1.4rem;
        height: 1.4rem;
        --icon-size: 1em;
    }
    &--medium {
        width: 2.2rem;
        height: 2.2rem;
        --icon-size: 1.4rem;
    }
    &--large {
        width: 3rem;
        height: 3rem;
        --icon-size: 2rem;
    }
    &__icon {
        font-size: var(--icon-size);
    }
}
</style>
