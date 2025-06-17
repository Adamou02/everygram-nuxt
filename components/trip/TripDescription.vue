<template>
    <div class="trip-description relative">
        <div
            ref="contentRef"
            class="overflow-hidden"
            :style="{ maxHeight: isExpanded ? '' : `${maxHeight}px` }"
        >
            <MarkdownRenderer
                :content="trip.description"
                :class="['text-color line-height-3']"
            />
        </div>
        <template v-if="isShowReadMore">
            <!-- gradient background at the bottom -->
            <div
                v-if="!isExpanded"
                :class="[
                    'absolute bottom-0 left-0 right-0 h-4rem cursor-pointer',
                    'trip-description__bottom-gradient',
                    'flex align-items-end justify-content-end',
                ]"
                role="button"
                @click="isExpanded = true"
            >
                <PrimeButton
                    :label="$t('ACTION_READ_MORE')"
                    text
                    outlined
                    rounded
                    icon="pi pi-chevron-down"
                    size="small"
                    @click.stop="isExpanded = true"
                />
            </div>
            <!-- collapse button when expanded -->
            <div v-else class="flex justify-content-end mt-2">
                <PrimeButton
                    :label="$t('ACTION_COLLAPSE')"
                    text
                    outlined
                    rounded
                    icon="pi pi-chevron-up"
                    size="small"
                    @click="isExpanded = false"
                />
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    trip: Trip | TripShare;
}>();
const maxHeight = 100;
const contentRef = ref<HTMLElement | null>(null);
const isShowReadMore = ref(false);
const isExpanded = ref(false);

const updateShowReadMore = () => {
    if (!contentRef.value) return;
    isShowReadMore.value = contentRef.value.scrollHeight > maxHeight;
};

onMounted(() => {
    nextTick(updateShowReadMore);
    if (process.client) {
        window.addEventListener('resize', updateShowReadMore);
    }
});

onUnmounted(() => {
    if (process.client) {
        window.removeEventListener('resize', updateShowReadMore);
    }
});

// Re-check if trip.description changes
watch(
    () => props.trip.description,
    async () => {
        await nextTick();
        updateShowReadMore();
    },
);
</script>

<style lang="scss">
.trip-description {
    &__bottom-gradient {
        background: linear-gradient(
            to bottom,
            transparent 0%,
            var(--app-background-color) 70%
        );
    }
}
</style>
