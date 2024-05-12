<template>
    <TripInfoEditorDialog
        :is-open="isAddingTrip || isEditingTrip"
        :trip="editingTrip"
        @complete-create="
            (trip) => {
                onCompleteCreateTrip();
                emit('complete-create-trip', trip);
            }
        "
        @complete-edit="
            (trip) => {
                onCompleteEditTrip();
                emit('complete-edit-trip', trip);
            }
        "
        @cancel="
            () => {
                onCancelEditTrip();
                emit('cancel-edit-trip');
            }
        "
    />
</template>

<script setup lang="ts">
const emit = defineEmits<{
    'complete-create-trip': [trip: Trip];
    'complete-edit-trip': [trip: Trip];
    'cancel-edit-trip': [];
}>();
const {
    onCompleteCreateTrip,
    onCompleteEditTrip,
    onCancelEditTrip,
    isAddingTrip,
    isEditingTrip,
    editingTrip,
} = useEditTrip();
</script>
