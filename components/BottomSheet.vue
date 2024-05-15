<template>
    <PrimeSidebar
        :visible="isOpen"
        position="bottom"
        class="more-actions-bottom-sheet p-3 h-auto border-round-top-lg"
        @update:visible="(value: boolean) => !value && $emit('close')"
    >
        <template #container>
            <slot />
        </template>
    </PrimeSidebar>
</template>

<script setup lang="ts">
const props = defineProps<{
    isOpen: boolean;
}>();

const emit = defineEmits<{
    close: [];
}>();
</script>
