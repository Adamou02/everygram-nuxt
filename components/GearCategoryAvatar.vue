<template>
    <CategoryAvatar
        :size="size"
        :background-color="constants.GEAR_CATEGORIES[formattedCategory].color"
        :icon="constants.GEAR_CATEGORIES[formattedCategory].icon"
    />
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
