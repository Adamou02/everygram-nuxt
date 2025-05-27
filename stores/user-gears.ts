import {
    collection,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    onSnapshot,
    serverTimestamp,
    writeBatch,
    setDoc,
    getDocs,
    query,
    where,
    deleteField,
    runTransaction,
} from 'firebase/firestore';
import type { DocumentReference } from 'firebase/firestore';

export const useUserGearsStore = defineStore('userGearsStore', () => {
    const db = firebaseUtils.getFirestoreDB();
    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);
    const gearCollectionRef = collection(db, 'gear');
    const gearMap = ref<UserGears>({}); // gearMap is the local state that holds all user's gears
    const gears = computed(() => Object.values(gearMap.value));
    const visibleGears = computed(() =>
        gears.value.filter((gear) => !gear.isForOneTrip && !gear.isArchived),
    );
    const isFirstFetching = ref(true);
    const hasBuiltUserGears = ref(false);
    const unsubscribe = ref<null | (() => void)>(null);
    const isInitialized = ref(false);

    const getGearById = computed(() => (id: string) => gearMap.value[id]);

    const initialize = async () => {
        if (isInitialized.value || !user.value) {
            console.error('initialize useUserGearsStore fail');
            return;
        }

        // Unsubscribe previous listener if exists
        if (unsubscribe.value) {
            unsubscribe.value();
            unsubscribe.value = null;
        }

        const userId = user.value.uid;
        const userGearsDocRef = doc(db, 'userGears', userId);

        // Use a Firestore transaction to create the initial userGears document if needed
        try {
            await runTransaction(db, async (transaction) => {
                const userGearsDocSnap = await transaction.get(userGearsDocRef);

                // Check if userGears document exists, or if gears field is empty (in case of data lost)
                if (
                    !userGearsDocSnap.exists() ||
                    isEmpty(userGearsDocSnap.data().gears)
                ) {
                    // get all user's gears
                    const gearDocs = await getDocs(
                        query(
                            gearCollectionRef,
                            where(
                                `role.${userId}`,
                                '==',
                                constants.ROLES.OWNER,
                            ),
                        ),
                    );
                    const userGears: UserGears = {};
                    gearDocs.forEach((gearDoc) => {
                        const gearData = gearDoc.data();
                        const gearId = gearDoc.id;
                        userGears[gearId] = {
                            ...constants.EMPTY_GEAR_DATA,
                            ...gearData,
                            id: gearId,
                        };
                    });
                    transaction.set(userGearsDocRef, {
                        gears: userGears,
                        created: serverTimestamp(),
                    });
                }
            });
        } catch (err) {
            console.error('Error in Firestore transaction for userGears:', err);
        }

        // Listen to userGears document changes
        unsubscribe.value = onSnapshot(userGearsDocRef, async (doc) => {
            const docData = doc.data();
            if (!docData || !docData.gears) {
                // Document creation is now handled by the transaction above
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

    const createGear = async (
        editingGear: EditingGear,
    ): Promise<Gear | null> => {
        if (!user.value) {
            return null;
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
            delete gearData.id;

            // use transaction to update gear data and userGears document
            await runTransaction(db, async (transaction) => {
                const gearRef = doc(db, 'gear', id);
                const userGearsDocRef = doc(db, 'userGears', userId);

                // Read the documents
                const [gearDocSnap, userGearsDocSnap] = await Promise.all([
                    transaction.get(gearRef),
                    transaction.get(userGearsDocRef),
                ]);
                if (!gearDocSnap.exists || !userGearsDocSnap.exists) {
                    throw new Error('Document does not exist');
                }
                // update gear data
                transaction.update(gearRef, {
                    ...gearData,
                    updated: serverTimestamp(),
                });
                // update userGears document
                transaction.update(userGearsDocRef, {
                    [`gears.${id}`]: {
                        ...gearMap.value[id],
                        ...gearData,
                        updated: serverTimestamp(),
                    },
                });
            });
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
            // use transaction to delete gear data and userGears document
            await runTransaction(db, async (transaction) => {
                const gearRef = doc(db, 'gear', id);
                const userGearsDocRef = doc(db, 'userGears', userId);

                // Read the documents
                const [gearDocSnap, userGearsDocSnap] = await Promise.all([
                    transaction.get(gearRef),
                    transaction.get(userGearsDocRef),
                ]);
                if (!gearDocSnap.exists || !userGearsDocSnap.exists) {
                    throw new Error('Document does not exist');
                }

                // delete gear data
                transaction.delete(gearRef);
                // delete userGears document
                transaction.update(userGearsDocRef, {
                    [`gears.${id}`]: deleteField(),
                });
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return {
        gears,
        gearMap,
        visibleGears,
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
