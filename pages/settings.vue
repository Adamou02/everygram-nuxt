<template>
    <div>
        <nav>
            <PrimeButton @click="onSignOut">
                {{ $t('ACTION_LOGOUT') }}
            </PrimeButton>
        </nav>
    </div>
</template>

<script setup lang="ts">
import type { AuthError } from 'firebase/auth';

definePageMeta({
    middleware: ['auth-guard'],
    layout: 'user-page',
});

const userStore = useUserStore();

const onSignOut = async () => {
    try {
        await userStore.signOutUser();
        navigateTo('/');
    } catch (error) {
        console.error(errorMessageLang((error as AuthError).code));
    }
};
</script>
