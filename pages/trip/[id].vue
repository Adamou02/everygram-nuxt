<!-- A page to show data of a trip -->
<template>
    <div>
        <img
            src="/image/illustration/illu-mountains.jpg"
            alt=""
            class="w-full border-round-md"
        />
        <template v-if="isFetchingTrips">
            <p>Loading...</p>
        </template>
        <template v-else-if="trip">
            <h1>{{ trip.title }}</h1>
            <p>{{ trip.description }}</p>
            <h2>Gear list</h2>
            <div class="flex flex-column gap-5">
                <div v-for="category in displayCatergories" :key="category">
                    <div
                        class="flex justify-content-between align-items-center"
                    >
                        <h3>{{ categoryToLabel(category) }}</h3>
                        <div class="text-color-secondary">
                            {{ formatWeight(weightByCategory[category]) }}
                        </div>
                    </div>
                    <!-- use PrimeDataTable to replace the following ul, the same in gears.vue -->
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
                                {{ formatWeight(data.weight) }}
                            </template>
                            <template #editor="{ data, field }">
                                <PrimeInputGroup class="w-8rem">
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
                            class="w-10rem"
                        >
                            <template #editor="{ data, field }">
                                <PrimeInputNumber
                                    v-model="data[field]"
                                    :min="1"
                                    class="w-8rem"
                                />
                            </template>
                        </PrimeColumn>
                        <!-- <PrimeColumn
                            field="quantity"
                            :header="$t('LABEL_QUANTITY')"
                        >
                            <template #body="{ data }">
                                {{ trip.gears[data.id].quantity }}
                            </template>
                            <template #editor="{ data }">
                                <PrimeInputNumber
                                    v-model="trip.gears[data.id].quantity"
                                />
                            </template>
                        </PrimeColumn> -->
                        <PrimeColumn :exportable="false" class="w-3rem">
                            <template #body="{ data }">
                                <TableRowActionButtons
                                    :actions="[
                                        {
                                            icon: 'pi pi-times',
                                            tooltip: $t('ACTION_REMOVE'),
                                            onClick: () =>
                                                onRemoveGear(data.id),
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
            <PrimeButton @click="isSelectingGears = true"
                >Select Gears</PrimeButton
            >
            <PrimeButton @click="onAddGear">Add New Gear</PrimeButton>
            <PrimeButton @click="onEditTrip(trip)">Edit Trip Info</PrimeButton>
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
    constants.GEAR_CATEGORIES.filter(
        (category) => gearsInTripByCategory.value[category],
    ),
);
const weightByCategory = computed(() =>
    _mapValues(gearsInTripByCategory.value, (gears) =>
        _sumBy(
            gears,
            (gear) =>
                gear.weight *
                (trip.value ? trip.value.gears[gear.id]?.quantity : 0),
        ),
    ),
);

const { categoryToLabel, formatWeight } = useLangUtils();

// for gear selector
const isSelectingGears = ref<boolean>(false);
const selectedGearIds = computed(() =>
    trip.value ? Object.keys(trip.value.gears) : [],
);
const onCompletSelectGears = (selectedGears: TripGear[]) => {
    userTripsStore.setGearsToTrip(tripId, selectedGears);
    isSelectingGears.value = false;
};

// for add gear
const {
    isAddingGear,
    isEditingGear,
    editingGear,
    onAddGear,
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
