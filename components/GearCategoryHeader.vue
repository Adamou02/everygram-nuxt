<template>
    <div class="flex justify-content-between align-items-center">
        <div class="flex align-items-center gap-2">
            <CategoryAvatar :category="category" size="medium" />
            <h3>{{ categoryToLabel(category) }}</h3>
            <template v-if="weight !== undefined">
                <div>|</div>
                <div class="text-color-secondary">
                    {{ formatWeight(weight) }}
                </div>
            </template>
        </div>
        <div>
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    category: GearCategory;
    weight?: number;
}>();

const { categoryToLabel, formatWeight } = useLangUtils();
</script>
