<template>
    <div
        :class="[
            'gear-card-horizontal-skeleton',
            'flex flex-column bg-white border-round-md shadow-1',
            'p-2 lg:p-3',
            'gap-2',
        ]"
    >
        <!-- main -->
        <div
            :class="[
                'flex align-items-center min-w-0',
                isLargeScreen ? 'gap-3' : 'gap-2',
            ]"
        >
            <!-- photo -->
            <PrimeSkeleton
                :class="[isLargeScreen ? 'w-6rem h-6rem' : 'w-4rem h-4rem']"
            />
            <!-- brand and name -->
            <div class="flex flex-column gap-2">
                <PrimeSkeleton height="0.75rem" width="4rem" />
                <PrimeSkeleton height="1rem" width="8rem" />
            </div>
        </div>
        <!-- bottom infos -->
        <div class="flex align-items-center justify-content-between gap-2">
            <PrimeSkeleton height="1.5rem" width="3rem" />
            <PrimeSkeleton height="1.5rem" width="4rem" />
        </div>
    </div>
</template>

<script setup lang="ts">
const { isLargeScreen } = useDeviceMeta();
</script>
