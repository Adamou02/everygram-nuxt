<template>
    <div
        :class="[
            'flex align-items-center min-w-0',
            size === 'lg' ? 'gap-3' : 'gap-2',
        ]"
    >
        <GearPhoto
            class="flex-shrink-0"
            :gear="gear"
            :size="size === 'lg' ? 'md' : 'sm'"
            :clickable="photoClickable"
        />
        <GearNameWithBrand :gear="gear" :size="size" />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    gear: Gear;
    size?: 'md' | 'lg';
    photoClickable?: boolean;
}>();
</script>
