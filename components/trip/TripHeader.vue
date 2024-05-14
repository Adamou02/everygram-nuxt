<template>
    <div>
        <PrimeImage
            src="/image/illustration/illu-mountains.jpg"
            alt="Trip Banner Image"
            class="w-full border-round-md"
        />
        <div class="flex flex-column py-6">
            <div class="flex justify-content-between align-items-center">
                <h1>{{ trip.title }}</h1>
                <slot name="actions" />
            </div>

            <!-- trip date -->
            <div
                v-if="
                    trip.dateMode === 'multi' && trip.startDate && trip.endDate
                "
                class="py-3"
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
