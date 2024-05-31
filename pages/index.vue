<template>
    <AppHeader class="bg-primary lg:bg-transparent lg:absolute" color-reverse />
    <HomeHero ref="heroRef" @see-key-features="onSeeFeatures" />
    <div class="intro" ref="introRef">
        <HomeTriangleLine />
        <HomeBrandIconSection class="intro-description">
            <p class="text-700">
                {{ $t('HOME_INTRO_DESCRIPTION') }}
            </p>
        </HomeBrandIconSection>
        <HomeTriangleLine />
    </div>
    <div class="key-features">
        <HomeTriangleConnectLine />
        <HomeKeyFeature
            :image-src="$t('IMAGE_URL_HOME_KEY_FEATURE_1')"
            :image-src-mobile="$t('IMAGE_URL_HOME_KEY_FEATURE_1_M')"
            class="key-feature-1"
        >
            <template #title>
                <i18n-t keypath="HOME_KEY_FEATURE_1_TITLE">
                    <template #keyword>
                        <span class="text-primary">{{
                            $t('HOME_KEY_FEATURE_1_KEYWORD')
                        }}</span>
                    </template>
                </i18n-t>
            </template>
            <template #description>
                {{ $t('HOME_KEY_FEATURE_1_DESCRIPTION') }}
            </template>
        </HomeKeyFeature>
        <HomeTriangleConnectLine reverse />
        <HomeKeyFeature
            :image-src="$t('IMAGE_URL_HOME_KEY_FEATURE_2')"
            :image-src-mobile="$t('IMAGE_URL_HOME_KEY_FEATURE_2_M')"
            class="key-feature-2"
            reverse
        >
            <template #title>
                <i18n-t keypath="HOME_KEY_FEATURE_2_TITLE">
                    <template #keyword>
                        <span class="text-primary">{{
                            $t('HOME_KEY_FEATURE_2_KEYWORD')
                        }}</span>
                    </template>
                </i18n-t>
            </template>
            <template #description>
                {{ $t('HOME_KEY_FEATURE_2_DESCRIPTION') }}
            </template>
        </HomeKeyFeature>
        <HomeTriangleConnectLine />
        <HomeKeyFeature
            :image-src="$t('IMAGE_URL_HOME_KEY_FEATURE_3')"
            :image-src-mobile="$t('IMAGE_URL_HOME_KEY_FEATURE_3_M')"
            class="key-feature-3"
        >
            <template #title>
                <i18n-t keypath="HOME_KEY_FEATURE_3_TITLE">
                    <template #keyword>
                        <span class="text-primary">{{
                            $t('HOME_KEY_FEATURE_3_KEYWORD')
                        }}</span>
                    </template>
                </i18n-t>
            </template>
            <template #description>
                {{ $t('HOME_KEY_FEATURE_3_DESCRIPTION') }}
                <NuxtLink
                    v-if="$i18n.locale === 'zh-tw'"
                    to="/trip-share/68wdPrCDnUbGJ17a53Mp"
                    class="block mt-5 text-center lg:text-left"
                    @click="
                        () =>
                            analyticsUtils.log(
                                constants.ANALYTICS_EVENTS
                                    .CLICK_TRIP_SHARE_EXAMPLE_BUTTON,
                            )
                    "
                >
                    <PrimeButton
                        :label="$t('ACTION_SEE_TRIP_SHARE_EXAMPLE')"
                        icon="pi pi-arrow-right"
                        icon-pos="right"
                        severity="secondary"
                        outlined
                    />
                </NuxtLink>
            </template>
        </HomeKeyFeature>
        <HomeTriangleConnectLine reverse />
        <HomeBrandIconSection class="are-you-ready">
            <h3 class="mb-2">{{ $t('HOME_READY_TITLE') }}</h3>
            <p class="text-700 mb-4">
                {{
                    user
                        ? $t('HOME_READY_DESCRIPTION')
                        : $t('HOME_READY_SIGN_UP_DESCRIPTION')
                }}
            </p>
            <HomeCtaButton severity="secondary" container-name="key-features" />
        </HomeBrandIconSection>
        <HomeTriangleLine />
    </div>
    <div class="bg-white">
        <div
            class="container flex flex-column align-items-center gap-6 text-center px-3 py-7"
        >
            <h2 class="text-2xl lg:text-4xl">
                {{ $t('LABEL_ALL_DEVICES_COMPATIBLE') }}
            </h2>
            <picture>
                <source
                    :media="`(min-width: ${constants.BREAK_POINTS.lg}px)`"
                    :srcset="$t('IMAGE_URL_COMPATIBLE_DEVICES')"
                />
                <img
                    :src="$t('IMAGE_URL_COMPATIBLE_DEVICES_M')"
                    alt="All Devices Compatible"
                    loading="lazy"
                />
            </picture>
        </div>
        <AppFooter />
    </div>
</template>

<script setup lang="ts">
import type { HomeHero } from '#build/components';

const i18n = useI18n();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const heroRef = ref<InstanceType<typeof HomeHero> | null>(null);
const heroIntersectionObserver = ref<IntersectionObserver | null>(null);
const introRef = ref<HTMLElement | null>(null);

const onSeeFeatures = () => {
    if (introRef.value) {
        introRef.value.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }
};

onMounted(() => {
    heroIntersectionObserver.value = new IntersectionObserver(
        ([entry]) => {
            // update theme-color meta tag in head
            document
                .querySelector('meta[name="theme-color"]')
                ?.setAttribute(
                    'content',
                    entry.isIntersecting ? '#9d8b73' : '#fff',
                );
        },
        {
            threshold: 0.001,
        },
    );
    if (heroRef.value) {
        heroIntersectionObserver.value.observe(heroRef.value.$el);
    }
    analyticsUtils.log(constants.ANALYTICS_EVENTS.VIEW_LANDING_PAGE);
});

onBeforeUnmount(() => {
    if (heroIntersectionObserver.value) {
        heroIntersectionObserver.value.disconnect();
    }
});

useHead({
    link: [
        // add canonical link to avoid query params
        {
            rel: 'canonical',
            href: constants.SITE_DOMAIN,
        },
    ],
});
useSeoMeta({
    title: i18n.t('META_HOME_TITLE'),
    ogTitle: i18n.t('META_HOME_TITLE'),
    description: i18n.t('META_HOME_DESCRIPTION'),
    ogDescription: i18n.t('META_HOME_DESCRIPTION'),
    ogImage: constants.SITE_DOMAIN + '/image/home-og-image.jpg',
    robots: 'index, follow',
    themeColor: '#9d8b73',
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

// deco images
@media (min-width: $lg) {
    .intro-description {
        background:
            url(/image/deco-poles.png) no-repeat 40px center / 100px,
            url(/image/deco-silverware.png) no-repeat right 40px center / 100px;
    }
    .key-feature-1 {
        background: url(/image/deco-merinohat.png) no-repeat left bottom 120px /
            120px;
    }
    .key-feature-2 {
        background: url(/image/deco-sacks.png) no-repeat right top 120px / 120px;
    }
    .key-feature-3 {
        background: url(/image/deco-hat.png) no-repeat left bottom 80px / 120px;
    }
    .are-you-ready {
        background: url(/image/deco-socks.png) no-repeat right 120px bottom /
            120px;
    }
}
</style>
