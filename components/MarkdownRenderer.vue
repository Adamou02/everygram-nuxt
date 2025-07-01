<template>
    <div v-html="renderedHtml" class="markdown-content"></div>
</template>

<script lang="ts" setup>
import { marked } from 'marked';

const props = defineProps<{
    content: string;
}>();

// Configure marked to open links in new tab
const renderer = new marked.Renderer();
renderer.link = ({ href, title, text }) => {
    const titleAttr = title ? ` title="${title}"` : '';
    return `<a href="${href}" target="_blank" rel="noopener noreferrer"${titleAttr}>${text}</a>`;
};
marked.setOptions({ renderer });

const renderedHtml = computed(() => {
    return marked.parse(props.content || '', {
        async: false,
        breaks: true,
    });
});
</script>

<style lang="scss">
@import '~/assets/theme/_eg-colors.scss';

.markdown-content {
    line-height: 2;
    a {
        color: $eg-c-secondary;
        text-decoration: underline;
    }
    a:hover {
        color: $eg-c-secondary-dark;
    }
    h1,
    h2,
    h3,
    h4 {
        margin-top: 1rem;
        &:first-child {
            margin-top: 0;
        }
    }
    hr {
        margin: 2.5rem 0;
        border-style: solid;
        border-color: $eg-c-gray-400;
    }
}
</style>
