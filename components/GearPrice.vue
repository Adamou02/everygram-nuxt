<template>
    <div class="gear-name-with-brand flex flex-column min-w-0 gap-1">
        <!-- price -->
        <div
            v-if="gear.price"
            :class="[
                'text-color-light',
                'line-clamp-1', // text-ellipsis doesn't work in data table
                size === 'lg' ? 'text-xs lg:text-sm' : 'text-xs',
            ]"
        >
            {{ formatPrice(gear.currency!, gear.price) }}
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    gear: Gear;
    size?: 'md' | 'lg';
}>();
const { formatPrice } = useLangUtils();
</script>

<style lang="scss">
.gear-name-with-brand {
    // add a gap between name and extra-info
    &__name > :last-child {
        margin-left: 0.5rem;
    }
}
</style>
