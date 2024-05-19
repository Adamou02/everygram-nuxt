import {
    collection,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    getFirestore,
    serverTimestamp,
    writeBatch,
    setDoc,
    deleteField,
    // connectFirestoreEmulator,
} from 'firebase/firestore';
import type { DocumentReference } from 'firebase/firestore';

export const useUserGearsStore = defineStore('userGearsStore', () => {
    const db = getFirestore();
    // connectFirestoreEmulator(db, '127.0.0.1', 8080);
    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);
    const gearCollectionRef = collection(db, 'gear');
    const gearMap = ref<UserGears>({});
    const gears = computed(() => Object.values(gearMap.value));
    const isFirstFetching = ref(true);
    const unsubscribe = ref<null | (() => void)>(null);
    const isInitialized = ref(false);

    const getGearById = computed(() => (id: string) => gearMap.value[id]);

    const initialize = () => {
        if (isInitialized.value || !user.value) {
            console.error('initialize useUserGearsStore fail');
            return;
        }

        const userId = user.value.uid;
        const userGearsDocRef = doc(db, 'userGears', userId);
        unsubscribe.value = onSnapshot(userGearsDocRef, async (doc) => {
            const docData = doc.data();
            if (!doc.exists || !docData) {
                // create initial userGears document
                setDoc(userGearsDocRef, {
                    gears: {},
                });
                return;
            }

            const userGears = _cloneDeep(docData.gears) as UserGears;

            // fill in missing gear fields
            Object.entries(userGears).forEach(([gearId, gear]) => {
                userGears[gearId] = {
                    ...constants.EMPTY_GEAR_DATA,
                    ...gear,
                    id: gearId,
                };
            });

            gearMap.value = userGears;

            if (isFirstFetching.value) {
                isFirstFetching.value = false;
            }
        });

        isInitialized.value = true;
    };

    const destroy = () => {
        if (unsubscribe.value) {
            unsubscribe.value();
        }

        // reset all ref values
        gearMap.value = {};
        isFirstFetching.value = true;
        isInitialized.value = false;
        unsubscribe.value = null;
    };

    const createGear = async (editingGear: EditingGear) => {
        if (!user.value) {
            return;
        }
        const userId = user.value.uid;
        try {
            // Add new gear to gear collection
            const gearDocRef = await addDoc(gearCollectionRef, {
                ...constants.EMPTY_GEAR_DATA,
                ...editingGear,
                role: {
                    [userId]: constants.ROLES.OWNER,
                },
                created: serverTimestamp(),
            });

            // Get new gear data
            const gearId = gearDocRef.id;
            const gearDocSnap = await getDoc(gearDocRef);
            const gearData = gearDocSnap.data();
            const newGear: Gear = {
                ...constants.EMPTY_GEAR_DATA,
                ...gearData,
                id: gearId,
            };

            // Add new gear to userGears document
            const userGearsDocRef = doc(db, 'userGears', userId);
            await updateDoc(userGearsDocRef, {
                [`gears.${gearId}`]: newGear,
            });

            return newGear;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const createGears = async (gears: EditingGear[]) => {
        if (!user.value) {
            return;
        }
        const userId = user.value.uid;
        try {
            // write new gears to gear collection in batch
            const newGearRefs: DocumentReference[] = [];
            const batch = writeBatch(db);
            gears.forEach((gear) => {
                const docRef = doc(gearCollectionRef);
                newGearRefs.push(docRef);
                batch.set(docRef, {
                    ...constants.EMPTY_GEAR_DATA,
                    ...gear,
                    role: {
                        [userId]: constants.ROLES.OWNER,
                    },
                    created: serverTimestamp(),
                });
            });
            await batch.commit();

            // get new gears data
            const newGearDocs = await Promise.all(
                newGearRefs.map((ref) => getDoc(ref)),
            );
            const newGears: Gear[] = newGearDocs.map((doc, index) => {
                const gearData = doc.data();
                return {
                    ...constants.EMPTY_GEAR_DATA,
                    ...gearData,
                    id: newGearRefs[index].id,
                };
            });

            // write new gears to userGears document
            const newGearsFields: Record<string, Gear> = newGears.reduce(
                (acc, gear) => {
                    acc[`gears.${gear.id}`] = gear;
                    return acc;
                },
                {} as Record<string, Gear>,
            );
            const userGearsDocRef = doc(db, 'userGears', userId);
            await updateDoc(userGearsDocRef, newGearsFields);
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
        if (!user.value) {
            return;
        }
        const userId = user.value.uid;
        try {
            const gearRef = doc(db, 'gear', id);
            delete gearData.id;

            // update gear data
            const updateGearPromise = updateDoc(gearRef, {
                ...gearData,
                updated: serverTimestamp(),
            });

            // update userGears document
            const userGearsDocRef = doc(db, 'userGears', userId);
            const updateUserGearsPromise = updateDoc(userGearsDocRef, {
                [`gears.${id}`]: {
                    ...gearMap.value[id],
                    ...gearData,
                    updated: serverTimestamp(),
                },
            });

            await Promise.all([updateGearPromise, updateUserGearsPromise]);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const deleteGear = async (id: string) => {
        if (!user.value) {
            return;
        }
        const userId = user.value.uid;
        try {
            // delete gear from gear collection
            const gearRef = doc(db, 'gear', id);
            const deleteGearPromise = deleteDoc(gearRef);

            // delete gear from userGears document
            const userGearsDocRef = doc(db, 'userGears', userId);
            const deleteGearInUserGearsPromise = updateDoc(userGearsDocRef, {
                [`gears.${id}`]: deleteField(),
            });

            await Promise.all([
                deleteGearPromise,
                deleteGearInUserGearsPromise,
            ]);
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
        createGears,
        updateGear,
        deleteGear,
    };
});
