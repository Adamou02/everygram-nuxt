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

export const useUserGearsStore = defineStore("userGearsStore", () => {
    const db = getFirestore();
    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);
    const gearCollectionRef = collection(db, "gear");
    const gears = ref<Gear[]>([]);
    const isFirstFetching = ref(true);
    const unsubscribe = ref<null | (() => void)>(null);
    const isInitialized = ref(false);

    return {
        gears,
        isFetchingGears: isFirstFetching,
        initialize: () => {
            if (isInitialized.value || !user.value) {
                console.error("initialize useUserGearsStore fail");
                return;
            }
            unsubscribe.value = onSnapshot(
                query(
                    gearCollectionRef,
                    where(
                        `role.${user.value.uid}`,
                        "==",
                        constants("ROLE_OWNER"),
                    ),
                ),
                (querySnapshot) => {
                    gears.value = querySnapshot.docs.map(
                        (doc) =>
                            ({
                                id: doc.id,
                                ...doc.data(),
                            }) as Gear,
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
        addGear: async (gear: EditingGear) => {
            if (!user.value) {
                return;
            }
            try {
                await addDoc(gearCollectionRef, {
                    ...gear,
                    role: {
                        [user.value.uid]: constants("ROLE_OWNER"),
                    },
                });
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        updateGear: async ({ id, gear }: { id: string; gear: EditingGear }) => {
            try {
                const gearRef = doc(db, "gear", id);
                await updateDoc(gearRef, gear);
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        deleteGear: async (id: string) => {
            try {
                const gearRef = doc(db, "gear", id);
                await deleteDoc(gearRef);
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    };
});
