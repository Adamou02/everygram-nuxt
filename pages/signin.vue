<template>
    <div class="flex flex-column gap-3">
        <div>
            <div class="field">
                <label for="user-email">
                    {{ $t('LABEL_EMAIL') }}
                </label>
                <PrimeInputText
                    id="user-email"
                    v-model="email"
                    class="w-full"
                />
            </div>
            <div class="field">
                <label for="user-password">
                    {{ $t('LABEL_PASSWORD') }}
                </label>
                <PrimeInputText
                    id="user-password"
                    v-model="password"
                    type="password"
                    class="w-full"
                />
            </div>
        </div>
        <div class="flex justify-content-center">
            <PrimeButton
                :label="$t('ACTION_SIGN_IN')"
                @click="signIn"
                :loading="isLoading"
                class="w-full"
            />
        </div>
        <div class="flex justify-content-center align-items-center gap-2">
            <PrimeButton
                text
                :label="$t('ACTION_SIGN_UP')"
                @click="navigateTo('/signup')"
            />
            |
            <PrimeButton
                text
                :label="$t('ACTION_RESET_PASSWORD')"
                @click="navigateTo('/reset-password')"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AuthError } from 'firebase/auth';
import { ref } from 'vue';

definePageMeta({
    middleware: ['auth-guard'],
    layout: 'user-page',
});

const email = ref<string>('');
const password = ref<string>('');
const isLoading = ref<boolean>(false);

const userStore = useUserStore();

const signIn = async () => {
    isLoading.value = true;
    try {
        await userStore.signInWithEmail({
            email: email.value,
            password: password.value,
        });
        navigateTo('/gears');
    } catch (error) {
        console.error(errorMessageLang((error as AuthError).code));
        isLoading.value = false;
    }
};
</script>
