<template>
    <div class="flex flex-column gap-3">
        <div>
            <div class="field">
                <label for="signup-email">{{ $t('LABEL_EMAIL') }}</label>
                <PrimeInputText
                    id="signup-email"
                    v-model="email"
                    class="w-full"
                />
            </div>
            <div class="field">
                <label for="signup-password">{{ $t('LABEL_PASSWORD') }}</label>
                <PrimeInputText
                    id="signup-password"
                    v-model="password"
                    type="password"
                    class="w-full"
                />
            </div>
        </div>
        <div class="flex justify-content-center">
            <PrimeButton
                :label="$t('ACTION_SIGN_UP')"
                @click="signUp"
                :loading="isLoading"
                class="w-full"
            />
        </div>
        <div class="flex justify-content-center">
            <PrimeButton
                text
                :label="$t('ACTION_SIGN_IN')"
                @click="navigateTo('/signin')"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AuthError } from 'firebase/auth';
import { ref } from 'vue';

definePageMeta({
    middleware: ['auth-guard'],
    layout: 'siginin-page',
});

const email = ref<string>('');
const password = ref<string>('');
const isLoading = ref<boolean>(false);

const userStore = useUserStore();

const signUp = async () => {
    isLoading.value = true;
    try {
        await userStore.signUpWithEmail({
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
