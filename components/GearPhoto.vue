<template>
    <div
        :class="[
            'gear-photo flex align-items-center justify-content-center border-round-md text-400 relative',
            {
                'gear-photo--empty surface-100 border-2 border-100 hover:border-dashed hover:border-400 cursor-pointer':
                    !displayImageUrl,
                'opacity-50': isHovering || isCompressing || isLoading,
                // show dashed border when hovering on empty gear photo
                'border-dashed border-400': isHovering && !displayImageUrl,
            },
        ]"
        :style="{
            backgroundImage: displayImageUrl
                ? `url(${displayImageUrl})`
                : 'none',
        }"
    >
        <span
            v-if="!displayImageUrl"
            class="material-symbols-outlined text-2xl"
            >{{ gearCategoryIcon }}</span
        >
        <!-- invisible image uploader -->
        <div
            class="gear-photo__image-uploader absolute top-0 left-0 right-0 bottom-0"
            @dragover.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
            @click="!displayImageUrl && openFilePicker"
        >
            <input
                type="file"
                accept="image/*"
                @change="onFileChange"
                ref="fileInput"
                style="display: none"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    gear: Gear;
}>();
const isLoading = ref(false);
const userGearsStore = useUserGearsStore();
const { uploadFile } = useStorage();
const {
    fileInput,
    selectedFilePath,
    openFilePicker,
    onFileChange,
    onDragOver,
    onDragLeave,
    onDrop,
    isHovering,
    isCompressing,
} = useImageUpload({
    width: constants.LIMIT.gearPhotoWidth,
    height: constants.LIMIT.gearPhotoHeight,
    resize: 'cover',
    onFileCompressed: async (file) => {
        // upload image right after compression
        try {
            isLoading.value = true;
            const result = await uploadFile({
                path: `${constants.STORAGE_PATH.GEAR}/${props.gear.id}`,
                file,
            });
            if (result) {
                await userGearsStore.updateGear({
                    id: props.gear.id,
                    gearData: {
                        photo: {
                            url: result.downloadUrl,
                            fileName: result.fileName,
                        },
                    },
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            isLoading.value = false;
        }
    },
});
const gearCategoryIcon = computed(
    () => constants.GEAR_CATEGORIES[props.gear.category].icon,
);
const displayImageUrl = computed(
    () =>
        selectedFilePath.value ||
        props.gear.photo?.thumbnails?.xs.url ||
        props.gear.photo?.url,
);
</script>

<style scoped lang="scss">
.gear-photo {
    background-position: center;
    background-size: cover;

    // not support image uploader on mobile devices
    @media not (hover: hover) {
        border: none !important;
        cursor: default !important;
        opacity: 1 !important;
        &__image-uploader {
            display: none !important;
        }
    }
}
</style>
