<template>
    <PrimeDialog
        :visible="isOpen"
        :header="props.trip ? $t('ACTION_EDIT_TRIP') : $t('ACTION_CREATE_TRIP')"
        modal
        @update:visible="(value: boolean) => !value && $emit('cancel')"
    >
        <div class="field">
            <label for="trip-title">
                {{ $t('LABEL_NAME') }}
            </label>
            <PrimeInputText
                id="trip-title"
                v-model="editingTrip.title"
                class="w-full"
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
        <template #footer>
            <div class="flex justify-content-end">
                <PrimeButton
                    text
                    severity="secondary"
                    :disabled="isSaving"
                    @click="$emit('cancel')"
                >
                    {{ $t('ACTION_CANCEL') }}
                </PrimeButton>
                <PrimeButton :loading="isSaving" @click="onSubmit()">
                    {{ props.trip ? $t('ACTION_SAVE') : $t('ACTION_CREATE') }}
                </PrimeButton>
            </div>
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
const isEditing = !!props.trip;
const editingTrip = ref<EditingTrip>({});
watch(
    () => props.trip,
    (trip) => {
        if (trip) {
            editingTrip.value = { ...trip };
        } else {
            editingTrip.value = { ...emptyTrip };
        }
    },
);
const isSaving = ref<boolean>(false);
const userTripsStore = useUserTripsStore();

const onSubmit = async () => {
    try {
        isSaving.value = true;
        if (isEditing) {
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
        isSaving.value = false;
    }
};
</script>
