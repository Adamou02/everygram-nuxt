<template>
    <div class="flex justify-content-between align-items-center">
        <div class="flex align-items-center gap-2">
            <template v-if="type === 'gear'">
                <GearCategoryAvatar
                    v-if="type === 'gear'"
                    :category="category as GearCategory"
                    size="medium"
                />
                <h3>{{ gearCategoryToLabel(category as GearCategory) }}</h3>
            </template>
            <template v-if="type === 'consumable'">
                <ConsumableCategoryAvatar
                    v-if="type === 'consumable'"
                    :category="category as ConsumableCategory"
                    size="medium"
                />
                <h3>
                    {{
                        consumableCategoryToLabel(
                            category as ConsumableCategory,
                        )
                    }}
                </h3>
            </template>
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
    type: 'consumable' | 'gear';
    category: GearCategory | ConsumableCategory;
    weight?: number;
}>();

const { gearCategoryToLabel, consumableCategoryToLabel, formatWeight } =
    useLangUtils();
</script>
