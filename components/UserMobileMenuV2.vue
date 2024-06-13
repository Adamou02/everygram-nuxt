<template>
    <PrimeButton
        type="button"
        @click="isOpenUserMenu = !isOpenUserMenu"
        aria-haspopup="true"
        unstyled
        class="appearance-none border-none bg-transparent cursor-pointer p-0"
    >
        <UserAvatar :user="user" avatarSize="sm" />
    </PrimeButton>
    <BottomSheetMenu
        :menuItems="userMenuItems"
        :isOpen="isOpenUserMenu"
        @close="isOpenUserMenu = false"
    />
    <LocaleMenuBottomSheet
        :isOpen="isOpenLocaleMenu"
        @close="isOpenLocaleMenu = false"
    />
</template>

<script setup>
const { localeToLabel, getCurrentLocale } = useLangUtils();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const isOpenUserMenu = ref(false);
const isOpenLocaleMenu = ref(false);
const i18n = useI18n();

const userMenuItems = computed(() => {
    return [
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
            command: onSignOut,
        },
    ];
});

const onSignOut = async () => {
    await userStore.signOutUser();
    navigateTo('/');
};
</script>
