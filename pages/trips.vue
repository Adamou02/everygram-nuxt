<template>
    <div class="flex flex-column gap-5">
        <template v-if="isFetchingTrips || trips.length > 0">
            <SectionTitleBar>
                <div class="text-color-light">
                    {{
                        $t('INFO_TRIP_NUM', { num: trips.length }, trips.length)
                    }}
                </div>
                <PrimeButton
                    severity="secondary"
                    rounded
                    :label="$t('ACTION_CREATE_TRIP')"
                    icon="pi pi-plus"
                    @click="onCreateTrip"
                />
            </SectionTitleBar>
            <div class="grid">
                <div
                    v-if="isFetchingTrips"
                    v-for="i in 6"
                    class="col-12 md:col-6 lg:col-3"
                    :key="i"
                >
                    <TripCardSkeleton />
                </div>
                <div
                    v-else
                    v-for="trip in trips"
                    class="col-12 md:col-6 lg:col-3"
                    :key="trip.id"
                >
                    <NuxtLink :to="`/trip/${trip.id}`">
                        <TripCard :key="trip.id" :trip="trip" />
                    </NuxtLink>
                </div>
            </div>
        </template>
        <EmptyState
            v-else
            :title="$t('INFO_NO_USER_TRIPS')"
            :description="$t('INFO_NO_USER_TRIPS_DESC')"
            image-src="/image/empty-trip.jpg"
        >
            <template #actions>
                <PrimeButton
                    severity="secondary"
                    rounded
                    :label="$t('ACTION_CREATE_TRIP')"
                    icon="pi pi-plus"
                    @click="onCreateTrip"
                />
            </template>
        </EmptyState>
    </div>
    <TripInfoEditorDialog />
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth-guard'],
    layout: 'user-page',
});

const userTripsStore = useUserTripsStore();
const { trips, isFetchingTrips } = storeToRefs(userTripsStore);
const { onCreateTrip } = useEditTrip();
const i18n = useI18n();

onMounted(() => {
    analyticsUtils.log(constants.ANALYTICS_EVENTS.VIEW_TRIPS_PAGE);
});

useHead({
    title: i18n.t('PAGE_TRIPS'),
});
</script>
