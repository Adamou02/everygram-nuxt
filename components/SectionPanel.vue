<template>
    <div class="flex flex-column bg-white border-round-md">
        <slot name="header" />
        <div v-if="$slots.default" class="flex flex-column gap-5 p-1 lg:p-3">
            <slot />
        </div>
    </div>
</template>
