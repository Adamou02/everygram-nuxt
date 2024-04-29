export default function useEditTrip() {
    const userTripsStore = useUserTripsStore();
    const isAddingTrip = ref<boolean>(false);
    const isEditingTrip = ref<boolean>(false);
    const editingTrip = ref<Trip | null>(null);

    return {
        isAddingTrip,
        isEditingTrip,
        editingTrip,
        onAddTrip: () => {
            isAddingTrip.value = true;
        },
        onEditTrip: (trip: Trip) => {
            editingTrip.value = trip;
            isEditingTrip.value = true;
        },
        onDeleteTrip: async (trip: Trip) => {
            try {
                await userTripsStore.deleteTrip(trip.id);
            } catch (error) {
                console.error(error);
            }
        },
        onCompleteEditTrip: () => {
            isAddingTrip.value = false;
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
