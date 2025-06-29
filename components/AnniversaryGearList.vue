<template>
    <div class="flex flex-column gap-4">
        <!-- anniversary -->
        <div
            v-if="anniversaryGearList.length > 0"
            class="flex flex-column gap-3"
        >
            <h2 class="text-lg">{{ $t('LABEL_TODAY_ANNIVERSARY_GEARS') }}</h2>
            <GearCardList
                :gears="anniversaryGearList"
                :min-card-width="minCardWidth"
            >
                <template #gear-card="{ gear }">
                    <AnniversaryGearCard
                        :gear="gear"
                        type="today"
                        class="cursor-pointer"
                        role="button"
                        @click="emit('gear-clicked', gear)"
                    />
                </template>
            </GearCardList>
        </div>

        <!-- upcoming -->
        <div
            v-if="upcomingAnniversaryGears.length > 0"
            class="flex flex-column gap-3"
        >
            <h2 class="text-lg">
                {{ $t('LABEL_UPCOMING_ANNIVERSARY_GEARS') }}
            </h2>
            <GearCardList
                :gears="upcomingAnniversaryGears"
                :min-card-width="minCardWidth"
            >
                <template #gear-card="{ gear }">
                    <AnniversaryGearCard
                        :gear="gear"
                        type="upcoming"
                        class="cursor-pointer"
                        role="button"
                        @click="emit('gear-clicked', gear)"
                    />
                </template>
            </GearCardList>
        </div>
    </div>
</template>

<script lang="ts" setup>
const { anniversaryGearList, upcomingAnniversaryGears } = useDisplayGears();
const emit = defineEmits<{
    'gear-clicked': [gear: Gear];
}>();
const minCardWidth = '300px';
</script>
