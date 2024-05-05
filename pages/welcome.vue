<template>
    <div class="flex flex-column gap-1">
        <template v-if="user">
            <PrimeButton
                :label="$t('ACTION_GO_TO_EVERYGRAM')"
                class="w-full"
                @click="navigateTo('/gears')"
            />
        </template>
        <template v-else>
            <PrimeButton
                :label="$t('ACTION_SIGN_IN_WITH_GOOGLE')"
                class="w-full"
                icon="pi pi-google"
                @click="signInWWithGoogle"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'login-page',
});

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { signInWWithGoogle } = useSignInActions();
</script>
