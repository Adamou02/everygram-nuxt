<template>
    <div
        class="trip-card border-round-md overflow-hidden shadow-1 bg-white flex flex-column w-full"
    >
        <div
            class="trip-card__image relative"
            :style="{
                backgroundImage: `url('${trip.bannerImage ? trip.bannerImage.url : constants.SITE_DOMAIN + constants.DEFAULT_TRIP_BANNER_IMAGE_PATH}')`,
            }"
        >
            <div
                v-if="trip.isPublished"
                class="trip-card__public-label flex align-items-center gap-1 p-2 absolute top-0 right-0 text-white"
            >
                <i class="pi pi-globe"></i>
                <div>{{ $t('LABEL_PUBLIC') }}</div>
            </div>
        </div>
        <div class="px-4 py-3">
            <h3 class="text-lg text-color mb-2 text-ellipsis">
                {{ trip.title }}
            </h3>
            <div class="text-600 mb-3 text-ellipsis">
                <template v-if="trip.startDate">
                    {{ trip.startDate }}
                    <template v-if="trip.dateMode === 'multi'">
                        ・{{ $t('INFO_DAYS', { num: days }, days) }}
                    </template>
                </template>
                <template v-else>
                    <div class="text-white">-</div>
                </template>
            </div>
            <PrimeTag
                severity="secondary"
                :value="
                    formatWeight(dataUtils.getTripWeightTotal(trip, gearMap))
                "
            />
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    trip: Trip;
}>();

const userGearsStore = useUserGearsStore();
const { gearMap } = storeToRefs(userGearsStore);
const { formatWeight } = useLangUtils();

const days = computed(() => {
    if (
        props.trip.dateMode === 'multi' &&
        props.trip.startDate &&
        props.trip.endDate
    ) {
        return dataUtils.getDaysBetweenDates(
            props.trip.startDate,
            props.trip.endDate,
        );
    }
    return 1;
});
</script>

<style lang="scss">
.trip-card {
    &__image {
        aspect-ratio: 2 / 1;
        background-size: cover;
        background-position: center;
    }
    &__public-label {
        text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5);
    }
}
</style>
