<template>
    <div class="gear-name-with-brand flex flex-column gap-1">
        <div
            v-if="gear.brand"
            class="gear-name-with-brand__brand text-color-light cursor-default text-sm"
        >
            {{ formatBrand(gear.brand) }}
        </div>
        <div
            :class="[
                'gear-name-with-brand__name',
                'line-clamp-2',
                size === 'lg' ? 'text-base lg:text-lg' : 'text-sm lg:text-base',
            ]"
        >
            {{ gear.name }}
            <slot name="extra-info" />
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    gear: Gear;
    size?: 'md' | 'lg';
}>();
const { formatBrand } = useLangUtils();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
</script>

<style lang="scss">
.gear-name-with-brand {
    // add a gap between name and extra-info
    &__name > :last-child {
        margin-left: 0.5rem;
    }
}
</style>
