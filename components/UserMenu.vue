<template>
    <PrimeButton
        type="button"
        @click="menu?.toggle"
        aria-haspopup="true"
        aria-controls="user-menu"
        class="text-color"
        text
    >
        <div class="user-menu flex gap-2 align-items-center w-full">
            <UserLabel v-if="user" :user="user" avatarSize="sm" />
            <span class="pi pi-angle-down flex-0"></span>
        </div>
    </PrimeButton>
    <PrimeMenu ref="menu" id="user-menu" :model="items" :popup="true" />
    <LocaleMenuDialog
        :isOpen="isOpenLocaleMenu"
        @close="isOpenLocaleMenu = false"
    />
</template>

<script setup>
const { localeToLabel, getCurrentLocale, setLocale } = useLangUtils();
const i18n = useI18n();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const onSignOut = async () => {
    await userStore.signOutUser();
    navigateTo('/');
};

const menu = ref();
const isOpenLocaleMenu = ref(false);
const { openUserSettingsDialog } = useUserSettingsDialog();

const items = computed(() => [
    {
        label: i18n.t('ACTION_USER_SETTINGS'),
        icon: 'pi pi-user-edit',
        command: () => openUserSettingsDialog(),
    },
    {
        label: i18n.t('LABEL_LOCALE_CURRENT', {
            locale: localeToLabel(getCurrentLocale()),
        }),
        icon: 'pi pi-language',
        command: () => {
            isOpenLocaleMenu.value = true;
        },
    },
    {
        label: i18n.t('ACTION_SIGN_OUT'),
        icon: 'pi pi-sign-out',
        command: () => onSignOut(),
    },
]);
</script>
