<template>
    <h1>{{ $t('WELCOME_TO_EVERYGRAM') }}</h1>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth-guard'],
});
</script>
