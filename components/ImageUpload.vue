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
import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const props = defineProps<{
    path: string;
    label?: string;
}>();

const emit = defineEmits<{
    'upload-complete': [{ downloadUrl: string; fileName: string }];
}>();

const isUploading = ref(false);
const storage = getStorage();

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
        const formattedFile = await utils.formatImageToJpeg(file, {
            maxWidth: constants.MAX_IMAGE_WIDTH,
            maxHeight: constants.MAX_IMAGE_HEIGHT,
        });

        // upload image to storage with uuid as file name
        const fileName = uuidv4();
        const fileRef = storageRef(storage, `${props.path}/${fileName}`);
        const snapshot = await uploadBytes(fileRef, formattedFile);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        emit('upload-complete', { downloadUrl, fileName });
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
