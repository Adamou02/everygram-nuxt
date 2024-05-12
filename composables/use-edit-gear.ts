// gloabl state for adding/editing gear
const isAddingGear = ref<boolean>(false);
const isEditingGear = ref<boolean>(false);
const editingGear = ref<Gear | null>(null);
const defaultGearCategory = ref<GearCategory | undefined>();

export default function () {
    return {
        isAddingGear,
        isEditingGear,
        editingGear,
        defaultGearCategory,
        onCreateGear: (props?: { category?: GearCategory }) => {
            defaultGearCategory.value = props?.category || undefined;
            isAddingGear.value = true;
        },
        onEditGear: (gear: Gear) => {
            editingGear.value = gear;
            isEditingGear.value = true;
        },
        onCompleteCreateGear: () => {
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
