<!-- a page to list all gear the user has -->
<template>
    <div class="flex flex-column gap-5">
        <div class="flex justify-content-between align-items-center">
            <div class="text-color-secondary">
                {{ $t('INFO_GEAR_NUM', { num: gears.length }, gears.length) }}
            </div>
            <div>
                <ActionButtonsGroup
                    type="text"
                    :actions="[
                        {
                            label: $t('ACTION_CREATE_GEAR'),
                            onClick: () => onCreateGear(),
                        },
                    ]"
                />
            </div>
        </div>
        <div
            v-for="category in displayCatergories"
            :key="category"
            class="flex flex-column gap-2"
        >
            <GearCategoryHeader :category="category">
                <template #actions>
                    <ActionButtonsGroup
                        type="icon"
                        :actions="[
                            {
                                icon: 'pi pi-plus',
                                label: $t('ACTION_CREATE_GEAR'),
                                onClick: () => onCreateGear({ category }),
                            },
                        ]"
                    />
                </template>
            </GearCategoryHeader>
            <PrimeDataTable
                :value="gearsGroupByCategory[category]"
                edit-mode="cell"
                @cell-edit-complete="onCellEditComplete"
                dataKey="id"
            >
                <PrimeColumn field="name" :header="$t('LABEL_NAME')">
                    <template #editor="{ data, field }">
                        <PrimeInputText v-model="data[field]" />
                    </template>
                </PrimeColumn>
                <PrimeColumn
                    field="weight"
                    :header="$t('LABEL_WEIGHT')"
                    class="w-10rem"
                >
                    <template #body="{ data }">
                        {{ data.weight ? formatWeight(data.weight) : '-' }}
                    </template>
                    <template #editor="{ data, field }">
                        <PrimeInputGroup>
                            <PrimeInputNumber v-model="data[field]" />
                            <PrimeInputGroupAddon>g</PrimeInputGroupAddon>
                        </PrimeInputGroup>
                    </template>
                </PrimeColumn>
                <PrimeColumn :exportable="false" class="w-3rem">
                    <template #body="{ data }">
                        <MoreActionsMenuButton
                            :items="[
                                {
                                    icon: 'pi pi-pencil',
                                    label: $t('ACTION_EDIT'),
                                    command: () => {
                                        onEditGear(data);
                                    },
                                },
                                {
                                    icon: 'pi pi-trash',
                                    label: $t('ACTION_DELETE'),
                                    command: () => {
                                        confirmDeleteGear(data);
                                    },
                                },
                            ]"
                        />
                    </template>
                </PrimeColumn>
            </PrimeDataTable>
        </div>
    </div>
    <GearEditorDialog
        :is-open="isAddingGear || isEditingGear"
        :gear="editingGear"
        :default-category="defaultGearCategory"
        @complete-add="onCompleteCreateGear"
        @complete-edit="onCompleteEditGear"
        @cancel="onCancelEditGear"
    />
    <p v-if="isFetchingGears">Loading...</p>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth-guard'],
    layout: 'user-page',
});

const userGearsStore = useUserGearsStore();
const { gears, isFetchingGears } = storeToRefs(userGearsStore);
const gearsGroupByCategory = computed(() =>
    gearUtils.groupGearsByCategory(gears.value),
);
const displayCatergories = computed(() =>
    constants.GEAR_CATEGORY_KEYS.filter(
        (category) => gearsGroupByCategory.value[category],
    ),
);
const { formatWeight } = useLangUtils();
const { confirmDeleteDialog } = useUiUitls();
const i18n = useI18n();

// for GearEditor
const {
    onCreateGear,
    onEditGear,
    onCompleteCreateGear,
    onCompleteEditGear,
    onCancelEditGear,
    isAddingGear,
    isEditingGear,
    editingGear,
    defaultGearCategory,
} = useEditGear();

const onDeleteGear = async (gear: Gear) => {
    // TODO: check if the gear has been used in any trips
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

const onArchiveGear = async (gear: Gear) => {
    // TODO
    console.log('archive gear', gear);
};

// for edit gear in table
const onCellEditComplete = async (e: {
    data: Gear & { quantity: number };
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
</script>
