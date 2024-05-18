<template>
    <div class="flex flex-column gap-3 w-full">
        <div
            id="file-upload-drop-zone"
            :class="[
                'flex flex-column gap-4 align-items-center justify-content-center text-center text-primary cursor-pointer w-full h-10rem border-dashed border-primary border-rounded-md p-5',
                { hover: isHovering },
            ]"
            @dragover.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
            @click="openFilePicker"
        >
            {{ description || $t('INFO_DROP_FILE_HERE') }}
            <PrimeButton
                :label="buttonLabel || $t('ACTION_UPLOAD_FILE')"
                icon="pi pi-upload"
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

const isHovering = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const onDragOver = () => {
    isHovering.value = true;
};

const onDragLeave = () => {
    isHovering.value = false;
};

const onDrop = (event: DragEvent) => {
    if (props.isLoading) {
        return;
    }
    isHovering.value = false;
    const files = event.dataTransfer?.files;
    if (files) {
        emit('file-selected', files[0]);
    }
};

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
        emit('file-selected', files[0]);
    }
    // reset input value
    target.value = '';
};
</script>

<style scoped>
#file-upload-drop-zone.hover {
    opacity: 0.8 !important;
}
</style>
