<template>
    <PrimeButton
        type="button"
        @click="isOpen = true"
        icon="pi pi-bars"
        aria-haspopup="true"
        aria-controls="user-mobile-menu"
        text
    />
    <PrimeSidebar v-model:visible="isOpen" position="right">
        <template #header>
            <div v-if="isFetchingMember" class="flex gap-2 align-items-center">
                <PrimeSkeleton width="32px" height="32px" shape="circle" />
                <PrimeSkeleton width="8rem" height="1rem" />
            </div>
            <div v-else class="user-menu flex gap-2 align-items-center">
                <img
                    class="border-circle"
                    width="32px"
                    height="32px"
                    :src="member?.photoUrl"
                    alt="Member Photo"
                />
                <div
                    class="white-space-nowrap text-overflow-ellipsis overflow-hidden"
                >
                    {{ member?.displayName }}
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
const userMemberStore = useUserMemberStore();
const isOpen = ref(false);
const { member, isFetchingMember } = storeToRefs(userMemberStore);
const { $i18n } = useNuxtApp();

const onSignOut = async () => {
    try {
        await userStore.signOutUser();
        navigateTo('/');
    } catch (error) {
        // console.error(errorMessageLang((error as AuthError).code));
    }
};
</script>

<style lang="scss">
@import '~/assets/theme/themes/mytheme/_variables.scss';
.user-mobile-menu {
    &__avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
    }
    &__button--active {
        background-color: rgba($buttonBg, $textButtonActiveBgOpacity);
    }
}
</style>
