<template>
    <label
        :for="`${path}-image-upload`"
        class="p-button p-component"
        :disabled="isUploading"
    >
        <span
            v-if="!isUploading"
            class="p-button-icon p-button-icon-left pi pi-image"
        ></span>
        <span class="p-button-label">
            <PrimeProgressSpinner
                v-if="isUploading"
                class="w-1rem h-1rem mx-4"
                strokeWidth="2"
            />
            <template v-else>
                {{ label || $t('ACTION_UPLOAD_PHOTO') }}
            </template>
        </span>
    </label>
    <input
        :id="`${path}-image-upload`"
        type="file"
        class="hidden"
        accept="image/*"
        :disabled="isUploading"
        @change="onSelectFile"
    />
</template>

<script setup lang="ts">
const props = defineProps<{
    path: string;
    label?: string;
}>();

const emit = defineEmits<{
    'upload-complete': [{ downloadUrl: string; fileName: string }];
}>();

const { isUploading, uploadFile } = useStorage();

const onSelectFile = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
        return;
    }

    // check if file type is image
    if (!file.type.startsWith('image/')) {
        return;
    }

    try {
        isUploading.value = true;

        // format image to jpeg
        const formattedFile = await fileUtils.formatImageToJpeg(file, {
            maxWidth: constants.LIMIT.imageWidth,
            maxHeight: constants.LIMIT.imageHeight,
        });

        // upload image to storage with uuid as file name
        const result = await uploadFile({
            path: props.path,
            file: formattedFile,
        });
        if (!result) {
            throw new Error('Failed to upload file');
        }
        emit('upload-complete', {
            downloadUrl: result.downloadUrl,
            fileName: result.fileName,
        });
    } catch (error) {
        console.error(error);
    } finally {
        setTimeout(() => {
            // hack: wait image to load
            isUploading.value = false;
        }, 1000);
    }
};
</script>
