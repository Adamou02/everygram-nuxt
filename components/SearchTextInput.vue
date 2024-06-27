<template>
    <PrimeIconField iconPosition="left">
        <PrimeInputIcon class="pi pi-search" />
        <PrimeInputText
            v-model="value"
            ref="filterNameInput"
            :placeholder="$t('ACTION_SEARCH')"
            class="w-full"
        />
        <PrimeButton
            v-if="value"
            icon="pi pi-times"
            severity="secondary"
            text
            rounded
            size="small"
            aria-label="clear"
            class="absolute z-1 right-0 top-0"
            @click="onClickClearButton"
        />
    </PrimeIconField>
</template>

<script setup lang="ts">
import PrimeInputText from 'primevue/inputtext';

const value = defineModel<string>({ required: true });
const filterNameInput = ref<InstanceType<typeof PrimeInputText> | null>(null);
const onClickClearButton = () => {
    value.value = '';
    // @ts-ignore
    filterNameInput.value?.$el.focus();
};
</script>
