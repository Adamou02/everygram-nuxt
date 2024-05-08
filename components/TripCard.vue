<template>
    <div
        class="trip-card border-round-md shadow-1 bg-white flex flex-column w-full"
    >
        <div class="trip-card__image"></div>
        <div class="px-4 py-3">
            <h3 class="text-lg mb-2 text-ellipsis">
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
    if (props.trip.dateMode === 'multi') {
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
        aspect-ratio: 3 / 1;
        background-image: url('/image/illustration/illu-mountains.jpg');
        background-size: cover;
    }
}
</style>
