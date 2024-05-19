<template>
    <div class="weight-bar-chart flex flex-column gap-3">
        <!-- bar -->
        <div class="weight-bar-chart__bar">
            <div
                v-if="barSectionItems.length && totalWeight > 0"
                v-for="item in barSectionItems"
                v-tooltip.top="
                    `${item.label} ${formatWeight(item.weight)} (${_round((item.weight / totalWeight) * 100)}%)`
                "
                :class="[
                    'weight-bar-chart__section',
                    { 'border-1 border-solid border-500': item.addBorder },
                ]"
                :style="{
                    backgroundColor: item.color,
                    width: `${(item.weight / totalWeight) * 100}%`,
                }"
            />
            <div
                v-else
                class="weight-bar-chart__section w-full"
                :style="{
                    backgroundColor: constants.COLORS.EMPTY_WEIGHT,
                }"
            ></div>
        </div>

        <!-- labels -->
        <div v-if="showLabel" class="flex flex-column gap-0">
            <div v-for="(item, index) in sortedItems" :key="item.label">
                <div
                    :class="[
                        'flex gap-2 align-items-center py-2',
                        { 'cursor-pointer': item.subItems },
                    ]"
                    @click="itemsToggle[index] = !itemsToggle[index]"
                >
                    <div
                        :class="[
                            'weight-bar-chart__dot',
                            {
                                'border-1 border-solid border-500':
                                    item.addBorder,
                            },
                        ]"
                        :style="{ backgroundColor: item.color }"
                    ></div>
                    <div>
                        {{ item.label }}
                        <span
                            v-if="item.subItems"
                            :class="[
                                'pi text-xs text-600',
                                {
                                    'pi-chevron-up': itemsToggle[index],
                                    'pi-chevron-down': !itemsToggle[index],
                                },
                            ]"
                        ></span>
                    </div>
                    <DashedLine />
                    <div>{{ formatWeight(item.weight) }}</div>
                    <div class="w-2rem text-600 text-right">
                        {{
                            _round(
                                (totalWeight ? item.weight / totalWeight : 0) *
                                    100,
                            )
                        }}%
                    </div>
                </div>
                <div
                    v-if="item.subItems && itemsToggle[index]"
                    class="flex flex-column gap-2 mt-1 mb-2 ml-3 text-600"
                >
                    <div
                        v-for="subItem in item.subItems"
                        class="flex gap-2 align-items-center"
                        :key="subItem.label"
                    >
                        <div>{{ subItem.label }}</div>
                        <DashedLine />
                        <div>{{ formatWeight(subItem.weight) }}</div>
                        <div class="w-2rem text-600 text-right">
                            {{
                                _round(
                                    (totalWeight
                                        ? subItem.weight / totalWeight
                                        : 0) * 100,
                                )
                            }}%
                        </div>
                    </div>
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
const barSectionItems = computed(() =>
    sortedItems.value.filter((item) => item.weight > 0),
);
const itemsToggle = ref<Record<number, boolean>>(
    props.items.reduce(
        (acc, item, index) => {
            acc[index] = false;
            return acc;
        },
        {} as Record<number, boolean>,
    ),
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
