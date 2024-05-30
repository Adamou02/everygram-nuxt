<template>
    <div class="flex flex-column bg-white border-round-md">
        <slot name="header" />
        <div v-if="$slots.default" class="flex flex-column gap-6 p-3">
            <slot />
        </div>
    </div>
</template>
