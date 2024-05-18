<template>
    <div class="flex flex-column gap-1">
        <template v-if="!user || isSigningIn">
            <PrimeButton
                :label="$t('ACTION_SIGN_IN_WITH_GOOGLE')"
                class="w-full"
                icon="pi pi-google"
                :loading="isSigningIn"
                @click="onSignInWithGoogle"
            />
        </template>
        <template v-else>
            <NuxtLink to="/trips" class="block w-full">
                <PrimeButton
                    :label="$t('ACTION_START_USING_EVERYGRAM')"
                    class="w-full"
                />
            </NuxtLink>
        </template>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'signin-page',
});

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { signInWithGoogle, isSigningIn } = useSignInActions();
const onSignInWithGoogle = async () => {
    analyticsUtils.log(constants.ANALYTICS_EVENTS.CLICK_SIGN_IN_BUTTON, {
        sign_in_method: 'google',
    });
    await signInWithGoogle();
    navigateTo('/trips');
};

onMounted(() => {
    analyticsUtils.log(constants.ANALYTICS_EVENTS.VIEW_LANDING_PAGE);
});
</script>
