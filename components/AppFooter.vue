<template>
    <footer class="app-footer">
        <div class="app-footer__hr">
            <div class="app-footer__hr-line"></div>
            <img
                class="app-footer__brand-icon"
                src="/image/brand-icon.svg"
                alt="App Icon"
            />
            <div class="app-footer__hr-line"></div>
        </div>
        <div class="app-footer__content">
            <div class="text-600">
                <small>Copyright &copy; 2024 Everygram</small>
            </div>
            <div class="flex gap-2">
                <NuxtLink
                    to="https://docs.google.com/forms/d/e/1FAIpQLSdYyYfy1i7yfBjf-KrqlpD97UVxxtMrAqEyBlRoqWb3INEgeg/viewform"
                    target="_blank"
                    rel="noopener"
                >
                    <PrimeButton link>
                        {{ $t('ACTION_FEEDBACK') }}
                    </PrimeButton>
                </NuxtLink>
            </div>
        </div>
    </footer>
</template>

<style lang="scss">
@import '~/assets/theme/themes/mytheme/_variables.scss';
@import '~/assets/theme/primeflex/core/_variables.scss';

.app-footer {
    &__hr {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
    }
    &__brand-icon {
        height: 32px;
        position: relative;
        bottom: -4px;
        margin: 0px -2px;
    }
    &__hr-line {
        border-bottom: 1px solid $eg-c-primary;
    }
    &__content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 40px;
    }

    @media (max-width: $lg) {
        &__content {
            flex-direction: column-reverse;
            gap: 12px;
            padding: 12px 20px 20px;
        }
    }
}
</style>
