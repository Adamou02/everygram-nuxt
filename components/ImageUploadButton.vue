<template>
    <PrimeButton
        icon="pi pi-image"
        icon-pos="left"
        :label="label || $t('ACTION_UPLOAD_PHOTO')"
        :loading="isUploading || isCompressing"
        :disabled="isUploading || isCompressing"
        :severity="severity"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
        @click="() => !isUploading && !isCompressing && openFilePicker()"
    />
    <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept="image/*"
        @change="onFileChange"
    />
</template>

<script setup lang="ts">
const props = defineProps<{
    path: string;
    label?: string;
    severity?: string;
}>();

const emit = defineEmits<{
    'upload-complete': [{ downloadUrl: string; fileName: string }];
}>();

const {
    fileInput,
    isCompressing,
    openFilePicker,
    onFileChange,
    onDragOver,
    onDragLeave,
    onDrop,
} = useImageUpload({
    width: constants.LIMIT.tripBannerImageWidth,
    height: constants.LIMIT.tripBannerImageHeight,
    resize: 'cover',
    onFileCompressed: async (file) => {
        // upload image right after compression
        try {
            isUploading.value = true;
            const result = await uploadFile({
                path: props.path,
                file,
            });
            if (result) {
                emit('upload-complete', {
                    downloadUrl: result.downloadUrl,
                    fileName: result.fileName,
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                // hack: wait image to load
                isUploading.value = false;
            }, 1000);
        }
    },
});

const { isUploading, uploadFile } = useStorage();
</script>
