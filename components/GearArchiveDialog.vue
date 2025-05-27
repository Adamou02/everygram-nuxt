<template>
    <PrimeDialog
        :visible="isOpen"
        :header="$t('ACTION_ARCHIVE_GEAR')"
        modal
        class="w-full mx-2 max-w-20rem"
        @update:visible="onCancel"
    >
        <template v-if="isOpen && archivingGear" #default>
            <GearLabel :gear="archivingGear" class="mt-1 mb-4" />
            <!-- Archive reason selection -->
            <FormField :label="$t('LABEL_ARCHIVE_REASON')">
                <PrimeDropdown
                    v-model="formState.archiveReason"
                    :options="reasonOptions"
                    optionValue="value"
                    optionLabel="label"
                    class="w-full"
                />
            </FormField>
            <!-- Custom note input -->
            <FormField :label="$t('LABEL_ARCHIVE_NOTE')">
                <PrimeInputText
                    v-model="formState.customNote"
                    class="w-full"
                    :maxlength="constants.LIMIT.maxGearArchiveNoteLength"
                />
            </FormField>
            <HintInfo :description="$t('INFO_ARCHIVE_GEAR_HINT')" size="xs" />
        </template>
        <template #footer>
            <PrimeButton
                :label="$t('ACTION_CANCEL')"
                text
                rounded
                severity="secondary"
                :disabled="isSaving"
                @click="onCancel"
            />
            <PrimeButton
                :label="$t('ACTION_ARCHIVE')"
                rounded
                :loading="isSaving"
                @click="onArchive"
            />
        </template>
    </PrimeDialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import useArchiveGear from '~/composables/use-archive-gear';
import useVuelidate from '@vuelidate/core';

const emit = defineEmits<{
    'complete-archive': [gear: Gear];
    cancel: [];
}>();

const {
    isArchivingGear,
    archivingGear,
    onCancelArchiveGear,
    onCompleteArchiveGear,
} = useArchiveGear();

const userGearsStore = useUserGearsStore();
const isSaving = ref(false);
const i18n = useI18n();

const initialFormState = {
    archiveReason: constants.GEAR_ARCHIVE_REASONS.UNUSED,
    customNote: '',
};
const formState = reactive<{
    archiveReason: GearArchiveReason;
    customNote: string;
}>({ ...initialFormState });

const formValidators = useFormValidators();
const formRules = {
    archiveReason: {
        required: formValidators.required,
    },
    customNote: {
        maxLength: formValidators.maxLength(
            constants.LIMIT.maxGearArchiveNoteLength,
        ),
    },
};
const vuelidate = useVuelidate(formRules, formState, { $autoDirty: true });

const reasonOptions: { value: GearArchiveReason; label: string }[] = [
    { value: 'unused', label: i18n.t('LABEL_ARCHIVE_REASON_UNUSED') },
    { value: 'lost', label: i18n.t('LABEL_ARCHIVE_REASON_LOST') },
    { value: 'broken', label: i18n.t('LABEL_ARCHIVE_REASON_BROKEN') },
    { value: 'sold', label: i18n.t('LABEL_ARCHIVE_REASON_SOLD') },
    { value: 'given', label: i18n.t('LABEL_ARCHIVE_REASON_GIVEN') },
    { value: 'trashed', label: i18n.t('LABEL_ARCHIVE_REASON_TRASHED') },
    { value: 'other', label: i18n.t('LABEL_ARCHIVE_REASON_OTHER') },
];

const isOpen = computed(() => isArchivingGear.value && !!archivingGear.value);

watch(
    () => isOpen.value,
    (val) => {
        if (val && archivingGear.value) {
            formState.archiveReason =
                archivingGear.value.archiveReason ||
                initialFormState.archiveReason;
            formState.customNote =
                archivingGear.value.archiveNote || initialFormState.customNote;
            vuelidate.value.$reset();
        } else {
            Object.assign(formState, initialFormState);
        }
    },
);

const onCancel = () => {
    emit('cancel');
    onCancelArchiveGear();
};

const onArchive = async () => {
    if (!archivingGear.value) return;
    if (!(await vuelidate.value.$validate())) return;

    isSaving.value = true;

    try {
        const updateData: EditingGear = {
            isArchived: true,
            archiveReason: formState.archiveReason,
            // Only include custom note if 'other' is selected
            ...(formState.customNote
                ? { archiveNote: formState.customNote }
                : {}),
        };

        await userGearsStore.updateGear({
            id: archivingGear.value.id,
            gearData: updateData,
        });

        emit(
            'complete-archive',
            userGearsStore.getGearById(archivingGear.value.id),
        );
        onCompleteArchiveGear();
    } catch (e) {
        // handle error (optional)
    } finally {
        isSaving.value = false;
    }
};
</script>
