import {
    getDoc,
    setDoc,
    updateDoc,
    doc,
    serverTimestamp,
} from 'firebase/firestore';

export const useUserMetaStore = defineStore('userMetaStore', () => {
    const db = firebaseUtils.getFirestoreDB();
    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);
    const userMeta = ref<UserMeta | null>(null);
    const isInitialized = ref(false);

    const initialize = async () => {
        if (isInitialized.value) return;
        if (!user.value) return;

        const docRef = doc(db, 'userMeta', user.value.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            userMeta.value = docSnap.data() as UserMeta;
        } else {
            // Create a new userMeta doc with default values
            const defaultMeta: Omit<UserMeta, 'lastUpdated'> = {
                userId: user.value.uid,
                locale: null,
                currency: null,
                gearCount: 0,
                archivedGearCount: 0,
                tripCount: 0,
                tripShareCount: 0,
            };
            await setDoc(docRef, {
                ...defaultMeta,
                lastUpdated: serverTimestamp(),
            });
            const newDocSnap = await getDoc(docRef);
            if (newDocSnap.exists()) {
                userMeta.value = newDocSnap.data() as UserMeta;
            }
        }

        // Set the locale for i18n if available
        if (userMeta.value?.locale) {
            const { $i18n } = useNuxtApp();
            $i18n.setLocale(userMeta.value.locale);
        }

        isInitialized.value = true;
    };

    const updateUserMeta = async (userMetaData: Partial<UserMeta>) => {
        if (!user.value || !userMeta.value) return;
        const docRef = doc(db, 'userMeta', user.value.uid);
        await updateDoc(docRef, {
            ...userMetaData,
            lastUpdated: serverTimestamp(),
        });
        userMeta.value = {
            ...userMeta.value,
            ...userMetaData,
        };
    };

    const destroy = () => {
        userMeta.value = null;
        isInitialized.value = false;
    };

    return {
        userMeta,
        initialize,
        updateUserMeta,
        destroy,
    };
});
