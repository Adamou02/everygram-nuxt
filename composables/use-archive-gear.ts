// global state for archiving gear
const isArchivingGear = ref<boolean>(false);
const archivingGear = ref<Gear | null>(null);

export default function () {
    return {
        isArchivingGear,
        archivingGear,
        onArchiveGear: (gear: Gear) => {
            archivingGear.value = gear;
            isArchivingGear.value = true;
        },
        onCompleteArchiveGear: () => {
            isArchivingGear.value = false;
            archivingGear.value = null;
        },
        onCancelArchiveGear: () => {
            isArchivingGear.value = false;
            archivingGear.value = null;
        },
    };
}
