<!-- A page to show data of a trip -->
<template>
    <div>
        <template v-if="isFetchingTrips">
            <p>Loading...</p>
        </template>
        <template v-else-if="trip">
            <h1>{{ trip.title }}</h1>
            <p>{{ trip.description }}</p>
            <h2>Gear list</h2>
            <!-- show the ul by displayCatergories -->
            <ul>
                <li v-for="category in displayCatergories" :key="category">
                    <h3>{{ category }}</h3>
                    <ul>
                        <li
                            v-for="gear in gearsInTripByCategory[category]"
                            :key="gear.id"
                        >
                            <div>
                                {{ gear.name }}: {{ gear.weight }} grams x
                                {{ trip.gears[gear.id].quantity }}
                            </div>
                            <button @click="onEditGear(gear)">Edit</button>
                            <button @click="onRemoveGear(gear.id)">x</button>
                        </li>
                    </ul>
                </li>
            </ul>

            <GearsSelector
                v-if="isSelectingGears"
                :selected-gear-ids="selectedGearIds"
                @complete="onCompletSelectGears"
                @cancel="isSelectingGears = false"
            />
            <GearEditor
                v-if="isAddingGear || isEditingGear"
                :gear="editingGear"
                @complete-add="onCompleteAddGearInTrip"
                @complete-edit="onCompleteEditGear"
                @cancel="onCancelEditGear"
            />
            <TripInfoEditor
                v-if="isEditingTrip"
                :trip="editingTrip"
                @complete-edit="onCompleteEditTrip"
                @cancel="onCancelEditTrip"
            />
            <button @click="isSelectingGears = true">Select Gears</button>
            <button @click="onAddGear">Add Gears</button>
            <button @click="onEditTrip(trip)">Edit Trip Info</button>
        </template>
        <template v-else>
            <p>Trip not found</p>
        </template>
        <NuxtLink to="/dashboard">Back to Trips</NuxtLink>
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
              _map(trip.value.gears, (gear) =>
                  userGearsStore.getGearById(gear.id),
              ),
          )
        : [],
);
const gearsInTripByCategory = computed(() =>
    gearUtils.groupGearsByCategory(gearsInTrip.value),
);
const displayCatergories = computed(() =>
    CONSTANTS.GEAR_CATEGORIES.filter(
        (category) => gearsInTripByCategory.value[category],
    ),
);

// for gear selector
const isSelectingGears = ref<boolean>(false);
const selectedGearIds = computed(() =>
    trip.value ? Object.keys(trip.value.gears) : [],
);
const onCompletSelectGears = (selectedGears: TripGear[]) => {
    userTripsStore.addGearsToTrip(tripId, selectedGears);
    isSelectingGears.value = false;
};

// for add gear
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
    userTripsStore.addGearsToTrip(tripId, [{ id: gear.id, quantity: 1 }]);
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
</script>
