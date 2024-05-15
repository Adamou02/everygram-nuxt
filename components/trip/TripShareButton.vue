<template>
    <div>
        <div class="hidden lg:block">
            <PrimeButton
                type="button"
                :text="text"
                :rounded="rounded"
                :outlined="outlined"
                icon="pi pi-share-alt"
                :label="$t('ACTION_SHARE')"
                @click="toggle"
            />
            <PrimeOverlayPanel
                ref="overlayPanel"
                class="border-round-lg p-2 w-25rem"
            >
                <TripShareContent :trip="trip" />
            </PrimeOverlayPanel>
        </div>
        <div class="lg:hidden">
            <PrimeButton
                type="button"
                :text="text"
                :rounded="rounded"
                :outlined="outlined"
                icon="pi pi-share-alt"
                aria-haspopup="true"
                @click="isOpenBottomMenu = true"
            />
            <BottomSheet
                :isOpen="isOpenBottomMenu"
                @close="isOpenBottomMenu = false"
            >
                <TripShareContent :trip="trip" />
            </BottomSheet>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    trip: Trip;
    text?: boolean;
    rounded?: boolean;
    outlined?: boolean;
}>();

// desktop overlay panel
const overlayPanel = ref();
const toggle = (event: MouseEvent) => {
    overlayPanel.value.toggle(event);
};

// mobile menu
const isOpenBottomMenu = ref(false);
</script>
