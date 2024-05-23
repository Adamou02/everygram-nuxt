export default function (props?: {
    onFileSelected?: (params: { file: File; filePath: string }) => void;
    onFileRemoved?: () => void;
}) {
    const fileInput = ref<HTMLInputElement | null>(null);
    const selectedFile = ref<File | null>(null);
    const selectedFilePath = computed(
        () =>
            (selectedFile.value && URL.createObjectURL(selectedFile.value)) ||
            '',
    );
    const isHovering = ref(false);
    const onDragOver = () => {
        isHovering.value = true;
    };

    const onDragLeave = () => {
        isHovering.value = false;
    };

    const onDrop = (event: DragEvent) => {
        isHovering.value = false;
        const files = event.dataTransfer?.files;
        if (files) {
            selectedFile.value = files[0];
        }
    };

    const openFilePicker = () => {
        fileInput.value?.click();
    };

    const onFileChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        if (files) {
            selectedFile.value = files[0];
        }
        // reset input value
        target.value = '';
    };

    const onRemoveFile = () => {
        selectedFile.value = null;
    };

    watch(selectedFile, (file) => {
        if (file) {
            props?.onFileSelected?.({ file, filePath: selectedFilePath.value });
        } else {
            props?.onFileRemoved?.();
        }
    });

    return {
        selectedFile,
        selectedFilePath,
        isHovering,
        onDragOver,
        onDragLeave,
        onDrop,
        fileInput,
        openFilePicker,
        onFileChange,
        onRemoveFile,
    };
}
