<template>
    <CategoryAvatar
        :size="size"
        :background-color="
            constants.CONSUMABLE_CATEGORIES[formattedCategory].color
        "
        :icon="constants.CONSUMABLE_CATEGORIES[formattedCategory].icon"
    />
</template>

<script setup lang="ts">
const props = defineProps<{
    category?: ConsumableCategory;
    size: 'small' | 'medium' | 'large';
}>();

const formattedCategory = computed(() => {
    return props.category &&
        constants.CONSUMABLE_CATEGORY_KEYS.includes(props.category)
        ? props.category
        : 'others';
});
</script>
