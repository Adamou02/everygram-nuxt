<template>
    <PrimeDialog
        :visible="isOpen"
        modal
        class="mx-2"
        :dismissableMask="true"
        @update:visible="(value: boolean) => !value && $emit('close')"
    >
        <template #container>
            <PrimeMenu
                :model="menuItems"
                @click="$emit('close')"
                class="border-round-lg p-3"
                :pt="{
                    menu: {
                        class: 'flex flex-column gap-1 border-round-lg overflow-hidden',
                    },
                    content: { class: 'surface-100 hover:surface-300' },
                    action: { class: 'py-3' },
                }"
            />
        </template>
    </PrimeDialog>
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
