<template>
    <PrimeDialog
        :visible="isOpen"
        :header="
            editingGear ? $t('ACTION_EDIT_GEAR') : $t('ACTION_CREATE_GEAR')
        "
        modal
        class="w-full mx-2 max-w-20rem"
        @update:visible="
            (value: boolean) => {
                if (!value) {
                    $emit('cancel');
                    onCancelEditGear();
                }
            }
        "
    >
        <template v-if="isOpen" #default>
            <FormField
                :label="$t('LABEL_NAME')"
                :errors="vuelidate.name.$errors"
                required
            >
                <PrimeInputText
                    v-model="formState.name"
                    class="w-full"
                    :minlength="constants.LIMIT.minNameLength"
                    :maxlength="constants.LIMIT.maxNameLength"
                    :autofocus="!editingGear"
                    :invalid="vuelidate.name.$error"
                    @keypress.enter="onSubmit"
                />
            </FormField>
            <FormField
                :label="$t('LABEL_WEIGHT')"
                :errors="vuelidate.weight.$errors"
            >
                <PrimeInputGroup>
                    <PrimeInputNumber
                        v-model="formState.weight"
                        class="w-full text-right"
                        :maxFractionDigits="constants.LIMIT.maxFractionDigits"
                        :min="constants.LIMIT.minWeight"
                        :max="constants.LIMIT.maxWeight"
                        :invalid="vuelidate.weight.$error"
                        @keypress.enter="onSubmit"
                    />
                    <PrimeInputGroupAddon>g</PrimeInputGroupAddon>
                </PrimeInputGroup>
            </FormField>
            <FormField :label="$t('LABEL_BRAND')">
                <GearBrandDropdown v-model="formState.brand" class="w-full" />
            </FormField>
            <FormField :label="$t('LABEL_CATEGORY')">
                <PrimeDropdown
                    v-model="formState.category"
                    :options="
                        selectableCategories.map((category) => ({
                            value: category,
                        }))
                    "
                    optionValue="value"
                    :placeholder="$t('ACTION_SELECT_A_CATEGORY')"
                    class="w-full"
                >
                    <template #value="slotProps">
                        <CategoryLabel
                            v-if="slotProps.value"
                            :category="slotProps.value"
                        />
                        <span v-else>
                            {{ slotProps.placeholder }}
                        </span>
                    </template>
                    <template #option="slotProps">
                        <CategoryLabel :category="slotProps.option.value" />
                    </template>
                </PrimeDropdown>
            </FormField>
            <FormField :label="$t('LABEL_PHOTO')">
                <ImageUploadBox
                    :width="120"
                    :aspectRatio="1"
                    :imageUrl="gearPhotoUrl"
                    :isLoading="isSaving"
                    :compressorOptions="{
                        width: constants.LIMIT.gearPhotoWidth,
                        height: constants.LIMIT.gearPhotoHeight,
                        resize: 'cover',
                    }"
                    @file-compressed="(file) => (compressedPhotoFile = file)"
                    @file-removed="() => (compressedPhotoFile = null)"
                />
            </FormField>
            <!-- Checkbox for adding the new gear to the users gears when creating gear in trip page, checked by default -->
            <div
                class="flex align-items-center gap-2"
                v-if="props.isInTripPage && !editingGear"
            >
                <PrimeCheckbox
                    v-model="formState.addToGears"
                    inputId="for-one-trip"
                    binary
                />
                <label for="for-one-trip">
                    {{ $t('LABEL_ADD_TO_GEARS') }}
                </label>
            </div>
            <!-- Hint for editing gear -->
            <HintInfo
                v-if="isEditingGear && !editingGear?.isForOneTrip"
                :description="
                    props.isInTripPage
                        ? $t('INFO_EDIT_GEAR_SYNC_TO_GEARS')
                        : $t('INFO_EDIT_GEAR_SYNC_TO_TRIPS')
                "
                size="sm"
            />
        </template>
        <template #footer>
            <PrimeButton
                :label="$t('ACTION_CANCEL')"
                text
                rounded
                severity="secondary"
                :disabled="isSaving"
                @click="
                    () => {
                        $emit('cancel');
                        onCancelEditGear();
                    }
                "
            />
            <PrimeButton
                :label="editingGear ? $t('ACTION_SAVE') : $t('ACTION_CREATE')"
                rounded
                :loading="isSaving"
                @click="onSubmit"
            />
        </template>
    </PrimeDialog>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core';

const props = defineProps<{
    isInTripPage?: boolean;
}>();

const emit = defineEmits<{
    'complete-create': [gear: Gear];
    'complete-edit': [gear: Gear];
    cancel: [];
}>();

const {
    onCompleteCreateGear,
    onCompleteEditGear,
    onCancelEditGear,
    isAddingGear,
    isEditingGear,
    editingGear,
    defaultGearCategory,
    categories,
} = useEditGear();

const isOpen = computed(() => isAddingGear.value || isEditingGear.value);
const selectableCategories = computed(() =>
    categories.value
        ? _intersection(constants.GEAR_CATEGORY_KEYS, categories.value)
        : constants.GEAR_CATEGORY_KEYS,
);

const { gearCategoryToLabel } = useLangUtils();

// form state and validation rules
const initialFormState = {
    name: '',
    brand: undefined,
    weight: undefined,
    category: undefined,
    addToGears: true,
};
const formState = reactive<{
    name: string;
    brand: string | undefined;
    weight: number | undefined;
    category: GearCategory | undefined;
    addToGears: boolean;
}>({ ...initialFormState });
const formValidators = useFormValidators();
const formRules = {
    name: {
        required: formValidators.required,
        minLength: formValidators.minLength(constants.LIMIT.minNameLength),
        maxLength: formValidators.maxLength(constants.LIMIT.maxNameLength),
    },
    weight: {
        minValue: formValidators.minValue(constants.LIMIT.minWeight),
        maxValue: formValidators.maxValue(constants.LIMIT.maxWeight),
    },
};
const vuelidate = useVuelidate(formRules, formState, { $autoDirty: true });

watch(isOpen, (newValue) => {
    if (newValue) {
        formState.name = editingGear.value?.name || initialFormState.name;
        formState.brand =
            editingGear.value?.brand?.key ||
            editingGear.value?.brand?.custom ||
            initialFormState.brand;
        formState.weight = editingGear.value?.weight || initialFormState.weight;
        formState.category =
            editingGear.value?.category ||
            defaultGearCategory.value ||
            initialFormState.category;
        formState.addToGears = initialFormState.addToGears;
        compressedPhotoFile.value = null;
        vuelidate.value.$reset();
    }
});

const isSaving = ref<boolean>(false);
const userGearsStore = useUserGearsStore();
const { gears } = storeToRefs(userGearsStore);
const gearPhotoUrl = computed(() =>
    editingGear.value ? dataUtils.getGearPhotoUrl(editingGear.value, 'xs') : '',
);
const compressedPhotoFile = ref<Blob | null>(null);
const { uploadFile } = useStorage();
const onSubmit = async () => {
    const valid = await vuelidate.value.$validate();
    if (!valid) {
        return;
    }

    const gearData: EditingGear = {
        name: formState.name,
        weight: formState.weight || 0,
        category: formState.category || 'others',
    };

    // if not adding to gears, set isForOneTrip to true
    if (props.isInTripPage && !isEditingGear && !formState.addToGears) {
        gearData.isForOneTrip = true;
    }

    if (formState.brand) {
        gearData.brand = constants.GEAR_BRANDS[formState.brand]
            ? { key: formState.brand }
            : { custom: formState.brand };
    }

    try {
        isSaving.value = true;

        if (editingGear.value) {
            // upload gear photo first
            if (compressedPhotoFile.value) {
                const result = await uploadFile({
                    path: `${constants.STORAGE_PATH.GEAR}/${editingGear.value.id}`,
                    file: compressedPhotoFile.value,
                });
                if (result) {
                    gearData.photo = {
                        url: result.downloadUrl,
                        fileName: result.fileName,
                    };
                }
            }
            // update gear
            await userGearsStore.updateGear({
                id: editingGear.value.id,
                gearData,
            });
            emit(
                'complete-edit',
                userGearsStore.getGearById(editingGear.value.id),
            );
            onCompleteEditGear();
        } else {
            // create new gear first
            const newGear = await userGearsStore.createGear(gearData);
            if (!newGear) {
                throw new Error('Failed to add gear');
            }
            // upload gear photo
            if (compressedPhotoFile.value) {
                const result = await uploadFile({
                    path: `${constants.STORAGE_PATH.GEAR}/${newGear.id}`,
                    file: compressedPhotoFile.value,
                });
                if (result) {
                    const photo = {
                        url: result.downloadUrl,
                        fileName: result.fileName,
                    };
                    await userGearsStore.updateGear({
                        id: newGear.id,
                        gearData: {
                            photo,
                        },
                    });
                    newGear.photo = photo;
                }
            }
            emit('complete-create', newGear);
            onCompleteCreateGear();
            analyticsUtils.log(constants.ANALYTICS_EVENTS.CREATE_GEAR, {
                gear_category: gearData.category,
                user_gear_num: gears.value.length,
            });
        }
    } catch (error) {
        console.error(error);
    } finally {
        isSaving.value = false;
    }
};
</script>
