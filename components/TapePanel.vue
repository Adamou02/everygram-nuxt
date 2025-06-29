<template>
    <div class="tape-panel p-5">
        <slot></slot>
        <img
            src="/image/washi-tape.png"
            alt="tape"
            class="tape-panel__tape-a"
        />
        <img
            src="/image/washi-tape.png"
            alt="tape"
            class="tape-panel__tape-b"
        />
    </div>
</template>

<script lang="ts" setup></script>

<style lang="scss">
@import '~/assets/theme/_eg-colors.scss';
.tape-panel {
    position: relative;
    background-color: $eg-c-brown-100;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.04);
    --tape-offset: calc(var(--page-container-padding) * -0.8);

    &__tape-a,
    &__tape-b {
        position: absolute;
        width: 75px;
        z-index: 1; // Ensure the tape is behind the content
    }
    &__tape-a {
        top: var(--tape-offset);
        left: var(--tape-offset);
    }
    &__tape-b {
        bottom: var(--tape-offset);
        right: var(--tape-offset);
    }
}
</style>
