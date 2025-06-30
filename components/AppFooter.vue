<template>
    <footer class="app-footer">
        <div class="app-footer__hr">
            <div class="app-footer__hr-line"></div>
            <div
                class="app-footer__brand-icon-container"
                @click="onClickBrandIcon"
            >
                <img
                    class="app-footer__brand-icon"
                    src="/image/brand-icon.svg"
                    alt="Brand Icon"
                />
                <div class="app-footer__greeting">
                    \ {{ $t('INFO_HELLO') }} /
                </div>
            </div>
            <div class="app-footer__hr-line"></div>
        </div>
        <div class="app-footer__content">
            <div class="text-color-light">
                <small
                    >Copyright &copy; {{ currentYear }}
                    {{ $t('APP_NAME') }}</small
                >
            </div>
            <div class="flex flex-column lg:flex-row gap-2 align-items-center">
                <!-- facebook page -->
                <NuxtLink
                    to="https://www.facebook.com/everygram"
                    target="_blank"
                    rel="noopener"
                    :aria-label="$t('PAGE_FACEBOOK_PAGE')"
                >
                    <PrimeButton rounded text icon="pi pi-facebook" />
                </NuxtLink>
                <!-- release notes -->
                <NuxtLink
                    to="/release-notes"
                    :aria-label="$t('PAGE_RELEASE_NOTES')"
                >
                    <PrimeButton rounded text size="small">
                        {{ $t('PAGE_RELEASE_NOTES') }}
                    </PrimeButton>
                </NuxtLink>
                <!-- privacy -->
                <NuxtLink
                    :to="`/privacy/${$i18n.locale}`"
                    :aria-label="$t('PAGE_PRIVACY_POLICY')"
                >
                    <PrimeButton rounded text size="small">
                        {{ $t('PAGE_PRIVACY_POLICY') }}
                    </PrimeButton>
                </NuxtLink>
                <!-- feedback form -->
                <NuxtLink
                    to="https://docs.google.com/forms/d/e/1FAIpQLSdYyYfy1i7yfBjf-KrqlpD97UVxxtMrAqEyBlRoqWb3INEgeg/viewform"
                    target="_blank"
                    rel="noopener"
                    @click="
                        () =>
                            analyticsUtils.log(
                                constants.ANALYTICS_EVENTS
                                    .CLICK_FEEDBACK_BUTTON,
                            )
                    "
                >
                    <PrimeButton rounded text size="small">
                        {{ $t('ACTION_FEEDBACK') }}
                    </PrimeButton>
                </NuxtLink>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
const onClickBrandIcon = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};
</script>

<style lang="scss">
@import '~/assets/theme/themes/mytheme/_variables.scss';
@import '~/assets/theme/primeflex/core/_variables.scss';

.app-footer {
    height: var(--app-footer-height);
    &__hr {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
    }
    &__brand-icon-container {
        position: relative;
        line-height: 0;
        bottom: -4px;
    }
    &__brand-icon {
        height: 32px;
    }
    &__greeting {
        display: none;
        position: absolute;
        z-index: 1;
        bottom: 32px;
        left: 28px;
        font-size: 12px;
        white-space: nowrap;
        transform: scale(0) rotate(-30deg);
        transform-origin: bottom left;
        transition: transform 0.2s;
        transition-timing-function: ease-out;
        @media (hover: hover) {
            display: block;
        }
    }
    &__brand-icon-container:hover &__greeting {
        transform: scale(1) rotate(-30deg);
    }
    &__hr-line {
        border-bottom: 1px solid $eg-c-primary;
        &:first-child {
            margin-right: -3px;
        }
        &:last-child {
            margin-left: -3px;
        }
        transform: translateY(-0.8px);
    }
    &__content {
        display: flex;
        align-items: center;
        flex-direction: column-reverse;
        gap: 12px;
        padding: 12px 20px 20px;
    }

    @media (min-width: $lg) {
        &__content {
            flex-direction: row;
            justify-content: space-between;
            gap: 0;
            padding: 20px 40px;
        }
    }
}
</style>
