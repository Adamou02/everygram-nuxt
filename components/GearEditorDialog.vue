<template>
    <PrimeDialog
        :visible="isOpen"
        :header="props.gear ? $t('ACTION_EDIT_GEAR') : $t('ACTION_CREATE_GEAR')"
        modal
        @update:visible="(value: boolean) => !value && $emit('cancel')"
    >
        <template v-if="isOpen" #default>
            <div class="field">
                <label for="gear-name">
                    {{ $t('LABEL_NAME') }}
                </label>
                <PrimeInputText
                    id="gear-name"
                    v-model="editingGear.name"
                    class="w-full"
                    autofocus
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
                    <PrimeInputGroupAddon>g</PrimeInputGroupAddon>
                </PrimeInputGroup>
            </div>
            <div class="field">
                <label for="gear-category">
                    {{ $t('LABEL_CATEGORY') }}
                </label>
                <PrimeDropdown
                    v-model="editingGear.category"
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
                            <CategoryAvatar
                                :category="slotProps.value"
                                size="small"
                            />
                            <div>{{ categoryToLabel(slotProps.value) }}</div>
                        </div>
                        <span v-else>
                            {{ slotProps.placeholder }}
                        </span>
                    </template>
                    <template #option="slotProps">
                        <div class="flex align-items-center gap-2">
                            <CategoryAvatar
                                :category="slotProps.option.value"
                                size="small"
                            />
                            <div>
                                {{ categoryToLabel(slotProps.option.value) }}
                            </div>
                        </div>
                    </template>
                </PrimeDropdown>
            </div>
            <!-- <div class="field">
                <label for="gear-brand">
                    {{ $t('LABEL_BRAND') }}
                </label>
                <PrimeInputText
                    id="gear-brand"
                    v-model="editingGear.brand"
                    class="w-full"
                />
            </div> -->
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
    defaultCategory?: GearCategory;
}>();

const emit = defineEmits<{
    'complete-add': [gear: Gear];
    'complete-edit': [gear: Gear];
    cancel: [];
}>();

const { categoryToLabel } = useLangUtils();

const emptyGear: EditingGear = {
    name: '',
};

const editingGear = ref<EditingGear>({});
watchEffect(() => {
    if (props.isOpen) {
        editingGear.value = props.gear
            ? { ...props.gear }
            : { ...emptyGear, category: props.defaultCategory };
    }
});
const isSaving = ref<boolean>(false);
const userGearsStore = useUserGearsStore();
const categoryOptions = constants.GEAR_CATEGORY_KEYS.map((category) => ({
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
            const docId = await userGearsStore.createGear(editingGear.value);
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
