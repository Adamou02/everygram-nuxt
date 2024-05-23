<template>
    <div
        :class="[
            'image-upload-box  border-round-md text-400 flex align-items-center justify-content-center cursor-pointer relative',
            {
                'border-dashed border-2 border-400': !displayImageUrl,
                'border-solid border-1 border-300': displayImageUrl,
                'opacity-80': isHovering,
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
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="
            (event) => {
                !isLoading && onDrop(event);
            }
        "
        @click="
            () => {
                !isLoading && openFilePicker();
            }
        "
    >
        <div v-if="!displayImageUrl">
            <i class="pi pi-camera text-2xl"></i>
        </div>
        <div
            v-else-if="!isLoading && selectedFile"
            class="absolute top-0 right-0 p-1 cursor-pointer"
            @click.stop="
                () => {
                    !isLoading && onRemoveFile();
                }
            "
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
    compressorOptions?: PhotoCompressorOptions;
}>();
const emit = defineEmits<{
    'file-compressed': [file: Blob];
    'file-removed': [];
}>();
const {
    fileInput,
    selectedFile,
    selectedFilePath,
    openFilePicker,
    onFileChange,
    onRemoveFile,
    onDragOver,
    onDragLeave,
    onDrop,
    isHovering,
} = useImageUpload({
    ...props.compressorOptions,
    onFileCompressed: (file) => {
        emit('file-compressed', file);
    },
    onFileRemoved: () => {
        emit('file-removed');
    },
});

const displayImageUrl = computed(
    () => selectedFilePath.value || props.imageUrl,
);
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
