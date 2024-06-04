<template>
    <div>
        <PrimeIconField class="m-2 lg:m-3" iconPosition="left">
            <PrimeInputIcon class="pi pi-search" />
            <PrimeInputText
                v-model="filters.name.value"
                :placeholder="$t('ACTION_SEARCH_BY_NAME')"
                class="w-full"
            />
        </PrimeIconField>
        <PrimeDataTable
            :filters="filters"
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
            <PrimeColumn field="name" :header="$t('LABEL_NAME')" />
            <PrimeColumn
                field="weight"
                :header="$t('LABEL_WEIGHT')"
                class="text-right w-5rem"
            >
                <template #body="{ data }">
                    {{ data.weight ? formatWeight(data.weight) : '-' }}
                </template>
            </PrimeColumn>
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
                    <GearCategoryAvatar
                        :category="data.category"
                        size="small"
                    />
                </template>
            </PrimeColumn>
        </PrimeDataTable>
    </div>
</template>

<script
    setup
    lang="ts"
    generic="T extends { name: string; weight: number; category: GearCategory }"
>
import { FilterMatchMode } from 'primevue/api';
const props = defineProps<{
    selectableGears: T[];
    selectedGears: T[];
    dataKey: string;
    showPhoto?: boolean;
}>();
const emit = defineEmits<{
    update: [selectedGears: T[]];
}>();
const { gearCategoryToLabel, formatWeight } = useLangUtils();

const filters = ref({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
</script>
