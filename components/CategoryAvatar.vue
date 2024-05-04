<template>
    <div
        :class="['category-avatar', `category-avatar--${size}`]"
        :style="{
            backgroundColor: constants.GEAR_CATEGORIES[formattedCategory].color,
        }"
    >
        <div class="category-avatar__icon material-symbols-outlined">
            {{ constants.GEAR_CATEGORIES[formattedCategory].icon }}
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    category?: GearCategory;
    size: 'small' | 'medium' | 'large';
}>();

const formattedCategory = computed(() => {
    return props.category &&
        constants.GEAR_CATEGORY_KEYS.includes(props.category)
        ? props.category
        : 'others';
});
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
