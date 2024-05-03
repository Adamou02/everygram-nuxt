<template>
    <div class="flex flex-row flex-wrap gap-0 justify-content-end">
        <PrimeButton
            v-for="(action, index) in props.actions"
            :key="index"
            :icon="action.icon"
            text
            rounded
            v-tooltip.top="{
                value: action.tooltip,
                showDelay: 300,
                hideDelay: 100,
            }"
            @click="action.onClick"
        />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    actions: {
        icon: string;
        tooltip: string;
        onClick: () => void;
    }[];
}>();
</script>
