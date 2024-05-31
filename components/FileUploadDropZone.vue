<template>
    <div class="flex flex-column gap-3 w-full">
        <div
            :class="[
                'file-upload-drop-zone flex flex-column gap-4 align-items-center justify-content-center text-center text-primary cursor-pointer w-full h-10rem border-dashed border-primary border-round-md p-5',
                { 'opacity-80': isHovering },
            ]"
            @dragover.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="
                (event) => {
                    !isLoading && onDrop(event);
                }
            "
            @click="
                () => {
                    !props.isLoading && openFilePicker();
                }
            "
        >
            {{ description || $t('INFO_DROP_FILE_HERE') }}
            <PrimeButton
                :label="buttonLabel || $t('ACTION_UPLOAD_FILE')"
                icon="pi pi-upload"
                rounded
                outlined
                :loading="isLoading"
                :disabled="isLoading"
            />
        </div>
        <input
            type="file"
            :accept="accept"
            @change="onFileChange"
            ref="fileInput"
            style="display: none"
        />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    description?: string;
    buttonLabel?: string;
    accept?: string;
    isLoading?: boolean;
}>();
const emit = defineEmits<{
    'file-selected': [file: File];
}>();
const {
    isHovering,
    onDragOver,
    onDragLeave,
    onDrop,
    fileInput,
    openFilePicker,
    onFileChange,
} = useFileUpload({
    onFileSelected: ({ file }) => {
        emit('file-selected', file);
    },
});
</script>
