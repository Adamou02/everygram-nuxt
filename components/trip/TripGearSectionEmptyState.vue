<template>
    <div class="flex gap-2 align-items-start text-600">
        <span class="pi pi-info-circle mt-1"></span>
        <p class="line-height-3">
            {{ props.description }}
        </p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    description?: string;
}>();
</script>
