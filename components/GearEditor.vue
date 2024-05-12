<template>
    <GearEditorDialog
        :is-open="isAddingGear || isEditingGear"
        :gear="editingGear"
        :default-category="defaultGearCategory"
        @complete-create="
            (gear) => {
                onCompleteCreateGear();
                emit('complete-create-gear', gear);
            }
        "
        @complete-edit="
            (gear) => {
                onCompleteEditGear();
                emit('complete-edit-gear', gear);
            }
        "
        @cancel="
            () => {
                onCancelEditGear();
                emit('cancel-edit-gear');
            }
        "
    />
</template>

<script setup lang="ts">
const emit = defineEmits<{
    'complete-create-gear': [gear: Gear];
    'complete-edit-gear': [gear: Gear];
    'cancel-edit-gear': [];
}>();
const {
    onCompleteCreateGear,
    onCompleteEditGear,
    onCancelEditGear,
    isAddingGear,
    isEditingGear,
    editingGear,
    defaultGearCategory,
} = useEditGear();
</script>
