<template>
    <PublicPage>
        <div class="grid">
            <div class="col-12 lg:col-offset-2 lg:col-8">
                <div
                    class="error-container flex flex-column py-8 align-items-center justify-content-center"
                >
                    <h1 class="error-container__title text-8xl mb-5">
                        {{ error.statusCode }}
                    </h1>
                    <PrimeButton
                        :label="$t('ACTION_BACK_TO_HOME')"
                        :icon="`pi pi-arrow-left`"
                        icon-pos="left"
                        severity="secondary"
                        rounded
                        @click="clearError({ redirect: '/' })"
                    />
                </div>
            </div>
        </div>
    </PublicPage>
</template>

<script setup lang="ts">
import PublicPage from '~/layouts/public-page.vue';
const props = defineProps({
    error: Object as () => NuxtError,
});

useSeoMeta({
    title: props.error.statusCode,
    ogTitle: props.error.statusCode,
    ogImage: constants.SITE_DOMAIN + '/image/home-og-image.jpg',
    robots: 'noindex, nofollow',
});
</script>

<style scoped lang="scss">
@import '~/assets/theme/themes/mytheme/_variables.scss';
@import '~/assets/theme/primeflex/core/_variables.scss';

.error-container {
    aspect-ratio: 1;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url(/image/error-bg-1x.jpg);
    @media (min-width: $lg) {
        background-image: url(/image/error-bg-2x.jpg);
    }

    &__title {
        letter-spacing: 1.25rem;
    }
}
</style>
