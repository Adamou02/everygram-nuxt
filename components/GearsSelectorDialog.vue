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
                    gears.length
                        ? gears.length === selectedGearIds.length
                            ? $t('INFO_ALL_GEARS_HAVE_BEEN_ADDED_TO_TRIP')
                            : ''
                        : $t('INFO_NO_USER_GEARS')
                "
                image-src="/image/illustration/illu-adventure.svg"
            >
            </EmptyState>
            <PrimeDataTable
                v-else
                v-model:selection="selectedGears"
                selectionMode="multiple"
                :value="selectableGears"
                size="large"
                dataKey="id"
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
                        <GearCategoryAvatar
                            :category="data.category"
                            size="small"
                        />
                    </template>
                </PrimeColumn>
            </PrimeDataTable>
            <template #footer>
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
                    <div>
                        <PrimeButton
                            :label="$t('ACTION_CANCEL')"
                            text
                            severity="secondary"
                            @click="$emit('cancel')"
                        />
                        <PrimeButton
                            :label="$t('ACTION_ADD')"
                            @click="onSubmit()"
                        />
                    </div>
                </div>
            </template>
        </PrimeDialog>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    isOpen: boolean;
    selectedGearIds: string[];
    categories?: GearCategory[];
}>();
const emit = defineEmits<{
    complete: [selectedGears: TripGear[]];
    cancel: [];
}>();

const { gearCategoryToLabel, formatWeight } = useLangUtils();
const userGearsStore = useUserGearsStore();
const { gears } = storeToRefs(userGearsStore);
const selectableGears = computed(() =>
    _sortBy(
        gears.value.filter(
            (gear) =>
                !props.selectedGearIds.includes(gear.id) &&
                (!props.categories || props.categories.includes(gear.category)),
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
