<template>
    <div>
        <!-- use PrimeDataTable to display trips -->
        <PrimeDataTable
            :value="tripsWithMoreData"
            v-model:editingRows="editingRows"
            editMode="row"
            dataKey="id"
        >
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
            <PrimeColumn :exportable="false" class="w-8rem">
                <template #body="{ data }">
                    <TableRowActionButtons
                        :actions="[
                            {
                                icon: 'pi pi-pencil',
                                tooltip: $t('ACTION_EDIT'),
                                onClick: () =>
                                    (editingRows = [...editingRows, data]),
                            },
                            {
                                icon: 'pi pi-trash',
                                tooltip: $t('ACTION_DELETE'),
                                onClick: () => onDeleteTrip(data),
                            },
                        ]"
                    />
                </template>
                <template #editor="{ data }">
                    <TableRowActionButtons
                        :actions="[
                            {
                                icon: 'pi pi-check',
                                tooltip: $t('ACTION_SAVE'),
                                onClick: () => onSaveRowEdit(data),
                            },
                            {
                                icon: 'pi pi-times',
                                tooltip: $t('ACTION_CANCEL'),
                                onClick: () => onCancelRowEdit(data),
                            },
                        ]"
                    />
                </template>
            </PrimeColumn>
        </PrimeDataTable>
        <TripInfoEditorDialog
            :is-open="isAddingTrip || isEditingTrip"
            :trip="editingTrip"
            @complete-add="onCompleteAddTrip"
            @complete-edit="onCompleteEditTrip"
            @cancel="onCancelEditTrip"
        />
        <PrimeButton @click="onAddTrip">
            {{ $t('ACTION_ADD_TRIP') }}
        </PrimeButton>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth-guard'],
    layout: 'user-page',
});

const langUtils = useLangUtils();
const userTripsStore = useUserTripsStore();
const { trips } = storeToRefs(userTripsStore);
const userGearsStore = useUserGearsStore();
const { gearMap } = storeToRefs(userGearsStore);
const tripsWithMoreData = computed(() =>
    trips.value.map((trip) => {
        const weightTotal = _sum(
            _map(trip.gears, (tripGear, gearId) =>
                gearMap.value[gearId]
                    ? gearMap.value[gearId].weight * tripGear.quantity
                    : 0,
            ),
        );
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
    onAddTrip,
    onEditTrip,
    onCompleteAddTrip,
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

// for trips table
const editingRows = ref<Trip[]>([]);
const onSaveRowEdit = async (trip: Trip) => {
    try {
        await userTripsStore.updateTrip({
            id: trip.id,
            tripData: {
                title: trip.title,
            },
        });
        editingRows.value = [...editingRows.value].filter(
            (editingRow) => editingRow.id !== trip.id,
        );
    } catch (error) {
        console.error(error);
    }
};
const onCancelRowEdit = (trip: Trip) => {
    editingRows.value = [...editingRows.value].filter(
        (editingRow) => editingRow.id !== trip.id,
    );
};
</script>
