<template>
    <PrimeDialog
        :visible="isOpen"
        :header="
            editingTrip ? $t('ACTION_EDIT_TRIP') : $t('ACTION_CREATE_TRIP')
        "
        modal
        class="w-full mx-2 max-w-20rem"
        @update:visible="
            (value: boolean) => {
                if (!value) {
                    $emit('cancel');
                    onCancelEditTrip();
                }
            }
        "
    >
        <template v-if="isOpen" #default>
            <FormField
                :label="$t('LABEL_NAME')"
                :errors="vuelidate.title.$errors"
                required
            >
                <PrimeInputText
                    v-model="formState.title"
                    class="w-full"
                    :minlength="constants.LIMIT.minNameLength"
                    :maxlength="constants.LIMIT.maxNameLength"
                    :autofocus="!editingTrip"
                    :invalid="vuelidate.title.$error"
                    @keypress.enter="onSubmit"
                />
            </FormField>
            <FormField
                :label="
                    formState.dateMode === 'multi'
                        ? $t('LABEL_TRIP_DATES')
                        : $t('LABEL_TRIP_DATE')
                "
            >
                <PrimeSelectButton
                    v-model="formState.dateMode"
                    severity="secondary"
                    :options="dateModeOptions"
                    optionLabel="label"
                    optionValue="value"
                    aria-labelledby="Date Mode"
                    class="mb-2 p-selectbutton--stretch"
                />
                <PrimeInputGroup v-if="formState.dateMode === 'multi'">
                    <PrimeCalendar
                        v-model="formState.startDate"
                        dateFormat="yy-mm-dd"
                        placeholder="yyyy-mm-dd"
                        class="w-7rem"
                    />
                    <PrimeInputGroupAddon class="min-w-0 p-1"
                        >~</PrimeInputGroupAddon
                    >
                    <PrimeCalendar
                        v-model="formState.endDate"
                        dateFormat="yy-mm-dd"
                        placeholder="yyyy-mm-dd"
                        class="w-7rem"
                    />
                </PrimeInputGroup>
                <PrimeCalendar
                    v-else-if="formState.dateMode === 'single'"
                    v-model="formState.startDate"
                    dateFormat="yy-mm-dd"
                    placeholder="yyyy-mm-dd"
                    class="w-full"
                >
                </PrimeCalendar>
            </FormField>
        </template>
        <template #footer>
            <PrimeButton
                :label="$t('ACTION_CANCEL')"
                text
                severity="secondary"
                :disabled="isSaving"
                @click="
                    () => {
                        $emit('cancel');
                        onCancelEditTrip();
                    }
                "
            />
            <PrimeButton
                :label="editingTrip ? $t('ACTION_SAVE') : $t('ACTION_CREATE')"
                :loading="isSaving"
                @click="onSubmit()"
            />
        </template>
    </PrimeDialog>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core';

const {
    onCompleteCreateTrip,
    onCompleteEditTrip,
    onCancelEditTrip,
    isAddingTrip,
    isEditingTrip,
    editingTrip,
} = useEditTrip();

const isOpen = computed(() => isAddingTrip.value || isEditingTrip.value);

const emit = defineEmits<{
    'complete-create': [trip: Trip];
    'complete-edit': [trip: Trip];
    cancel: [];
}>();

const userTripsStore = useUserTripsStore();
const i18n = useI18n();
const dateModeOptions = ref<{ label: string; value: TripDateMode }[]>([
    { label: i18n.t('LABEL_ONE_DAY'), value: constants.TRIP_DATE_MODE.single },
    { label: i18n.t('LABEL_MULTI_DAY'), value: constants.TRIP_DATE_MODE.multi },
]);

// form state and validation rules
const initialFormState = {
    title: '',
    dateMode: undefined,
    startDate: undefined,
    endDate: undefined,
};
const formState = reactive<{
    title: string;
    dateMode: TripDateMode | undefined;
    startDate: Date | undefined;
    endDate: Date | undefined;
}>({ ...initialFormState });
const formValidators = useFormValidators();
const formRules = {
    title: {
        required: formValidators.required,
        minLength: formValidators.minLength(constants.LIMIT.minNameLength),
        maxLength: formValidators.maxLength(constants.LIMIT.maxNameLength),
    },
};
const vuelidate = useVuelidate(formRules, formState, { $autoDirty: true });

watch(isOpen, (newValue) => {
    if (newValue) {
        formState.title = editingTrip.value?.title || initialFormState.title;
        formState.dateMode =
            editingTrip.value?.dateMode || initialFormState.dateMode;
        formState.startDate =
            (editingTrip.value?.startDate &&
                new Date(editingTrip.value?.startDate)) ||
            initialFormState.startDate;
        formState.endDate =
            (editingTrip.value?.endDate &&
                new Date(editingTrip.value?.endDate)) ||
            initialFormState.endDate;
        vuelidate.value.$reset();
    }
});

const isSaving = ref<boolean>(false);
const onSubmit = async () => {
    const valid = await vuelidate.value.$validate();
    if (!valid) {
        return;
    }

    const tripData = {
        title: formState.title,
        ...(formState.dateMode && { dateMode: formState.dateMode }),
        ...(formState.dateMode === 'multi' &&
            formState.startDate &&
            formState.endDate &&
            formState.startDate.getTime() < formState.endDate.getTime() && {
                startDate: dataUtils.formatDateToString(formState.startDate),
                endDate: dataUtils.formatDateToString(formState.endDate),
            }),
        ...(formState.dateMode === 'single' &&
            formState.startDate && {
                startDate: dataUtils.formatDateToString(formState.startDate),
                endDate: dataUtils.formatDateToString(formState.startDate),
            }),
    };

    try {
        isSaving.value = true;
        if (editingTrip.value) {
            await userTripsStore.updateTrip({
                id: editingTrip.value.id,
                tripData,
            });
            emit(
                'complete-edit',
                userTripsStore.getTripById(editingTrip.value.id),
            );
            onCompleteEditTrip();
        } else {
            const tripId = await userTripsStore.createTrip(tripData);
            if (!tripId) {
                throw new Error('Failed to create trip');
            }
            emit('complete-create', userTripsStore.getTripById(tripId));
            onCompleteCreateTrip();
        }
    } catch (error) {
        console.error(error);
    } finally {
        isSaving.value = false;
    }
};
</script>
