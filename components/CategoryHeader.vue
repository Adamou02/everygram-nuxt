<template>
    <div
        :class="[
            'category-header flex align-items-center gap-3',
            { 'sticky z-1': sticky },
        ]"
    >
        <div class="flex-1 flex align-items-center gap-3">
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
                <div
                    class="flex-1 border-none border-top-1 border-300 border-dashed"
                ></div>
                <div class="text-600">
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
    sticky?: boolean;
}>();

const { gearCategoryToLabel, consumableCategoryToLabel, formatWeight } =
    useLangUtils();
</script>

<style lang="scss">
.category-header {
    top: var(--app-header-height);
}
</style>
