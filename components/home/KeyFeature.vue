<template>
    <div :class="['key-feature', { 'key-feature--reverse': reverse }]">
        <div
            :class="['grid grid-nogutter', { 'lg:flex-row-reverse': reverse }]"
        >
            <!-- text -->
            <div v-if="reverse" class="lg:col-offset-1"></div>
            <div :class="['col-12 lg:col-offset-1 lg:col-4']">
                <div
                    class="h-full flex flex-column justify-content-center align-items-start p-3 lg:p-0"
                >
                    <div
                        class="key-feature__label flex align-items-center gap-2 text-sm p-2 border-round-md mb-3"
                    >
                        <img src="/image/feature-stars.svg" />
                        <span class="text-sm">KEY FEATURE</span>
                    </div>
                    <h2 class="text-3xl lg:text-5xl mb-5">
                        <slot name="title" />
                    </h2>
                    <p class="text-700 text-lg">
                        <slot name="description" />
                    </p>
                </div>
            </div>
            <!-- image -->
            <div :class="['col-12 lg:col-6', { 'lg:col-offset-1': !reverse }]">
                <div
                    class="key-feature__img"
                    :style="{ 'background-image': `url(${props.imageSrc})` }"
                ></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    reverse?: boolean;
    imageSrc: string;
}>();
</script>

<style lang="scss" scoped>
@import '~/assets/theme/themes/mytheme/_variables.scss';
@import '~/assets/theme/primeflex/core/_variables.scss';
@import '~/assets/theme/_eg-colors.scss';

.key-feature {
    max-width: var(--max-page-width);
    margin: auto;
    &__img {
        height: 400px;
        background-position: right;
        background-repeat: no-repeat;
        background-size: contain;
        @media (min-width: $lg) {
            background-position: left;
            height: 600px;
            background-size: auto 100%;
        }
    }
    &__label {
        color: $eg-brown-700;
        background-color: $eg-brown-300;
    }
}

.key-feature {
    &--reverse &__img {
        background-position: left;
        @media (min-width: $lg) {
            background-position: right;
        }
    }
}
</style>
