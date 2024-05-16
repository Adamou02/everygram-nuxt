<template>
    <TripPageLayout v-if="tripShare">
        <template #header>
            <TripHeader :trip="tripShare">
                <template #actions>
                    <div class="flex align-items-center gap-1">
                        <UserLabel :user="tripShare.owner" />
                        <div class="text-600">
                            {{ $t('INFO_CREATED_THIS_TRIP') }}
                        </div>
                    </div>
                </template>
            </TripHeader>
        </template>
        <template #side>
            <TripWeightInfo
                :gears="gearsInTrip"
                :wornGears="wornGearsInTrip"
                :consumables="consumablesInTrip"
            />
            <PrimeButton
                :label="$t('ACTION_CREATE_YOUR_GEAR_LIST')"
                icon="pi pi-arrow-right"
                icon-pos="right"
                class="w-full mt-3"
                @click="navigateTo('/welcome')"
            />
        </template>
        <template #main>
            <!-- base gears -->
            <TripGearSection :title="$t('LABEL_BASE')" :gears="gearsInTrip">
                <template #category-body="{ gears }">
                    <GearDataTable
                        :gears="gears"
                        :hasQuantity="true"
                        class="lg:ml-6"
                        readonly
                    />
                </template>
            </TripGearSection>

            <!-- comsumables -->
            <TripConsumableSection
                :title="$t('LABEL_CONSUMABLES')"
                :consumables="consumablesInTrip"
            >
                <template #category-body="{ consumables }">
                    <ConsumableDataTable
                        :consumables="consumables"
                        class="lg:ml-6"
                        readonly
                    />
                </template>
            </TripConsumableSection>

            <!-- worn gears -->
            <TripGearSection :title="$t('LABEL_WORN')" :gears="wornGearsInTrip">
                <template #category-body="{ gears }">
                    <GearDataTable
                        :gears="gears"
                        :hasQuantity="true"
                        class="lg:ml-6"
                        readonly
                    />
                </template>
            </TripGearSection>
        </template>
    </TripPageLayout>
    <EmptyState
        :title="$t('INFO_TRIP_NOT_FOUND')"
        :description="$t('INFO_TRIP_NOT_FOUND_DESC')"
        image-src="/image/illustration/illu-camping.svg"
        v-else
    />
</template>

<script setup lang="ts">
import { getApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

definePageMeta({
    layout: 'public-page',
});

const app = getApp();
const db = getFirestore(app);
const route = useRoute();
const tripId = ref(route.params.id as string);
const tripShareRef = doc(db, 'tripShare', tripId.value);
const tripShareSnap = await getDoc(tripShareRef);
const tripShareData = (tripShareSnap.data() as TripShare) || null;
const tripShare = ref<TripShare | null>(
    (tripShareSnap.data() as TripShare) || null,
);
const gearsInTrip = ref<GearWithQuantity[]>(_values(tripShareData.gears));
const wornGearsInTrip = ref<GearWithQuantity[]>(
    _values(tripShareData.wornGears),
);
const consumablesInTrip = computed<ConsumableWithIndex[]>(() =>
    tripShareData
        ? _map(tripShareData.consumables || [], (consumable, index) => ({
              ...consumable,
              index,
          }))
        : [],
);
</script>
