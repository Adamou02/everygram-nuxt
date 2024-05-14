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
    // connectFirestoreEmulator,
} from 'firebase/firestore';

export const useUserGearsStore = defineStore('userGearsStore', () => {
    const db = getFirestore();
    // connectFirestoreEmulator(db, '127.0.0.1', 8080);
    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);
    const gearCollectionRef = collection(db, 'gear');
    const gears = ref<Gear[]>([]);
    const gearMap = computed(() => _keyBy(gears.value, 'id'));
    const isFirstFetching = ref(true);
    const unsubscribe = ref<null | (() => void)>(null);
    const isInitialized = ref(false);

    const getGearById = computed(() => (id: string) => gearMap.value[id]);

    const initialize = () => {
        if (isInitialized.value || !user.value) {
            console.error('initialize useUserGearsStore fail');
            return;
        }
        unsubscribe.value = onSnapshot(
            query(
                gearCollectionRef,
                where(`role.${user.value.uid}`, '==', constants.ROLES.OWNER),
            ),
            (querySnapshot) => {
                gears.value = querySnapshot.docs.map((doc) => {
                    const docData = doc.data();
                    return {
                        ...constants.EMPTY_GEAR,
                        id: doc.id,
                        ...docData,
                    } as Gear;
                });
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
        gears.value = [];
        isInitialized.value = false;
    };

    const createGear = async (gear: EditingGear) => {
        if (!user.value) {
            return;
        }
        try {
            const docRef = await addDoc(gearCollectionRef, {
                ...gear,
                role: {
                    [user.value.uid]: constants.ROLES.OWNER,
                },
            });
            return docRef.id;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const updateGear = async ({
        id,
        gearData,
    }: {
        id: string;
        gearData: EditingGear;
    }) => {
        try {
            const gearRef = doc(db, 'gear', id);
            delete gearData.id;
            await updateDoc(gearRef, gearData);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const deleteGear = async (id: string) => {
        try {
            const gearRef = doc(db, 'gear', id);
            await deleteDoc(gearRef);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return {
        gears,
        gearMap,
        isFetchingGears: isFirstFetching,
        getGearById,
        initialize,
        destroy,
        createGear,
        updateGear,
        deleteGear,
    };
});
