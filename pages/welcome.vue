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
            <PrimeButton
                :label="$t('ACTION_START_USING_EVERYGRAM')"
                class="w-full"
                @click="navigateTo('/trips')"
            />
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
    await signInWithGoogle();
    navigateTo('/trips');
};
</script>
