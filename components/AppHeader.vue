<template>
    <header class="app-header sticky top-0 border-bottom-1 border-200">
        <NuxtLink to="/">
            <img
                class="app-header__logo"
                src="/image/logo-horizontal.svg"
                alt="App Logo"
            />
        </NuxtLink>
        <div class="app-header__navigation">
            <slot name="navigation" />
        </div>
        <div class="app-header__actions">
            <slot name="actions" />
        </div>
        <div class="app-header__menu">
            <slot name="menu" />
        </div>
    </header>
</template>

<style lang="scss">
@import '~/assets/theme/themes/mytheme/_variables.scss';
@import '~/assets/theme/primeflex/core/_variables.scss';

.app-header {
    height: var(--app-header-height);
    display: grid;
    align-items: center;
    padding: 0 16px;
    grid-template-columns: 200px 1fr;
    background-color: $eg-c-bright;
    z-index: 1200; // higher than dropdown menu, lower than modal

    &__logo {
        height: 24px;
    }
    &__navigation,
    &__actions {
        display: none;
    }
    &__navigation {
        justify-content: center;
    }
    &__actions {
        justify-content: flex-end;
    }
    &__menu {
        display: flex;
        justify-content: flex-end;
    }

    @media (min-width: $lg) {
        padding: 0 40px;
        grid-template-columns: 200px 1fr 200px;
        gap: 16px;
        &__menu {
            display: none;
        }
        &__navigation,
        &__actions {
            display: flex;
        }
    }
}
</style>
