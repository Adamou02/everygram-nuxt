<template>
    <BottomSheet :isOpen="isOpen" @close="$emit('close')">
        <PrimeMenu
            :model="menuItems"
            class="border-none"
            @click="$emit('close')"
            :pt="{
                menu: {
                    class: 'flex flex-column gap-1 border-round-lg overflow-hidden',
                },
                content: { class: 'surface-100 hover:surface-300' },
                action: { class: 'py-3' },
            }"
        />
    </BottomSheet>
</template>

<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';

const props = defineProps<{
    menuItems: MenuItem[];
    isOpen: boolean;
}>();

const emit = defineEmits<{
    close: [];
}>();
</script>
