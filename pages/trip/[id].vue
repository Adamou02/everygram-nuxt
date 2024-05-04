<!-- A page to show data of a trip -->
<template>
    <div class="flex flex-column gap-5">
        <img
            src="/image/illustration/illu-mountains.jpg"
            alt=""
            class="w-full border-round-md"
        />
        <template v-if="trip">
            <div>
                <h1>{{ trip.title }}</h1>
                <p>{{ trip.description }}</p>
            </div>
            <div class="flex justify-content-between align-items-center">
                <div class="text-color-secondary">
                    {{ $t('LABEL_WEIGHT_TOTAL') }}:
                    {{ formatWeight(getTripWeightTotal(trip)) }}
                </div>
                <div>
                    <ActionButtonsGroup
                        type="text"
                        :actions="[
                            {
                                label: $t('ACTION_SELECT_GEARS'),
                                onClick: () => (isSelectingGears = true),
                            },
                            {
                                label: $t('ACTION_ADD_NEW_GEAR'),
                                onClick: () => onAddGear(),
                            },
                            {
                                label: $t('ACTION_EDIT_TRIP'),
                                onClick: () => trip && onEditTrip(trip),
                            },
                        ]"
                    />
                </div>
            </div>
            <div class="flex flex-column gap-5">
                <div v-for="category in displayCatergories" :key="category">
                    <div
                        class="flex justify-content-between align-items-center"
                    >
                        <GearCategoryHeader
                            :category="category"
                            :weight="weightByCategory[category]"
                        />
                    </div>
                    <PrimeDataTable
                        :value="gearsInTripByCategory[category]"
                        dataKey="id"
                        edit-mode="cell"
                        @cell-edit-complete="onCellEditComplete"
                    >
                        <PrimeColumn field="name" :header="$t('LABEL_NAME')">
                            <template #editor="{ data, field }">
                                <PrimeInputText
                                    v-model="data[field]"
                                    class="w-10rem"
                                />
                            </template>
                        </PrimeColumn>
                        <PrimeColumn
                            field="weight"
                            :header="$t('LABEL_WEIGHT')"
                            class="w-10rem"
                        >
                            <template #body="{ data }">
                                {{
                                    data.weight
                                        ? formatWeight(data.weight)
                                        : '-'
                                }}
                            </template>
                            <template #editor="{ data, field }">
                                <PrimeInputGroup>
                                    <PrimeInputNumber v-model="data[field]" />
                                    <PrimeInputGroupAddon
                                        >g</PrimeInputGroupAddon
                                    >
                                </PrimeInputGroup>
                            </template>
                        </PrimeColumn>
                        <PrimeColumn
                            field="quantity"
                            :header="$t('LABEL_QUANTITY')"
                            class="w-5rem"
                        >
                            <template #editor="{ data, field }">
                                <PrimeInputNumber
                                    v-model="data[field]"
                                    :min="1"
                                    class="w-3rem"
                                />
                            </template>
                        </PrimeColumn>
                        <PrimeColumn :exportable="false" class="w-3rem">
                            <template #body="{ data }">
                                <MoreActionsMenuButton
                                    :items="[
                                        {
                                            icon: 'pi pi-pencil',
                                            label: $t('ACTION_EDIT'),
                                            command: () => {
                                                onEditGear(data);
                                            },
                                        },
                                        {
                                            icon: 'pi pi-times',
                                            label: $t('ACTION_REMOVE'),
                                            command: () => {
                                                onRemoveGear(data.id);
                                            },
                                        },
                                    ]"
                                />
                            </template>
                        </PrimeColumn>
                    </PrimeDataTable>
                </div>
            </div>

            <GearsSelectorDialog
                :is-open="isSelectingGears"
                :selected-gear-ids="selectedGearIds"
                @complete="onCompletSelectGears"
                @cancel="isSelectingGears = false"
            />
            <GearEditorDialog
                :is-open="isAddingGear || isEditingGear"
                :gear="editingGear"
                @complete-add="onCompleteAddGearInTrip"
                @complete-edit="onCompleteEditGear"
                @cancel="onCancelEditGear"
            />
            <TripInfoEditorDialog
                :is-open="isEditingTrip"
                :trip="editingTrip"
                @complete-edit="onCompleteEditTrip"
                @cancel="onCancelEditTrip"
            />
        </template>
        <template v-else-if="isFetchingTrips">
            <p>Loading...</p>
        </template>
        <template v-else>
            <p>Trip not found</p>
        </template>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth-guard'],
    layout: 'user-page',
});
const userTripsStore = useUserTripsStore();
const userGearsStore = useUserGearsStore();

const route = useRoute();
const tripId = route.params.id as string;
const { trips, isFetchingTrips } = storeToRefs(userTripsStore);
const trip = computed(() =>
    trips.value.find((trip: Trip) => trip.id === tripId),
);
const gearsInTrip = computed(() =>
    trip.value
        ? _filter(
              _map(trip.value.gears, (gear) => ({
                  ...userGearsStore.getGearById(gear.id),
                  quantity: gear.quantity,
              })),
          )
        : [],
);
const gearsInTripByCategory = computed(() =>
    gearUtils.groupGearsByCategory(gearsInTrip.value),
);
const displayCatergories = computed(() =>
    constants.GEAR_CATEGORY_KEYS.filter(
        (category) => gearsInTripByCategory.value[category],
    ),
);
const weightByCategory = computed(() =>
    _mapValues(gearsInTripByCategory.value, (gears) =>
        _sumBy(
            gears,
            (gear) =>
                (gear.weight || 0) *
                (trip.value ? trip.value.gears[gear.id]?.quantity : 0),
        ),
    ),
);

const { formatWeight } = useLangUtils();
const { getTripWeightTotal } = useDataUtils();

// for gear selector
const isSelectingGears = ref<boolean>(false);
const selectedGearIds = computed(() =>
    trip.value ? Object.keys(trip.value.gears) : [],
);
const onCompletSelectGears = (selectedGears: TripGear[]) => {
    userTripsStore.setGearsToTrip(tripId, selectedGears);
    isSelectingGears.value = false;
};

// for GearEditorDialog
const {
    isAddingGear,
    isEditingGear,
    editingGear,
    onAddGear,
    onEditGear,
    onCompleteAddGear,
    onCompleteEditGear,
    onCancelEditGear,
} = useEditGear();

const onCompleteAddGearInTrip = (gear: Gear) => {
    userTripsStore.setGearsToTrip(tripId, [{ id: gear.id, quantity: 1 }]);
    onCompleteAddGear();
};

const onRemoveGear = (gearId: string) => {
    userTripsStore.removeGearsFromTrip(tripId, [gearId]);
};

// for TripInfoEditorDialog
const {
    isEditingTrip,
    editingTrip,
    onEditTrip,
    onCompleteEditTrip,
    onCancelEditTrip,
} = useEditTrip();

// for edit gear in table
const onCellEditComplete = async (e: {
    data: Gear & { quantity: number };
    newValue: any;
    field: string;
}) => {
    const { data, newValue, field } = e;
    switch (field) {
        case 'quantity':
            await userTripsStore.setGearsToTrip(tripId, [
                { id: data.id, quantity: newValue },
            ]);
            break;
        case 'name':
            await userGearsStore.updateGear({
                id: data.id,
                gear: {
                    name: newValue,
                },
            });
            break;
        case 'weight':
            await userGearsStore.updateGear({
                id: data.id,
                gear: {
                    weight: newValue,
                },
            });
            break;
    }
};
</script>
