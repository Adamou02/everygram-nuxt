<template>
    <SectionPanel>
        <template #header>
            <SectionTitleBar
                class="p-3 bg-white border-round-top-md h-5rem"
                sticky
            >
                <h2>{{ title }}</h2>
                <slot name="header-actions" />
            </SectionTitleBar>
        </template>
        <div
            v-for="category in displayConsumableCatergories"
            :key="category"
            class="flex flex-column gap-3"
        >
            <CategoryHeader
                :category="category"
                type="consumable"
                :weight="consumableWeightByCategory[category]"
            >
                <template #actions>
                    <slot name="category-actions" :category="category" />
                </template>
            </CategoryHeader>
            <slot
                name="category-body"
                :category="category"
                :consumables="consumablesByCategory[category]"
            />
        </div>
    </SectionPanel>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string;
    consumables: ConsumableWithIndex[];
}>();

const consumablesByCategory = computed(() =>
    dataUtils.groupConsumablesByCategory(props.consumables),
);

const displayConsumableCatergories = constants.CONSUMABLE_CATEGORY_KEYS.filter(
    (category) => consumablesByCategory.value[category]?.length,
);

const consumableWeightByCategory = computed(() =>
    _mapValues(consumablesByCategory.value, (consumables) =>
        _sumBy(consumables, (consumable) => +consumable.weight || 0),
    ),
);
</script>
