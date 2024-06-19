<template>
    <PrimeDropdown
        v-model="value"
        :options="
            constants.GEAR_BRAND_KEYS.map((brand) => ({
                value: brand,
                label: constants.GEAR_BRANDS[brand].name,
            }))
        "
        editable
        optionValue="value"
        optionLabel="label"
        :virtualScrollerOptions="{ itemSize: 40 }"
    />
</template>

<script setup lang="ts">
const value = defineModel<string>({ required: true });
</script>
