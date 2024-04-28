<template>
    <div>
        <h1>Trips</h1>
        <ul>
            <li v-for="trip in trips" :key="trip.id">
                <div>Title: {{ trip.title }}</div>
                <div>Desc: {{ trip.description }}</div>
                <button @click="onEditTrip(trip)">Edit</button>
                <button @click="onDeleteTrip(trip)">Delete</button>
            </li>
        </ul>
        <hr />
        <TripInfoEditor
            v-if="isAddingTrip || isEditingTrip"
            :trip="editingTrip"
            @complete="onCompleteEdit"
            @cancel="onCancelEdit"
        />
        <hr />
        <button @click="onAddTrip">Add Trip</button>
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
    onDeleteTrip,
    onCompleteEdit,
    onCancelEdit,
} = useEditTrip();
</script>
