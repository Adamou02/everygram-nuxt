<template>
    <div class="flex flex-column gap-1">
        <div v-if="gear.brand" class="text-sm lg:text-sm text-color-light">
            {{ formatBrand(gear.brand) }}
        </div>
        <div class="text-sm lg:text-base line-clamp-2">
            {{ gear.name }}
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    gear: Gear;
}>();
const { formatBrand } = useLangUtils();
</script>
