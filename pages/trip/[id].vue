<!-- A page to show data of a trip -->
<template>
    <SubPageAppHeader v-if="trip">
        <template #mobile-actions>
            <div class="flex">
                <TripShareButton text :trip="trip" />
                <MoreActionsMenuButton text :items="moreActionsMenuItems" />
            </div>
        </template>
    </SubPageAppHeader>
    <TripPageLayout v-if="trip">
        <template #header>
            <TripHeader :trip="trip">
                <template #actions>
                    <div class="flex gap-3">
                        <div
                            v-if="trip.isPublished"
                            class="flex align-items-center gap-1 text-600"
                        >
                            <i class="material-symbols-outlined">language</i>
                            <div>
                                {{ $t('INFO_TRIP_HAS_BEEN_PUBLISHED') }}
                            </div>
                        </div>
                        <div class="flex gap-2 hide-in-mobile">
                            <TripShareButton :trip="trip" />
                            <MoreActionsMenuButton
                                outlined
                                :items="moreActionsMenuItems"
                            />
                        </div>
                    </div>
                </template>
            </TripHeader>
        </template>
        <template #side>
            <TripWeightInfo
                :gears="gearsInTrip"
                :wornGears="wornGearsInTrip"
                :consumables="consumablesInTrip"
            />
        </template>
        <template #main>
            <!-- base gears -->
            <TripGearSection :title="$t('LABEL_BASE')" :gears="gearsInTrip">
                <template #header-actions>
                    <ActionButtonsGroup
                        type="text"
                        :actions="[
                            {
                                icon: 'pi pi-plus',
                                label: $t('ACTION_ADD_FROM_GEARS'),
                                onClick: () => {
                                    selectingGearType = 'gears';
                                    isSelectingGears = true;
                                },
                            },
                            {
                                icon: 'pi pi-plus',
                                label: $t('ACTION_CREATE'),
                                onClick: () => {
                                    creatingGearType = 'gears';
                                    onCreateGear();
                                },
                            },
                        ]"
                        class="hide-in-mobile"
                    />
                    <MoreActionsMenuButton
                        text
                        rounded
                        icon="pi-plus"
                        :items="[
                            {
                                icon: 'pi pi-plus',
                                label: $t('ACTION_ADD_FROM_GEARS'),
                                command: () => {
                                    selectingGearType = 'gears';
                                    isSelectingGears = true;
                                },
                            },
                            {
                                icon: 'pi pi-plus',
                                label: $t('ACTION_CREATE_GEAR'),
                                command: () => {
                                    creatingGearType = 'gears';
                                    onCreateGear();
                                },
                            },
                        ]"
                        class="lg:hidden"
                    />
                </template>
                <template #category-actions="{ category }">
                    <ActionButtonsGroup
                        type="icon"
                        class="hide-in-mobile"
                        :actions="[
                            {
                                icon: 'pi pi-plus',
                                label: $t('ACTION_CREATE_GEAR'),
                                onClick: () => {
                                    creatingGearType = 'gears';
                                    onCreateGear({ category });
                                },
                            },
                        ]"
                    />
                </template>
                <template #category-body="{ gears }">
                    <GearDataTable
                        :gears="gears"
                        :hasQuantity="true"
                        :actions="['edit', 'remove']"
                        @gear-edit="onEditGear"
                        @gear-remove="
                            (gear: Gear) => onRemoveGear(gear, 'gears')
                        "
                        @gear-cell-edit-complete="
                            (e: any) =>
                                onGearCellEditComplete({
                                    ...e,
                                    type: 'gears',
                                })
                        "
                        class="lg:ml-6"
                    />
                </template>
            </TripGearSection>

            <!-- comsumables -->
            <TripConsumableSection
                :title="$t('LABEL_CONSUMABLES')"
                :consumables="consumablesInTrip"
            >
                <template #header-actions>
                    <ActionButtonsGroup
                        type="text"
                        :actions="[
                            {
                                icon: 'pi pi-plus',
                                label: $t('ACTION_CREATE'),
                                onClick: () => onCreateConsumable(),
                            },
                        ]"
                        class="hide-in-mobile"
                    />
                    <ActionButtonsGroup
                        type="icon"
                        :actions="[
                            {
                                icon: 'pi pi-plus',
                                label: $t('ACTION_CREATE'),
                                onClick: () => onCreateConsumable(),
                            },
                        ]"
                        class="lg:hidden"
                    />
                </template>
                <template #category-actions="{ category }">
                    <ActionButtonsGroup
                        type="icon"
                        class="hide-in-mobile"
                        :actions="[
                            {
                                icon: 'pi pi-plus',
                                label: $t('ACTION_CREATE_CONSUMABLE'),
                                onClick: () =>
                                    onCreateConsumable({
                                        category,
                                    }),
                            },
                        ]"
                    />
                </template>
                <template #category-body="{ consumables }">
                    <ConsumableDataTable
                        :consumables="consumables"
                        @consumable-edit="onEditConsumable"
                        @consumable-delete="confirmDeleteConsumable"
                        @consumable-cell-edit-complete="
                            onConsumableCellEditComplete
                        "
                        class="lg:ml-6"
                    />
                </template>
            </TripConsumableSection>

            <!-- worn gears -->
            <TripGearSection :title="$t('LABEL_WORN')" :gears="wornGearsInTrip">
                <template #header-actions>
                    <ActionButtonsGroup
                        type="text"
                        :actions="[
                            {
                                icon: 'pi pi-plus',
                                label: $t('ACTION_ADD_FROM_GEARS'),
                                onClick: () => {
                                    selectingGearType = 'wornGears';
                                    isSelectingGears = true;
                                },
                            },
                            {
                                icon: 'pi pi-plus',
                                label: $t('ACTION_CREATE'),
                                onClick: () => {
                                    creatingGearType = 'wornGears';
                                    onCreateGear({
                                        categories:
                                            constants.WEARABLE_GEAR_CATEGORIES,
                                    });
                                },
                            },
                        ]"
                        class="hide-in-mobile"
                    />
                    <MoreActionsMenuButton
                        text
                        rounded
                        icon="pi-plus"
                        :items="[
                            {
                                icon: 'pi pi-plus',
                                label: $t('ACTION_ADD_FROM_GEARS'),
                                command: () => {
                                    selectingGearType = 'wornGears';
                                    isSelectingGears = true;
                                },
                            },
                            {
                                icon: 'pi pi-plus',
                                label: $t('ACTION_CREATE_GEAR'),
                                command: () => {
                                    creatingGearType = 'wornGears';
                                    onCreateGear({
                                        categories:
                                            constants.WEARABLE_GEAR_CATEGORIES,
                                    });
                                },
                            },
                        ]"
                        class="lg:hidden"
                    />
                </template>
                <template #category-actions="{ category }">
                    <ActionButtonsGroup
                        type="icon"
                        class="hide-in-mobile"
                        :actions="[
                            {
                                icon: 'pi pi-plus',
                                label: $t('ACTION_CREATE_GEAR'),
                                onClick: () => {
                                    creatingGearType = 'wornGears';
                                    onCreateGear({
                                        category,
                                        categories:
                                            constants.WEARABLE_GEAR_CATEGORIES,
                                    });
                                },
                            },
                        ]"
                    />
                </template>
                <template #category-body="{ gears }">
                    <GearDataTable
                        :gears="gears"
                        :hasQuantity="true"
                        :actions="['edit', 'remove']"
                        @gear-edit="onEditGear"
                        @gear-remove="
                            (gear: Gear) => onRemoveGear(gear, 'wornGears')
                        "
                        @gear-cell-edit-complete="
                            (e: any) =>
                                onGearCellEditComplete({
                                    ...e,
                                    type: 'wornGears',
                                })
                        "
                        class="lg:ml-6"
                    />
                </template>
            </TripGearSection>
        </template>
    </TripPageLayout>
    <PageLoading v-else-if="isFetchingTrips" />
    <EmptyState
        :title="$t('INFO_TRIP_NOT_FOUND')"
        :description="$t('INFO_TRIP_NOT_FOUND_DESC')"
        image-src="/image/illustration/illu-camping.svg"
        v-else
    >
        <template #actions>
            <PrimeButton
                :label="$t('ACTION_BACK_TO_TRIPS')"
                @click="$router.push('/trips')"
            />
        </template>
    </EmptyState>
    <GearsSelectorDialog
        :is-open="isSelectingGears"
        :selected-gear-ids="
            selectingGearType === 'gears'
                ? selectedGearIds
                : selectedWornGearIds
        "
        :categories="
            selectingGearType === 'wornGears'
                ? constants.WEARABLE_GEAR_CATEGORIES
                : undefined
        "
        @complete="onCompletSelectGears"
        @cancel="isSelectingGears = false"
    />
    <GearEditorDialog @complete-create="onCompleteCreateGearInTrip" />
    <TripInfoEditorDialog />
    <ConsumableEditor :tripId="tripId" />
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth-guard'],
    layout: 'sub-page',
});
const userTripsStore = useUserTripsStore();
const { trips, isFetchingTrips } = storeToRefs(userTripsStore);
const userGearsStore = useUserGearsStore();
const { gearMap } = storeToRefs(userGearsStore);
const i18n = useI18n();

const route = useRoute();
const tripId = route.params.id as string;
const trip = computed(() =>
    trips.value.find((trip: Trip) => trip.id === tripId),
);

//  gears
const gearsInTrip = computed<GearWithQuantity[]>(() =>
    trip.value
        ? _map(dataUtils.getGearsInTrip(trip.value, gearMap.value), (gear) => ({
              ...gear,
              quantity: trip.value?.gears[gear.id]?.quantity || 0,
          }))
        : [],
);

// worn gears
const wornGearsInTrip = computed<GearWithQuantity[]>(() =>
    trip.value
        ? _map(
              dataUtils.getWornGearsInTrip(trip.value, gearMap.value),
              (gear) => ({
                  ...gear,
                  quantity: trip.value?.wornGears[gear.id]?.quantity || 0,
              }),
          )
        : [],
);

// consumables
const consumablesInTrip = computed<ConsumableWithIndex[]>(() =>
    trip.value
        ? _map(trip.value.consumables || [], (consumable, index) => ({
              ...consumable,
              index,
          }))
        : [],
);

// for gear selector
const isSelectingGears = ref<boolean>(false);
const selectingGearType = ref<TripGearType>('gears');
const selectedGearIds = computed(() =>
    trip.value ? Object.keys(trip.value.gears) : [],
);
const selectedWornGearIds = computed(() =>
    trip.value ? Object.keys(trip.value.wornGears) : [],
);
const onCompletSelectGears = (selectedGears: TripGear[]) => {
    userTripsStore.setGearsToTrip(
        tripId,
        selectedGears,
        selectingGearType.value,
    );
    isSelectingGears.value = false;
};

// for GearEditor
const { onCreateGear, onEditGear } = useEditGear();
const creatingGearType = ref<TripGearType>('gears');
const onCompleteCreateGearInTrip = (gear: Gear) => {
    userTripsStore.setGearsToTrip(
        tripId,
        [{ id: gear.id, quantity: 1 }],
        creatingGearType.value,
    );
};

const onRemoveGear = (gear: Gear, type: TripGearType) => {
    userTripsStore.removeGearsFromTrip(tripId, [gear.id], type);
};

// for TripInfoEditor
const { onEditTrip } = useEditTrip();

// for edit gear in table
const onGearCellEditComplete = async ({
    data,
    newValue,
    field,
    type,
}: {
    data: Gear;
    newValue: any;
    field: string;
    type: TripGearType;
}) => {
    switch (field) {
        case 'quantity':
            await userTripsStore.setGearsToTrip(
                tripId,
                [{ id: data.id, quantity: newValue }],
                type,
            );
            break;
        case 'name':
            await userGearsStore.updateGear({
                id: data.id,
                gearData: {
                    name: newValue,
                },
            });
            break;
        case 'weight':
            await userGearsStore.updateGear({
                id: data.id,
                gearData: {
                    weight: newValue,
                },
            });
            break;
    }
};

// for edit consumable cell
const onConsumableCellEditComplete = async (e: {
    data: ConsumableWithIndex;
    newValue: any;
    field: string;
}) => {
    const { data, newValue, field } = e;
    switch (field) {
        case 'name':
        case 'weight':
            await userTripsStore.updateConsumableInTrip({
                tripId,
                consumableIndex: data.index,
                consumable: {
                    ...consumablesInTrip.value[data.index],
                    [field]: newValue,
                },
            });
            break;
    }
};

// consumables
const { onCreateConsumable, onEditConsumable } = useEditConsumable();

const onDeleteConsumable = async (consumableIndex: number) => {
    await userTripsStore.deleteConsumableFromTrip({
        tripId,
        consumableIndex,
    });
};

const { confirmDeleteDialog } = useUiUitls();
const confirmDeleteConsumable = (consumableIndex: number) => {
    confirmDeleteDialog({
        message: i18n.t('MESSAGE_CONFIRM_DELETE_CONSUMABLE', {
            consumableName: consumablesInTrip.value[consumableIndex].name,
        }),
        header: i18n.t('ACTION_DELETE_CONSUMABLE'),
        toastSummary: i18n.t('FEEDBACK_CONSUMABLE_DELETED'),
        onAccept: async () => {
            await onDeleteConsumable(consumableIndex);
        },
    });
};

const { confirmDeleteTrip } = useDeleteTrip();

const moreActionsMenuItems = [
    {
        icon: 'pi pi-pencil',
        label: i18n.t('ACTION_EDIT_TRIP'),
        command: () => trip.value && onEditTrip(trip.value),
    },
    {
        icon: 'pi pi-trash',
        label: i18n.t('ACTION_DELETE_TRIP'),
        severity: 'danger',
        command: () => trip.value && confirmDeleteTrip(trip.value),
    },
];
</script>
