<!-- a page to list all gear the user has -->
<template>
    <PageLoading v-if="isFetchingGears" />
    <div
        v-else-if="visibleGears.length"
        class="flex flex-column gap-2 lg:gap-3"
    >
        <!-- header -->
        <div class="grid align-items-center">
            <!-- left -->
            <div :class="sidebarClass">
                <GearNum
                    :num="displayGears.length"
                    :isFiltered="isFiltered"
                    class="px-4"
                />
            </div>
            <!-- right -->
            <div :class="mainClass">
                <div
                    :class="[
                        'flex flex-column gap-3',
                        'md:flex-row-reverse md:justify-content-between md:align-items-center',
                    ]"
                >
                    <div
                        class="flex justify-content-between align-items-center"
                    >
                        <GearNum
                            :num="displayGears.length"
                            :isFiltered="isFiltered"
                            class="md:hidden"
                        />
                        <div class="flex align-items-center gap-2">
                            <PrimeButton
                                severity="secondary"
                                rounded
                                outlined
                                :label="$t('ACTION_IMPORT_GEARS')"
                                icon="pi pi-file-arrow-up"
                                class="hide-in-mobile"
                                @click="isOpenImportGearsDialog = true"
                            />
                            <PrimeButton
                                severity="secondary"
                                rounded
                                outlined
                                icon="pi pi-file-arrow-up"
                                @click="isOpenImportGearsDialog = true"
                                class="lg:hidden"
                            />
                            <PrimeButton
                                severity="secondary"
                                rounded
                                :label="$t('ACTION_CREATE_GEAR')"
                                icon="pi pi-plus"
                                @click="() => onCreateGear()"
                            />
                        </div>
                    </div>
                    <SearchTextInput
                        v-model="filterValue"
                        :placeholder="$t('ACTION_SEARCH_GEARS')"
                        class="flex-1 md:flex-none surface-200 border-none"
                    />
                </div>
            </div>
        </div>
        <!-- body -->
        <EmptyState
            v-if="isFiltered && !displayGears.length"
            :title="$t('INFO_NO_GEARS_FOUND')"
            image-src="/image/empty-gear.jpg"
        />
        <div v-else class="grid">
            <!-- sidebar -->
            <div :class="sidebarClass">
                <div
                    class="flex flex-column gap-1 align-items-start sticky z-1"
                    style="top: var(--app-header-height)"
                >
                    <PrimeButton
                        v-for="category in displayGearCatergories"
                        :key="category"
                        :label="`${gearCategoryToLabel(category)} (${gearsGroupByCategory[category]?.length || 0})`"
                        text
                        size="small"
                        :class="[
                            'text-color text-left w-full',
                            { 'opacity-50': !gearsGroupByCategory[category] },
                        ]"
                        @click="scrollToCategory(category)"
                    >
                        <template #icon>
                            <GearCategoryAvatar
                                :category="category"
                                size="medium"
                                class="mr-3 flex-none"
                            />
                        </template>
                    </PrimeButton>
                </div>
            </div>
            <!-- main -->
            <div :class="mainClass">
                <div class="flex flex-column gap-5">
                    <SectionPanel
                        v-for="category in displayGearCatergories"
                        :id="`category-section-${category}`"
                        :key="category"
                        :class="{
                            'opacity-50': !gearsGroupByCategory[category],
                        }"
                        style="scroll-margin-top: var(--app-header-height)"
                    >
                        <template #header>
                            <CategoryHeader
                                :category="category"
                                type="gear"
                                class="p-3 border-round-md"
                                sticky
                            >
                                <template #actions>
                                    <ActionButtonsGroup
                                        text
                                        type="icon"
                                        size="small"
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
                        </template>
                        <template
                            v-if="gearsGroupByCategory[category]"
                            #default
                        >
                            <GearDataTable
                                :gears="gearsGroupByCategory[category]"
                                :hasQuantity="false"
                                :actions="['edit', 'delete']"
                                @gear-edit="onEditGear"
                                @gear-delete="confirmDeleteGear"
                                @gear-cell-edit-complete="onCellEditComplete"
                            />
                        </template>
                    </SectionPanel>
                </div>
            </div>
        </div>
    </div>
    <EmptyState
        v-else
        :title="$t('INFO_NO_USER_GEARS')"
        :description="$t('INFO_NO_USER_GEARS_DESC')"
        image-src="/image/empty-gear.jpg"
    >
        <template #actions>
            <div
                class="flex flex-column lg:flex-row-reverse align-items-stretch lg:align-items-center gap-2"
            >
                <PrimeButton
                    severity="secondary"
                    rounded
                    :label="$t('ACTION_CREATE_GEAR')"
                    icon="pi pi-plus"
                    @click="() => onCreateGear()"
                />
                <PrimeButton
                    severity="secondary"
                    rounded
                    outlined
                    :label="$t('ACTION_IMPORT_GEARS')"
                    icon="pi pi-file-arrow-up"
                    @click="isOpenImportGearsDialog = true"
                />
            </div>
        </template>
    </EmptyState>
    <GearEditorDialog :is-editing="isEditingGear" />
    <ImportGearsDialog
        :is-open="isOpenImportGearsDialog"
        @close="isOpenImportGearsDialog = false"
    />
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth-guard'],
    layout: 'user-page',
});

const userGearsStore = useUserGearsStore();
const { visibleGears, isFetchingGears } = storeToRefs(userGearsStore);
const { formatBrand } = useLangUtils();
const displayGears = computed(() =>
    isFiltered.value ? filteredGears.value : visibleGears.value,
);
const gearsGroupByCategory = computed(() =>
    dataUtils.groupGearsByCategory(displayGears.value),
);
const nonEmptyGearCatergories = computed(() =>
    constants.GEAR_CATEGORY_KEYS.filter(
        (category) => gearsGroupByCategory.value[category],
    ),
);
const emptyGearCategories = computed(() =>
    isFiltered.value
        ? []
        : constants.GEAR_CATEGORY_KEYS.filter(
              (category) => !gearsGroupByCategory.value[category],
          ),
);
const displayGearCatergories = computed(() =>
    isFiltered.value
        ? nonEmptyGearCatergories.value
        : [...nonEmptyGearCatergories.value, ...emptyGearCategories.value],
);
const { confirmDeleteDialog } = useUiUitls();
const { gearCategoryToLabel } = useLangUtils();
const i18n = useI18n();

// for GearEditor
const { onCreateGear, onEditGear, isEditingGear } = useEditGear();

const onDeleteGear = async (gear: Gear) => {
    try {
        await userGearsStore.deleteGear(gear.id);
    } catch (error) {
        console.error(error);
    }
};

const confirmDeleteGear = (gear: Gear) => {
    confirmDeleteDialog({
        message: i18n.t('MESSAGE_CONFIRM_DELETE_GEAR', { gearName: gear.name }),
        header: i18n.t('ACTION_DELETE_GEAR'),
        toastSummary: i18n.t('FEEDBACK_GEAR_DELETED'),
        onAccept: async () => {
            await onDeleteGear(gear);
        },
    });
};

// for edit gear in table
const onCellEditComplete = async (e: {
    data: Gear;
    newValue: any;
    field: string;
}) => {
    const { data, newValue, field } = e;
    switch (field) {
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

// for ImportGearsDialog
const isOpenImportGearsDialog = ref<boolean>(false);

onMounted(() => {
    analyticsUtils.log(constants.ANALYTICS_EVENTS.VIEW_GEARS_PAGE);
});

// filter
const filterValue = ref<string>('');
const filteredGears = ref<Gear[]>([]);
const isFiltered = ref<boolean>(false);
const debouncedUpdateFilteredGears = _debounce(() => {
    const searchText = filterValue.value.toLocaleLowerCase();
    if (!searchText) {
        filteredGears.value = visibleGears.value;
        isFiltered.value = false;
        return;
    }
    // filter by gear name or brand
    filteredGears.value = visibleGears.value.filter(
        (gear) =>
            gear.name.toLocaleLowerCase().includes(searchText) ||
            (gear.brand &&
                formatBrand(gear.brand)
                    .toLocaleLowerCase()
                    .includes(searchText)),
    );
    isFiltered.value = true;
}, 500);
watch(filterValue, (newFilterValue) => {
    if (!newFilterValue) {
        // reset immediately when clear filter
        filteredGears.value = visibleGears.value;
        isFiltered.value = false;
    }
    debouncedUpdateFilteredGears();
});

// for scroll into view
const scrollToCategory = (category: string) => {
    const sectionElement = document.getElementById(
        `category-section-${category}`,
    );
    if (!sectionElement) {
        return;
    }
    sectionElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });
};

const sidebarClass = 'hidden md:block md:col-3 lg:col-2';
const mainClass = 'col-12 md:col-9 lg:col-10';

useHead({
    title: i18n.t('PAGE_GEARS'),
});
</script>
