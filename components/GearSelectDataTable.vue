<template>
    <PrimeDataTable
        :selection="selectedGears"
        @update:selection="
            (newSelectedGears: T[]) => $emit('update', newSelectedGears)
        "
        selectionMode="multiple"
        :value="selectableGears"
        size="large"
        :dataKey="dataKey"
        class="select-none"
    >
        <PrimeColumn selectionMode="multiple" />
        <PrimeColumn field="name" :header="$t('LABEL_NAME')" />
        <PrimeColumn
            field="weight"
            :header="$t('LABEL_WEIGHT')"
            class="text-right"
        >
            <template #body="{ data }">
                {{ data.weight ? formatWeight(data.weight) : '-' }}
            </template>
        </PrimeColumn>
        <!-- desktop category -->
        <PrimeColumn
            field="category"
            :header="$t('LABEL_CATEGORY')"
            class="hide-in-mobile"
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
        <PrimeColumn field="category" class="lg:hidden">
            <template #body="{ data }">
                <GearCategoryAvatar :category="data.category" size="small" />
            </template>
        </PrimeColumn>
    </PrimeDataTable>
</template>

<script
    setup
    lang="ts"
    generic="T extends { name: string; weight: number; category: GearCategory }"
>
const props = defineProps<{
    selectableGears: T[];
    selectedGears: T[];
    dataKey: string;
}>();
const emit = defineEmits<{
    update: [selectedGears: T[]];
}>();
const { gearCategoryToLabel, formatWeight } = useLangUtils();
</script>
