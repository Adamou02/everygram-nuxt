<template>
    <PrimeDialog
        :visible="isOpenGearCardDialog"
        modal
        dismissableMask
        class="gear-card-dialog w-full mx-2 p-0 max-w-40rem"
        @update:visible="(value) => !value && closeGearCardDialog()"
    >
        <template v-if="isOpenGearCardDialog && displayingGear" #container>
            <div
                class="flex flex-column border-round-lg overflow-auto bg-white"
            >
                <!-- show a square placeholder with loading -->
                <div
                    v-if="!isImgLoaded || !displayImageUrl"
                    class="gear-card-dialog__loading"
                >
                    <PrimeSkeleton class="w-full h-full" />
                </div>
                <img
                    v-if="displayImageUrl"
                    :src="displayImageUrl"
                    :alt="displayingGear.name"
                    :class="{
                        'w-full': isImgLoaded,
                        'max-w-0': !isImgLoaded,
                    }"
                    @load="isImgLoaded = true"
                />
                <div
                    :class="[
                        'p-3 sticky bottom-0 bg-white shadow-2',
                        'flex flex-column gap-3',
                    ]"
                >
                    <!-- gear name and brand -->
                    <GearNameWithBrand
                        :gear="displayingGear"
                        :size="isLargeScreen ? 'lg' : 'md'"
                    />
                    <!-- private note -->
                    <div
                        v-if="
                            displayingGear.privateNote &&
                            user &&
                            displayingGear.role[user.uid] ===
                                constants.ROLES.OWNER
                        "
                        :class="['text-color-light text-sm']"
                    >
                        <i
                            class="pi pi-lock text-xs mr-1"
                            :aria-label="$t('LABEL_PRIVATE_NOTE')"
                        ></i>
                        {{ displayingGear.privateNote }}
                    </div>
                </div>
            </div>
        </template>
    </PrimeDialog>
</template>

<script lang="ts" setup>
const { isLargeScreen } = useDeviceMeta();
const { displayingGear, isOpenGearCardDialog, closeGearCardDialog } =
    useGearCardDialog();
const isImgLoaded = ref(false);
const displayImageUrl = computed(() =>
    displayingGear.value ? dataUtils.getGearPhotoUrl(displayingGear.value) : '',
);
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

// reset image loading state when dialog is closed
watch(isOpenGearCardDialog, (newValue) => {
    if (!newValue) {
        isImgLoaded.value = false;
    }
});
</script>

<style lang="scss">
.gear-card-dialog {
    &__loading {
        width: 100%;
        aspect-ratio: 1;
    }
}
</style>
