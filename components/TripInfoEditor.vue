<template>
    <div>
        <h1>{{ isEditing ? "Edit" : "Add" }} Trip</h1>
        <div>
            <input
                type="text"
                v-model="editingTrip.title"
                placeholder="Title"
            />
            <input
                type="text"
                v-model="editingTrip.description"
                placeholder="Description"
            />
            <button @click="onSubmit()">Save</button>
            <button @click="$emit('cancel')">Cancel</button>
            <p v-if="isSaving">Saving...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    trip: Trip | null;
}>();

const emit = defineEmits(["complete", "cancel"]);

const emptyTrip: EditingTrip = {
    title: "",
    description: "",
};
const isEditing = !!props.trip;
const editingTrip = ref<EditingTrip>(
    props.trip ? { ...props.trip } : emptyTrip,
);
const isSaving = ref<boolean>(false);
const userTripsStore = useUserTripsStore();

const onSubmit = async () => {
    try {
        isSaving.value = true;
        if (isEditing) {
            await userTripsStore.updateTrip({
                id: props.trip.id,
                trip: editingTrip.value,
            });
        } else {
            await userTripsStore.addTrip(editingTrip.value);
        }
        emit("complete");
    } catch (error) {
        console.error(error);
        isSaving.value = false;
    }
};
</script>
