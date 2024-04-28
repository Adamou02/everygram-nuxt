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
} from "firebase/firestore";

export const useUserTripsStore = defineStore("userTripsStore", () => {
    const db = getFirestore();
    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);
    const tripCollectionRef = collection(db, "trip");
    const trips = ref<Trip[]>([]);
    const isFirstFetching = ref(true);
    const unsubscribe = ref<null | (() => void)>(null);
    const isInitialized = ref(false);

    return {
        trips,
        isFetchingTrips: isFirstFetching,
        initialize: () => {
            if (isInitialized.value || !user.value) {
                console.error("initialize useUserTripsStore fail");
                return;
            }
            unsubscribe.value = onSnapshot(
                query(
                    tripCollectionRef,
                    where(
                        `role.${user.value.uid}`,
                        "==",
                        constants("ROLE_OWNER"),
                    ),
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
        },
        destroy: () => {
            if (unsubscribe.value) {
                unsubscribe.value();
            }
            isInitialized.value = false;
        },
        addTrip: async (trip: EditingTrip) => {
            if (!user.value) {
                return;
            }
            try {
                await addDoc(tripCollectionRef, {
                    ...trip,
                    role: {
                        [user.value.uid]: constants("ROLE_OWNER"),
                    },
                    gears: {},
                });
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        updateTrip: async ({ id, trip }: { id: string; trip: EditingTrip }) => {
            if (!user.value) {
                console.error("updateTrip fail");
                return;
            }
            try {
                await updateDoc(doc(tripCollectionRef, id), trip);
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        deleteTrip: async (id: string) => {
            if (!user.value) {
                console.error("deleteTrip fail");
                return;
            }
            try {
                await deleteDoc(doc(tripCollectionRef, id));
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    };
});
