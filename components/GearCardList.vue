<template>
    <div
        class="gear-card-list"
        :style="{ '--min-card-width': minCardWidth || '375px' }"
    >
        <div v-for="(gear, index) in gears" :key="gear.id">
            <slot name="gear-card" :gear="gear" :index="index"></slot>
        </div>
    </div>
</template>

<script lang="ts" setup generic="T extends Gear">
defineProps<{
    gears: T[];
    minCardWidth?: string; // Optional prop to set minimum card width
}>();
</script>

<style lang="scss">
@import '~/assets/theme/primeflex/core/_variables.scss';

.gear-card-list {
    display: grid;
    gap: 0.75rem;
    @media (min-width: $lg) {
        grid-template-columns: repeat(
            auto-fill,
            minmax(var(--min-card-width), 1fr)
        );
        gap: 1rem;
    }
}
</style>
