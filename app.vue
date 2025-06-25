<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
    <PrimeToast position="top-center" />
    <PrimeConfirmDialog />
    <GearCardDialog />
</template>

<script setup lang="ts">
const i18n = useI18n();
useHead({
    titleTemplate: (pageTitle) => {
        return pageTitle
            ? `${pageTitle} | ${i18n.t('APP_NAME')}`
            : i18n.t('APP_NAME');
    },
});
useSeoMeta({
    keywords: i18n.t('META_KEYWORDS'),
});
</script>
