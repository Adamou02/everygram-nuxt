<template>
    <div
        :class="[
            'flex flex-column align-items-center w-full py-4',
            {
                'pb-4': $slots.actions,
            },
        ]"
    >
        <PrimeImage
            :src="imageSrc"
            class="w-full max-w-20rem mb-3 text-center"
            width="240"
            height="240"
        />
        <div
            :class="[
                'flex flex-column gap-2 text-center',
                {
                    'mb-5': $slots.actions,
                },
            ]"
        >
            <h2 class="text-2xl font-bold">{{ title }}</h2>
            <p v-if="description">{{ description }}</p>
        </div>
        <slot name="actions" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string;
    description?: string;
    imageSrc: string;
}>();
</script>
