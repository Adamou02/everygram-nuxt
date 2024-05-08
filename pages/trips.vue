<template>
    <div class="flex flex-column gap-5">
        <SectionTitleBar>
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
            <div v-for="trip in trips" class="col-12 md:col-6 lg:col-3">
                <NuxtLink :to="`/trip/${trip.id}`">
                    <TripCard :key="trip.id" :trip="trip" />
                </NuxtLink>
            </div>
        </div>
    </div>
    <TripInfoEditorDialog
        :is-open="isAddingTrip"
        :trip="null"
        @complete-create="onCompleteCreateTrip"
        @complete-edit="onCompleteEditTrip"
        @cancel="onCancelEditTrip"
    />
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth-guard'],
    layout: 'user-page',
});

const i18n = useI18n();
const { confirmDeleteDialog } = useUiUitls();
const userTripsStore = useUserTripsStore();
const { trips } = storeToRefs(userTripsStore);
const {
    isAddingTrip,
    onCreateTrip,
    onCompleteCreateTrip,
    onCompleteEditTrip,
    onCancelEditTrip,
} = useEditTrip();
</script>
