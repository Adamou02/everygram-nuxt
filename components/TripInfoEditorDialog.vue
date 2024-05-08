<template>
    <PrimeDialog
        :visible="isOpen"
        :header="props.trip ? $t('ACTION_EDIT_TRIP') : $t('ACTION_CREATE_TRIP')"
        modal
        @update:visible="(value: boolean) => !value && $emit('cancel')"
    >
        <template v-if="isOpen" #default>
            <div class="field">
                <label for="trip-title">
                    {{ $t('LABEL_NAME') }}
                </label>
                <PrimeInputText
                    id="trip-title"
                    v-model="editingTrip.title"
                    class="w-full"
                    autofocus
                />
            </div>
            <div class="field">
                <label for="trip-date-calendar">
                    {{
                        editingTrip.dateMode === 'multi'
                            ? $t('LABEL_TRIP_DATES')
                            : $t('LABEL_TRIP_DATE')
                    }}
                </label>
                <PrimeSelectButton
                    v-model="editingTrip.dateMode"
                    severity="secondary"
                    :options="dateModeOptions"
                    optionLabel="label"
                    optionValue="value"
                    aria-labelledby="Date Mode"
                    class="mb-2 p-selectbutton--stretch"
                />
                <PrimeCalendar
                    v-if="editingTrip.dateMode === 'multi'"
                    id="trip-date-calendar"
                    v-model="multiDates"
                    dateFormat="yy-mm-dd"
                    selectionMode="range"
                    :manualInput="false"
                    class="w-full"
                />
                <PrimeCalendar
                    v-else
                    id="trip-date-calendar"
                    v-model="singleDate"
                    dateFormat="yy-mm-dd"
                    class="w-full"
                />
            </div>
            <!-- <div class="field">
                <label for="trip-description">
                    {{ $t('LABEL_DESCRIPTION') }}
                </label>
                <PrimeTextarea
                    id="trip-description"
                    v-model="editingTrip.description"
                    class="w-full"
                    rows="2"
                    autoResize
                />
            </div> -->
        </template>
        <template #footer>
            <PrimeButton
                :label="$t('ACTION_CANCEL')"
                text
                severity="secondary"
                :disabled="isSaving"
                @click="$emit('cancel')"
            />
            <PrimeButton
                :label="props.trip ? $t('ACTION_SAVE') : $t('ACTION_CREATE')"
                :loading="isSaving"
                @click="onSubmit()"
            />
        </template>
    </PrimeDialog>
</template>

<script setup lang="ts">
const props = defineProps<{
    isOpen: boolean;
    trip: Trip | null;
}>();

const emit = defineEmits<{
    'complete-create': [trip: Trip];
    'complete-edit': [trip: Trip];
    cancel: [];
}>();

const userTripsStore = useUserTripsStore();
const i18n = useI18n();
const dateModeOptions = ref<{ label: string; value: TripDateMode }[]>([
    { label: i18n.t('LABEL_ONE_DAY'), value: 'single' },
    { label: i18n.t('LABEL_MULTI_DAY'), value: 'multi' },
]);
const emptyTrip: EditingTrip = {
    title: '',
    description: '',
    dateMode: 'single',
    startDate: '',
    endDate: '',
};
const editingTrip = ref<EditingTrip>({});
const singleDate = ref<Date>(new Date());
const multiDates = ref<Date[]>([]);
const isSaving = ref<boolean>(false);

watchEffect(() => {
    if (props.isOpen) {
        editingTrip.value = props.trip
            ? { ...emptyTrip, ...props.trip }
            : { ...emptyTrip };
        singleDate.value = editingTrip.value.startDate
            ? new Date(editingTrip.value.startDate)
            : new Date();
        multiDates.value =
            editingTrip.value.startDate && editingTrip.value.endDate
                ? [
                      new Date(editingTrip.value.startDate),
                      new Date(editingTrip.value.endDate),
                  ]
                : [];
    }
});

const onSubmit = async () => {
    try {
        const tripData = {
            ...editingTrip.value,
            ...(editingTrip.value.dateMode === 'multi'
                ? {
                      startDate: dataUtils.formatDateToString(
                          multiDates.value[0],
                      ),
                      endDate: dataUtils.formatDateToString(
                          multiDates.value[1],
                      ),
                  }
                : {
                      startDate: dataUtils.formatDateToString(singleDate.value),
                      endDate: dataUtils.formatDateToString(singleDate.value),
                  }),
        };
        isSaving.value = true;
        if (props.trip) {
            await userTripsStore.updateTrip({
                id: props.trip.id,
                tripData,
            });
            emit('complete-edit', userTripsStore.getTripById(props.trip.id));
        } else {
            const tripId = await userTripsStore.createTrip(tripData);
            if (!tripId) {
                throw new Error('Failed to create trip');
            }
            emit('complete-create', userTripsStore.getTripById(tripId));
        }
    } catch (error) {
        console.error(error);
    } finally {
        isSaving.value = false;
    }
};
</script>
