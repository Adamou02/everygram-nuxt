<template>
    <GearCardHorizontal
        :gear="gear"
        :class="[
            'cursor-pointer user-select-none',
            'hover:shadow-3',
            { 'gear-card-horizontal--not-selected': !selected },
        ]"
        @click="toggle"
    >
        <template #actions>
            <PrimeCheckbox :modelValue="selected" binary />
        </template>
        <template #info-left>
            <slot name="info-left" />
        </template>
        <template #info-right>
            <slot name="info-right" />
        </template>
    </GearCardHorizontal>
</template>

<script lang="ts" setup>
defineProps<{
    gear: any;
    selected: boolean;
}>();
const emit = defineEmits<{
    toggle: [];
}>();
const toggle = () => emit('toggle');
</script>

<style lang="scss">
.gear-card-horizontal--not-selected {
    opacity: 0.3;
    filter: grayscale(100%);
}
</style>
