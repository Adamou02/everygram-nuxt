export const useDeleteGear = () => {
    const i18n = useI18n();
    const userGearsStore = useUserGearsStore();
    const { confirmDeleteDialog } = useUiUitls();
    const { errorToast } = useErrorToast();

    const onDeleteGear = async (gear: Gear) => {
        try {
            await userGearsStore.deleteGear(gear.id);
        } catch (error) {
            errorToast('Failed to delete gear', error);
        }
    };

    const confirmDeleteGear = (gear: Gear) => {
        confirmDeleteDialog({
            message: i18n.t('MESSAGE_CONFIRM_DELETE_GEAR', {
                gearName: gear.name,
            }),
            header: i18n.t('ACTION_DELETE_GEAR'),
            toastSummary: i18n.t('FEEDBACK_GEAR_DELETED'),
            onAccept: async () => {
                await onDeleteGear(gear);
            },
        });
    };

    return {
        confirmDeleteGear,
    };
};
