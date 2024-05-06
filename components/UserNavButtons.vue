<template>
    <div class="user-nav-buttons flex gap-2">
        <PrimeButton
            :class="[
                'user-nav-buttons__button',
                { 'user-nav-buttons__button--active': $route.name === 'gears' },
            ]"
            :label="$t('PAGE_GEARS')"
            text
            @click="navigateTo('/gears')"
        >
            <template #icon>
                <span class="material-symbols-outlined mr-2">category</span>
            </template>
        </PrimeButton>
        <PrimeButton
            :class="[
                'user-nav-buttons__button',
                {
                    'user-nav-buttons__button--active':
                        $route.name === 'trips' || $route.name === 'trip-id',
                },
            ]"
            :label="$t('PAGE_TRIPS')"
            text
            @click="navigateTo('/trips')"
        >
            <template #icon>
                <span class="material-symbols-outlined mr-2">landscape</span>
            </template>
        </PrimeButton>
    </div>
</template>

<style lang="scss">
@import '~/assets/theme/themes/mytheme/_variables.scss';
.user-nav-buttons {
    &__button--active {
        background-color: rgba($buttonBg, $textButtonActiveBgOpacity);
    }
}
</style>
