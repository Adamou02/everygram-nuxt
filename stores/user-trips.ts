import {
    collection,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    getFirestore,
    query,
    where,
    deleteField,
} from 'firebase/firestore';

export const useUserTripsStore = defineStore('userTripsStore', () => {
    const db = getFirestore();
    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);
    const tripCollectionRef = collection(db, 'trip');
    const trips = ref<Trip[]>([]);
    const tripMap = computed(() => _keyBy(trips.value, 'id'));
    const isFirstFetching = ref(true);
    const unsubscribe = ref<null | (() => void)>(null);
    const isInitialized = ref(false);

    const getTripById = computed(() => (id: string) => tripMap.value[id]);

    const initialize = () => {
        if (isInitialized.value || !user.value) {
            console.error('initialize useUserTripsStore fail');
            return;
        }
        unsubscribe.value = onSnapshot(
            query(
                tripCollectionRef,
                where(`role.${user.value.uid}`, '==', constants.ROLE_OWNER),
            ),
            (querySnapshot) => {
                trips.value = querySnapshot.docs.map(
                    (doc) =>
                        ({
                            id: doc.id,
                            ...doc.data(),
                        }) as Trip,
                );
                if (isFirstFetching.value) {
                    isFirstFetching.value = false;
                }
            },
        );
        isInitialized.value = true;
    };

    const destroy = () => {
        if (unsubscribe.value) {
            unsubscribe.value();
        }
        isInitialized.value = false;
    };

    const createTrip = async (trip: EditingTrip) => {
        if (!user.value) {
            return;
        }
        try {
            const docRef = await addDoc(tripCollectionRef, {
                ...trip,
                role: {
                    [user.value.uid]: constants.ROLE_OWNER,
                },
                gears: {},
            });
            return docRef.id;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const updateTrip = async ({
        id,
        tripData,
    }: {
        id: string;
        tripData: EditingTrip;
    }) => {
        if (!user.value) {
            console.error('updateTrip fail');
            return;
        }
        try {
            await updateDoc(doc(tripCollectionRef, id), tripData);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const deleteTrip = async (id: string) => {
        if (!user.value) {
            console.error('deleteTrip fail');
            return;
        }
        try {
            await deleteDoc(doc(tripCollectionRef, id));
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const setGearsToTrip = async (tripId: string, tripGears: TripGear[]) => {
        const newGearsData = _keyBy(tripGears, (gear) => `gears.${gear.id}`);
        try {
            await updateTrip({ id: tripId, tripData: newGearsData });
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const removeGearsFromTrip = async (tripId: string, gearIds: string[]) => {
        const removeGearsData = gearIds.reduce(
            (acc, gearId) => {
                acc[`gears.${gearId}`] = deleteField();
                return acc;
            },
            {} as Record<string, any>,
        );
        await updateTrip({
            id: tripId,
            tripData: removeGearsData,
        });
    };

    return {
        trips,
        tripMap,
        isFetchingTrips: isFirstFetching,
        getTripById,
        initialize,
        destroy,
        createTrip,
        updateTrip,
        deleteTrip,
        setGearsToTrip,
        removeGearsFromTrip,
    };
});
