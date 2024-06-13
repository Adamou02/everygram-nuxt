<template>
    <img
        class="border-circle vertical-align-middle"
        :width="avatarImgSize"
        :height="avatarImgSize"
        :src="user.photoURL"
        alt="User Photo"
    />
</template>

<script setup lang="ts">
const props = defineProps<{
    user: UserInfo;
    avatarSize?: 'sm' | 'md' | 'lg';
}>();
const avatarImgSize = computed(() =>
    props.avatarSize === 'sm' ? 32 : props.avatarSize === 'lg' ? 48 : 40,
);
</script>
