<template>
    <AppHeader>
        <template #left>
            <PrimeButton
                icon="pi pi-arrow-left"
                @click="$router.push(backButton.parent)"
                :label="backButton.label"
                text
            />
        </template>
        <template #navigation>
            <div id="app-header-navigation-slot"></div>
        </template>
        <template #actions>
            <UserMenu />
        </template>
        <template #mobile-actions>
            <div id="app-header-mobile-actions-slot"></div>
        </template>
    </AppHeader>
    <div class="page-container">
        <slot />
    </div>
    <AppFooter />
</template>

<script setup lang="ts">
const route = useRoute();
const i18n = useI18n();
const backButton = computed<{ label: string; parent: string }>(() => {
    switch (route.name) {
        case 'trip-id':
            return {
                label: i18n.t('ACTION_BACK_TO_TRIPS'),
                parent: '/trips',
            };
        default:
            return {
                label: i18n.t('ACTION_BACK'),
                parent: '/',
            };
    }
});
</script>
