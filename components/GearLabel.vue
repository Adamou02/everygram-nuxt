<template>
    <div class="flex gap-2 align-items-center min-w-0">
        <GearPhoto
            class="w-4rem h-4rem lg:w-4rem lg:h-4rem flex-shrink-0"
            :gear="gear"
            readonly
        />
        <GearNameWithBrand :gear="gear" />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    gear: Gear;
}>();
</script>
