<!-- a page to list all gear the user has -->
<template>
    <PageLoading v-if="isFetchingGears" />
    <div v-else-if="gears.length" class="grid">
        <div class="col-12 lg:col-offset-2 lg:col-8">
            <div class="flex flex-column gap-5">
                <SectionTitleBar>
                    <div class="text-600">
                        {{
                            $t(
                                'INFO_GEAR_NUM',
                                { num: gears.length },
                                gears.length,
                            )
                        }}
                    </div>
                    <div class="flex align-items-center gap-2">
                        <PrimeButton
                            :label="$t('ACTION_IMPORT_GEARS')"
                            icon="pi pi-file-arrow-up"
                            class="hide-in-mobile"
                            @click="isOpenImportGearsDialog = true"
                            outlined
                        />
                        <PrimeButton
                            icon="pi pi-file-arrow-up"
                            @click="isOpenImportGearsDialog = true"
                            class="lg:hidden"
                            outlined
                        />
                        <PrimeButton
                            :label="$t('ACTION_CREATE_GEAR')"
                            icon="pi pi-plus"
                            @click="() => onCreateGear()"
                        />
                    </div>
                </SectionTitleBar>
                <SectionPanel
                    v-for="category in displayGearCatergories"
                    :key="category"
                >
                    <template #header>
                        <CategoryHeader
                            :category="category"
                            type="gear"
                            class="p-3 bg-white border-round-top-md"
                            sticky
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
                    </template>
                    <GearDataTable
                        :gears="gearsGroupByCategory[category]"
                        :hasQuantity="false"
                        :actions="['edit', 'delete']"
                        @gear-edit="onEditGear"
                        @gear-delete="confirmDeleteGear"
                        @gear-cell-edit-complete="onCellEditComplete"
                    />
                </SectionPanel>
            </div>
        </div>
    </div>
    <EmptyState
        v-else
        :title="$t('INFO_NO_USER_GEARS')"
        :description="$t('INFO_NO_USER_GEARS_DESC')"
        image-src="/image/illustration/illu-adventure.svg"
    >
        <template #actions>
            <div
                class="flex flex-column lg:flex-row-reverse align-items-stretch lg:align-items-center gap-2"
            >
                <PrimeButton
                    :label="$t('ACTION_CREATE_GEAR')"
                    icon="pi pi-plus"
                    @click="() => onCreateGear()"
                />
                <PrimeButton
                    :label="$t('ACTION_IMPORT_GEARS')"
                    icon="pi pi-file-arrow-up"
                    @click="isOpenImportGearsDialog = true"
                    outlined
                />
            </div>
        </template>
    </EmptyState>
    <GearEditorDialog />
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
const { gears, isFetchingGears } = storeToRefs(userGearsStore);
const gearsGroupByCategory = computed(() =>
    dataUtils.groupGearsByCategory(gears.value),
);
const displayGearCatergories = computed(() =>
    constants.GEAR_CATEGORY_KEYS.filter(
        (category) => gearsGroupByCategory.value[category],
    ),
);
const { confirmDeleteDialog } = useUiUitls();
const i18n = useI18n();

// for GearEditor
const { onCreateGear, onEditGear } = useEditGear();

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

useHead({
    title: i18n.t('PAGE_GEARS'),
});

// for ImportGearsDialog
const isOpenImportGearsDialog = ref<boolean>(false);
</script>
