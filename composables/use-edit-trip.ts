export default function useEditTrip() {
    const isAddingTrip = ref<boolean>(false);
    const isEditingTrip = ref<boolean>(false);
    const editingTrip = ref<Trip | null>(null);

    return {
        isAddingTrip,
        isEditingTrip,
        editingTrip,
        onCreateTrip: () => {
            isAddingTrip.value = true;
        },
        onEditTrip: (trip: Trip) => {
            editingTrip.value = trip;
            isEditingTrip.value = true;
        },
        onCompleteCreateTrip: () => {
            isAddingTrip.value = false;
        },
        onCompleteEditTrip: () => {
            isEditingTrip.value = false;
            editingTrip.value = null;
        },
        onCancelEditTrip: () => {
            isAddingTrip.value = false;
            isEditingTrip.value = false;
            editingTrip.value = null;
        },
    };
}
