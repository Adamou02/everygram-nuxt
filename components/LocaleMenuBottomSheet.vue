<template>
    <BottomSheetMenu
        :menuItems="localeMenuItems"
        :isOpen="isOpen"
        @close="() => emit('close')"
    />
</template>

<script setup lang="ts">
const props = defineProps<{
    isOpen: boolean;
}>();
const emit = defineEmits<{
    close: [];
}>();
const { localeMenuItems } = useLocaleMenuItems({
    close: () => emit('close'),
});
</script>
