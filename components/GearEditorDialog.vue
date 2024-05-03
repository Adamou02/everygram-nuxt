<template>
    <PrimeDialog
        :visible="isOpen"
        :header="props.gear ? $t('ACTION_EDIT_GEAR') : $t('ACTION_ADD_GEAR')"
        modal
        @update:visible="(value: boolean) => !value && $emit('cancel')"
    >
        <template #default>
            <div class="field">
                <label for="gear-name">
                    {{ $t('LABEL_NAME') }}
                </label>
                <PrimeInputText
                    id="gear-name"
                    v-model="editingGear.name"
                    class="w-full"
                />
            </div>
            <div class="field">
                <label for="gear-brand">
                    {{ $t('LABEL_BRAND') }}
                </label>
                <PrimeInputText
                    id="gear-brand"
                    v-model="editingGear.brand"
                    class="w-full"
                />
            </div>
            <div class="field">
                <label for="gear-weight">
                    {{ $t('LABEL_WEIGHT') }}
                </label>
                <PrimeInputGroup>
                    <PrimeInputNumber
                        id="gear-weight"
                        v-model="editingGear.weight"
                        class="w-full"
                    />
                    <PrimeInputGroupAddon> g </PrimeInputGroupAddon>
                </PrimeInputGroup>
            </div>
            <div class="field">
                <label for="gear-category">
                    {{ $t('LABEL_CATEGORY') }}
                </label>
                <PrimeDropdown
                    v-model="editingGear.category"
                    :options="categoryOptions"
                    optionLabel="name"
                    optionValue="value"
                    :placeholder="$t('ACTION_SELECT_A_CATEGORY')"
                    class="w-full"
                />
            </div>
        </template>
        <template #footer>
            <PrimeButton
                text
                severity="secondary"
                :disabled="isSaving"
                @click="$emit('cancel')"
            >
                {{ $t('ACTION_CANCEL') }}
            </PrimeButton>
            <PrimeButton :loading="isSaving" @click="onSubmit()">
                {{ props.gear ? $t('ACTION_SAVE') : $t('ACTION_CREATE') }}
            </PrimeButton>
        </template>
    </PrimeDialog>
</template>

<script setup lang="ts">
const props = defineProps<{
    isOpen: boolean;
    gear: Gear | null;
}>();

const emit = defineEmits<{
    'complete-add': [gear: Gear];
    'complete-edit': [gear: Gear];
    cancel: [];
}>();

const i18n = useI18n();

const emptyGear: EditingGear = {
    brand: '',
    name: '',
    weight: 0,
};
const editingGear = ref<EditingGear>({});
watch(
    () => props.gear,
    (gear) => {
        if (gear) {
            editingGear.value = { ...gear };
        } else {
            editingGear.value = { ...emptyGear };
        }
    },
);
const isSaving = ref<boolean>(false);
const userGearsStore = useUserGearsStore();
const categoryOptions = CONSTANTS.GEAR_CATEGORIES.map((category) => ({
    name: i18n.t(`GEAR_CATEGORY_${category.toUpperCase()}`),
    value: category,
}));

const onSubmit = async () => {
    try {
        isSaving.value = true;
        if (props.gear) {
            await userGearsStore.updateGear({
                id: props.gear.id,
                gear: editingGear.value,
            });
            emit('complete-edit', userGearsStore.getGearById(props.gear.id));
        } else {
            const docId = await userGearsStore.addGear(editingGear.value);
            if (!docId) {
                throw new Error('Failed to add gear');
            }
            emit('complete-add', userGearsStore.getGearById(docId));
        }
    } catch (error) {
        console.error(error);
    } finally {
        isSaving.value = false;
    }
};
</script>
