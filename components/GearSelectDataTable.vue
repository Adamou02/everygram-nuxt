<template>
    <PrimeDataTable
        :filters="filters"
        :globalFilterFields="['name', 'formattedBrand']"
        :selection="selectedGears"
        @update:selection="
            (newSelectedGears: FormattedGear[]) => {
                selectedGears = newSelectedGears;
                $emit(
                    'update',
                    newSelectedGears
                        .filter(
                            // filter out disabled gears
                            (gear) => !gear.isDisabled,
                        )
                        .map((gear) => gear._index),
                );
            }
        "
        selectionMode="multiple"
        :value="formattedGears"
        size="large"
        :dataKey="dataKey"
        class="select-none"
        :rowClass="
            (rowData) =>
                getIsDisabled?.(rowData) ? 'gear-select-data-row--diabled' : ''
        "
    >
        <PrimeColumn selectionMode="multiple" class="w-2rem" />
        <!-- hide photo on mobile due to limited space -->
        <PrimeColumn
            v-if="showPhoto && isLargeScreen"
            field="photo"
            :header="$t('LABEL_PHOTO')"
            class="w-3rem"
        >
            <template #body="{ data }">
                <GearPhoto :gear="data" :size="isLargeScreen ? 'sm' : 'xs'" />
            </template>
        </PrimeColumn>
        <!-- name -->
        <PrimeColumn field="name" :header="$t('LABEL_NAME')">
            <template #body="{ data }">
                <GearNameWithBrand :gear="data" />
            </template>
        </PrimeColumn>
        <!-- weight -->
        <PrimeColumn
            field="formattedWeight"
            :header="$t('LABEL_WEIGHT')"
            class="text-right w-5rem"
        >
            <template #body="{ data }">
                <div class="flex flex-column align-items-end gap-2">
                    <div>{{ data.formattedWeight }}</div>
                    <div v-if="data.gearHint" class="text-color-light text-sm">
                        {{ data.gearHint }}
                    </div>
                </div>
            </template>
        </PrimeColumn>
        <!-- desktop category -->
        <PrimeColumn
            v-if="isLargeScreen"
            field="category"
            :header="$t('LABEL_CATEGORY')"
            class="w-10rem"
        >
            <template #body="{ data }">
                <CategoryLabel :category="data.category" />
            </template>
        </PrimeColumn>
        <!-- mobile category -->
        <PrimeColumn v-else field="category" class="w-2rem">
            <template #body="{ data }">
                <GearCategoryAvatar :category="data.category" size="small" />
            </template>
        </PrimeColumn>
        <!-- additional field: description -->
        <PrimeColumn
            v-if="additionalFields?.includes('description')"
            field="description"
            :header="$t('LABEL_DESCRIPTION')"
        >
            <template #body="{ data }">
                <div class="w-10rem text-ellipsis">{{ data.description }}</div>
            </template>
        </PrimeColumn>
        <!-- additional field: currency -->
        <PrimeColumn
            v-if="additionalFields?.includes('currency')"
            field="currency"
            :header="$t('LABEL_CURRENCY')"
            class="white-space-nowrap"
        />
        <!-- additional field: price -->
        <PrimeColumn
            v-if="additionalFields?.includes('price')"
            field="price"
            :header="$t('LABEL_PRICE')"
            class="text-right white-space-nowrap"
        />
        <!-- additional field: acquired date -->
        <PrimeColumn
            v-if="additionalFields?.includes('acquiredDate')"
            field="acquiredDate"
            :header="$t('LABEL_ACQUIRED_DATE')"
            class="white-space-nowrap"
        />
    </PrimeDataTable>
</template>

<script setup lang="ts">
const props = defineProps<{
    selectableGears: Gear[];
    selectedIndices: number[];
    dataKey: string;
    showPhoto?: boolean;
    filters?: Record<string, any>;
    additionalFields?: (keyof Gear)[];
    getIsDisabled?: (gear: Gear) => boolean;
    getGearHint?: (gear: Gear) => string;
}>();
const emit = defineEmits<{
    update: [selectedIndices: number[]];
}>();

const { formatWeight, formatBrand } = useLangUtils();
const { isLargeScreen } = useDeviceMeta();

type FormattedGear = Gear & {
    _index: number;
    formattedBrand: string;
    formattedWeight: string;
    isDisabled: boolean;
    gearHint: string;
};

const selectedGears = ref<FormattedGear[]>([]);
const formattedGears = computed<FormattedGear[]>(() => {
    return props.selectableGears.map((gear, index) => ({
        ...gear,
        _index: index,
        formattedBrand: gear.brand ? formatBrand(gear.brand) : '',
        formattedWeight: gear.weight ? formatWeight(gear.weight) : '-',
        isDisabled: !!props.getIsDisabled?.(gear),
        gearHint: props.getGearHint?.(gear) || '',
    }));
});

watch(
    () => props.selectedIndices,
    (newSelectedIndices) => {
        selectedGears.value = newSelectedIndices
            .map((index) => formattedGears.value[index])
            .filter(Boolean); // filter out undefined
    },
    { immediate: true },
);
</script>

<style lang="scss">
.gear-select-data-row--diabled {
    opacity: 0.5;
    pointer-events: none;
    .p-checkbox {
        visibility: hidden;
    }
}
</style>
