<!-- A page to show data of a trip -->
<template>
    <div class="flex flex-column">
        <template v-if="trip">
            <div>
                <img
                    src="/image/illustration/illu-mountains.jpg"
                    alt=""
                    class="w-full border-round-md"
                />
                <div class="flex flex-column py-6">
                    <div
                        class="flex justify-content-between align-items-center"
                    >
                        <h1>{{ trip.title }}</h1>
                        <MoreActionsMenuButton
                            outlined
                            :items="[
                                {
                                    icon: 'pi pi-pencil',
                                    label: $t('ACTION_EDIT_TRIP'),
                                    command: () => trip && onEditTrip(trip),
                                },
                                {
                                    icon: 'pi pi-trash',
                                    label: $t('ACTION_DELETE_TRIP'),
                                    severity: 'danger',
                                    command: () =>
                                        trip && confirmDeleteTrip(trip),
                                },
                            ]"
                        />
                    </div>

                    <!-- trip date -->
                    <div
                        v-if="
                            trip.dateMode === 'multi' &&
                            trip.startDate &&
                            trip.endDate
                        "
                        class="py-3"
                    >
                        {{ dataUtils.formatDateString(trip.startDate, '/') }} ~
                        {{ dataUtils.formatDateString(trip.endDate, '/') }}
                    </div>
                    <div
                        v-else-if="trip.dateMode === 'single' && trip.startDate"
                        class="py-3"
                    >
                        {{ dataUtils.formatDateString(trip.startDate, '/') }}
                    </div>
                </div>
            </div>
            <div class="grid row-gap-5 lg:flex-row-reverse">
                <!-- right -->
                <div class="col-12 lg:block lg:col-4">
                    <!-- weigh bars -->
                    <div class="flex flex-column gap-4">
                        <div
                            class="flex flex-column gap-3 p-3 border-round-md bg-white"
                        >
                            <div class="text-lg">
                                {{ $t('LABEL_TOTAL_WEIGHT') }}:
                                {{
                                    formatWeight(
                                        dataUtils.getTripWeightTotal(
                                            trip,
                                            gearMap,
                                        ),
                                    )
                                }}
                            </div>
                            <WeightBarChart
                                :items="totalWeightItems"
                                :showLabel="true"
                            />
                        </div>
                        <div
                            class="flex flex-column gap-3 p-3 border-round-md bg-white"
                        >
                            <div class="text-lg">
                                {{ $t('LABEL_BASE_WEIGHT') }}:
                                {{
                                    formatWeight(
                                        dataUtils.getTripGearsWeight(
                                            trip,
                                            gearMap,
                                        ),
                                    )
                                }}
                            </div>
                            <WeightBarChart
                                :items="baseWeightItems"
                                :showLabel="true"
                            />
                        </div>
                        <div
                            class="flex flex-column gap-3 p-3 border-round-md bg-white"
                        >
                            <div class="text-lg">
                                {{ $t('LABEL_WORN_WEIGHT') }}:
                                {{
                                    formatWeight(
                                        dataUtils.getTripWornGearsWeight(
                                            trip,
                                            gearMap,
                                        ),
                                    )
                                }}
                            </div>
                            <WeightBarChart
                                :items="wornWeightItems"
                                :showLabel="true"
                            />
                        </div>
                        <div
                            class="flex flex-column gap-3 p-3 border-round-md bg-white"
                        >
                            <div class="text-lg">
                                {{ $t('LABEL_CONSUMABLES_WEIGHT') }}:
                                {{
                                    formatWeight(
                                        dataUtils.getTripConsumablessWeight(
                                            trip,
                                        ),
                                    )
                                }}
                            </div>
                            <WeightBarChart
                                :items="consumablesWeightItems"
                                :showLabel="true"
                            />
                        </div>
                    </div>
                </div>

                <!-- left -->
                <div class="col-12 lg:col-8 flex flex-column gap-4">
                    <!-- base gears -->
                    <SectionPanel>
                        <template #header>
                            <SectionTitleBar
                                class="p-3 bg-white border-round-top-md"
                                sticky
                            >
                                <h2>{{ $t('LABEL_BASE') }}</h2>
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
                            </SectionTitleBar>
                        </template>
                        <div
                            v-for="category in displayGearCatergories"
                            :key="category"
                            class="flex flex-column gap-3"
                        >
                            <CategoryHeader
                                :category="category"
                                type="gear"
                                :weight="gearWeightByCategory[category]"
                            >
                                <template #actions>
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
                            </CategoryHeader>
                            <GearDataTable
                                :gears="gearsInTripByCategory[category]"
                                :hasQuantity="true"
                                :actions="['edit', 'remove']"
                                @gear-edit="onEditGear"
                                @gear-remove="
                                    (gear) => onRemoveGear(gear, 'gears')
                                "
                                @gear-cell-edit-complete="
                                    (e) =>
                                        onGearCellEditComplete({
                                            ...e,
                                            type: 'gears',
                                        })
                                "
                                class="lg:ml-6"
                            />
                        </div>
                    </SectionPanel>

                    <!-- worn gears -->
                    <SectionPanel>
                        <template #header>
                            <SectionTitleBar
                                class="p-3 bg-white border-round-top-md"
                                sticky
                            >
                                <h2>{{ $t('LABEL_WORN') }}</h2>
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
                                                selectingGearType = 'wornGears';
                                                isSelectingGears = true;
                                            },
                                        },
                                        {
                                            icon: 'pi pi-plus',
                                            label: $t('ACTION_CREATE_GEAR'),
                                            command: () => {
                                                creatingGearType = 'wornGears';
                                                onCreateGear();
                                            },
                                        },
                                    ]"
                                    class="lg:hidden"
                                />
                            </SectionTitleBar>
                        </template>
                        <div
                            v-for="category in displayWornGearCatergories"
                            :key="category"
                            class="flex flex-column gap-3"
                        >
                            <CategoryHeader
                                :category="category"
                                type="gear"
                                :weight="wornGearWeightByCategory[category]"
                            >
                                <template #actions>
                                    <ActionButtonsGroup
                                        type="icon"
                                        class="hide-in-mobile"
                                        :actions="[
                                            {
                                                icon: 'pi pi-plus',
                                                label: $t('ACTION_CREATE_GEAR'),
                                                onClick: () => {
                                                    creatingGearType =
                                                        'wornGears';
                                                    onCreateGear({ category });
                                                },
                                            },
                                        ]"
                                    />
                                </template>
                            </CategoryHeader>
                            <GearDataTable
                                :gears="wornGearsInTripByCategory[category]"
                                :hasQuantity="true"
                                :actions="['edit', 'remove']"
                                @gear-edit="onEditGear"
                                @gear-remove="
                                    (gear) => onRemoveGear(gear, 'wornGears')
                                "
                                @gear-cell-edit-complete="
                                    (e) =>
                                        onGearCellEditComplete({
                                            ...e,
                                            type: 'wornGears',
                                        })
                                "
                                class="lg:ml-6"
                            />
                        </div>
                    </SectionPanel>

                    <!-- comsumables -->
                    <SectionPanel>
                        <template #header>
                            <SectionTitleBar
                                class="p-3 bg-white border-round-top-md"
                                sticky
                            >
                                <h2>{{ $t('LABEL_CONSUMABLES') }}</h2>
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
                            </SectionTitleBar>
                        </template>
                        <div
                            v-for="category in displayConsumableCategories"
                            :key="category"
                            class="flex flex-column gap-3"
                        >
                            <CategoryHeader
                                :category="category"
                                type="consumable"
                                :weight="consumableWeightByCategory[category]"
                            >
                                <template #actions>
                                    <ActionButtonsGroup
                                        type="icon"
                                        class="hide-in-mobile"
                                        :actions="[
                                            {
                                                icon: 'pi pi-plus',
                                                label: $t(
                                                    'ACTION_CREATE_CONSUMABLE',
                                                ),
                                                onClick: () =>
                                                    onCreateConsumable({
                                                        category,
                                                    }),
                                            },
                                        ]"
                                    />
                                </template>
                            </CategoryHeader>
                            <ConsumableDataTable
                                :consumables="consumablesByCategory[category]"
                                @consumable-edit="onEditConsumable"
                                @consumable-delete="confirmDeleteConsumable"
                                @consumable-cell-edit-complete="
                                    onConsumableCellEditComplete
                                "
                                class="lg:ml-6"
                            />
                        </div>
                    </SectionPanel>
                </div>
            </div>
        </template>
        <PageLoading v-else-if="isFetchingTrips" />
        <template v-else>
            <EmptyState
                :title="$t('INFO_TRIP_NOT_FOUND')"
                :description="$t('INFO_TRIP_NOT_FOUND_DESC')"
                image-src="/image/illustration/illu-camping.svg"
            >
                <template #actions>
                    <PrimeButton
                        :label="$t('ACTION_BACK_TO_TRIPS')"
                        @click="$router.push('/trips')"
                    />
                </template>
            </EmptyState>
        </template>
    </div>
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
    <GearEditor @complete-create-gear="onCompleteCreateGearInTrip" />
    <TripInfoEditor />
    <ConsumableEditor :tripId="tripId" />
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth-guard'],
    layout: 'user-page',
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
const gearsInTripByCategory = computed(() =>
    dataUtils.groupGearsByCategory(gearsInTrip.value),
);
const displayGearCatergories = computed(() =>
    constants.GEAR_CATEGORY_KEYS.filter(
        (category) => gearsInTripByCategory.value[category],
    ),
);
const gearWeightByCategory = computed(() =>
    _mapValues(gearsInTripByCategory.value, (gears) =>
        _sumBy(gears, (gear) => (+gear.weight || 0) * gear.quantity),
    ),
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
const wornGearsInTripByCategory = computed(() =>
    dataUtils.groupGearsByCategory(wornGearsInTrip.value),
);
const displayWornGearCatergories = computed(() =>
    constants.GEAR_CATEGORY_KEYS.filter(
        (category) => wornGearsInTripByCategory.value[category],
    ),
);
const wornGearWeightByCategory = computed(() =>
    _mapValues(wornGearsInTripByCategory.value, (gears) =>
        _sumBy(gears, (gear) => (+gear.weight || 0) * gear.quantity),
    ),
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

const consumablesByCategory = computed(() =>
    dataUtils.groupConsumablesByCategory(consumablesInTrip.value),
);

const displayConsumableCategories = computed(() =>
    constants.CONSUMABLE_CATEGORY_KEYS.filter(
        (category) => consumablesByCategory.value[category],
    ),
);

const consumableWeightByCategory = computed(() =>
    _mapValues(consumablesByCategory.value, (consumables) =>
        _sumBy(consumables, (consumable) => +consumable.weight || 0),
    ),
);

// weight bars
const totalWeightItems = computed<WeightBarChartItem[]>(() => [
    {
        label: i18n.t('LABEL_BASE_WEIGHT'),
        weight: trip.value
            ? dataUtils.getTripGearsWeight(trip.value, gearMap.value)
            : 0,
        color: constants.COLORS.BASE_WEIGHT,
    },
    {
        label: i18n.t('LABEL_WORN_WEIGHT'),
        weight: trip.value
            ? dataUtils.getTripWornGearsWeight(trip.value, gearMap.value)
            : 0,
        color: constants.COLORS.WORN_WEIGHT,
    },
    {
        label: i18n.t('LABEL_CONSUMABLES_WEIGHT'),
        weight: trip.value
            ? dataUtils.getTripConsumablessWeight(trip.value)
            : 0,
        color: constants.COLORS.CONSUMABLES_WEIGHT,
    },
]);

const baseWeightItems = computed<WeightBarChartItem[]>(() =>
    Object.entries(gearWeightByCategory.value).map(([category, weight]) => ({
        label: gearCategoryToLabel(category as GearCategory),
        weight,
        color: constants.GEAR_CATEGORIES[category as GearCategory].color,
    })),
);

const wornWeightItems = computed<WeightBarChartItem[]>(() =>
    Object.entries(wornGearWeightByCategory.value).map(
        ([category, weight]) => ({
            label: gearCategoryToLabel(category as GearCategory),
            weight,
            color: constants.GEAR_CATEGORIES[category as GearCategory].color,
        }),
    ),
);

const consumablesWeightItems = computed<WeightBarChartItem[]>(() =>
    Object.entries(consumableWeightByCategory.value).map(
        ([category, weight]) => ({
            label: consumableCategoryToLabel(category as ConsumableCategory),
            weight,
            color: constants.CONSUMABLE_CATEGORIES[
                category as ConsumableCategory
            ].color,
        }),
    ),
);

const { formatWeight, gearCategoryToLabel, consumableCategoryToLabel } =
    useLangUtils();

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
</script>
