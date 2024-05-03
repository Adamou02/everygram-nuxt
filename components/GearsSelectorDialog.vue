<template>
    <div>
        <!-- show the ul by displayCatergories -->
        <PrimeDialog
            :visible="isOpen"
            :header="$t('ACTION_SELECT_GEARS')"
            modal
            @update:visible="(value: boolean) => !value && $emit('cancel')"
        >
            <PrimeDataTable
                v-model:selection="selectedGears"
                selectionMode="multiple"
                :value="gears"
                dataKey="id"
            >
                <PrimeColumn selectionMode="multiple" />
                <PrimeColumn field="name" :header="$t('LABEL_NAME')" sortable />
                <PrimeColumn
                    field="weight"
                    :header="$t('LABEL_WEIGHT')"
                    sortable
                >
                    <template #body="{ data }">
                        {{ formatWeight(data.weight) }}
                    </template>
                </PrimeColumn>
                <PrimeColumn
                    field="category"
                    :header="$t('LABEL_CATEGORY')"
                    sortable
                >
                    <template #body="{ data }">
                        {{ categoryToLabel(data.category) }}
                    </template>
                </PrimeColumn>
            </PrimeDataTable>
            <template #footer>
                <PrimeButton text severity="secondary" @click="$emit('cancel')">
                    {{ $t('ACTION_CANCEL') }}
                </PrimeButton>
                <PrimeButton @click="onSubmit()">
                    {{ $t('ACTION_CONFIRM') }}
                </PrimeButton>
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

const { categoryToLabel, formatWeight } = useLangUtils();
const userGearsStore = useUserGearsStore();
const { gears, gearMap } = storeToRefs(userGearsStore);
const selectedGears = ref<Gear[]>(
    props.selectedGearIds.map((id) => gearMap.value[id]),
);
const newSelectedTripGears = computed(() =>
    selectedGears.value
        .filter((gear) => !props.selectedGearIds.includes(gear.id))
        .map(
            (gear) =>
                ({
                    id: gear.id,
                    quantity: 1,
                }) as TripGear,
        ),
);
const onSubmit = () => {
    emit('complete', newSelectedTripGears.value);
};
</script>
