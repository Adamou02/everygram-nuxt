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
            <div
                class="white-space-nowrap text-overflow-ellipsis overflow-hidden"
            >
                {{ user?.displayName }}
            </div>
            <span class="pi pi-angle-down"></span>
        </div>
    </PrimeButton>
    <PrimeMenu ref="menu" id="user-menu" :model="items" :popup="true" />
</template>

<script setup>
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
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
