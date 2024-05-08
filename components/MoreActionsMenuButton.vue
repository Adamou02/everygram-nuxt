<template>
    <PrimeButton
        type="button"
        :text="text"
        :rounded="rounded"
        :outlined="outlined"
        icon="pi pi-ellipsis-v"
        aria-haspopup="true"
        :aria-controls="menuId"
        @click="toggle"
    />
    <PrimeMenu ref="menu" :id="menuId" :model="props.items" :popup="true" />
</template>

<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';

const props = defineProps<{
    items: MenuItem[];
    text?: boolean;
    rounded?: boolean;
    outlined?: boolean;
}>();

const menuId = _uniqueId('overlay_menu_');
const menu = ref();

const toggle = (event: any) => {
    menu.value.toggle(event);
};
</script>
