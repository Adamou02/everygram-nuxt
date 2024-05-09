<template>
    <div class="flex flex-column bg-white border-round-md">
        <slot name="header" />
        <div class="flex flex-column gap-5 p-3">
            <slot />
        </div>
    </div>
</template>
