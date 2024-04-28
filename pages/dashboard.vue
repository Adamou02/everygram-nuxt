<template>
    <div>
        <h1>Dashboard</h1>
        <p>Welcome to the dashboard page!</p>
        <p>Here you can manage your trips and gears.</p>
        <TripList />
        <hr />
        <button @click="navigateTo('/')">Home</button>
        <button @click="navigateTo('/gears')">Gears</button>
        <button @click="onSignOut">Sign Out</button>
    </div>
</template>

<script setup lang="ts">
import type { AuthError } from "firebase/auth";

definePageMeta({
    middleware: ["auth-guard"],
    layout: "user-page",
});

const userStore = useUserStore();

const onSignOut = async () => {
    try {
        await userStore.signOutUser();
        navigateTo("/");
    } catch (error) {
        console.error(errorMessageLang((error as AuthError).code));
    }
};
</script>
