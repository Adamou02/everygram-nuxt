// gloabl state
const isEditingQuantity = ref<boolean>(false);
const editingGearWithQuantity = ref<GearWithQuantity | null>(null);
const quantity = ref<number>(0);

export default function () {
    return {
        isEditingQuantity,
        editingGearWithQuantity,
        quantity,
        onEditQuantity: (gear: GearWithQuantity) => {
            editingGearWithQuantity.value = gear;
            quantity.value = gear.quantity;
            isEditingQuantity.value = true;
        },
        onCompleteEditQuantity: () => {
            isEditingQuantity.value = false;
        },
        onCancelEditQuantity: () => {
            isEditingQuantity.value = false;
        },
    };
}
