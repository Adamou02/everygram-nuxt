<!-- a page to list all gear the user has -->
<template>
    <div>
        <div class="flex justify-content-between align-items-center">
            <div class="text-color-secondary">
                {{ $t('INFO_GEAR_NUM', { num: gears.length }, gears.length) }}
            </div>
            <div></div>
        </div>
        <p v-if="isFetchingGears">Loading...</p>
        <template v-for="category in displayCatergories" :key="category">
            <h2>{{ $t(`GEAR_CATEGORY_${category.toUpperCase()}`) }}</h2>
            <PrimeDataTable
                :value="gearsGroupByCategory[category]"
                v-model:editingRows="editingRows"
                editMode="row"
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
                    style="width: 8rem"
                >
                    <template #editor="{ data, field }">
                        <PrimeInputNumber v-model="data[field]" />
                    </template>
                </PrimeColumn>
                <PrimeColumn :exportable="false" style="width: 10rem">
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
                                    icon: 'pi pi-inbox',
                                    tooltip: $t('ACTION_ARCHIVE'),
                                    onClick: () => onArchiveGear(data),
                                },
                                {
                                    icon: 'pi pi-trash',
                                    tooltip: $t('ACTION_DELETE'),
                                    onClick: () => onDeleteGear(data),
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
        </template>
        <GearEditorDialog
            :is-open="isAddingGear || isEditingGear"
            :gear="editingGear"
            @complete-add="onCompleteAddGear"
            @complete-edit="onCompleteEditGear"
            @cancel="onCancelEditGear"
        />
        <PrimeButton @click="onAddGear">
            {{ $t('ACTION_ADD_GEAR') }}
        </PrimeButton>
    </div>
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
    CONSTANTS.GEAR_CATEGORIES.filter(
        (category) => gearsGroupByCategory.value[category],
    ),
);

// for GearEditor
const {
    onAddGear,
    onEditGear,
    onCompleteAddGear,
    onCompleteEditGear,
    onCancelEditGear,
    isAddingGear,
    isEditingGear,
    editingGear,
} = useEditGear();

const onDeleteGear = async (gear: Gear) => {
    // TODO: check if the gear has been used in any trips
    try {
        await userGearsStore.deleteGear(gear.id);
    } catch (error) {
        console.error(error);
    }
};

const onArchiveGear = async (gear: Gear) => {
    // TODO
    console.log('archive gear', gear);
};

const editingRows = ref<Gear[]>([]);
const onSaveRowEdit = async (gear: Gear) => {
    try {
        await userGearsStore.updateGear({
            id: gear.id,
            gear: {
                name: gear.name,
                weight: gear.weight,
            },
        });
        editingRows.value = [...editingRows.value].filter(
            (editingRow) => editingRow.id !== gear.id,
        );
    } catch (error) {
        console.error(error);
    }
};
const onCancelRowEdit = (gear: Gear) => {
    editingRows.value = [...editingRows.value].filter(
        (editingRow) => editingRow.id !== gear.id,
    );
};
</script>
