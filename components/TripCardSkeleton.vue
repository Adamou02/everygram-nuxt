<template>
    <div
        class="trip-card trip-card--skeleton border-round-md shadow-1 bg-white flex flex-column w-full"
    >
        <div class="trip-card__image"></div>
        <div class="px-4 py-3">
            <PrimeSkeleton height="1.5rem" class="mb-3" />
            <PrimeSkeleton width="5rem" class="mb-3" />
            <PrimeSkeleton height="1.625rem" width="2rem" />
        </div>
    </div>
</template>

<style lang="scss">
.trip-card--skeleton .trip-card__image {
    filter: saturate(0);
}
</style>
