<template>
    <PrimeDialog
        ref="importGearsDialog"
        :header="$t('ACTION_IMPORT_GEARS')"
        :visible="isOpen"
        :modal="true"
        class="mx-2 w-30rem"
        @update:visible="emit('close')"
        :pt="{
            content: {
                class: {
                    'p-0 lg:p-2': activeStep === 2,
                    'p-2': activeStep !== 2,
                },
            },
        }"
    >
        <PrimeStepper
            :activeStep="activeStep"
            linear
            :pt="{ nav: { class: 'p-2' } }"
        >
            <PrimeStepperPanel>
                <div class="flex flex-column gap-3">
                    <h3>{{ $t('INFO_DOWNLOAD_GEARS_TEMPLATE') }}</h3>
                    <ol class="line-height-3 pl-5">
                        <li
                            v-for="item in $t(
                                'INFO_DOWNLOAD_GEARS_TEMPLATE_DESC',
                                { max: constants.LIMIT.importLimit },
                            ).split(';')"
                        >
                            {{ item }}
                        </li>
                    </ol>
                    <a
                        href="/file/everygram_gears.csv"
                        download="everygram_gears.csv"
                        @click="
                            analyticsUtils.log(
                                constants.ANALYTICS_EVENTS
                                    .DOWNLOAD_IMPORT_GEARS_TEMPLATE,
                            )
                        "
                    >
                        <PrimeButton
                            :label="$t('ACTION_DOWNLOAD_GEARS_TEMPLATE')"
                            icon="pi pi-download"
                        />
                    </a>
                </div>
            </PrimeStepperPanel>
            <PrimeStepperPanel>
                <div class="flex flex-column gap-3">
                    <h3>{{ $t('INFO_UPLOAD_GEARS_FILE') }}</h3>
                    <FileUploadDropZone
                        ref="fileUploadDropZone"
                        accept=".csv"
                        :is-loading="isFormatting"
                        :buttonLabel="$t('ACTION_UPLOAD_GEARS_FILE')"
                        :description="
                            $t('INFO_DROP_FILE_TYPE_HERE', {
                                fileType: '.csv',
                            })
                        "
                        @file-selected="
                            async (file) => {
                                await onFileSelected(file);
                                activeStep = activeStep + 1;
                            }
                        "
                    />
                </div>
            </PrimeStepperPanel>
            <PrimeStepperPanel>
                <div class="flex flex-column gap-3">
                    <GearSelectDataTable
                        v-if="formattedGearsData.length"
                        :selectableGears="formattedGearsData"
                        :selectedGears="selectedGears"
                        dataKey="name"
                        @update="
                            (newSelectedGears) =>
                                (selectedGears = newSelectedGears)
                        "
                    />
                    <PrimePanel
                        v-if="invalidRows.length"
                        :header="
                            $t('INFO_INVALID_GEAR_DATA', {
                                num: invalidRows.length,
                            })
                        "
                    >
                        <ul class="text-red-700 pl-5">
                            <li v-for="row in invalidRows">
                                {{
                                    $t('INFO_INVALID_GEAR_DATA_ROW', {
                                        index: row.index + 1,
                                        data: row.row.join(', '),
                                    })
                                }}
                            </li>
                        </ul>
                    </PrimePanel>
                </div>
            </PrimeStepperPanel>
        </PrimeStepper>
        <template #footer>
            <div class="flex w-full justify-content-between">
                <div>
                    <PrimeButton
                        v-if="activeStep > 0"
                        :label="$t('ACTION_BACK')"
                        outlined
                        icon="pi pi-arrow-left"
                        @click="activeStep = activeStep - 1"
                    />
                </div>
                <div>
                    <PrimeButton
                        v-if="activeStep < 2"
                        :label="$t('ACTION_NEXT')"
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        :disabled="activeStep === 1 && !importedGearRows.length"
                        @click="activeStep = activeStep + 1"
                    />
                    <PrimeButton
                        v-else-if="activeStep === 2"
                        :label="
                            $t(
                                'ACTION_IMPORT_NUM_GEARS',
                                { num: selectedGears.length },
                                selectedGears.length,
                            )
                        "
                        icon="pi pi-download"
                        :loading="isImporting"
                        :disabled="!selectedGears.length || isImporting"
                        @click="onImportGears"
                    />
                </div>
            </div>
        </template>
    </PrimeDialog>
</template>

<script setup lang="ts">
type ImportGear = Pick<Gear, 'name' | 'weight' | 'category'>;
const props = defineProps<{
    isOpen: boolean;
}>();
const emit = defineEmits<{
    close: [];
}>();
const isFormatting = ref(false);
const isImporting = ref(false);
const activeStep = ref(0);
const importedGearRows = ref<string[][]>([]);
const selectedGears = ref<ImportGear[]>([]);
const invalidRows = ref<{ index: number; row: string[] }[]>([]);
const formattedGearsData = ref<ImportGear[]>([]);

const onFileSelected = async (file: File) => {
    resetData();
    isFormatting.value = true;
    const parsedContent = await fileUtils.parseCsv(file);
    importedGearRows.value = parsedContent;
    parsedContent.forEach((row, index) => {
        if (formattedGearsData.value.length >= constants.LIMIT.importLimit) {
            invalidRows.value.push({ index, row });
            return;
        }

        if (row.length !== 3) {
            invalidRows.value.push({ index, row });
            return;
        }

        const name = row[0];
        if (!name || name.length > constants.LIMIT.maxNameLength) {
            invalidRows.value.push({ index, row });
            return;
        }

        const weight = _toInteger(row[1]);
        if (
            isNaN(weight) ||
            weight < constants.LIMIT.minWeight ||
            weight > constants.LIMIT.maxWeight
        ) {
            invalidRows.value.push({ index, row });
            return;
        }

        const category: GearCategory = (
            constants.GEAR_CATEGORY_KEYS.includes(row[2] as GearCategory)
                ? row[2]
                : 'others'
        ) as GearCategory;

        formattedGearsData.value.push({
            name,
            weight,
            category,
        });
    });
    selectedGears.value = formattedGearsData.value;
    isFormatting.value = false;
    analyticsUtils.log(constants.ANALYTICS_EVENTS.UPLOAD_IMPORT_GEARS_DATA, {
        gear_num: importedGearRows.value.length,
    });
};

const resetData = () => {
    importedGearRows.value = [];
    formattedGearsData.value = [];
    invalidRows.value = [];
    selectedGears.value = [];
};

const userGearsStore = useUserGearsStore();
const onImportGears = async () => {
    const gears = selectedGears.value.map((gear) => ({
        name: gear.name,
        weight: gear.weight,
        category: gear.category,
        quantity: 1,
    }));
    try {
        isImporting.value = true;
        await userGearsStore.createGears(gears);
        emit('close');
        analyticsUtils.log(constants.ANALYTICS_EVENTS.COMPLETE_IMPORT_GEARS, {
            gear_num: gears.length,
        });
    } catch (error) {
        console.error(error);
    } finally {
        isImporting.value = false;
    }
};

// reset dialog state when dialog is open
watch(
    () => props.isOpen,
    (isOpen) => {
        if (isOpen) {
            resetData();
            activeStep.value = 0;
            analyticsUtils.log(constants.ANALYTICS_EVENTS.START_IMPORT_GEARS);
        }
    },
);
</script>
