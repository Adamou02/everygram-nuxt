<template>
    <div>
        <div>
            <label>Email</label>
            <input type="email" v-model="email" placeholder="Email" />
        </div>
        <div>
            <label>Password</label>
            <input type="password" v-model="password" placeholder="Password" />
        </div>
        <div>
            <PrimeButton @click="signUp">
                {{ $t('ACTION_SIGN_UP') }}
            </PrimeButton>
        </div>
        <hr />
        <nav>
            <NuxtLink to="/">Home</NuxtLink>
            |
            <NuxtLink to="/login">Login</NuxtLink>
        </nav>
    </div>
</template>

<script setup lang="ts">
import type { AuthError } from 'firebase/auth';
import { ref } from 'vue';

definePageMeta({
    middleware: ['auth-guard'],
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
