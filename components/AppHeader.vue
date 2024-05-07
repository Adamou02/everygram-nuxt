<template>
    <header class="app-header sticky top-0 z-1">
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
    padding: 0 40px;
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    align-items: center;
    gap: 16px;
    background-color: $eg-c-bright;

    &__logo {
        height: 24px;
    }
    &__navigation {
        display: flex;
        justify-content: center;
    }
    &__actions {
        display: flex;
        justify-content: flex-end;
    }
    &__menu {
        display: none;
    }

    @media (max-width: $lg) {
        padding: 0 20px;
        grid-template-columns: 200px 1fr;
        &__menu {
            display: flex;
            justify-content: flex-end;
        }
        &__navigation,
        &__actions {
            display: none;
        }
    }
}
</style>
