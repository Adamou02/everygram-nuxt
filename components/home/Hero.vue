<template>
    <div class="hero w-full relative">
        <div
            class="hero__img absolute top-0 right-0 left-0 bottom-50 lg:left-50 lg:bottom-0"
        ></div>
        <div class="container h-full">
            <div class="grid h-full align-items-end lg:align-items-stretch">
                <div
                    class="col-10 col-offset-1 lg:col-4 lg:h-full"
                    style="height: 50%"
                >
                    <div
                        class="h-full flex flex-column justify-content-center gap-4 lg:gap-6"
                    >
                        <h1
                            class="hero__slogan text-4xl lg:text-6xl text-white"
                        >
                            {{ $t('APP_SLOGAN') }}
                        </h1>
                        <div class="flex flex-column align-items-start gap-4">
                            <HomeCtaButton
                                severity="contrast"
                                rounded
                                container-name="hero"
                            />
                            <PrimeButton
                                severity="contrast"
                                rounded
                                outlined
                                :label="$t('ACTION_SEE_KEY_FEATURES')"
                                icon="pi pi-arrow-down"
                                icon-pos="left"
                                @click="() => emit('see-key-features')"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
    'see-key-features': [];
}>();
</script>

<style lang="scss" scoped>
@import '~/assets/theme/themes/mytheme/_variables.scss';
@import '~/assets/theme/primeflex/core/_variables.scss';
@import '~/assets/theme/_eg-colors.scss';

.hero {
    background-color: $eg-c-brand;
    height: 600px;
    &__img {
        background-image: url(/image/home-hero-1x.jpg);
        background-position: bottom center;
        background-size: cover;
        background-repeat: no-repeat;

        @media (min-width: $lg) {
            background-image: url(/image/home-hero-2x.jpg);
            background-size: contain;
            background-position: left center;
        }
    }
    &__slogan {
        white-space: pre-line;
    }
}
</style>
