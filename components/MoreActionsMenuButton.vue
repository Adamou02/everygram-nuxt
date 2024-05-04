<template>
    <div>
        <PrimeButton
            type="button"
            text
            rounded
            icon="pi pi-ellipsis-v"
            aria-haspopup="true"
            :aria-controls="menuId"
            @click="toggle"
        />
        <PrimeMenu ref="menu" :id="menuId" :model="props.items" :popup="true" />
    </div>
</template>

<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';

const props = defineProps<{
    items: MenuItem[];
}>();

const menuId = _uniqueId('overlay_menu_');
const menu = ref();

const toggle = (event: any) => {
    menu.value.toggle(event);
};
</script>
