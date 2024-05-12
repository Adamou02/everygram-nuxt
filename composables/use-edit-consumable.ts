const isAddingConsumable = ref<boolean>(false);
const isEditingConsumable = ref<boolean>(false);
const editingConsumableIndex = ref<number | null>(null);
const defaultConsumableCategory = ref<ConsumableCategory | undefined>();

export default function () {
    return {
        isAddingConsumable,
        isEditingConsumable,
        editingConsumableIndex,
        defaultConsumableCategory,
        onCreateConsumable: (props?: { category?: ConsumableCategory }) => {
            defaultConsumableCategory.value = props?.category || undefined;
            isAddingConsumable.value = true;
        },
        onEditConsumable: (consuableIndex: number) => {
            editingConsumableIndex.value = consuableIndex;
            isEditingConsumable.value = true;
        },
        onCompleteCreateConsumable: () => {
            isAddingConsumable.value = false;
        },
        onCompleteEditConsumable: () => {
            isEditingConsumable.value = false;
            editingConsumableIndex.value = null;
        },
        onCancelEditConsumable: () => {
            isAddingConsumable.value = false;
            isEditingConsumable.value = false;
            editingConsumableIndex.value = null;
        },
    };
}
