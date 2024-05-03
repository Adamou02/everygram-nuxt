<template>
    <PrimeMenu :model="items" class="user-page-nav-menu p-0">
        <template #item="{ item, props }">
            <NuxtLink
                v-if="item.route"
                class="p-menuitem-link"
                :to="item.route"
            >
                <span :class="[item.iconClass, 'p-menuitem-icon']">{{
                    item.iconContent
                }}</span>
                <span class="p-menuitem-text">{{ item.label }}</span>
            </NuxtLink>
            <a
                v-else
                v-ripple
                :href="item.url"
                :target="item.target"
                v-bind="props.action"
            >
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
            </a>
        </template>
    </PrimeMenu>
</template>

<script setup lang="ts">
const i18n = useI18n();
const route = useRoute();

const items = ref([
    {
        label: i18n.t('PAGE_GEARS'),
        iconClass: 'material-symbols-outlined',
        iconContent: 'category',
        route: '/gears',
        active: route.path === '/gears',
    },
    {
        label: i18n.t('PAGE_TRIPS'),
        iconClass: 'material-symbols-outlined',
        iconContent: 'landscape',
        route: '/trips',
        active: route.path === '/trips',
    },
    // settings
    {
        label: i18n.t('PAGE_SETTINGS'),
        iconClass: 'material-symbols-outlined',
        iconContent: 'settings',
        route: '/settings',
        active: route.path === '/settings',
    },
]);
</script>

<style lang="scss">
@import '~/assets/theme/themes/mytheme/_variables.scss';

.user-page-nav-menu {
    background-color: transparent;
    border: none;
    .p-menuitem {
        margin-bottom: 0.5rem;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .router-link-active {
        background-color: $menuitemActiveBg;
    }
}
</style>
