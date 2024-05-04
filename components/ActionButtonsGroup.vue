<template>
    <div class="flex flex-row flex-wrap gap-1 justify-content-end">
        <PrimeButton
            v-for="(action, index) in props.actions"
            :key="index"
            :icon="action.icon"
            :outlined="type === 'text'"
            :text="type === 'icon'"
            :rounded="type === 'icon'"
            :label="type === 'text' ? action.label : undefined"
            :aria-label="action.label"
            v-tooltip.top="
                type === 'icon' && {
                    value: action.label,
                    showDelay: 300,
                    hideDelay: 100,
                }
            "
            @click="action.onClick"
        />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    actions: {
        icon?: string;
        label: string;
        onClick: () => void;
    }[];
    type: 'icon' | 'text';
}>();
</script>
