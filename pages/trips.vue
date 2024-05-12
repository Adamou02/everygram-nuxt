<template>
    <div class="flex flex-column gap-5">
        <SectionTitleBar v-if="isFetchingTrips || trips.length > 0">
            <div class="text-600">
                {{ $t('INFO_TRIP_NUM', { num: trips.length }, trips.length) }}
            </div>
            <PrimeButton
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
        <EmptyState
            v-if="!isFetchingTrips && trips.length === 0"
            :title="$t('INFO_NO_USER_TRIPS')"
            :description="$t('INFO_NO_USER_TRIPS_DESC')"
            image-src="/image/illustration/illu-mountain-1.svg"
        >
            <template #actions>
                <PrimeButton
                    :label="$t('ACTION_CREATE_TRIP')"
                    icon="pi pi-plus"
                    @click="onCreateTrip"
                />
            </template>
        </EmptyState>
    </div>
    <TripInfoEditor />
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth-guard'],
    layout: 'user-page',
});

const userTripsStore = useUserTripsStore();
const { trips, isFetchingTrips } = storeToRefs(userTripsStore);
const { onCreateTrip } = useEditTrip();
</script>
