<template>
    <div>
        <div>
            <label>
                {{ $t('LABEL_EMAIL') }}
            </label>
            <input type="email" v-model="email" placeholder="Email" />
        </div>
        <div>
            <label>
                {{ $t('LABEL_PASSWORD') }}
            </label>
            <input type="password" v-model="password" placeholder="Password" />
        </div>
        <div>
            <button @click="login">
                {{ $t('ACTION_LOGIN') }}
            </button>
        </div>
        <hr />
        <nav>
            <NuxtLink to="/">Home</NuxtLink>
            |
            <NuxtLink to="/signup">Sign Up</NuxtLink>
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

const login = async () => {
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
