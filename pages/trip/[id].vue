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
                    <!-- gears -->
                    <SectionPanel>
                        <template #header>
                            <SectionTitleBar
                                class="p-3 bg-white border-round-top-md"
                                sticky
                            >
                                <h2>{{ $t('LABEL_GEARS') }}</h2>
                                <ActionButtonsGroup
                                    type="text"
                                    :actions="[
                                        {
                                            label: $t('ACTION_ADD_FROM_GEARS'),
                                            onClick: () =>
                                                (isSelectingGears = true),
                                        },
                                        {
                                            label: $t('ACTION_CREATE'),
                                            onClick: () => onCreateGear(),
                                        },
                                    ]"
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
                                        :actions="[
                                            {
                                                icon: 'pi pi-plus',
                                                label: $t('ACTION_CREATE_GEAR'),
                                                onClick: () =>
                                                    onCreateGear({ category }),
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
                                @gear-remove="onRemoveGear"
                                @gear-cell-edit-complete="
                                    onGearCellEditComplete
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
                                            label: $t('ACTION_CREATE'),
                                            onClick: () => onCreateConsumable(),
                                        },
                                    ]"
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
        <template v-else-if="isFetchingTrips">
            <p>Loading...</p>
        </template>
        <template v-else>
            <p>Trip not found</p>
        </template>
    </div>
    <GearsSelectorDialog
        :is-open="isSelectingGears"
        :selected-gear-ids="selectedGearIds"
        @complete="onCompletSelectGears"
        @cancel="isSelectingGears = false"
    />
    <GearEditorDialog
        :is-open="isAddingGear || isEditingGear"
        :gear="editingGear"
        :default-category="defaultGearCategory"
        @complete-create="onCompleteCreateGearInTrip"
        @complete-edit="onCompleteEditGear"
        @cancel="onCancelEditGear"
    />
    <TripInfoEditorDialog
        :is-open="isEditingTrip"
        :trip="editingTrip"
        @complete-edit="onCompleteEditTrip"
        @cancel="onCancelEditTrip"
    />
    <ConsumableEditorDialog
        :is-open="isAddingConsumable || isEditingConsumable"
        :trip-id="tripId"
        :consumable-index="editingConsumableIndex"
        :default-category="defaultConsumableCategory"
        @complete-create="onCompleteCreateConsumable"
        @complete-edit="onCompleteEditConsumable"
        @cancel="onCancelEditConsumable"
    />
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

const totalWeightItems = computed<WeightBarChartItem[]>(() => [
    {
        label: i18n.t('LABEL_BASE_WEIGHT'),
        weight: trip.value
            ? dataUtils.getTripGearsWeight(trip.value, gearMap.value)
            : 0,
        color: constants.COLORS.BASE_WEIGHT,
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
const selectedGearIds = computed(() =>
    trip.value ? Object.keys(trip.value.gears) : [],
);
const onCompletSelectGears = (selectedGears: TripGear[]) => {
    userTripsStore.setGearsToTrip(tripId, selectedGears);
    isSelectingGears.value = false;
};

// for GearEditorDialog
const {
    isAddingGear,
    isEditingGear,
    editingGear,
    defaultGearCategory,
    onCreateGear,
    onEditGear,
    onCompleteCreateGear,
    onCompleteEditGear,
    onCancelEditGear,
} = useEditGear();

const onCompleteCreateGearInTrip = (gear: Gear) => {
    userTripsStore.setGearsToTrip(tripId, [{ id: gear.id, quantity: 1 }]);
    onCompleteCreateGear();
};

const onRemoveGear = (gear: Gear) => {
    userTripsStore.removeGearsFromTrip(tripId, [gear.id]);
};

// for TripInfoEditorDialog
const {
    isEditingTrip,
    editingTrip,
    onEditTrip,
    onCompleteEditTrip,
    onCancelEditTrip,
} = useEditTrip();

// for edit gear in table
const onGearCellEditComplete = async (e: {
    data: Gear;
    newValue: any;
    field: string;
}) => {
    const { data, newValue, field } = e;
    switch (field) {
        case 'quantity':
            await userTripsStore.setGearsToTrip(tripId, [
                { id: data.id, quantity: newValue },
            ]);
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
const {
    isAddingConsumable,
    isEditingConsumable,
    editingConsumableIndex,
    defaultConsumableCategory,
    onCreateConsumable,
    onEditConsumable,
    onCompleteCreateConsumable,
    onCompleteEditConsumable,
    onCancelEditConsumable,
} = useEditConsumable();

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
