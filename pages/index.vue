<template>
    <div>
        <h1>Home</h1>
        <p>Welcome to the home page!</p>
        <button v-if="isLoggedIn" @click="navigateTo('/dashboard')">
            Dashboard
        </button>
        <button v-else @click="navigateTo('/login')">Login</button>
    </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
</script>
