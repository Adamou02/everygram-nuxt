<template>
    <div v-if="formattedDate" class="trip-date">
        <!-- calendar icon -->
        <i class="pi pi-calendar mr-1 text-600" />
        <!-- dates -->
        {{ formattedDate }}
        <!-- days for multi-day trips -->
        <template v-if="trip.dateMode === 'multi'">
            ・{{ $t('INFO_DAYS', { num: days }, days) }}
        </template>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    trip: Trip | TripShare;
}>();
const formattedDate = computed(() => dataUtils.formatTripDate(props.trip));
const days = computed(() => dataUtils.getTripDays(props.trip));
</script>

<style lang="scss">
@import '~/assets/theme/_eg-colors.scss';

.trip-date {
    display: inline-block;
    font-size: 14px;
    color: $eg-c-text;
    background-color: $eg-c-gray-200;
    padding: 2px 4px;
    border-radius: 2px;
}
</style>
