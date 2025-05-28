<template>
    <div class="flex flex-column gap-3 bg-white border-round-md p-3 shadow-1">
        <div class="flex align-items-start justify-content-between">
            <GearLabel :gear="gear" size="lg" />
            <GearActionsMenuButton
                :gear="gear"
                :actions="actionItems"
                @gear-edit="$emit('gear-edit', $event)"
                @gear-edit-archive="$emit('gear-edit-archive', $event)"
                @gear-edit-quantity="$emit('gear-edit-quantity', $event)"
                @gear-add-to-gears="$emit('gear-add-to-gears', $event)"
                @gear-archive="$emit('gear-archive', $event)"
                @gear-unarchive="$emit('gear-unarchive', $event)"
                @gear-delete="$emit('gear-delete', $event)"
                @gear-remove="$emit('gear-remove', $event)"
            />
        </div>
        <div class="flex align-items-center justify-content-between gap-2">
            <div class="flex align-items-center gap-2">
                <CategoryLabel :category="gear.category" />
                <span class="text-color-lightest">|</span>
                <span class="text-color-light">{{
                    formatWeight(gear.weight)
                }}</span>
            </div>
            <slot name="extra-info"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    gear: Gear;
    actionItems: GearAction[];
}>();

defineEmits<{
    'gear-edit': [gear: Gear];
    'gear-edit-archive': [gear: Gear];
    'gear-edit-quantity': [gear: GearWithQuantity];
    'gear-add-to-gears': [gear: Gear];
    'gear-archive': [gear: Gear];
    'gear-unarchive': [gear: Gear];
    'gear-delete': [gear: Gear];
    'gear-remove': [gear: Gear];
}>();

const { formatWeight } = useLangUtils();
</script>
