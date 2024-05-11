<template>
    <PrimeDialog
        :visible="isOpen"
        :header="gear ? $t('ACTION_EDIT_GEAR') : $t('ACTION_CREATE_GEAR')"
        modal
        class="w-full mx-2 max-w-20rem"
        @update:visible="(value: boolean) => !value && $emit('cancel')"
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
                    :autofocus="!gear"
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
                        integer
                        :min="constants.LIMIT.minWeight"
                        :max="constants.LIMIT.maxWeight"
                        :invalid="vuelidate.weight.$error"
                        @keypress.enter="onSubmit"
                    />
                    <PrimeInputGroupAddon>g</PrimeInputGroupAddon>
                </PrimeInputGroup>
            </FormField>
            <FormField :label="$t('LABEL_CATEGORY')">
                <PrimeDropdown
                    v-model="formState.category"
                    :options="
                        constants.GEAR_CATEGORY_KEYS.map((category) => ({
                            value: category,
                        }))
                    "
                    optionValue="value"
                    :placeholder="$t('ACTION_SELECT_A_CATEGORY')"
                    class="w-full"
                >
                    <template #value="slotProps">
                        <div
                            v-if="slotProps.value"
                            class="flex align-items-center gap-2"
                        >
                            <GearCategoryAvatar
                                :category="slotProps.value"
                                size="small"
                            />
                            <div>
                                {{ gearCategoryToLabel(slotProps.value) }}
                            </div>
                        </div>
                        <span v-else>
                            {{ slotProps.placeholder }}
                        </span>
                    </template>
                    <template #option="slotProps">
                        <div class="flex align-items-center gap-2">
                            <GearCategoryAvatar
                                :category="slotProps.option.value"
                                size="small"
                            />
                            <div>
                                {{
                                    gearCategoryToLabel(slotProps.option.value)
                                }}
                            </div>
                        </div>
                    </template>
                </PrimeDropdown>
            </FormField>
        </template>
        <template #footer>
            <PrimeButton
                :label="$t('ACTION_CANCEL')"
                text
                severity="secondary"
                :disabled="isSaving"
                @click="$emit('cancel')"
            />
            <PrimeButton
                :label="gear ? $t('ACTION_SAVE') : $t('ACTION_CREATE')"
                :loading="isSaving"
                @click="onSubmit"
            />
        </template>
    </PrimeDialog>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { minLength } from '@vuelidate/validators';

const props = defineProps<{
    isOpen: boolean;
    gear: Gear | null;
    defaultCategory?: GearCategory;
}>();

const emit = defineEmits<{
    'complete-create': [gear: Gear];
    'complete-edit': [gear: Gear];
    cancel: [];
}>();

const { gearCategoryToLabel } = useLangUtils();

// form state and validation rules
const initialFormState = {
    name: '',
    weight: undefined,
    category: undefined,
};
const formState = reactive<{
    name: string;
    weight: number | undefined;
    category: GearCategory | undefined;
}>({ ...initialFormState });
const formValidators = useFormValidators();
const formRules = {
    name: {
        required: formValidators.required,
        minLength: formValidators.minLength(constants.LIMIT.minNameLength),
        maxLength: formValidators.maxLength(constants.LIMIT.maxNameLength),
    },
    weight: {
        integer: formValidators.integer,
        minValue: formValidators.minValue(constants.LIMIT.minWeight),
        maxValue: formValidators.maxValue(constants.LIMIT.maxWeight),
    },
};
const vuelidate = useVuelidate(formRules, formState, { $autoDirty: true });

watch(
    () => props.isOpen,
    () => {
        if (props.isOpen) {
            formState.name = props.gear?.name || initialFormState.name;
            formState.weight = props.gear?.weight || initialFormState.weight;
            formState.category =
                props.gear?.category || initialFormState.category;
            vuelidate.value.$reset();
        }
    },
);

const isSaving = ref<boolean>(false);
const userGearsStore = useUserGearsStore();
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

    try {
        isSaving.value = true;
        if (props.gear) {
            await userGearsStore.updateGear({
                id: props.gear.id,
                gearData,
            });
            emit('complete-edit', userGearsStore.getGearById(props.gear.id));
        } else {
            const docId = await userGearsStore.createGear(gearData);
            if (!docId) {
                throw new Error('Failed to add gear');
            }
            emit('complete-create', userGearsStore.getGearById(docId));
        }
    } catch (error) {
        console.error(error);
    } finally {
        isSaving.value = false;
    }
};
</script>
