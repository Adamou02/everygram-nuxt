<template>
    <div>
        <hr />
        <h3>{{ isEditing ? 'Edit' : 'Add' }} Trip</h3>
        <div>
            <div>
                <label>Title</label>
                <input
                    type="text"
                    v-model="editingTrip.title"
                    placeholder="Title"
                />
            </div>
            <div>
                <label>Description</label>
                <input
                    type="text"
                    v-model="editingTrip.description"
                    placeholder="Description"
                />
            </div>
            <div>
                <button @click="onSubmit()">Save</button>
                <button @click="$emit('cancel')">Cancel</button>
            </div>
            <p v-if="isSaving">Saving...</p>
        </div>
        <hr />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    trip: Trip | null;
}>();

const emit = defineEmits(['complete', 'cancel']);

const emptyTrip: EditingTrip = {
    title: '',
    description: '',
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
                tripData: editingTrip.value,
            });
        } else {
            await userTripsStore.addTrip(editingTrip.value);
        }
        emit('complete');
    } catch (error) {
        console.error(error);
        isSaving.value = false;
    }
};
</script>
