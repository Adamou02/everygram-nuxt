<template>
    <div class="grid">
        <!-- trip cards -->
        <div
            v-for="trip in trips"
            class="col-12 md:col-6 lg:col-3"
            :key="trip.id"
        >
            <slot :trip="trip"></slot>
        </div>
        <!-- skeleton loaders -->
        <div
            v-if="isFetching"
            v-for="i in 4"
            class="col-12 md:col-6 lg:col-3"
            :key="i"
        >
            <TripCardSkeleton />
        </div>
    </div>
    <div ref="loadMoreRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const emit = defineEmits<{
    'load-more': [];
}>();

const props = defineProps<{
    isFetching?: boolean;
    trips: Trip[] | TripShare[];
}>();

const loadMoreRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

function setupObserver() {
    if (observer) observer.disconnect();
    if (!loadMoreRef.value) return;
    observer = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            emit('load-more');
        }
    });
    observer.observe(loadMoreRef.value);
}

onMounted(() => {
    setupObserver();
});

onBeforeUnmount(() => {
    if (observer) observer.disconnect();
});
</script>
