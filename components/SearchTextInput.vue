<template>
    <PrimeIconField iconPosition="left">
        <PrimeInputIcon class="pi pi-search" />
        <PrimeInputText
            v-model="value"
            ref="filterNameInput"
            :size="size"
            :placeholder="placeholder || $t('ACTION_SEARCH')"
            class="w-full"
            v-bind="$attrs"
        />
        <PrimeButton
            v-if="value"
            icon="pi pi-times"
            severity="secondary"
            text
            rounded
            size="small"
            aria-label="clear"
            :class="[
                'absolute z-1 right-0 top-0',
                {
                    'mt-1 mr-1': size === 'large',
                },
            ]"
            @click="onClickClearButton"
        />
    </PrimeIconField>
</template>

<script setup lang="ts">
import PrimeInputText from 'primevue/inputtext';

defineOptions({
    inheritAttrs: false,
});
const value = defineModel<string>({ required: true });
const props = defineProps<{
    size?: 'small' | 'large';
    placeholder?: string;
}>();
const filterNameInput = ref<InstanceType<typeof PrimeInputText> | null>(null);
const onClickClearButton = () => {
    value.value = '';
    // @ts-ignore
    filterNameInput.value?.$el.focus();
};
</script>
