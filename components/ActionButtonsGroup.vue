<template>
    <div class="flex flex-row flex-wrap gap-1 justify-content-end">
        <PrimeButton
            v-for="(action, index) in props.actions"
            :key="index"
            :icon="action.icon"
            :severity="severity"
            :outlined="outlined"
            :text="text"
            :raised="raised"
            :rounded="rounded"
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
    text?: boolean;
    rounded?: boolean;
    outlined?: boolean;
    raised?: boolean;
    severity?: string;
}>();
</script>
