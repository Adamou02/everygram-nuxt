<template>
    <div class="flex flex-column align-items-center w-full">
        <PrimeImage :src="imageSrc" class="w-full max-w-20rem mb-2" />
        <div class="flex flex-column gap-2 text-center mb-5">
            <h2 class="text-2xl font-bold">{{ props.title }}</h2>
            <p>{{ props.description }}</p>
        </div>
        <slot name="actions" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string;
    description: string;
    imageSrc: string;
}>();
</script>
