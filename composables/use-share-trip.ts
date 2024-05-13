export default function () {
    const userTripsStore = useUserTripsStore();
    const toast = useToast();
    const i18n = useI18n();

    const publishTrip = async (trip: Trip) => {
        await userTripsStore.updateTrip({
            id: trip.id,
            tripData: {
                isPublished: true,
            },
        });
        toast.add({
            severity: 'secondary',
            summary: i18n.t('INFO_TRIP_PUBLISHED'),
            life: 3000,
        });
    };

    const unpublishTrip = async (trip: Trip) => {
        await userTripsStore.updateTrip({
            id: trip.id,
            tripData: {
                isPublished: false,
            },
        });
        toast.add({
            severity: 'secondary',
            summary: i18n.t('INFO_TRIP_UNPUBLISHED'),
            life: 3000,
        });
    };

    return {
        publishTrip,
        unpublishTrip,
    };
}
