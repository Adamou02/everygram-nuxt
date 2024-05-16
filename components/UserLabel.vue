<template>
    <div class="flex gap-2 align-items-center min-w-0">
        <img
            class="border-circle"
            :width="avatarImgSize"
            :height="avatarImgSize"
            :src="user.photoURL"
            alt="User Photo"
        />
        <div class="text-ellipsis">
            {{ user.displayName }}
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    user: UserInfo;
    avatarSize?: 'sm' | 'md' | 'lg';
}>();
const avatarImgSize =
    props.avatarSize === 'sm' ? 32 : props.avatarSize === 'lg' ? 48 : 40;
</script>
