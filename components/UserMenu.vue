<template>
    <div v-if="isFetchingMember" class="flex gap-2 align-items-center">
        <PrimeSkeleton width="32px" height="32px" shape="circle" />
        <PrimeSkeleton width="8rem" height="1rem" />
    </div>
    <template v-else>
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
                    :src="member?.photoUrl"
                    alt="Member Photo"
                />
                <div
                    class="white-space-nowrap text-overflow-ellipsis overflow-hidden"
                >
                    {{ member?.displayName }}
                </div>
                <span class="pi pi-angle-down"></span>
            </div>
        </PrimeButton>
        <PrimeMenu ref="menu" id="user-menu" :model="items" :popup="true" />
    </template>
</template>

<script setup>
const userStore = useUserStore();
const userMemberStore = useUserMemberStore();
const { member, isFetchingMember } = storeToRefs(userMemberStore);
const { $i18n } = useNuxtApp();

const onSignOut = async () => {
    await userStore.signOutUser();
    navigateTo('/');
};

const menu = ref();
const items = ref([
    {
        label: $i18n.t('ACTION_SIGN_OUT'),
        icon: 'pi pi-sign-out',
        command: () => onSignOut(),
    },
]);
</script>

<style lang="scss">
// .user-menu {
//     &__avatar {
//         width: 32px;
//         height: 32px;
//         border-radius: 50%;
//     }
// }
</style>
