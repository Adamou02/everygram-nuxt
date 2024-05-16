<template>
    <AppHeader>
        <template #navigation>
            <UserNavButtons />
        </template>
        <template #actions>
            <UserMenu />
        </template>
        <template #mobile-actions>
            <UserMobileMenu />
        </template>
    </AppHeader>
    <div class="page-container">
        <slot />
    </div>
    <AppFooter />
</template>
