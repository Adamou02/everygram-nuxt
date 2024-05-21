<template>
    <PrimeDialog
        :visible="isOpen"
        :header="
            existingConsumable
                ? $t('ACTION_EDIT_CONSUMABLE')
                : $t('ACTION_CREATE_CONSUMABLE')
        "
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
                    :autofocus="!existingConsumable"
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
                        constants.CONSUMABLE_CATEGORY_KEYS.map((category) => ({
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
                            <ConsumableCategoryAvatar
                                :category="slotProps.value"
                                size="small"
                            />
                            <div>
                                {{ consumableCategoryToLabel(slotProps.value) }}
                            </div>
                        </div>
                        <span v-else>
                            {{ slotProps.placeholder }}
                        </span>
                    </template>
                    <template #option="slotProps">
                        <div class="flex align-items-center gap-2">
                            <ConsumableCategoryAvatar
                                :category="slotProps.option.value"
                                size="small"
                            />
                            <div>
                                {{
                                    consumableCategoryToLabel(
                                        slotProps.option.value,
                                    )
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
                :label="
                    existingConsumable ? $t('ACTION_SAVE') : $t('ACTION_CREATE')
                "
                :loading="isSaving"
                @click="onSubmit()"
            />
        </template>
    </PrimeDialog>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { v4 as uuidv4 } from 'uuid';

const props = defineProps<{
    isOpen: boolean;
    tripId: string;
    existingConsumable: Consumable | null;
    defaultCategory?: ConsumableCategory;
}>();

const emit = defineEmits<{
    'complete-create': [consumable: Consumable];
    'complete-edit': [consumable: Consumable];
    cancel: [];
}>();

const { consumableCategoryToLabel } = useLangUtils();
const userTripsStore = useUserTripsStore();
const trip = computed(() => userTripsStore.getTripById(props.tripId));

// form state and validation rules
const initialFormState = {
    name: '',
    weight: undefined,
    category: undefined,
};
const formState = reactive<{
    name: string;
    weight: number | undefined;
    category: ConsumableCategory | undefined;
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
            formState.name =
                props.existingConsumable?.name || initialFormState.name;
            formState.weight =
                props.existingConsumable?.weight || initialFormState.weight;
            formState.category =
                props.existingConsumable?.category || initialFormState.category;
            vuelidate.value.$reset();
        }
    },
);

const isSaving = ref<boolean>(false);
const onSubmit = async () => {
    const valid = await vuelidate.value.$validate();
    if (!valid) {
        return;
    }

    const consumableData = {
        id: props.existingConsumable?.id || uuidv4(),
        name: formState.name,
        weight: formState.weight || 0,
        category: formState.category || 'others',
    };

    try {
        isSaving.value = true;
        if (props.existingConsumable) {
            await userTripsStore.updateConsumableInTrip({
                tripId: props.tripId,
                consumableId: props.existingConsumable.id,
                consumable: consumableData,
            });
            emit('complete-edit', consumableData);
        } else {
            await userTripsStore.addConsumableToTrip({
                tripId: props.tripId,
                consumable: consumableData,
            });
            emit('complete-create', consumableData);
            analyticsUtils.log(constants.ANALYTICS_EVENTS.CREATE_CONSUMABLE, {
                consumable_category: consumableData.category,
            });
        }
    } catch (error) {
        console.error(error);
    } finally {
        isSaving.value = false;
    }
};
</script>
