<template>
    <div>
        <div class="hidden lg:block">
            <PrimeButton
                type="button"
                rounded
                :text="text"
                :outlined="outlined"
                :raised="raised"
                :severity="severity"
                :label="$t('ACTION_SHARE')"
                @click="toggle"
            >
                <template #icon>
                    <span class="material-symbols-outlined mr-2"
                        >ios_share</span
                    >
                </template>
            </PrimeButton>
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
                rounded
                :text="text"
                :outlined="outlined"
                :raised="raised"
                :severity="severity"
                aria-haspopup="true"
                @click="isOpenBottomMenu = true"
            >
                <template #icon>
                    <span class="material-symbols-outlined">ios_share</span>
                </template></PrimeButton
            >
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
    outlined?: boolean;
    raised?: boolean;
    severity?: string;
}>();

// desktop overlay panel
const overlayPanel = ref();
const toggle = (event: MouseEvent) => {
    overlayPanel.value.toggle(event);
};

// mobile menu
const isOpenBottomMenu = ref(false);
</script>
