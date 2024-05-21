<template>
    <template v-if="!user || isSigningIn">
        <PrimeButton
            :label="$t('ACTION_SIGN_IN_WITH_GOOGLE')"
            icon="pi pi-arrow-right"
            icon-pos="right"
            :severity="severity"
            rounded
            :loading="isSigningIn"
            @click="
                () => {
                    onSignInWithGoogle();
                    analyticsUtils.log(
                        constants.ANALYTICS_EVENTS.CLICK_CTA_BUTTON,
                        { page_name: 'home', container_name: containerName },
                    );
                }
            "
        />
    </template>
    <template v-else>
        <NuxtLink to="/trips">
            <PrimeButton
                icon="pi pi-arrow-right"
                icon-pos="right"
                :severity="severity"
                rounded
                :label="$t('ACTION_START_USING_EVERYGRAM')"
            />
        </NuxtLink>
    </template>
</template>

<script setup lang="ts">
const props = defineProps<{
    severity?:
        | 'primary'
        | 'secondary'
        | 'success'
        | 'info'
        | 'warning'
        | 'danger'
        | 'contrast';
    containerName?: string; // for analytics
}>();

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { onSignInWithGoogle, isSigningIn } = useSignIn();
</script>
