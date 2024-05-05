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
        </div>
        <div class="flex justify-content-center">
            <PrimeButton
                :label="$t('ACTION_SEND_RESET_PASSWORD_EMAIL')"
                @click="sendResetPasswordEmail"
                :loading="isLoading"
                class="w-full"
            />
        </div>
        <div class="flex justify-content-center align-items-center gap-2">
            <PrimeButton
                text
                :label="$t('ACTION_LOGIN')"
                @click="navigateTo('/login')"
            />
            |
            <PrimeButton
                text
                :label="$t('ACTION_SIGN_UP')"
                @click="navigateTo('/signup')"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AuthError } from 'firebase/auth';
import { ref } from 'vue';

definePageMeta({
    middleware: ['auth-guard'],
    layout: 'login-page',
});

const email = ref<string>('');
const isLoading = ref<boolean>(false);

const userStore = useUserStore();

const sendResetPasswordEmail = async () => {
    // isLoading.value = true;
    // try {
    //     // TODO
    // } catch (error) {
    //     console.error(errorMessageLang((error as AuthError).code));
    //     isLoading.value = false;
    // }
};
</script>
