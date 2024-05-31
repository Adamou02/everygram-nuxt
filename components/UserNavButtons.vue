<template>
    <div class="user-nav-buttons flex gap-2">
        <NuxtLink to="/trips">
            <PrimeButton
                :class="[
                    'user-nav-buttons__button border-round-md',
                    {
                        'user-nav-buttons__button--active':
                            $route.name === 'trips' ||
                            $route.name === 'trip-id',
                    },
                ]"
                :label="$t('PAGE_TRIPS')"
                text
            >
                <template #icon>
                    <span class="material-symbols-outlined mr-2"
                        >landscape</span
                    >
                </template>
            </PrimeButton>
        </NuxtLink>
        <NuxtLink to="/gears">
            <PrimeButton
                :class="[
                    'user-nav-buttons__button border-round-md',
                    {
                        'user-nav-buttons__button--active':
                            $route.name === 'gears',
                    },
                ]"
                :label="$t('PAGE_GEARS')"
                text
            >
                <template #icon>
                    <span class="material-symbols-outlined mr-2">category</span>
                </template>
            </PrimeButton>
        </NuxtLink>
    </div>
</template>

<style lang="scss">
@import '~/assets/theme/themes/mytheme/_variables.scss';
.user-nav-buttons {
    &__button--active {
        background-color: $eg-c-primary-lighter;
    }
}
</style>
