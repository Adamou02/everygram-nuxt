<template>
    <div class="flex flex-column gap-5">
        <div class="flex justify-content-between align-items-center">
            <div class="text-color-secondary">
                {{ $t('INFO_TRIP_NUM', { num: trips.length }, trips.length) }}
            </div>
            <div>
                <ActionButtonsGroup
                    type="text"
                    :actions="[
                        {
                            label: $t('ACTION_CREATE_TRIP'),
                            onClick: () => onCreateTrip(),
                        },
                    ]"
                />
            </div>
        </div>
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
                :header="$t('LABEL_WEIGHT_TOTAL')"
                class="w-10rem"
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
                                    onDeleteTrip(data);
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
        @complete-add="onCompleteCreateTrip"
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
const { getTripWeightTotal } = useDataUtils();
const userTripsStore = useUserTripsStore();
const { trips } = storeToRefs(userTripsStore);
const tripsWithMoreData = computed(() =>
    trips.value.map((trip) => {
        const weightTotal = getTripWeightTotal(trip);
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
</script>
