<template>
    <PrimeDataTable
        :filters="filters"
        :globalFilterFields="['name', 'formattedBrand']"
        :selection="selectedGears"
        @update:selection="
            (newSelectedGears: T[]) => $emit('update', newSelectedGears)
        "
        selectionMode="multiple"
        :value="formattedGears"
        size="large"
        :dataKey="dataKey"
        class="select-none"
    >
        <PrimeColumn selectionMode="multiple" class="w-2rem" />
        <!-- hide photo on mobile due to limited space -->
        <PrimeColumn
            v-if="showPhoto"
            field="photo"
            :header="$t('LABEL_PHOTO')"
            class="hide-in-mobile w-3rem"
        >
            <template #body="{ data }">
                <GearPhoto
                    class="w-3rem h-3rem lg:w-4rem lg:h-4rem"
                    :gear="data"
                    readonly
                />
            </template>
        </PrimeColumn>
        <PrimeColumn field="name" :header="$t('LABEL_NAME')">
            <template #body="{ data }">
                <GearNameWithBrand :gear="data" />
            </template>
        </PrimeColumn>
        <PrimeColumn
            field="formattedWeight"
            :header="$t('LABEL_WEIGHT')"
            class="text-right w-5rem"
        />
        <!-- desktop category -->
        <PrimeColumn
            field="category"
            :header="$t('LABEL_CATEGORY')"
            class="hide-in-mobile w-10rem"
        >
            <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                    <GearCategoryAvatar
                        :category="data.category"
                        size="small"
                    />
                    <div>
                        {{ gearCategoryToLabel(data.category) }}
                    </div>
                </div>
            </template>
        </PrimeColumn>
        <!-- mobile category -->
        <PrimeColumn field="category" class="lg:hidden w-2rem">
            <template #body="{ data }">
                <GearCategoryAvatar :category="data.category" size="small" />
            </template>
        </PrimeColumn>
    </PrimeDataTable>
</template>

<script
    setup
    lang="ts"
    generic="
        T extends {
            name: string;
            weight: number;
            category: GearCategory;
            brand?: GearBrand;
        }
    "
>
const props = defineProps<{
    selectableGears: T[];
    selectedGears: T[];
    dataKey: string;
    showPhoto?: boolean;
    filters?: Record<string, any>;
}>();
const emit = defineEmits<{
    update: [selectedGears: T[]];
}>();
const formattedGears = computed(() => {
    return props.selectableGears.map((gear) => ({
        ...gear,
        formattedBrand: gear.brand ? formatBrand(gear.brand) : '',
        formattedWeight: gear.weight ? formatWeight(gear.weight) : '-',
    }));
});
const { gearCategoryToLabel, formatWeight, formatBrand } = useLangUtils();
</script>
