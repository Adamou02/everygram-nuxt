<template>
    <div
        class="flex flex-column justify-content-center align-items-center h-screen"
    >
        <div class="mb-5">
            <img src="/image/logo-vertical.svg" alt="Everygram Logo" />
        </div>
        <div class="flex align-items-center gap-1">
            <PrimeButton
                text
                :label="$t('ACTION_LOGIN')"
                @click="navigateTo('/login')"
            />
            <span>|</span>
            <PrimeButton
                text
                :label="$t('ACTION_SIGN_UP')"
                @click="navigateTo('/signup')"
            />
        </div>
    </div>
</template>
