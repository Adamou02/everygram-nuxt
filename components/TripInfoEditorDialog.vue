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
                <label for="trip-description">
                    {{ $t('LABEL_DESCRIPTION') }}
                </label>
                <PrimeInputText
                    id="trip-description"
                    v-model="editingTrip.description"
                    class="w-full"
                />
            </div>
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
    'complete-add': [trip: Trip];
    'complete-edit': [trip: Trip];
    cancel: [];
}>();

const emptyTrip: EditingTrip = {
    title: '',
    description: '',
};
const editingTrip = ref<EditingTrip>({});
watchEffect(() => {
    if (props.isOpen) {
        editingTrip.value = props.trip ? { ...props.trip } : { ...emptyTrip };
    }
});
const isSaving = ref<boolean>(false);
const userTripsStore = useUserTripsStore();

const onSubmit = async () => {
    try {
        isSaving.value = true;
        if (props.trip) {
            await userTripsStore.updateTrip({
                id: props.trip.id,
                tripData: editingTrip.value,
            });
            emit('complete-edit', userTripsStore.getTripById(props.trip.id));
        } else {
            const tripId = await userTripsStore.createTrip(editingTrip.value);
            if (!tripId) {
                throw new Error('Failed to create trip');
            }
            emit('complete-add', userTripsStore.getTripById(tripId));
        }
    } catch (error) {
        console.error(error);
    } finally {
        isSaving.value = false;
    }
};
</script>
