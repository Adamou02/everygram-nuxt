<template>
    <div class="text-color-light">
        {{ $t(langKey || 'INFO_GEAR_NUM', { num }, num) }}
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    num: number;
    langKey?: string;
}>();
</script>
