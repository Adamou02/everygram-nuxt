export default function useDeleteTrip() {
    const i18n = useI18n();
    const userTripsStore = useUserTripsStore();
    const { confirmDeleteDialog } = useUiUitls();
    const { errorToast } = useErrorToast();

    const onDeleteTrip = async (trip: Trip) => {
        try {
            await userTripsStore.deleteTrip(trip.id);
        } catch (error) {
            errorToast('Failed to delete trip', error);
        }
    };

    const confirmDeleteTrip = (trip: Trip) => {
        confirmDeleteDialog({
            message: i18n.t('MESSAGE_CONFIRM_DELETE_TRIP', {
                tripName: trip.title,
            }),
            header: i18n.t('ACTION_DELETE_TRIP'),
            toastSummary: i18n.t('FEEDBACK_TRIP_DELETED'),
            onAccept: async () => {
                await onDeleteTrip(trip);
                navigateTo('/trips');
            },
        });
    };

    return {
        confirmDeleteTrip,
    };
}
