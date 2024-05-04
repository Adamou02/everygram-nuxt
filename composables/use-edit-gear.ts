export default function useEditGear() {
    const isAddingGear = ref<boolean>(false);
    const isEditingGear = ref<boolean>(false);
    const editingGear = ref<Gear | null>(null);
    const defaultGearCategory = ref<GearCategory | undefined>();

    return {
        isAddingGear,
        isEditingGear,
        editingGear,
        defaultGearCategory,
        onAddGear: (props?: { category?: GearCategory }) => {
            defaultGearCategory.value = props?.category || undefined;
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
