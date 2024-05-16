<template>
    <div class="trip-header">
        <div class="trip-header__banner w-full border-round-md overflow-hidden">
            <img
                :src="constants.DEFAULT_TRIP_BANNER_IMAGE_PATH"
                alt="Trip Banner Image"
            />
        </div>
        <div
            class="flex flex-column lg:flex-row py-4 lg:py-6 lg:justify-content-between lg:align-items-center gap-3"
        >
            <div>
                <h1 class="text-2xl lg:text-3xl">{{ trip.title }}</h1>
                <!-- trip date -->
                <div v-if="formattedDate" class="mt-1">
                    {{ formattedDate }}
                </div>
            </div>
            <div>
                <slot name="actions" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    trip: Trip | TripShare;
}>();
const formattedDate = computed(() => dataUtils.formatTripDate(props.trip));
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
