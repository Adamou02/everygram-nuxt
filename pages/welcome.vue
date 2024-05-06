<template>
    <div class="flex flex-column gap-1">
        <template v-if="user">
            <PrimeButton
                :label="$t('ACTION_START_USING_EVERYGRAM')"
                class="w-full"
                @click="navigateTo('/gears')"
            />
        </template>
        <template v-else>
            <PrimeButton
                :label="$t('ACTION_SIGN_IN_WITH_GOOGLE')"
                class="w-full"
                icon="pi pi-google"
                @click="signInWithGoogle"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'siginin-page',
});

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { signInWithGoogle } = useSignInActions();
</script>
