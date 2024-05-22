<template>
    <div
        :class="[
            'image-upload-box  border-round-md text-400 flex align-items-center justify-content-center cursor-pointer relative',
            {
                'border-dashed border-2 border-400': !displayImageUrl,
                'border-solid border-1 border-300': displayImageUrl,
            },
        ]"
        :style="{
            width: width && `${width}px`,
            height: height && `${height}px`,
            aspectRatio,
            backgroundImage: displayImageUrl
                ? `url(${displayImageUrl})`
                : 'none',
        }"
        @click="openFilePicker"
    >
        <div v-if="!displayImageUrl">
            <i class="pi pi-camera text-2xl"></i>
        </div>
        <div
            v-else-if="!isLoading && selectedFile"
            class="absolute top-0 right-0 p-1 cursor-pointer"
            @click.stop="onRemoveFile"
        >
            <i class="pi pi-times"></i>
        </div>
        <input
            type="file"
            accept="image/*"
            @change="onFileChange"
            ref="fileInput"
            style="display: none"
        />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    width?: number;
    height?: number;
    aspectRatio?: number;
    imageUrl?: string;
    isLoading?: boolean;
}>();
const emit = defineEmits<{
    'file-selected': [file: File];
    'file-removed': [];
}>();
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const selectedFilePath = computed(
    () => selectedFile.value && URL.createObjectURL(selectedFile.value),
);
const displayImageUrl = computed(
    () => selectedFilePath.value || props.imageUrl,
);
const openFilePicker = () => {
    if (props.isLoading) {
        return;
    }
    fileInput.value?.click();
};
const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
        selectedFile.value = files[0];
        emit('file-selected', files[0]);
    }
    // reset input value
    target.value = '';
};
const onRemoveFile = () => {
    if (props.isLoading) {
        return;
    }
    selectedFile.value = null;
    emit('file-removed');
};
</script>

<style scoped lang="scss">
.image-upload-box {
    background-position: center;
    background-size: cover;
    &:hover {
        opacity: 0.8;
    }
}
</style>
