<template>
    <div
        :class="[
            'anniversary-gear-card',
            `anniversary-gear-card--${type}`,
            'relative overflow-hidden',
            'bg-white border-round-lg p-3',
        ]"
    >
        <GearLabel :gear="gear" size="md" />
        <div
            :class="['anniversary-gear-card__label', 'absolute top-0 right-0']"
        >
            {{
                type === 'today'
                    ? $t('LABEL_GEAR_ANNIVERSARY', { age: gear.age }, gear.age)
                    : formatMonthDateString(gear.anniversaryDate)
            }}
        </div>
        <img
            v-if="type === 'today'"
            src="/image/birthday-hat.svg"
            alt="Birthday Hat"
            :class="['absolute', 'anniversary-gear-card__hat']"
        />
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    gear: GearWithAnniversary;
    type: 'today' | 'upcoming';
}>();
const { formatMonthDateString } = useLangUtils();
</script>

<style lang="scss">
@import '~/assets/theme/_eg-colors.scss';

.anniversary-gear-card {
    border: 1px solid #{$eg-c-gray-300};
    border-color: var(--card-border-color);
    transition: transform 0.1s ease-out;
    &:hover {
        transform: translateY(-4px);
    }

    &--today {
        --card-border-color: #{$eg-c-brown-300};
        --label-text-color: #{$eg-c-brown-800};
    }
    &--upcoming {
        --card-border-color: #{$eg-c-blue-300};
        --label-text-color: #{$eg-c-blue-800};
    }

    &__label {
        color: var(--label-text-color);
        background-color: var(--card-border-color);
        font-size: 0.875rem;
        line-height: 1.25rem;
        padding: 0 10px;
        border-bottom-left-radius: 8px;
    }
    &__hat {
        width: 30px;
        height: 30px;
        top: 0px;
        left: 66px;
    }
}
</style>
