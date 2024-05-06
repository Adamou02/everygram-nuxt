import { getDoc, setDoc, doc, getFirestore } from 'firebase/firestore';

export const useUserMemberStore = defineStore('userMemberStore', () => {
    const db = getFirestore();
    const { $i18n } = useNuxtApp();
    const member = ref<Member | null>();
    const isFirstFetching = ref(true);
    const isInitialized = ref(false);

    const initialize = async ({ userId }: { userId: string }) => {
        if (isInitialized.value) {
            return;
        }

        await fetchMember(userId);
        isFirstFetching.value = false;
        isInitialized.value = true;
    };

    const fetchMember = async (userId: string) => {
        const docRef = doc(db, 'member', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            member.value = docSnap.data() as Member;
        }
    };

    const setMember = async (userId: string, memberData: Partial<Member>) => {
        if (!member.value) {
            return;
        }

        const newMember = {
            locale: $i18n.locale.value,
            ...memberData,
        };

        try {
            await setDoc(doc(db, 'member', member.value.userId), memberData, {
                merge: true,
            });
            await fetchMember(userId);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const destroy = () => {
        member.value = null;
        isFirstFetching.value = true;
        isInitialized.value = false;
    };

    return {
        member,
        isFetchingMember: isFirstFetching,
        initialize,
        setMember,
        destroy,
    };
});
