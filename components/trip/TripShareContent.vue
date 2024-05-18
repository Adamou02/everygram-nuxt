<template>
    <div class="flex flex-column gap-3">
        <h3 class="py-2">
            {{
                trip.isPublished
                    ? $t('INFO_SHARE_THIS_TRIP_BY_THIS_LINK')
                    : $t('INFO_PUBLISH_TO_WEB')
            }}
        </h3>
        <template v-if="trip.isPublished">
            <PrimeInputGroup>
                <PrimeInputText
                    :value="tripShareLink"
                    readonly
                    class="w-full"
                ></PrimeInputText>
                <PrimeButton :icon="copyIcon" @click="onCopyLink" />
            </PrimeInputGroup>
            <div class="flex flex-column lg:flex-row-reverse gap-2">
                <PrimeButton
                    :label="$t('ACTION_VIEW_SHARED_TRIP_PAGE')"
                    class="w-full"
                    @click="() => onViewSharedTrip()"
                />
                <PrimeButton
                    :label="$t('ACTION_UNPUBLISH')"
                    class="w-full"
                    outlined
                    @click="() => unpublishTrip(trip)"
                />
            </div>
        </template>
        <template v-else>
            <p>
                {{ $t('INFO_PUBLISH_TO_WEB_DESC') }}
            </p>
            <PrimeButton
                :label="$t('ACTION_PUBLISH')"
                class="w-full"
                @click="() => publishTrip(trip)"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    trip: Trip;
}>();

const copyIcon = ref('pi pi-copy');

const tripShareLink = computed(() => {
    return `${window.location.origin}/trip-share/${props.trip.id}`;
});

const { publishTrip, unpublishTrip } = useShareTrip();

const onCopyLink = () => {
    utils.copyToClipboard(tripShareLink.value);
    copyIcon.value = 'pi pi-check';
    setTimeout(() => {
        copyIcon.value = 'pi pi-copy';
    }, 1000);
    analyticsUtils.log(constants.ANALYTICS_EVENTS.COPY_SHARE_TRIP_LINK, {
        trip_id: props.trip.id,
    });
};
const onViewSharedTrip = () => {
    window.open(tripShareLink.value, '_blank');
};
</script>
