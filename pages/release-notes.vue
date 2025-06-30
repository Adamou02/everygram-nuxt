<template>
    <NuxtLayout name="doc-page" :title="pageTitle">
        <MarkdownRenderer :content="content" />
    </NuxtLayout>
</template>

<script lang="ts" setup>
const i18n = useI18n();
const pageTitle = i18n.t('META_RELEASE_NOTES_TITLE');
const content = ref<string>('');

await(async () => {
    content.value = (await import('~/content/release-notes.md?raw')).default;
})();

useSeoMeta({
    title: pageTitle,
    ogTitle: pageTitle,
    description: i18n.t('META_RELEASE_NOTES_DESCRIPTION'),
    ogDescription: i18n.t('META_RELEASE_NOTES_DESCRIPTION'),
    ogImage: constants.SITE_DOMAIN + '/image/home-og-image.jpg',
    robots: 'index, follow',
});
</script>
