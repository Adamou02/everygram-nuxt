<template>
    <div>
        <h1>Dashboard</h1>
        <p>You're signed in as {{ user?.email }}</p>
        <h2>Trips</h2>
        <TripList />
        <hr />
        <nav>
            <NuxtLink to="/">Home</NuxtLink>
            |
            <NuxtLink to="/gears">Gears</NuxtLink>
            |
            <button @click="onSignOut">Sign Out</button>
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
const { user } = storeToRefs(userStore);

const onSignOut = async () => {
    try {
        await userStore.signOutUser();
        navigateTo('/');
    } catch (error) {
        console.error(errorMessageLang((error as AuthError).code));
    }
};
</script>
