<template>
    <DialogMenu
        :menuItems="localeMenuItems"
        :isOpen="isOpen"
        @close="() => emit('close')"
    />
</template>

<script lang="ts" setup>
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
