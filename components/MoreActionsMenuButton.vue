<template>
    <div class="hidden lg:block">
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
    </div>
    <div class="lg:hidden">
        <PrimeButton
            type="button"
            :text="text"
            :rounded="rounded"
            :outlined="outlined"
            icon="pi pi-ellipsis-v"
            aria-haspopup="true"
            @click="isOpenBottomMenu = true"
        />
        <PrimeSidebar
            v-model:visible="isOpenBottomMenu"
            position="bottom"
            class="py-3 h-auto border-round-top-lg"
        >
            <template #container>
                <PrimeMenu
                    :model="props.items"
                    class="border-none"
                    @click="isOpenBottomMenu = false"
                />
            </template>
        </PrimeSidebar>
    </div>
</template>

<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';

const props = defineProps<{
    items: MenuItem[];
    text?: boolean;
    rounded?: boolean;
    outlined?: boolean;
}>();

// desktop menu
const menuId = _uniqueId('overlay_menu_');
const menu = ref();
const toggle = (event: any) => {
    menu.value.toggle(event);
};

// mobile menu
const isOpenBottomMenu = ref(false);
</script>
