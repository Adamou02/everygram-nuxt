<template>
    <div class="text-color-light">
        {{
            $t(
                isFiltered ? 'INFO_GEAR_NUM_FILTERED' : 'INFO_GEAR_NUM',
                { num },
                num,
            )
        }}
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    num: number;
    isFiltered?: boolean;
}>();
</script>
