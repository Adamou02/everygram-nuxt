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
    avatarSize?: 'xs' | 'sm' | 'md' | 'lg';
}>();
const avatarImgSize = computed(() => {
    switch (props.avatarSize) {
        case 'xs':
            return 24;
        case 'sm':
            return 32;
        case 'lg':
            return 48;
        case 'md':
        default:
            return 40;
    }
});
</script>
