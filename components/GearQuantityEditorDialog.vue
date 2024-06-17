<template>
    <PrimeDialog
        modal
        :visible="isOpen"
        :header="$t('ACTION_EDIT_QUANTITY')"
        @update:visible="(value: boolean) => !value && onCancel()"
    >
        <template v-if="isOpen" #default>
            <FormField :label="$t('LABEL_QUANTITY')" required>
                <PrimeInputNumber
                    v-model="quantity"
                    :min="constants.LIMIT.minQuantity"
                    :max="constants.LIMIT.maxQuantity"
                    class="text-right flex w-min"
                    @keypress.enter="onSubmit"
                    showButtons
                    buttonLayout="horizontal"
                    :step="1"
                    autofocus
                >
                    <template #incrementbuttonicon>
                        <span class="pi pi-plus" />
                    </template>
                    <template #decrementbuttonicon>
                        <span class="pi pi-minus" />
                    </template>
                </PrimeInputNumber>
            </FormField>
        </template>
        <template #footer>
            <PrimeButton
                :label="$t('ACTION_CANCEL')"
                text
                rounded
                severity="secondary"
                @click="onCancel"
            />
            <PrimeButton :label="$t('ACTION_SAVE')" rounded @click="onSubmit" />
        </template>
    </PrimeDialog>
</template>

<script setup lang="ts">
const {
    isEditingQuantity,
    quantity,
    onCompleteEditQuantity,
    onCancelEditQuantity,
} = useEditQuantity();
const isOpen = computed(() => !!isEditingQuantity.value);
const emit = defineEmits<{
    'complete-edit': [quantity: number];
    cancel: [];
}>();
const onSubmit = () => {
    emit('complete-edit', quantity.value);
    onCompleteEditQuantity();
};
const onCancel = () => {
    emit('cancel');
    onCancelEditQuantity();
};
</script>
