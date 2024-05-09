<template>
    <div v-if="totalWeight > 0" class="weight-bar-chart flex flex-column gap-3">
        <div class="weight-bar-chart__bar">
            <div
                v-for="item in sortedItems"
                v-tooltip.top="
                    `${item.label} ${formatWeight(item.weight)} (${_round((item.weight / totalWeight) * 100)}%)`
                "
                class="weight-bar-chart__section"
                :style="{
                    backgroundColor: item.color,
                    width: `${(item.weight / totalWeight) * 100}%`,
                }"
            />
        </div>
        <div v-if="showLabel" class="flex flex-column gap-3">
            <div
                v-for="item in sortedItems"
                :key="item.label"
                class="flex gap-2 text-sm align-items-center"
            >
                <div
                    class="weight-bar-chart__dot"
                    :style="{ backgroundColor: item.color }"
                />
                <div>
                    {{ item.label }} - {{ formatWeight(item.weight) }}
                    <span v-if="totalWeight > 0" class="ml-1 text-600"
                        >{{ _round((item.weight / totalWeight) * 100) }}%</span
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    items: WeightBarChartItem[];
    showLabel?: boolean;
}>();

const { formatWeight } = useLangUtils();

const totalWeight = computed(() =>
    props.items.reduce((acc, item) => acc + item.weight, 0),
);
const sortedItems = computed(() =>
    props.items.sort((a, b) => b.weight - a.weight),
);
</script>

<style lang="scss">
.weight-bar-chart {
    &__bar {
        display: flex;
        gap: 2px;
        height: 16px;
    }
    &__section {
        flex: 1 1 auto;
        transition: all 0.3s;
        &:first-child {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }
        &:last-child {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
        }
        &:hover {
            transition: 0.2s;
            transform: scaleY(1.2);
        }
    }
    &__dot {
        width: 6px;
        height: 12px;
        border-radius: 2px;
    }
}
</style>
