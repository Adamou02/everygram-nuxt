<template>
    <div class="flex gap-2 align-items-center min-w-0">
        <UserAvatar :user="user" :avatarSize="avatarSize" />
        <div class="text-ellipsis text-color">
            {{ user.displayName }}
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    user: UserInfo;
    avatarSize?: 'xs' | 'sm' | 'md' | 'lg';
}>();
</script>
