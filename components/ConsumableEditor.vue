<template>
    <ConsumableEditorDialog
        :is-open="isAddingConsumable || isEditingConsumable"
        :trip-id="tripId"
        :existingConsumable="editingConsumable"
        :default-category="defaultConsumableCategory"
        @complete-create="
            (consumable) => {
                onCompleteCreateConsumable();
                emit('complete-create-consumable', consumable);
            }
        "
        @complete-edit="
            (consumable) => {
                onCompleteEditConsumable();
                emit('complete-edit-consumable', consumable);
            }
        "
        @cancel="
            () => {
                onCancelEditConsumable();
                emit('cancel-edit-consumable');
            }
        "
    />
</template>

<script setup lang="ts">
const props = defineProps<{
    tripId: string;
}>();
const emit = defineEmits<{
    'complete-create-consumable': [consumable: Consumable];
    'complete-edit-consumable': [consumable: Consumable];
    'cancel-edit-consumable': [];
}>();
const {
    isAddingConsumable,
    isEditingConsumable,
    editingConsumable,
    defaultConsumableCategory,
    onCompleteCreateConsumable,
    onCompleteEditConsumable,
    onCancelEditConsumable,
} = useEditConsumable();
</script>
