<template>
    <header
        :class="[
            'app-header top-0 w-full',
            {
                'bg-white border-bottom-1 border-200': !colorReverse,
            },
        ]"
    >
        <div class="app-header__left">
            <slot name="left">
                <!-- default show logo -->
                <NuxtLink :to="user ? '/trips' : '/'">
                    <img
                        class="app-header__logo"
                        :src="
                            colorReverse
                                ? '/image/logo-horizontal-white.svg'
                                : '/image/logo-horizontal.svg'
                        "
                        alt="App Logo"
                        height="24px"
                    />
                </NuxtLink>
            </slot>
        </div>
        <div class="app-header__navigation">
            <slot name="navigation" />
        </div>
        <div class="app-header__actions">
            <slot name="actions" />
        </div>
        <div class="app-header__mobile-actions">
            <slot name="mobile-actions" />
        </div>
    </header>
</template>

<script setup lang="ts">
const props = defineProps<{
    colorReverse?: boolean;
}>();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
</script>

<style lang="scss">
@import '~/assets/theme/themes/mytheme/_variables.scss';
@import '~/assets/theme/primeflex/core/_variables.scss';

.app-header {
    height: var(--app-header-height);
    display: grid;
    align-items: center;
    padding: 0 16px;
    grid-template-columns: auto 1fr auto;
    gap: 16px;
    z-index: 1100; // higher than dropdown menu, lower than modal

    &__logo {
        vertical-align: middle;
    }
    &__left {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }
    &__actions {
        display: none;
    }
    &__navigation {
        display: flex;
        justify-content: center;
    }
    &__actions {
        justify-content: flex-end;
    }
    &__mobile-actions {
        display: flex;
        justify-content: flex-end;
    }

    @media (min-width: $lg) {
        padding: 0 40px;
        grid-template-columns: 300px 1fr 300px;
        &__mobile-actions {
            display: none;
        }
        &__actions {
            display: flex;
        }
    }
}
</style>
