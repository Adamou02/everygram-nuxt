<template>
    <div
        :class="[
            'gear-photo flex align-items-center justify-content-center border-round-md overflow-hidden',
            {
                'surface-100 text-color-lightest border-2 border-100':
                    !displayImageUrl,
                'w-3rem h-3rem': !size || size === 'xs',
                'w-4rem h-4rem': size === 'sm',
                'w-6rem h-6rem': size === 'md',
                'gear-photo--enlargable cursor-pointer': isEnlargable,
            },
        ]"
        :role="isEnlargable ? 'button' : undefined"
        @click="isEnlargable && openGearCardDialog(gear)"
    >
        <img
            v-if="displayImageUrl"
            :src="displayImageUrl"
            :alt="gear.name"
            class="gear-photo__img"
            loading="lazy"
        />
        <span v-else class="material-symbols-outlined text-2xl">{{
            gearCategoryIcon
        }}</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    gear: Gear;
    size?: 'xs' | 'sm' | 'md';
    clickable?: boolean;
}>();
const gearCategoryIcon = computed(
    () => constants.GEAR_CATEGORIES[props.gear.category].icon,
);
const displayImageUrl = computed(() => {
    const thumbnailSize = props.size === 'md' ? 'sm' : 'xs';
    return dataUtils.getGearPhotoUrl(props.gear, thumbnailSize);
});
const { openGearCardDialog } = useGearCardDialog();
const isEnlargable = computed(() => {
    return !!(props.clickable !== false && displayImageUrl.value);
});
</script>

<style scoped lang="scss">
.gear-photo {
    &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.1s ease-out;
    }
    &--enlargable:hover &__img {
        transform: scale(1.1);
    }
}
</style>
