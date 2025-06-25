const isOpenGearCardDialog = ref<boolean>(false);
const displayingGear = ref<Gear | null>(null);

export default function () {
    return {
        displayingGear,
        isOpenGearCardDialog,
        openGearCardDialog: (gear: Gear) => {
            displayingGear.value = gear;
            isOpenGearCardDialog.value = true;
        },
        closeGearCardDialog: () => {
            displayingGear.value = null;
            isOpenGearCardDialog.value = false;
        },
    };
}
