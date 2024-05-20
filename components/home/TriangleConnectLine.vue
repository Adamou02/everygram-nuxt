<template>
    <div
        :class="[
            'triangle-connect-line',
            { 'triangle-connect-line--reverse': reverse },
        ]"
    ></div>
</template>

<script setup lang="ts">
const props = defineProps<{
    reverse?: boolean;
}>();
</script>

<style lang="scss" scoped>
.triangle-connect-line {
    background-image: url(/image/deco-triangle-connect-line.svg);
    background-repeat: no-repeat;
    background-size: auto 96px;
    background-position: center center;
    height: 160px;
    &--reverse {
        transform: rotateX(180deg);
    }
}
</style>
