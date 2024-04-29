<template>
    <div>
        <h1>Home</h1>
        <p>Welcome to Everygram!</p>
        <hr />
        <nav>
            <NuxtLink v-if="isLoggedIn" to="/dashboard"> Dashboard </NuxtLink>
            <template v-else>
                <NuxtLink to="/login">Login</NuxtLink>
                |
                <NuxtLink to="/signup">Sign Up</NuxtLink>
            </template>
        </nav>
    </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
</script>
