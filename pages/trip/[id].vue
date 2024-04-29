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
            <ul>
                <li v-for="gear in gearsInTrip" :key="gear.id">
                    <div>
                        {{ gear.name }}: {{ gear.weight }} grams x
                        {{ trip.gears[gear.id].quantity }}
                    </div>
                    <button @click="onRemoveGear(gear.id)">x</button>
                </li>
            </ul>
            <button @click="isSelectingGears = true">Add Gears</button>
            <GearsSelector
                v-if="isSelectingGears"
                :selected-gear-ids="selectedGearIds"
                @complete="onCompletSelectGears"
                @cancel="isSelectingGears = false"
            />
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
const trip = computed(() => trips.value.find((trip) => trip.id === tripId));
const gearsInTrip = computed(() =>
    trip.value
        ? _filter(
              _map(trip.value.gears, (gear) =>
                  userGearsStore.getGearById(gear.id),
              ),
          )
        : [],
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

const onRemoveGear = (gearId: string) => {
    userTripsStore.removeGearsFromTrip(tripId, [gearId]);
};
</script>
