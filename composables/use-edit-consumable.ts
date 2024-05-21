const isAddingConsumable = ref<boolean>(false);
const isEditingConsumable = ref<boolean>(false);
const editingConsumable = ref<Consumable | null>(null);
const defaultConsumableCategory = ref<ConsumableCategory | undefined>();

export default function () {
    return {
        isAddingConsumable,
        isEditingConsumable,
        editingConsumable,
        defaultConsumableCategory,
        onCreateConsumable: (props?: { category?: ConsumableCategory }) => {
            defaultConsumableCategory.value = props?.category || undefined;
            isAddingConsumable.value = true;
        },
        onEditConsumable: (consumable: Consumable) => {
            editingConsumable.value = consumable;
            isEditingConsumable.value = true;
        },
        onCompleteCreateConsumable: () => {
            isAddingConsumable.value = false;
        },
        onCompleteEditConsumable: () => {
            isEditingConsumable.value = false;
            editingConsumable.value = null;
        },
        onCancelEditConsumable: () => {
            isAddingConsumable.value = false;
            isEditingConsumable.value = false;
            editingConsumable.value = null;
        },
    };
}
