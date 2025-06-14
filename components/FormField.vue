<template>
    <div class="form-field field">
        <label>
            {{ label }}
            <span v-if="required" class="text-danger">*</span>
        </label>
        <slot />
        <small
            v-for="error in errors"
            :key="error.$uid"
            class="block text-danger"
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
