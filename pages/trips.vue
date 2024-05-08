<template>
    <div class="flex flex-column gap-5">
        <SectionTitleBar>
            <div class="text-600">
                {{ $t('INFO_TRIP_NUM', { num: trips.length }, trips.length) }}
            </div>
            <PrimeButton
                :label="$t('ACTION_CREATE_TRIP')"
                icon="pi pi-plus"
                @click="onCreateTrip"
            />
        </SectionTitleBar>
        <PrimeDataTable :value="tripsWithMoreData" dataKey="id">
            <PrimeColumn field="title" :header="$t('LABEL_TITLE')">
                <template #body="{ data }">
                    <NuxtLink
                        :to="`/trip/${data.id}`"
                        class="text-color no-underline hover:underline"
                    >
                        {{ data.title }}
                    </NuxtLink>
                </template>
                <template #editor="{ data, field }">
                    <PrimeInputText v-model="data[field]" />
                </template>
            </PrimeColumn>
            <PrimeColumn
                field="weightTotal"
                :header="$t('LABEL_TOTAL_WEIGHT')"
                class="w-10rem text-right"
            />
            <PrimeColumn :exportable="false" class="w-3rem">
                <template #body="{ data }">
                    <MoreActionsMenuButton
                        :items="[
                            {
                                icon: 'pi pi-pencil',
                                label: $t('ACTION_EDIT'),
                                command: () => {
                                    onEditTrip(data);
                                },
                            },
                            {
                                icon: 'pi pi-trash',
                                label: $t('ACTION_DELETE'),
                                command: () => {
                                    confirmDeleteTrip(data);
                                },
                            },
                        ]"
                    />
                </template>
            </PrimeColumn>
        </PrimeDataTable>
    </div>
    <TripInfoEditorDialog
        :is-open="isAddingTrip || isEditingTrip"
        :trip="editingTrip"
        @complete-create="onCompleteCreateTrip"
        @complete-edit="onCompleteEditTrip"
        @cancel="onCancelEditTrip"
    />
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth-guard'],
    layout: 'user-page',
});

const langUtils = useLangUtils();
const i18n = useI18n();
const { confirmDeleteDialog } = useUiUitls();
const userTripsStore = useUserTripsStore();
const { trips } = storeToRefs(userTripsStore);
const userGearsStore = useUserGearsStore();
const { gearMap } = storeToRefs(userGearsStore);
const tripsWithMoreData = computed(() =>
    trips.value.map((trip) => {
        const weightTotal = dataUtils.getTripWeightTotal(trip, gearMap.value);
        return {
            ...trip,
            weightTotal: langUtils.formatWeight(weightTotal),
        };
    }),
);
const {
    isAddingTrip,
    isEditingTrip,
    editingTrip,
    onCreateTrip,
    onEditTrip,
    onCompleteCreateTrip,
    onCompleteEditTrip,
    onCancelEditTrip,
} = useEditTrip();

const onDeleteTrip = async (trip: Trip) => {
    try {
        await userTripsStore.deleteTrip(trip.id);
    } catch (error) {
        console.error(error);
    }
};

const confirmDeleteTrip = (trip: Trip) => {
    confirmDeleteDialog({
        message: i18n.t('MESSAGE_CONFIRM_DELETE_TRIP', {
            tripName: trip.title,
        }),
        header: i18n.t('ACTION_DELETE_TRIP'),
        toastSummary: i18n.t('FEEDBACK_TRIP_DELETED'),
        onAccept: async () => {
            await onDeleteTrip(trip);
        },
    });
};
</script>
