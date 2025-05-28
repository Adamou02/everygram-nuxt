<template>
    <AppHeader class="sticky">
        <template #left>
            <NuxtLink :to="'/trips'" class="line-height-1">
                <picture>
                    <source
                        :media="`(min-width: ${constants.BREAK_POINTS.lg}px)`"
                        :srcset="'/image/logo-horizontal.svg'"
                        height="24px"
                    />
                    <img
                        class="app-header__logo"
                        :src="'/image/brand-icon.svg'"
                        alt="App Logo"
                        height="32px"
                    />
                </picture>
            </NuxtLink>
        </template>
        <template #navigation>
            <UserNavButtons />
        </template>
        <template #actions>
            <UserMenu />
        </template>
        <template #mobile-actions>
            <UserMobileMenuV2 />
        </template>
    </AppHeader>
    <div class="page-container">
        <slot />
    </div>
    <AppFooter />
    <!-- dialogs available in all user pages -->
    <UserSettingsDialog />
</template>
