<template>
    <div class="flex flex-column gap-5">
        <SectionTitleBar>
            <div class="flex align-items-center justify-content-between w-full">
                <!-- page title -->
                <div class="font-bold text-xl">
                    {{ $t('PAGE_PUBLIC_TRIPS') }}
                </div>
                <!-- sort and order dropdowns -->
                <div>
                    <PrimeDropdown
                        v-model="sortValue"
                        :options="sortOptions"
                        option-label="label"
                        option-value="value"
                        :placeholder="$t('ACTION_SORT_BY')"
                        class="w-12rem"
                    />
                    <PrimeDropdown
                        v-model="orderValue"
                        :options="
                            sortValue === 'tripShareCreated'
                                ? shareCreatedOrderOptions
                                : packWeightOrderOptions
                        "
                        option-label="label"
                        option-value="value"
                        :placeholder="$t('ACTION_ORDER_BY')"
                        class="w-12rem ml-2"
                    />
                </div>
            </div>
        </SectionTitleBar>
        <TripList
            :trips="resultTrips"
            :isFetching="isLoading"
            @load-more="onLoadMore"
            v-slot="{ trip }"
        >
            <NuxtLink :to="`/trip-share/${trip.id}`" target="_blank">
                <TripCard
                    :key="trip.id"
                    :trip="trip"
                    :pack-weight="(trip as TripShare).packWeight"
                    :owner="(trip as TripShare).owner"
                />
            </NuxtLink>
        </TripList>
    </div>
</template>

<script setup lang="ts">
type SortOption = 'tripShareCreated' | 'packWeight';
type OrderOption = 'asc' | 'desc';

definePageMeta({
    layout: 'public-page',
});

const i18n = useI18n();
const publicTripsStore = usePublicTripsStore();
const { resultTrips, isLoading, hasMoreResult } = storeToRefs(publicTripsStore);

const sortValue = ref<SortOption>('tripShareCreated');
const orderValue = ref<OrderOption>('desc');

const sortOptions = [
    { label: i18n.t('ACTION_SORT_BY_UPDATED_DATE'), value: 'tripShareCreated' },
    { label: i18n.t('ACTION_SORT_BY_PACK_WEIGHT'), value: 'packWeight' },
];
const shareCreatedOrderOptions = [
    { label: i18n.t('ACTION_SORT_DESC_NEW_TO_OLD'), value: 'desc' },
    { label: i18n.t('ACTION_SORT_ASC_OLD_TO_NEW'), value: 'asc' },
];
const packWeightOrderOptions = [
    { label: i18n.t('ACTION_SORT_ASC_LIGHT_TO_HEAVY'), value: 'asc' },
    { label: i18n.t('ACTION_SORT_DESC_HEAVY_TO_LIGHT'), value: 'desc' },
];

watch([sortValue, orderValue], ([sort, order]) => {
    publicTripsStore.setSearchParams({ sort, order });
    publicTripsStore.searchTrips();
});

function onLoadMore() {
    if (!hasMoreResult.value || isLoading.value) {
        return;
    }
    publicTripsStore.loadMore();
}

onMounted(() => {
    publicTripsStore.setSearchParams({
        sort: sortValue.value,
        order: orderValue.value,
    });
    publicTripsStore.searchTrips();
});

useSeoMeta({
    robots: 'noindex, nofollow',
});
</script>
