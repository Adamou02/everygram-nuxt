<template>
    <div class="flex flex-column align-items-center gap-2 px-4 py-6">
        <img src="/image/brand-icon.svg" width="80" alt="Brand Icon" />
        <div class="text-center text-lg line-height-3 content">
            <slot />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.content {
    max-width: 800px;
}
</style>
