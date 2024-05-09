<template>
    <PrimeButton
        type="button"
        @click="isOpen = !isOpen"
        icon="pi pi-bars"
        aria-haspopup="true"
        aria-controls="user-mobile-menu"
        text
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
                    <PrimeButton
                        :class="[
                            'text-left',
                            'user-mobile-menu__button',
                            {
                                'user-mobile-menu__button--active':
                                    $route.name === 'trips' ||
                                    $route.name === 'trip-id',
                            },
                        ]"
                        :label="$t('PAGE_TRIPS')"
                        text
                        @click="
                            () => {
                                navigateTo('/trips');
                                isOpen = false;
                            }
                        "
                    >
                        <template #icon>
                            <span class="material-symbols-outlined mr-2"
                                >landscape</span
                            >
                        </template>
                    </PrimeButton>
                    <PrimeButton
                        :class="[
                            'text-left',
                            'user-mobile-menu__button',
                            {
                                'user-mobile-menu__button--active':
                                    $route.name === 'gears',
                            },
                        ]"
                        :label="$t('PAGE_GEARS')"
                        text
                        @click="
                            () => {
                                navigateTo('/gears');
                                isOpen = false;
                            }
                        "
                    >
                        <template #icon>
                            <span class="material-symbols-outlined mr-2"
                                >category</span
                            >
                        </template>
                    </PrimeButton>
                </div>
                <div class="flex flex-column gap-2">
                    <PrimeButton
                        :label="$t('ACTION_SIGN_OUT')"
                        icon="pi pi-sign-out"
                        outlined
                        @click="onSignOut"
                    />
                </div>
            </div>
        </template>
    </PrimeSidebar>
</template>

<script setup>
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const isOpen = ref(false);

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
