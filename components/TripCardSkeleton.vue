<template>
    <div
        class="trip-card-skeleton border-round-md shadow-1 bg-white flex flex-column overflow-hidden"
    >
        <PrimeSkeleton
            class="trip-card-skeleton__image border-noround"
            height=""
        ></PrimeSkeleton>
        <div class="px-4 py-3">
            <PrimeSkeleton height="1.5rem" class="mb-3" />
            <PrimeSkeleton width="5rem" class="mb-3" />
            <PrimeSkeleton height="1.625rem" width="2rem" />
        </div>
    </div>
</template>

<style lang="scss">
.trip-card-skeleton {
    &__image {
        aspect-ratio: 2 / 1;
    }
}
</style>
