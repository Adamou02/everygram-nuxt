<template>
    <div>
        <PrimeDialog
            :visible="isOpen"
            :header="$t('ACTION_SELECT_GEARS')"
            modal
            @update:visible="(value: boolean) => !value && $emit('cancel')"
            class="w-full mx-2 lg:w-auto"
            :pt="{ content: { class: 'p-0 lg:px-4 lg:py-3' } }"
        >
            <EmptyState
                v-if="!selectableGears.length"
                :title="$t('INFO_NO_GEARS_TO_SELECT')"
                :description="
                    gearsInCategories.length ? noSelectableHint : noGearHint
                "
                image-src="/image/illustration/illu-adventure.svg"
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
            <GearSelectDataTable
                v-else
                :show-photo="true"
                :selectableGears="selectableGears"
                :selectedGears="selectedGears"
                dataKey="id"
                @update="
                    (newSelectedGears) => (selectedGears = newSelectedGears)
                "
            />
            <template v-if="selectableGears.length" #footer>
                <div
                    class="flex justify-content-between align-items-center gap-3 w-full"
                >
                    <div>
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
                        {{ formatWeight(weightOfSelectedGears) }}
                    </div>
                    <div class="flex flex-row flex-wrap gap-2">
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
