export default function useEditGear() {
    const userGearsStore = useUserGearsStore();
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
        onDeleteGear: async (gear: Gear) => {
            // TODO: check if the gear has been used in any trips
            try {
                await userGearsStore.deleteGear(gear.id);
            } catch (error) {
                console.error(error);
            }
        },
        onArchiveGear: async (gear: Gear) => {
            // TODO
            console.log('archive gear', gear);
        },
        onCompleteEditGear: () => {
            isAddingGear.value = false;
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
