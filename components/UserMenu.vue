<template>
    <PrimeButton
        type="button"
        @click="menu?.toggle"
        aria-haspopup="true"
        aria-controls="user-menu"
        text
    >
        <div class="user-menu flex gap-2 align-items-center">
            <img
                class="border-circle"
                width="32px"
                height="32px"
                :src="user?.photoURL"
                alt="User Photo"
            />
            <div class="text-ellipsis">
                {{ user?.displayName }}
            </div>
            <span class="pi pi-angle-down"></span>
        </div>
    </PrimeButton>
    <PrimeMenu ref="menu" id="user-menu" :model="items" :popup="true" />
    <DialogMenu
        :menuItems="localeMenuItems"
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
const items = computed(() => [
    {
        label: i18n.t('LABEL_LOCALE_CURRENT', {
            locale: localeToLabel(getCurrentLocale()),
        }),
        icon: 'pi pi-globe',
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

const isOpenLocaleMenu = ref(false);
const localeMenuItems = ref(
    constants.LOCALES.map((locale) => ({
        label: localeToLabel(locale),
        command: () => {
            setLocale(locale);
            isOpenLocaleMenu.value = false;
        },
    })),
);
</script>
