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
    serverTimestamp,
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
                where(`role.${user.value.uid}`, '==', constants.ROLES.OWNER),
            ),
            (querySnapshot) => {
                trips.value = querySnapshot.docs.map(
                    (doc) =>
                        ({
                            ...constants.EMPTY_TRIP,
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
        trips.value = [];
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
                    [user.value.uid]: constants.ROLES.OWNER,
                },
                gears: {},
                consumables: [],
                created: serverTimestamp(),
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
            delete tripData.id;
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

    const setGearsToTrip = async (
        tripId: string,
        tripGears: TripGear[],
        type: TripGearType,
    ) => {
        const newGearsData = _keyBy(tripGears, (gear) => `${type}.${gear.id}`);
        try {
            await updateTrip({ id: tripId, tripData: newGearsData });
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const removeGearsFromTrip = async (
        tripId: string,
        gearIds: string[],
        type: TripGearType,
    ) => {
        const removeGearsData = gearIds.reduce(
            (acc, gearId) => {
                acc[`${type}.${gearId}`] = deleteField();
                return acc;
            },
            {} as Record<string, any>,
        );
        await updateTrip({
            id: tripId,
            tripData: removeGearsData,
        });
    };

    const addConsumableToTrip = async ({
        tripId,
        consumable,
    }: {
        tripId: string;
        consumable: Consumable;
    }) => {
        try {
            const trip = getTripById.value(tripId);
            if (!trip) {
                throw 'fail to add consumable to trip, trip not found';
            }
            const tripConsumables = trip.consumables || [];
            await updateTrip({
                id: tripId,
                tripData: {
                    consumables: [...tripConsumables, consumable],
                },
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const updateConsumableInTrip = async ({
        tripId,
        consumableIndex,
        consumable,
    }: {
        tripId: string;
        consumableIndex: number;
        consumable: Consumable;
    }) => {
        try {
            const trip = getTripById.value(tripId);
            if (!trip) {
                throw 'fail to update consumable in trip, trip not found';
            }
            const newConsumables = [...(trip.consumables || [])];
            if (consumableIndex > newConsumables.length - 1) {
                throw 'fail to update consumable in trip, consumable index out of bound';
            }
            newConsumables[consumableIndex] = consumable;
            await updateTrip({
                id: tripId,
                tripData: {
                    consumables: newConsumables,
                },
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const deleteConsumableFromTrip = async ({
        tripId,
        consumableIndex,
    }: {
        tripId: string;
        consumableIndex: number;
    }) => {
        try {
            const trip = getTripById.value(tripId);
            if (!trip) {
                throw 'fail to remove consumable from trip, trip not found';
            }
            const newConsumables = [...(trip.consumables || [])];
            if (consumableIndex > newConsumables.length - 1) {
                throw 'fail to remove consumable from trip, consumable index out of bound';
            }
            newConsumables.splice(consumableIndex, 1);
            await updateTrip({
                id: tripId,
                tripData: {
                    consumables: newConsumables,
                },
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
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
        addConsumableToTrip,
        updateConsumableInTrip,
        deleteConsumableFromTrip,
    };
});
