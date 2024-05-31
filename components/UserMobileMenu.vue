<template>
    <PrimeButton
        type="button"
        @click="isOpen = !isOpen"
        icon="pi pi-bars"
        aria-haspopup="true"
        aria-controls="user-mobile-menu"
        text
        rounded
    />
    <PrimeSidebar v-model:visible="isOpen" position="right">
        <template #header>
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
            </div>
        </template>
        <template #default>
            <div
                class="user-mobile-menu flex flex-column justify-content-between h-full"
            >
                <div class="flex flex-column gap-2">
                    <NuxtLink
                        to="/trips"
                        class="block w-full"
                        @click="
                            () => {
                                isOpen = false;
                            }
                        "
                    >
                        <PrimeButton
                            :class="[
                                'text-left w-full',
                                'user-mobile-menu__button',
                                {
                                    'user-mobile-menu__button--active':
                                        $route.name === 'trips' ||
                                        $route.name === 'trip-id',
                                },
                            ]"
                            :label="$t('PAGE_TRIPS')"
                            text
                        >
                            <template #icon>
                                <span class="material-symbols-outlined mr-2"
                                    >landscape</span
                                >
                            </template>
                        </PrimeButton>
                    </NuxtLink>
                    <NuxtLink
                        to="/gears"
                        class="block w-full"
                        @click="
                            () => {
                                isOpen = false;
                            }
                        "
                    >
                        <PrimeButton
                            :class="[
                                'text-left w-full',
                                'user-mobile-menu__button',
                                {
                                    'user-mobile-menu__button--active':
                                        $route.name === 'gears',
                                },
                            ]"
                            :label="$t('PAGE_GEARS')"
                            text
                        >
                            <template #icon>
                                <span class="material-symbols-outlined mr-2"
                                    >category</span
                                >
                            </template>
                        </PrimeButton>
                    </NuxtLink>
                </div>
                <div class="flex flex-column gap-2">
                    <PrimeButton
                        :class="['text-left', 'user-mobile-menu__button']"
                        :label="
                            $t('LABEL_LOCALE_CURRENT', {
                                locale: localeToLabel(getCurrentLocale()),
                            })
                        "
                        icon="pi pi-language"
                        text
                        @click="
                            () => {
                                isOpenLocaleMenu = true;
                                isOpen = false;
                            }
                        "
                    >
                    </PrimeButton>
                    <PrimeButton
                        :class="['text-left', 'user-mobile-menu__button']"
                        :label="$t('ACTION_SIGN_OUT')"
                        icon="pi pi-sign-out"
                        text
                        @click="onSignOut"
                    />
                </div>
            </div>
        </template>
    </PrimeSidebar>
    <BottomSheetMenu
        :menuItems="localeMenuItems"
        :isOpen="isOpenLocaleMenu"
        @close="isOpenLocaleMenu = false"
    />
</template>

<script setup>
const { localeToLabel, getCurrentLocale, setLocale } = useLangUtils();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const isOpen = ref(false);
const isOpenLocaleMenu = ref(false);

const localeMenuItems = computed(() =>
    constants.LOCALES.map((locale) => ({
        label: localeToLabel(locale),
        command: () => {
            setLocale(locale);
            isOpenLocaleMenu.value = false;
        },
    })),
);

const onSignOut = async () => {
    await userStore.signOutUser();
    navigateTo('/');
};
</script>

<style lang="scss">
@import '~/assets/theme/themes/mytheme/_variables.scss';
.user-mobile-menu {
    &__button--active {
        background-color: rgba($buttonBg, $textButtonActiveBgOpacity);
    }
}
</style>
