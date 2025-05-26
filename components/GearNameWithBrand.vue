<template>
    <div class="flex flex-column gap-1">
        <div v-if="gear.brand" class="text-sm lg:text-sm text-color-light">
            {{ formatBrand(gear.brand) }}
        </div>
        <div class="text-sm lg:text-base line-clamp-2">
            {{ gear.name }}
            <NotInGearsIcon v-if="isGearOwner && gear.isForOneTrip" />
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    gear: Gear;
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
