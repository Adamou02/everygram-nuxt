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
const consumablesInTrip: ConsumableWithIndex[] = tripShare
    ? _map(tripShare.consumables || [], (consumable, index) => ({
          ...consumable,
          index,
      }))
    : [];
const gearsWeight = _sumBy(
    gearsInTrip,
    (gear) => (+gear.weight || 0) * gear.quantity,
);
const consumablesWeight = _sumBy(
    tripShare?.consumables || [],
    (consumable) => +consumable.weight || 0,
);

// SEO and meta
const i18n = useI18n();
const { formatWeight } = useLangUtils();
const metaTitle = tripShare
    ? i18n.t('META_TRIP_SHARE_TITLE', {
          title: tripShare.title,
      })
    : i18n.t('META_TRIP_SHARE_NOT_FOUND_TITLE');
const metaOgTitle = tripShare
    ? i18n.t('META_TRIP_SHARE_OG_TITLE', {
          title: tripShare.title,
      })
    : i18n.t('META_TRIP_SHARE_NOT_FOUND_OG_TITLE');
const metaDescription = tripShare
    ? i18n.t('META_TRIP_SHARE_DESCRIPTION', {
          title: tripShare.title,
          owner: tripShare.owner.displayName,
          packWeight: formatWeight(gearsWeight + consumablesWeight),
          baseWeight: formatWeight(gearsWeight),
          consumablesWeight: formatWeight(consumablesWeight),
          date: dataUtils.formatTripDate(tripShare),
      })
    : i18n.t('META_TRIP_SHARE_NOT_FOUND_DESCRIPTION');
const defaultBannerImageUrl =
    constants.SITE_DOMAIN + constants.DEFAULT_TRIP_BANNER_IMAGE_PATH;

useSeoMeta({
    title: metaTitle,
    ogTitle: metaOgTitle,
    description: metaDescription,
    ogDescription: metaDescription,
    ogImage: tripShare?.bannerImageUrl || defaultBannerImageUrl,
    robots: tripShare ? 'index, follow' : 'noindex, nofollow',
});
</script>
