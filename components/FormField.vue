<template>
    <div class="form-field field">
        <label>
            {{ label }}
            <span v-if="required" class="text-red-700">*</span>
        </label>
        <slot />
        <small
            v-for="error in errors"
            :key="error.$uid"
            class="block text-red-700"
            >{{ error.$message }}</small
        >
    </div>
</template>

<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core';

const props = defineProps<{
    label: string;
    required?: boolean;
    errors?: ErrorObject[];
}>();
</script>
