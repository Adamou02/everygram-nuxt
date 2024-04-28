<template>
    <div>
        <input type="email" v-model="email" placeholder="Email" />
        <input type="password" v-model="password" placeholder="Password" />
        <button @click="login">Login</button>
    </div>
</template>

<script setup lang="ts">
import type { AuthError } from "firebase/auth";
import { ref } from "vue";

definePageMeta({
    middleware: ["auth-guard"],
});

const email = ref<string>("");
const password = ref<string>("");
const isLoading = ref<boolean>(false);

const userStore = useUserStore();

const login = async () => {
    isLoading.value = true;
    try {
        await userStore.signInWithEmail({
            email: email.value,
            password: password.value,
        });
        navigateTo("/dashboard");
    } catch (error) {
        console.error(errorMessageLang((error as AuthError).code));
        isLoading.value = false;
    }
};
</script>
