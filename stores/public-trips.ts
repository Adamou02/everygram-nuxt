import { defineStore } from 'pinia';
import {
    getFirestore,
    collection,
    query,
    orderBy,
    limit,
    startAfter,
    getDocs,
    QueryDocumentSnapshot,
} from 'firebase/firestore';
import type { OrderByDirection } from 'firebase/firestore';
import { ref } from 'vue';

export const usePublicTripsStore = defineStore('publicTripsStore', () => {
    const resultTrips = ref<TripShare[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const lastDoc = ref<QueryDocumentSnapshot | null>(null);
    const hasMoreResult = ref(true);
    const searchParams = ref<{
        sort: 'tripShareCreated' | 'baseWeight' | 'packWeight' | 'wornWeight';
        order: OrderByDirection;
    }>({
        sort: 'tripShareCreated',
        order: 'desc',
    });

    async function searchTrips({ reset = true } = {}) {
        isLoading.value = true;
        error.value = null;

        try {
            const db = getFirestore();
            const { sort, order } = searchParams.value;
            const orderDir = order as OrderByDirection;

            let q = query(
                collection(db, 'tripShare'),
                orderBy(sort, orderDir),
                limit(constants.PUBLIC_TRIPS_PAGE_SIZE),
            );

            if (!reset && lastDoc.value) {
                q = query(q, startAfter(lastDoc.value));
            }

            const snap = await getDocs(q);
            const newTrips = snap.docs.map(
                (doc) =>
                    ({
                        ...constants.EMPTY_TRIP_DATA,
                        ...doc.data(),
                        id: doc.id,
                    }) as TripShare,
            );

            if (reset) {
                resultTrips.value = newTrips;
            } else {
                resultTrips.value = [...resultTrips.value, ...newTrips];
            }

            lastDoc.value = snap.docs[snap.docs.length - 1] || null;
            hasMoreResult.value =
                snap.docs.length === constants.PUBLIC_TRIPS_PAGE_SIZE;
        } catch (e: any) {
            error.value = e.message || 'Failed to fetch trips';
        } finally {
            isLoading.value = false;
        }
    }

    async function loadMore() {
        if (hasMoreResult.value && !isLoading.value) {
            await searchTrips({ ...searchParams.value, reset: false });
        }
    }

    function setSearchParams(params: Partial<typeof searchParams.value>) {
        searchParams.value = { ...searchParams.value, ...params };
    }

    return {
        resultTrips,
        isLoading,
        error,
        hasMoreResult,
        searchParams,
        searchTrips,
        loadMore,
        setSearchParams,
    };
});
