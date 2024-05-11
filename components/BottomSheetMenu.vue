<template>
    <PrimeSidebar
        :visible="isOpen"
        position="bottom"
        class="more-actions-bottom-sheet p-3 h-auto border-round-top-lg"
        @update:visible="(value: boolean) => !value && $emit('close')"
    >
        <template #container>
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
        </template>
    </PrimeSidebar>
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
