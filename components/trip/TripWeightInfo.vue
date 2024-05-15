<template>
    <div
        class="flex flex-column static lg:sticky"
        style="top: var(--app-header-height)"
    >
        <div
            :class="[
                'flex flex-column gap-3 p-3 bg-white border-round-top-md',
                { 'border-round-bottom-md': !wornGears.length },
            ]"
        >
            <div class="flex justify-content-between text-lg">
                <div>
                    {{ $t('LABEL_PACK_WEIGHT') }}
                </div>
                <div>
                    {{ formatWeight(backpackWeight) }}
                </div>
            </div>
            <WeightBarChart :items="backpackWeightItems" :showLabel="true" />
            <div
                class="flex justify-content-between surface-200 p-3 border-round-md"
            >
                <div>
                    {{ $t('LABEL_BASE_WEIGHT') }}
                </div>
                <div>
                    {{ formatWeight(gearsWeight) }}
                </div>
            </div>
            <div
                class="flex justify-content-between surface-200 p-3 border-round-md"
            >
                <div>
                    {{ $t('LABEL_CONSUMABLES') }}
                </div>
                <div>
                    {{ formatWeight(consumablesWeight) }}
                </div>
            </div>
        </div>
        <div
            v-if="wornGears.length"
            class="flex flex-column gap-3 p-3 bg-white border-round-bottom-md border-top-solid border-top-1 border-200"
        >
            <div
                class="flex justify-content-between surface-200 p-3 border-round-md"
            >
                <div>
                    {{ $t('LABEL_WORN_GEARS') }}
                </div>
                <div>
                    {{ formatWeight(wornGearsWeight) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    gears: GearWithQuantity[];
    wornGears: GearWithQuantity[];
    consumables: Consumable[];
}>();
const i18n = useI18n();
const { formatWeight, gearCategoryToLabel, consumableCategoryToLabel } =
    useLangUtils();

// consumables
const consumablesByCategory = computed(() =>
    dataUtils.groupConsumablesByCategory(props.consumables),
);
const consumableWeightByCategory = computed(() =>
    _mapValues(consumablesByCategory.value, (consumables) =>
        _sumBy(consumables, (consumable) => +consumable.weight || 0),
    ),
);
const consumablesWeightItems = computed<WeightBarChartSubItem[]>(() =>
    Object.entries(consumableWeightByCategory.value).map(
        ([category, weight]) => ({
            label: consumableCategoryToLabel(category as ConsumableCategory),
            weight,
        }),
    ),
);
const consumablesWeight = computed(() => _sumBy(props.consumables, 'weight'));

// gears
const gearsByCategory = computed(() =>
    dataUtils.groupGearsByCategory(props.gears),
);
const gearWeightByCategory = computed(() =>
    _mapValues(gearsByCategory.value, (gears) =>
        _sumBy(gears, (gear) => (+gear.weight || 0) * gear.quantity),
    ),
);
const gearsWeight = computed(() =>
    _sumBy(props.gears, (gear) => (+gear.weight || 0) * gear.quantity),
);

// backpack weight
const backpackWeight = computed(
    () => gearsWeight.value + consumablesWeight.value,
);
const backpackWeightItems = computed<WeightBarChartItem[]>(() => [
    ...Object.entries(gearWeightByCategory.value).map(([category, weight]) => ({
        label: gearCategoryToLabel(category as GearCategory),
        weight,
        color: constants.GEAR_CATEGORIES[category as GearCategory].color,
    })),
    {
        label: i18n.t('LABEL_CONSUMABLES'),
        weight: consumablesWeight.value,
        color: constants.COLORS.CONSUMABLES_WEIGHT,
        addBorder: true,
        subItems: consumablesWeightItems.value,
    },
]);

// worn gears
const wornGearsWeight = computed(() =>
    _sumBy(props.wornGears, (gear) => (+gear.weight || 0) * gear.quantity),
);
</script>
