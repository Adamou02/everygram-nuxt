export default function useEditGear() {
    const isAddingGear = ref<boolean>(false);
    const isEditingGear = ref<boolean>(false);
    const editingGear = ref<Gear | null>(null);

    return {
        isAddingGear,
        isEditingGear,
        editingGear,
        onAddGear: () => {
            isAddingGear.value = true;
        },
        onEditGear: (gear: Gear) => {
            editingGear.value = gear;
            isEditingGear.value = true;
        },
        onCompleteAddGear: () => {
            isAddingGear.value = false;
        },
        onCompleteEditGear: () => {
            isEditingGear.value = false;
            editingGear.value = null;
        },
        onCancelEditGear: () => {
            isAddingGear.value = false;
            isEditingGear.value = false;
            editingGear.value = null;
        },
    };
}
