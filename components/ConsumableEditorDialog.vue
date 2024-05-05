<template>
    <PrimeDialog
        :visible="isOpen"
        :header="
            existingConsumable
                ? $t('ACTION_EDIT_CONSUMABLE')
                : $t('ACTION_CREATE_CONSUMABLE')
        "
        modal
        @update:visible="(value: boolean) => !value && $emit('cancel')"
    >
        <template v-if="isOpen" #default>
            <div class="field">
                <label for="consumable-name">
                    {{ $t('LABEL_NAME') }}
                </label>
                <PrimeInputText
                    id="consumable-name"
                    v-model="editingConsumable.name"
                    class="w-full"
                    autofocus
                />
            </div>
            <div class="field">
                <label for="consumable-weight">
                    {{ $t('LABEL_WEIGHT') }}
                </label>
                <PrimeInputGroup>
                    <PrimeInputNumber
                        id="consumable-weight"
                        v-model="editingConsumable.weight"
                        class="w-full"
                    />
                    <PrimeInputGroupAddon>g</PrimeInputGroupAddon>
                </PrimeInputGroup>
            </div>
            <div class="field">
                <label for="consumable-category">
                    {{ $t('LABEL_CATEGORY') }}
                </label>
                <PrimeDropdown
                    v-model="editingConsumable.category"
                    :options="categoryOptions"
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
            </div>
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
const props = defineProps<{
    isOpen: boolean;
    tripId: string;
    consumableIndex: number | null;
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
const emptyConsumable: EditingConsumable = {
    name: '',
};

const existingConsumable = computed<Consumable | null>(() => {
    return (
        (isNumber(props.consumableIndex) &&
            trip.value &&
            trip.value.consumables &&
            trip.value.consumables[props.consumableIndex]) ||
        null
    );
});
const editingConsumable = ref<EditingConsumable>({
    name: '',
    weight: 0,
});
watchEffect(() => {
    if (props.isOpen) {
        editingConsumable.value = existingConsumable.value
            ? { ...existingConsumable.value }
            : { ...emptyConsumable, category: props.defaultCategory };
    }
});
const isSaving = ref<boolean>(false);
const categoryOptions = constants.CONSUMABLE_CATEGORY_KEYS.map((category) => ({
    value: category,
}));

const onSubmit = async () => {
    try {
        isSaving.value = true;
        const newConsumable: Consumable = {
            name: editingConsumable.value.name || '',
            weight: editingConsumable.value.weight || 0,
            category: editingConsumable.value.category || 'others',
        };
        if (isNumber(props.consumableIndex) && existingConsumable) {
            await userTripsStore.updateConsumableInTrip({
                tripId: props.tripId,
                consumableIndex: props.consumableIndex,
                consumable: newConsumable,
            });
            emit('complete-edit', newConsumable);
        } else {
            await userTripsStore.addConsumableToTrip({
                tripId: props.tripId,
                consumable: newConsumable,
            });
            emit('complete-create', newConsumable);
        }
    } catch (error) {
        console.error(error);
    } finally {
        isSaving.value = false;
    }
};
</script>
