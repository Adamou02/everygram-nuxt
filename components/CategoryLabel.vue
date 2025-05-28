<template>
    <div class="category-label flex align-items-center gap-2">
        <template v-if="isGearCategory">
            <GearCategoryAvatar :category="gearCategory" size="small" />
            <div>{{ gearCategoryToLabel(gearCategory) }}</div>
        </template>
        <template v-else>
            <ConsumableCategoryAvatar
                :category="consumableCategory"
                size="small"
            />
            <div>
                {{ consumableCategoryToLabel(consumableCategory) }}
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    category: GearCategory | ConsumableCategory;
}>();

const isGearCategory = computed(() =>
    constants.GEAR_CATEGORY_KEYS.includes(props.category as GearCategory),
);
const gearCategory = computed(() => props.category as GearCategory);
const consumableCategory = computed(() => props.category as ConsumableCategory);

const { gearCategoryToLabel, consumableCategoryToLabel } = useLangUtils();
</script>
