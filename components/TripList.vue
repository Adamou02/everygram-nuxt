<template>
    <div>
        <ul>
            <li v-for="trip in trips" :key="trip.id">
                <NuxtLink :to="`/trip/${trip.id}`">
                    <div>{{ trip.title }} ({{ trip.description }})</div>
                </NuxtLink>
                <button @click="onEditTrip(trip)">Edit</button>
                <button @click="onDeleteTrip(trip)">Delete</button>
            </li>
        </ul>
        <TripInfoEditor
            v-if="isAddingTrip || isEditingTrip"
            :trip="editingTrip"
            @complete-add="onCompleteAddTrip"
            @complete-edit="onCompleteEditTrip"
            @cancel="onCancelEditTrip"
        />
        <button v-else @click="onAddTrip">Add Trip</button>
    </div>
</template>

<script setup lang="ts">
const userTripsStore = useUserTripsStore();
const { trips } = storeToRefs(userTripsStore);
const {
    isAddingTrip,
    isEditingTrip,
    editingTrip,
    onAddTrip,
    onEditTrip,
    onCompleteAddTrip,
    onCompleteEditTrip,
    onCancelEditTrip,
} = useEditTrip();

const onDeleteTrip = async (trip: Trip) => {
    try {
        await userTripsStore.deleteTrip(trip.id);
    } catch (error) {
        console.error(error);
    }
};
</script>
