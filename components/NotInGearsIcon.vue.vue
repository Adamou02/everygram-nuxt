<template>
    <div
        class="not-in-gears-icon"
        v-tooltip.bottom="{
            value: $t('INFO_NOT_IN_GEARS'),
            class: 'text-xs',
        }"
    >
        <span class="material-symbols-outlined">category</span>
        <span class="slash"></span>
    </div>
</template>

<style lang="scss">
@import '~/assets/theme/_eg-colors.scss';

.not-in-gears-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1em;
    line-height: 1;
    vertical-align: sub;
    position: relative;
    color: $eg-c-text-lighter;

    > .slash {
        position: absolute;
        width: 8%;
        height: 120%;
        right: 0;
        top: 0;
        transform: rotate(45deg) translate(50%, 15%);
        transform-origin: top right;
        background-color: $eg-c-text-lightest;
    }
}
</style>
