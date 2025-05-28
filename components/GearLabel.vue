<template>
    <div
        :class="[
            'flex align-items-center min-w-0',
            size === 'lg' ? 'gap-3' : 'gap-2',
        ]"
    >
        <GearPhoto
            :class="[
                'flex-shrink-0',
                size === 'lg' ? 'w-6rem h-6rem ' : 'w-4rem h-4rem',
            ]"
            :gear="gear"
            readonly
        />
        <GearNameWithBrand :gear="gear" :size="size" />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    gear: Gear;
    size?: 'md' | 'lg';
}>();
</script>
