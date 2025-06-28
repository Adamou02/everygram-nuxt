<template>
    <div class="flex align-items-center gap-1">
        <UserLabel
            :user="{
                ...tripShare.owner,
                ...(displayName
                    ? {
                          displayName,
                      }
                    : {}),
            }"
            :avatarSize="avatarSize"
        />
        <div class="text-color-lighter">
            {{ $t('INFO_CREATED_THIS_TRIP') }}
        </div>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    tripShare: TripShare;
    avatarSize?: UserAvatarSize;
    displayName?: string;
}>();
</script>
