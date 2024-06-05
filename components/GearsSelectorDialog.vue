<template>
    <div>
        <PrimeDialog
            :visible="isOpen"
            :header="$t('ACTION_SELECT_GEARS')"
            modal
            @update:visible="(value: boolean) => !value && $emit('cancel')"
            class="w-full h-full mx-2"
            style="max-width: 800px"
            :pt="{ content: { class: 'p-0 flex-1' } }"
        >
            <EmptyState
                v-if="!selectableGears.length"
                :title="$t('INFO_NO_GEARS_TO_SELECT')"
                :description="
                    gearsInCategories.length ? noSelectableHint : noGearHint
                "
                image-src="/image/empty-gear-select.jpg"
            >
                <template v-if="!gears.length" #actions>
                    <NuxtLink to="/gears">
                        <PrimeButton
                            :label="$t('ACTION_CREATE_GEAR_IN_GEARS')"
                            rounded
                            outlined
                            icon="pi pi-arrow-right"
                            icon-pos="right"
                        />
                    </NuxtLink>
                </template>
            </EmptyState>
            <template v-else>
                <PrimeIconField class="m-2 lg:m-3" iconPosition="left">
                    <PrimeInputIcon class="pi pi-search" />
                    <PrimeInputText
                        v-model="filters.name.value"
                        :placeholder="$t('ACTION_SEARCH_BY_NAME')"
                        class="w-full"
                    />
                </PrimeIconField>
                <GearSelectDataTable
                    :show-photo="true"
                    :selectableGears="selectableGears"
                    :selectedGears="selectedGears"
                    :filters="filters"
                    dataKey="id"
                    @update="
                        (newSelectedGears) => (selectedGears = newSelectedGears)
                    "
                />
            </template>
            <template v-if="selectableGears.length" #footer>
                <div
                    class="flex justify-content-between align-items-center gap-3 w-full"
                >
                    <div class="flex-1">
                        {{
                            $t(
                                'INFO_SELECTED_GEAR_NUM',
                                {
                                    num: selectedGears.length,
                                },
                                selectedGears.length,
                            )
                        }}
                        |
                        <span class="white-space-nowrap">
                            {{ formatWeight(weightOfSelectedGears) }}
                        </span>
                    </div>
                    <div class="flex flex-row gap-2">
                        <PrimeButton
                            :label="$t('ACTION_CANCEL')"
                            text
                            rounded
                            severity="secondary"
                            @click="$emit('cancel')"
                        />
                        <PrimeButton
                            rounded
                            :label="$t('ACTION_ADD')"
                            :disabled="!selectedGears.length"
                            @click="onSubmit()"
                        />
                    </div>
                </div>
            </template>
        </PrimeDialog>
    </div>
</template>

<script setup lang="ts">
import GearSelectDataTable from './GearSelectDataTable.vue';
import { FilterMatchMode } from 'primevue/api';

const props = defineProps<{
    isOpen: boolean;
    selectedGearIds: string[];
    categories?: GearCategory[];
    noGearHint?: string;
    noSelectableHint?: string;
}>();
const emit = defineEmits<{
    complete: [selectedGears: TripGear[]];
    cancel: [];
}>();

const { formatWeight } = useLangUtils();
const userGearsStore = useUserGearsStore();
const { gears } = storeToRefs(userGearsStore);
const gearsInCategories = computed(() =>
    gears.value.filter(
        (gear) => !props.categories || props.categories.includes(gear.category),
    ),
);
const selectableGears = computed<Gear[]>(() =>
    _sortBy(
        gearsInCategories.value.filter(
            (gear) => !props.selectedGearIds.includes(gear.id),
        ),
        (gear) => constants.GEAR_CATEGORY_KEYS.indexOf(gear.category),
        (gear) => -gear.weight,
    ),
);
const selectedGears = ref<Gear[]>([]);
const weightOfSelectedGears = computed(() =>
    _sum(selectedGears.value.map((gear) => +gear.weight || 0)),
);

watch(
    () => props.isOpen,
    (isOpen) => {
        if (isOpen) {
            selectedGears.value = [];
        }
    },
);

const filters = ref({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const onSubmit = () => {
    emit(
        'complete',
        selectedGears.value.map(
            (gear) =>
                ({
                    id: gear.id,
                    quantity: 1,
                }) as TripGear,
        ),
    );
};
</script>
