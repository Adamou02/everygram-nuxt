<template>
    <AppHeader transparent absolute color-reverse />
    <HomeHero />
    <div class="intro">
        <HomeTriangleLine />
        <HomeBrandIconSection>
            <p class="text-700">
                Welcome to Everygram, the ultimate web app designed for hiking
                enthusiasts who understand the importance of meticulous weight
                management. Everygram empowers you to create detailed gear lists
                for your hiking trips, ensuring that every gram is accounted for
                and optimized for a more efficient backpacking experience.
            </p>
        </HomeBrandIconSection>
        <HomeTriangleLine />
    </div>
    <div class="key-features">
        <HomeTriangleConnectLine />
        <HomeKeyFeature image-src="/image/home-key-feature-1.png">
            <template #title>
                Create your gear
                <span class="text-primary">collection</span> list
            </template>
            <template #description>
                Easily create and organize lists for all your gears. Add each
                piece of gear with its weight to keep a precise inventory.
            </template>
        </HomeKeyFeature>
        <HomeTriangleConnectLine reverse />
        <HomeKeyFeature image-src="/image/home-key-feature-2.png" reverse>
            <template #title>
                <span class="text-primary">Visualize</span> Trip weight
                Distribution
            </template>
            <template #description>
                Start by creating a new hiking trip in Everygram. Automatically
                calculate the total pack weight, base weight, and consumable
                weight. And you’ll get a visual representation of your gear’s
                weight distribution.
            </template>
        </HomeKeyFeature>
        <HomeTriangleConnectLine />
        <HomeKeyFeature image-src="/image/home-key-feature-3.png">
            <template #title>
                <span class="text-primary">Share</span> your Trip to friends
            </template>
            <template #description>
                Make your trip public and easily share it to your friends with a
                link.
            </template>
        </HomeKeyFeature>
        <HomeTriangleConnectLine reverse />
        <HomeBrandIconSection>
            <p class="text-700 mb-4">
                Lorem ipsum dolor sit amet consectetur. Ultricies sed tellus
                amet aliquam. Sit a interdum tortor habitant adipiscing in
                quisque nunc. Id hendrerit sapien pellentesque augue quis
                blandit.
            </p>
            <HomeCtaButton severity="secondary" container-name="key-features" />
        </HomeBrandIconSection>
        <HomeTriangleLine />
    </div>
    <div class="bg-white">
        <div class="container flex flex-column gap-4 text-center px-3 py-6">
            <h2 class="text-3xl lg:text-5xl">All Devices Compatible</h2>
            <img src="/image/compatible-devices.png" />
        </div>
        <AppFooter />
    </div>
</template>

<script setup lang="ts">
onMounted(() => {
    analyticsUtils.log(constants.ANALYTICS_EVENTS.VIEW_LANDING_PAGE);
});
</script>

<style lang="scss" scoped>
@import '~/assets/theme/themes/mytheme/_variables.scss';
@import '~/assets/theme/primeflex/core/_variables.scss';
@import '~/assets/theme/_eg-colors.scss';

.intro {
    background-color: $eg-brown-200;
}
.key-features {
    background-color: $eg-brown-100;
}
</style>
