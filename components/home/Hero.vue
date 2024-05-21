<template>
    <div class="hero w-full">
        <div class="grid grid-nogutter h-full lg:flex-row-reverse">
            <div class="col-12 lg:col-offset-1 lg:col-6">
                <div class="hero__img" />
            </div>
            <div class="col-12 lg:col-offset-1 lg:col-4">
                <div
                    class="h-full flex flex-column justify-content-center gap-4 lg:gap-6 py-3 px-6 lg:py-0 lg:px-0"
                >
                    <h1 class="text-4xl lg:text-6xl text-white">
                        Count every gram, <br />
                        every gram counts.
                    </h1>
                    <div class="flex flex-column align-items-start gap-4">
                        <HomeCtaButton
                            severity="contrast"
                            container-name="hero"
                        />
                        <PrimeButton
                            severity="contrast"
                            label="See Features"
                            icon="pi pi-arrow-down"
                            icon-pos="left"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '~/assets/theme/themes/mytheme/_variables.scss';
@import '~/assets/theme/primeflex/core/_variables.scss';
@import '~/assets/theme/_eg-colors.scss';

.hero {
    background-color: $eg-c-primary;
    &__img {
        height: 300px;
        background-image: url(/image/illustration/home-hero-1x.jpg);
        background-position: bottom center;
        background-repeat: no-repeat;
        background-size: cover;

        @media (min-width: $lg) {
            height: 600px;
            background-image: url(/image/illustration/home-hero-2x.jpg);
            background-position: left center;
        }
    }
}
</style>
