<template>
    <div
        :class="['trip-og-image', 'flex gap-7 px-5 py-5 overflow-hidden']"
        :style="{ width: '1200px', height: '630px' }"
    >
        <div
            :class="[
                'trip-og-image__trip-info',
                'flex flex-column h-full justify-content-center',
            ]"
        >
            <img
                src="/image/logo-horizontal.svg"
                alt="App Logo"
                height="72px"
            />
            <h1 class="text-6xl mt-6">
                {{ tripShare.title }}
            </h1>
            <TripDate :trip="tripShare" class="text-2xl mt-2" />
            <UserLabel
                :user="tripShare.owner"
                avatar-size="xl"
                class="text-4xl mt-6"
            />
        </div>
        <TripWeightInfo
            :gears="gearsInTrip"
            :wornGears="wornGearsInTrip"
            :consumables="consumablesInTrip"
            class="trip-og-image__weight-info"
        />
    </div>
</template>

<script setup lang="ts">
import { getApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// ! the values below are non-reactive //
const app = getApp();
const db = getFirestore(app);
const route = useRoute();
const tripId = route.params.id as string;
const tripShareRef = doc(db, 'tripShare', tripId);
const tripShareSnap = await getDoc(tripShareRef);
const tripShare: TripShare | null = (tripShareSnap.data() as TripShare) || null;
const gearsInTrip: GearWithQuantity[] = _values(tripShare?.gears || []);
const wornGearsInTrip: GearWithQuantity[] = _values(tripShare?.wornGears || []);
const consumablesInTrip: Consumable[] = _values(tripShare?.consumables || []);

// set locale
const i18n = useI18n();
const { isLikelyServerClient } = useDeviceMeta();
if (
    isLikelyServerClient.value &&
    tripShare.locale &&
    constants.LOCALES.includes(tripShare.locale)
) {
    i18n.setLocale(tripShare.locale);
}

useSeoMeta({
    robots: 'noindex, nofollow',
});
</script>

<style lang="scss" scoped>
@import '~/assets/theme/_eg-colors.scss';
html,
body {
    margin: 0;
    padding: 0;
}
body {
    width: 1200px;
    height: 630px;
}
.trip-og-image {
    background-color: $eg-c-brown-200;
    &__weight-info {
        width: 400px;
        transform: scale(1.6);
        transform-origin: top left;
    }
}
</style>
