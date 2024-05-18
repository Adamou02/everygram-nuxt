<template>
    <div
        :class="[
            'flex gap-2 align-items-start text-600',
            {
                'text-xs': props.size === 'xs',
                'text-sm': props.size === 'sm',
                'text-md': props.size === 'md' || !props.size,
            },
        ]"
    >
        <span
            :class="[
                'pi pi-info-circle line-height-2',
                {
                    'line-height-3': props.size === 'md' || !props.size,
                },
            ]"
        ></span>
        <p class="line-height-3">
            {{ props.description }}
        </p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    description?: string;
    size?: 'xs' | 'sm' | 'md';
}>();
</script>
