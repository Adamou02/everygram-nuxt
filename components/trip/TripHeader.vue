<template>
    <div class="trip-header">
        <div class="trip-header__banner w-full border-round-md overflow-hidden">
            <img
                src="/image/illustration/illu-mountains.jpg"
                alt="Trip Banner Image"
            />
        </div>
        <div class="flex flex-column py-4 lg:py-6">
            <div class="flex justify-content-between align-items-center">
                <h1>{{ trip.title }}</h1>
                <slot name="actions" />
            </div>

            <!-- trip date -->
            <div
                v-if="
                    trip.dateMode === 'multi' && trip.startDate && trip.endDate
                "
                class="mt-2 lg:mt-3"
            >
                {{ dataUtils.formatDateString(trip.startDate, '/') }} ~
                {{ dataUtils.formatDateString(trip.endDate, '/') }}
            </div>
            <div
                v-else-if="trip.dateMode === 'single' && trip.startDate"
                class="py-3"
            >
                {{ dataUtils.formatDateString(trip.startDate, '/') }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    trip: Trip | TripShare;
}>();
</script>

<style lang="scss">
@import '~/assets/theme/primeflex/core/_variables.scss';

.trip-header {
    &__banner {
        aspect-ratio: 3 / 1;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        @media (min-width: $lg) {
            aspect-ratio: 4 / 1;
        }
    }
}
</style>
