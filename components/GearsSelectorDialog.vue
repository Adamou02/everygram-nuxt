<template>
    <div>
        <PrimeDialog
            :visible="isOpen"
            :header="$t('ACTION_SELECT_GEARS')"
            modal
            @update:visible="(value: boolean) => !value && $emit('cancel')"
        >
            <PrimeDataTable
                v-model:selection="selectedGears"
                selectionMode="multiple"
                :value="notSelectedGears"
                dataKey="id"
            >
                <PrimeColumn selectionMode="multiple" />
                <PrimeColumn field="name" :header="$t('LABEL_NAME')" sortable />
                <PrimeColumn
                    field="weight"
                    :header="$t('LABEL_WEIGHT')"
                    class="text-right"
                    sortable
                >
                    <template #body="{ data }">
                        {{ data.weight ? formatWeight(data.weight) : '-' }}
                    </template>
                </PrimeColumn>
                <PrimeColumn
                    field="category"
                    :header="$t('LABEL_CATEGORY')"
                    sortable
                >
                    <template #body="{ data }">
                        <div class="flex align-items-center gap-2">
                            <GearCategoryAvatar
                                :category="data.category"
                                size="small"
                            />
                            {{ gearCategoryToLabel(data.category) }}
                        </div>
                    </template>
                </PrimeColumn>
            </PrimeDataTable>
            <template #footer>
                <div
                    class="flex justify-content-between align-items-center w-full"
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
}>();
const emit = defineEmits<{
    complete: [selectedGears: TripGear[]];
    cancel: [];
}>();

const { gearCategoryToLabel, formatWeight } = useLangUtils();
const userGearsStore = useUserGearsStore();
const { gears } = storeToRefs(userGearsStore);
const notSelectedGears = computed(() =>
    gears.value.filter((gear) => !props.selectedGearIds.includes(gear.id)),
);
const selectedGears = ref<Gear[]>([]);
const weightOfSelectedGears = computed(() =>
    _sum(selectedGears.value.map((gear) => +gear.weight || 0)),
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
