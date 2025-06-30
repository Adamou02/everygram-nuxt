<template>
    <NuxtLayout name="doc-page" :title="pageTitle">
        <MarkdownRenderer :content="content" />
    </NuxtLayout>
</template>

<script lang="ts" setup>
const route = useRoute();
const locale = computed(() => (route.params.locale || 'en') as Locale);
const content = ref<string>('');
const i18n = useI18n();
i18n.setLocale(locale.value);
const pageTitle = i18n.t('META_PRIVACY_TITLE');

if (!constants.LOCALES.includes(locale.value)) {
    throw createError({
        statusCode: 404,
    });
}

async function loadMarkdown(locale: string) {
    switch (locale) {
        case 'zh-tw':
            content.value = (
                await import('~/content/privacy-zh-tw.md?raw')
            ).default;
            break;
        case 'ja':
            content.value = (
                await import('~/content/privacy-ja.md?raw')
            ).default;
            break;
        default:
            content.value = (
                await import('~/content/privacy-en.md?raw')
            ).default;
    }
}

await loadMarkdown(locale.value);

useSeoMeta({
    title: pageTitle,
    ogTitle: pageTitle,
    description: i18n.t('META_PRIVACY_DESCRIPTION'),
    ogDescription: i18n.t('META_PRIVACY_DESCRIPTION'),
    ogImage: constants.SITE_DOMAIN + '/image/home-og-image.jpg',
    robots: 'index, follow',
});
</script>
