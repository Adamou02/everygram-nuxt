<template>
    <div
        :class="[
            'gear-photo flex align-items-center justify-content-center border-round-md text-400',
            {
                'surface-100': !gear.photo,
            },
        ]"
        :style="{
            backgroundImage: gear.photo ? `url(${gear.photo.url})` : 'none',
        }"
    >
        <span v-if="!gear.photo" class="material-symbols-outlined text-2xl">{{
            gearCategoryIcon
        }}</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    gear: Gear;
}>();
const gearCategoryIcon = computed(
    () => constants.GEAR_CATEGORIES[props.gear.category].icon,
);
</script>

<style scoped lang="scss">
.gear-photo {
    background-position: center;
    background-size: cover;
}
</style>
