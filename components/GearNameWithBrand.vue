<template>
    <div class="flex flex-column gap-1">
        <div v-if="gear.brand" class="text-color-light cursor-default text-sm">
            {{ formatBrand(gear.brand) }}
        </div>
        <div
            :class="[
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
const isGearOwner = computed(() => {
    if (!user.value) {
        return false;
    }
    return props.gear.role[user.value.uid] === constants.ROLES.OWNER;
});
</script>
