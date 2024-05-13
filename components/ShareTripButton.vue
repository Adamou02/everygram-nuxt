<template>
    <PrimeButton
        type="button"
        icon="pi pi-share-alt"
        :label="$t('ACTION_SHARE')"
        @click="toggle"
    />

    <PrimeOverlayPanel ref="overlayPanel" class="border-round-lg p-2 w-25rem">
        <div v-if="trip.isPublished" class="flex flex-column gap-3">
            <h3 class="">{{ $t('INFO_SHARE_THIS_TRIP_BY_THIS_LINK') }}</h3>
            <PrimeInputGroup>
                <PrimeInputText
                    :value="tripShareLink"
                    readonly
                    class="w-25rem"
                ></PrimeInputText>
                <PrimeButton :icon="copyIcon" @click="onCopyLink" />
            </PrimeInputGroup>
            <div class="flex gap-3">
                <PrimeButton
                    :label="$t('ACTION_UNPUBLISH')"
                    class="w-full"
                    outlined
                    @click="() => unpublishTrip(trip)"
                />
                <PrimeButton
                    :label="$t('ACTION_VIEW_SHARED_TRIP_PAGE')"
                    class="w-full"
                    @click="() => onViewSharedTrip()"
                />
            </div>
        </div>
        <div v-else class="flex flex-column gap-3">
            <h3>{{ $t('INFO_PUBLISH_TO_WEB') }}</h3>
            <p>
                {{ $t('INFO_PUBLISH_TO_WEB_DESC') }}
            </p>
            <PrimeButton
                :label="$t('ACTION_PUBLISH')"
                class="w-full"
                @click="() => publishTrip(trip)"
            />
        </div>
    </PrimeOverlayPanel>
</template>

<script setup lang="ts">
const props = defineProps<{
    trip: Trip;
}>();
const copyIcon = ref('pi pi-copy');
const overlayPanel = ref();
const toggle = (event: MouseEvent) => {
    overlayPanel.value.toggle(event);
};
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
};
const onViewSharedTrip = () => {
    window.open(tripShareLink.value, '_blank');
};
</script>
