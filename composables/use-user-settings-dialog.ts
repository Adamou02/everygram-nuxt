// gloabl state for user settings dialog
const isOpenUserSettingsDialog = ref<boolean>(false);

export default function () {
    return {
        isOpenUserSettingsDialog,
        openUserSettingsDialog: () => {
            isOpenUserSettingsDialog.value = true;
        },
        closeUserSettingsDialog: () => {
            isOpenUserSettingsDialog.value = false;
        },
    };
}
